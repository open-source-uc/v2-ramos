import type { APIRoute } from "astro";

// Obtain the blog data from R2 with the content path
export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const contentPath = url.searchParams.get("path");

  if (!contentPath) {
    return new Response("Bad Request: Missing 'path' parameter", {
      status: 400,
    });
  }

  const R2 = locals.runtime.env.R2;
  const head = await R2.head(contentPath);

  if (!head) {
    return new Response("Not Found", { status: 404 });
  }

  const clientEtag = request.headers.get("If-None-Match");
  const serverEtag = head.httpEtag;

  const sharedHeaders = {
    "Cache-Control": "private, max-age=180, must-revalidate",
    Vary: "Accept-Encoding",
    ETag: serverEtag,
  };

  if (clientEtag === serverEtag) {
    return new Response(null, {
      status: 304,
      headers: sharedHeaders,
    });
  }

  const content = await R2.get(contentPath);

  if (!content) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(content.body, {
    status: 200,
    headers: {
      ...sharedHeaders,
      "Content-Type": content.contentType,
    },
  });
};
