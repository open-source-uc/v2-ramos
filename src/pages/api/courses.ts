import type { APIRoute } from "astro";

// export const GET: APIRoute = async ({ request, locals }) => {
//     const key = "2025-1.json";

//     // Obtener metadata del objeto
//     const head = await locals.runtime.env.R2.head(key);
//     if (!head || !head.etag) {
//         return new Response("Not Found", { status: 404 });
//     }

//     const etag = `"${head.etag}"`;

//     // Verificar si el cliente ya tiene esta versión
//     const ifNoneMatch = request.headers.get("if-none-match");
//     if (ifNoneMatch === etag) {
//         return new Response(null, {
//             status: 304,
//             headers: {
//                 "Cache-Control": "private, max-age=86400, must-revalidate",
//                 "ETag": etag,
//                 "Vary": "Accept-Encoding"
//             },
//         });
//     }

//     // Obtener contenido si no coincide el ETag
//     const res = await locals.runtime.env.R2.get(key);
//     if (!res) {
//         return new Response("Not Found", { status: 404 });
//     }

//     const data = await res.json();

//     return new Response(JSON.stringify(data), {
//         status: 200,
//         headers: {
//             "Content-Type": "application/json",
//             "Cache-Control": "private, max-age=86400, must-revalidate",
//             "ETag": etag,
//         },
//     });
// };

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

