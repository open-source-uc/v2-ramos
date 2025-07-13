import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const objects = await locals.runtime.env.R2.list();

    return new Response(
      JSON.stringify(
        {
          success: true,
          count: objects.objects.length,
          objects: objects.objects.map((obj) => ({
            key: obj.key,
            size: obj.size,
            etag: obj.etag,
            uploaded: obj.uploaded,
            customMetadata: obj.customMetadata,
          })),
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
