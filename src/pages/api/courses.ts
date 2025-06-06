import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, locals }) => {

    const res = await locals.runtime.env.R2.get("2025-1.json")
    if (!res) {
        return new Response("Not Found", { status: 404 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
        status: 200,
    });
};