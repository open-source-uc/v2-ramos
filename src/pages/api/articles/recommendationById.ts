import type { APIRoute } from 'astro'
import type { Recommendations } from '@/types'

export const GET: APIRoute = async ({ request, locals }) => {
	try {
		const result = await locals.runtime.env.DB.prepare(
			`
      SELECT 
        id,
        user_id,
        display_name,
        user_role,
        organization_id,
        organization_name,
				faculty,
        title,
        period_time,
        readtime,
        code,
				qualification,
        content_path,
        created_at,
        updated_at
      FROM recommendations
			WHERE id = ?
    `
		)
			.bind(new URL(request.url).searchParams.get('id') || '')
			.all<Recommendations>()

		return new Response(JSON.stringify(result.results), {
			status: 200,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		})
	} catch (error) {
		console.error('Error fetching blogs:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}
