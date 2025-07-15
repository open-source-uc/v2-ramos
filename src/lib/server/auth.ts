import type { AstroCookies } from 'astro'

const OsucApi = 'http://localhost:4322/api'

export async function getUserDataByToken(token: string): Promise<{
	message: string
	permissions: string[]
	organizations: {
		id: number
		name: string
		user_name: string
		role: string
	}[]
	id: string
} | null> {
	const response = await fetch(OsucApi, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})

	if (response.ok) {
		const data: any = await response.json()
		return {
			message: data.message,
			permissions: data.permissions,
			id: data.userId,
			organizations: data.organizations,
		}
	}

	return null
}
