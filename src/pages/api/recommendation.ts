import type { APIRoute } from "astro";
import fs from 'fs';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const user = {
    name: "Chatgipiti",
  }
  const tags = ["astro", "javascript", "typescript"]
  const code = formData.get("code");
  const content = formData.get("content");
  const qualification = formData.get("qualification");

  if (!code || !content) {
    return new Response("Missing code or content", { status: 400 });
  }
  
  const fileContent = `---
title: "${code}-${user.name}"
code: "${code}"
initiative: "${user.name}"
period: "2025-1"
faculty: "DCC"
qualification: ${qualification} 
tags: 
${tags.map(tag => `  - ${tag}`).join("\n")}
resume: "resumen jiji"
---
${content}
`
  const filePath = path.join('src/content/recommendations', `${code}-${user.name}.md`);
  fs.writeFileSync(filePath, fileContent);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}