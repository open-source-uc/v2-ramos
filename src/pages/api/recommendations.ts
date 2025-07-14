import type { APIRoute } from "astro";
import type { Blogs } from "@/types";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const result = await locals.runtime.env.DB.prepare(
      `
      SELECT 
        id,
        user_id,
        user_name,
        user_role,
        organization_id,
        organization_name,
        faculty,
        title,
        period_time,
        readtime,
        code,
        qualification,
        content_path,
        created_at,
        updated_at
      FROM recommendations
      ORDER BY created_at DESC
    `
    ).all<Blogs>();

    return new Response(JSON.stringify(result.results), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
