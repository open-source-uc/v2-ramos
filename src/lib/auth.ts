import type { AstroCookies } from "astro";


export function getToken(cookies: AstroCookies) {
    let token = cookies.get("osucookie")?.value || "";

    if (!import.meta.env.PROD) {
        token = token || import.meta.env.TEST_TOKEN || "";
    }

    return token;
}