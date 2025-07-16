import type { AstroCookies } from 'astro'
import config from '../const'

export async function getUserDataByToken(token: string): Promise<{
	id: string
	message: string
	permissions: string[]
	organizations: {
		id: number
		name: string
		user_name: string
		role: string
	}[]
} | null> {
	const response = await fetch(`${config.AUTHURL}/api`, {
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
