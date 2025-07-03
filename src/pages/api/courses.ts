import type { APIRoute } from "astro";
import CoursesRaw from "../../../migration/json/2025-1.json";
import Id2NameRaw from "../../../migration/json/valores_unicos.json";
import type { CourseStaticInfo, CourseSummary } from "@/types";


const coursesData = CoursesRaw as Record<string, CourseStaticInfo>;
const id2NameData = Id2NameRaw as Record<string, string>;

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

    const stream = new ReadableStream({
        start(controller) {
            for (const course of result.results) {
                const staticInfo = coursesData[course.sigle];
                const out: any = {}
                out.name = staticInfo?.name ?? course.sigle;
                out.credits = staticInfo?.credits ?? 0;
                out.req = staticInfo?.req ?? "";
                out.conn = staticInfo?.conn ?? "";
                out.restr = staticInfo?.restr ?? "";
                out.equiv = staticInfo?.equiv ?? "";
                out.format = staticInfo?.format ?? [];
                out.compus = staticInfo?.compus ?? [];
                out.is_removable = staticInfo?.is_removable ?? [];
                out.is_special = staticInfo?.is_special ?? [];
                out.is_english = staticInfo?.is_english ?? [];
                out.school = id2NameData[course.school_id] || "";
                out.area = id2NameData[course.area_id] || "";
                out.category = id2NameData[course.category_id] || "";


                const line = JSON.stringify(course) + "\n";
                controller.enqueue(new TextEncoder().encode(line));
            }
            controller.close();
        },
    });

    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
        },
    });
};
