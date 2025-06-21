import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
    const url = new URL(request.url);
    const key = url.searchParams.get("path");

    if (!key) {
        return new Response("Bad Request: Missing 'path' parameter", { status: 400 });
    }

    const R2 = locals.runtime.env.R2;
    const head = await R2.head(key);

    if (!head) {
        return new Response("Not Found", { status: 404 });
    }

    const clientEtag = request.headers.get("If-None-Match");
    const serverEtag = head.httpEtag;

    if (clientEtag && serverEtag && clientEtag === serverEtag) {
        return new Response(null, {
            status: 304,
            headers: {
                "Etag": serverEtag
            }
        });
    }

    const object = await R2.get(key);
    if (!object) {
        return new Response("Not Found", { status: 404 });
    }

    const markdownContent = await object.text();

    return new Response(markdownContent, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown",
            "Cache-Control": "private, max-age=180, must-revalidate",
            "Vary": "Accept-Encoding",
            "Etag": serverEtag
        },
    });
};
