// "use client"

// import { UserAPIClient } from "../api/RPC"

// export async function ReviewCreate(prev: {
//     errors: number;
//     success: number;
//     message: string;
//     body: {
//         course_id: number;
//         year: number;
//         section_number: number;
//         liked: boolean;
//         comment: string;
//         estimated_credits: number;
//     };
// }, formData: FormData) {

//     const token = 

//     const client = await UserAPIClient()

//     const body = {
//         course_id: parseInt(formData.get("course_id")?.toString() ?? '0') || prev.body.course_id,
//         year: parseInt(formData.get("year")?.toString() ?? '0') || prev.body.year,
//         section_number: parseInt(formData.get("section_number")?.toString() ?? '0') || prev.body.section_number,
//         liked: formData.get("liked") === "on",
//         comment: formData.get("comment")?.toString() ?? prev.body.comment,
//         estimated_credits: (parseInt(formData.get("estimated_credits")?.toString() ?? '0')) || prev.body.estimated_credits
//     }

//     const res = await client.user.reviews.$post({
//         json: body
//     })

//     if (res.status === 201) {
//         return {
//             errors: 0,
//             success: prev.success + 1,
//             message: "Review submitted successfully",
//             body
//         }
//     }

//     if (res.status === 400) {
//         const data = await res.json()
//         return {
//             errors: prev.errors + 1,
//             success: prev.success,
//             message: data.message,
//             body
//         }
//     }

//     return {
//         errors: prev.errors + 1,
//         success: prev.success,
//         message: "Server error",
//         body
//     }

// }

// export async function ReviewUpdate(prev: {
//     errors: number;
//     success: number;
//     message: string;
//     body: {
//         course_id: number;
//         year: number;
//         section_number: number;
//         liked: boolean;
//         comment: string;
//         estimated_credits: number;
//     };
// }, formData: FormData) {
//     const client = await UserAPIClient()

//     const body = {
//         course_id: parseInt(formData.get("course_id")?.toString() ?? '0') || prev.body.course_id,
//         year: parseInt(formData.get("year")?.toString() ?? '0') || prev.body.year,
//         section_number: parseInt(formData.get("section_number")?.toString() ?? '0') || prev.body.section_number,
//         liked: formData.get("liked") === "on",
//         comment: formData.get("comment")?.toString() ?? prev.body.comment,
//         estimated_credits: (parseInt(formData.get("estimated_credits")?.toString() ?? '0')) || prev.body.estimated_credits
//     }

//     const res = await client.user.reviews.$put({
//         json: body
//     })

//     if (res.status === 200) {
//         return {
//             errors: 0,
//             success: prev.success + 1,
//             message: "Review updated successfully",
//             body
//         }
//     }

//     if (res.status === 400) {
//         const data = await res.json()
//         return {
//             errors: prev.errors + 1,
//             success: prev.success,
//             message: data.message,
//             body
//         }
//     }

//     return {
//         errors: prev.errors + 1,
//         success: prev.success,
//         message: "Server error",
//         body
//     }

// }

// export async function ReviewDelete(prev: {
//     errors: number;
//     success: number;
//     message: string;
//     body: {
//         course_id: number;
//     };
// }, formData: FormData) {
//     const client = await UserAPIClient()

//     const body = {
//         course_id: parseInt(formData.get("course_id")?.toString() ?? '0') || prev.body.course_id,
//     }

//     const res = await client.user.reviews.$delete({
//         json: body
//     })

//     if (res.status === 200) {
//         return {
//             errors: 0,
//             success: prev.success + 1,
//             message: "Review updated successfully",
//             body
//         }
//     }

//     if (res.status === 404) {
//         const data = await res.json()
//         return {
//             errors: prev.errors + 1,
//             success: prev.success,
//             message: data.message,
//             body
//         }
//     }

//     return {
//         errors: prev.errors + 1,
//         success: prev.success,
//         message: "Server error",
//         body
//     }

// }