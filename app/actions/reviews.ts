"use server";

import { UserAPIClient } from "../api/RPC";

export async function createReview(prev: {
  errors: number;
  success: number;
  message: string;
  data: {
    course_id: number;
    year: number;
    section_number: number;
    liked: boolean;
    comment: string;
    estimated_credits: number;
  };
}, formData: FormData) {

  const userClient = await UserAPIClient();

  return userClient.user.reviews.$post({
    json: {
      course_id: prev.data.course_id,
      year: parseInt(formData.get("year")?.toString() ?? '2025') || 2025,
      section_number: parseInt(formData.get("section_number")?.toString() ?? "1") || 1,
      liked: formData.get("liked") === "on",
      comment: formData.get("comment")?.toString() ?? "",
      estimated_credits: parseInt(formData.get("estimated_credits")?.toString() ?? 'NaN') || prev.data.estimated_credits,
    }
  })
    .then(async (res) => {
      const data = await res.json()
      if (!res.ok) {
        return {
          errors: prev.errors + 1,
          success: 0,
          message: data.message,
          data: prev.data,
        }
      }
      return {
        errors: 0,
        success: prev.success + 1,
        message: data.message,
        data: prev.data,
      }
    })
    .catch((error) => {
      return {
        errors: prev.errors + 1,
        success: 0,
        message: error.message,
        data: prev.data,
      }
    })
}
