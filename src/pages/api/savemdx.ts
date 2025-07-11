import type { APIRoute } from "astro";
import fs from "fs";
import path from "path";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const contentType = formData.get("contentType") as string;
  const content = formData.get("content") as string;
  const tags = formData?.getAll("tags") as string[];
  // Blog form
  const title = formData?.get("title") as string;
  const readtime = formData?.get("readtime") as string;
  const description = formData?.get("description") as string;

  // Recommendation form
  const code = formData?.get("code") as string;
  const faculty = formData?.get("faculty") as string;
  const qualification = formData?.get("qualification") as string;

  if (!content ) {
    return new Response("Missing required fields", { status: 400 });
  }

  const fileContent = `---
${contentType == "recommendations" ? 
`title: "${code}-${name}"
initiative: "${name}"
period: "2025-1"
faculty: "${faculty}"
qualification: ${qualification}`
: 
`title: "${title}"
readtime: ${readtime}
description: "${description}"
author:
  name: "${name}"
  title: "${name}"`
}
${tags.length > 0 ? `\ntags:\n${tags.map(tag => `  - ${tag}`).join("\n")}` : ""}
---

import { Pill } from "@/components/ui/pill";

${content}
`
  const filePath = path.join(`src/content/${contentType}`, `${title || code}-${name.replaceAll(" ","")}.mdx`);
  fs.writeFileSync(filePath, fileContent);
  return new Response(JSON.stringify({ succes: true}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
