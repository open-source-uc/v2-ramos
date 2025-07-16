import type { AstroCookies } from 'astro'

export function getToken(cookies: AstroCookies) {
	let token = cookies.get('osucookie')?.value || ''

	if (!import.meta.env.PROD) {
		token = token || import.meta.env.USER_TOKEN || ''
	}

	return token
}
