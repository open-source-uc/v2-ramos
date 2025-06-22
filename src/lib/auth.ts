import type { AstroCookies } from "astro";


export function getToken(cookies: AstroCookies) {
    const token = cookies.get("osucookie")?.value || import.meta.env.USER_TOKEN || "";

    return token;
}