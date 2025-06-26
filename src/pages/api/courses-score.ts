import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
    const coursesScore = await getCollection("coursesScore");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            (async () => {
                for (const item of coursesScore) {
                    controller.enqueue(encoder.encode(JSON.stringify(item) + "\n"));
                }
                controller.close();
            })();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson", // o "text/plain"
            "Cache-Control": "no-cache",
        },
    });
};

