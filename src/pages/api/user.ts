import { getUserDataByToken } from '@/lib/server/auth'

export async function get({ request }) {
	const cookie = request.headers.get('cookie') || ''
	const match = cookie.match(/(?:^|; )osucookie=([^;]*)/)
	const token = match ? decodeURIComponent(match[1]) : undefined
	if (!token) {
		return new Response(JSON.stringify({ error: 'No token' }), { status: 401 })
	}
	const user = await getUserDataByToken(token)
	if (!user) {
		return new Response(JSON.stringify({ error: 'No user' }), { status: 401 })
	}
	return new Response(JSON.stringify(user), { status: 200 })
}
