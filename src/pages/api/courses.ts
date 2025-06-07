import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
    const key = "2025-1.json";

    // Obtener metadata del objeto
    const head = await locals.runtime.env.R2.head(key);
    if (!head || !head.etag) {
        return new Response("Not Found", { status: 404 });
    }

    const etag = `"${head.etag}"`;

    // Verificar si el cliente ya tiene esta versión
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch === etag) {
        return new Response(null, {
            status: 304,
            headers: {
                "Cache-Control": "private, max-age=86400, must-revalidate",
                "ETag": etag,
                "Vary": "Accept-Encoding"
            },
        });
    }

    // Obtener contenido si no coincide el ETag
    const res = await locals.runtime.env.R2.get(key);
    if (!res) {
        return new Response("Not Found", { status: 404 });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "private, max-age=86400, must-revalidate",
            "ETag": etag,
        },
    });
};
