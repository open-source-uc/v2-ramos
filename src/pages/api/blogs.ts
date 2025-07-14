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
        title,
        period_time,
        readtime,
        tags,
        content_path,
        created_at,
        updated_at
      FROM blogs
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

// Obtain the blog data from R2 with the content path
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { content_path } = await request.json();
    if (!content_path || typeof content_path !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid content_path" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    // Opcional: Validar que la URL apunte a tu bucket R2
    const R2_BASE_URL = import.meta.env.R2_BASE_URL || "";
    const isExternal =
      content_path.startsWith("http://") || content_path.startsWith("https://");
    const fetchUrl = isExternal
      ? content_path
      : `${R2_BASE_URL}${content_path}`;

    const mdxRes = await fetch(fetchUrl);
    if (!mdxRes.ok) {
      return new Response(
        JSON.stringify({
          error: `No se pudo obtener el contenido: ${mdxRes.status}`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }
    const mdxContent = await mdxRes.text();

    return new Response(JSON.stringify({ content: mdxContent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error fetching blog content:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
};
