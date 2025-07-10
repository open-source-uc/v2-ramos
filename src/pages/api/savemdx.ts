import type { APIRoute } from "astro";
import fs from "fs";
import path from "path";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const user = {
    name: "PlaceHolder User"
  }
  const contentType = formData.get("contentType");
  const faculty = formData.get("faculty");
  const content = formData.get("content");
  const tags = ["tag1","tag2"];
  // Blog form
  const title = formData?.get("title");
  const readtime = formData?.get("readtime");
  const description = formData?.get("description");

  // Recommendation form
  const code = formData?.get("code");
  const qualification = formData?.get("qualification");

  if (!content ) {
    return new Response("Missing required fields", { status: 400 });
  }

  const fileContent = `---
${contentType == "recommendations" ? 
`title: "${code}-${user.name}"
initiative: "${user.name}"
period: "2025-1"
faculty: "${faculty}"
qualification: ${qualification}`
: 
`title: "${title}"
readtime: ${readtime}
description: "${description}"
faculty: "${faculty}"
author:
  name: "${user.name}"
  title: "${user.name}"`
}
tags:
${tags.map(tag => `  - ${tag}`).join("\n")}
---
${content}
`
  const filePath = path.join(`src/content/${contentType}`, `${title || code}-${user.name.replaceAll(" ","")}.mdx`);
  fs.writeFileSync(filePath, fileContent);
  return new Response(JSON.stringify({ succes: true}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
