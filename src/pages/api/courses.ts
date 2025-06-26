import type { CourseSummary } from "@/types";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
    const API_SECRET = import.meta.env.API_SECRET;
    if (!API_SECRET) {
        return new Response("Internal Server Error", { status: 500 });
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader || authHeader !== `Bearer ${API_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    const result = await locals.runtime.env.DB.prepare(`
        SELECT 
        id,
        sigle,
        school_id,
        area_id,
        category_id,
        superlikes,
        likes,
        dislikes,
        votes_low_workload,
        votes_medium_workload,
        votes_high_workload,
        votes_mandatory_attendance,
        votes_optional_attendance,
        avg_weekly_hours,
        sort_index
        FROM course_summary ORDER BY sort_index DESC, id
    `).all<CourseSummary>();

    return new Response(JSON.stringify(result.results), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

