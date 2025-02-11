"use server"

import { cookies } from "next/headers";

export async function createReview(prev: any, formData: FormData) {
    const body = {
        course_id: prev.data.course_id,
        year: parseInt(formData.get("year")?.toString() || "") || "",
        section_number: parseInt(formData.get("section_number")?.toString() || "") || "",
        liked: formData.get("liked") === "on",
        comment: formData.get("comment")?.toString() ?? '',
        estimated_credits: parseInt(formData.get("estimated_credits")?.toString() || "") || "",
    }

    const OSUC_API_URL = process.env.OSUC_API_URL;

    if (!OSUC_API_URL) {
        return {
            errors: prev.errors + 1,
            success: 0,
            message: 'API URL not set',
            data: body
        }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("osuctoken")

    if (!token) {
        return {
            errors: prev.errors + 1,
            success: 0,
            message: 'Token not found',
            data: body
        }
    }

    const response = await fetch(`${OSUC_API_URL}/user/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify(body)
    })


    const data = await response.json()

    if (!response.ok) {
        console.log(JSON.stringify(data, null, 2))
        return {
            errors: prev.errors + 1,
            success: 0,
            message: data.message,
            data: body
        }
    }

    return {
        errors: 0,
        success: prev.success + 1,
        message: data.message,
        data: body
    }
}