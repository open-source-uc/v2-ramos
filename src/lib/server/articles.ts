import type { Blogs, Recommendations } from '@/types'

export async function getBlogs(locals: App.Locals) {
	let blogsData: Blogs[] = []
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
					title,
					period_time,
					readtime,
					tags,
					content_path,
					created_at,
					updated_at
				FROM blogs
				ORDER BY created_at DESC
			`
		).all<Blogs>()
		if (result) {
			return result.results
		}
	} catch (error) {
		return null
	}
}

export async function getBlogById(locals: App.Locals, id: string) {
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
        title,
        period_time,
        readtime,
        tags,
        content_path,
        created_at,
        updated_at
      FROM blogs
			WHERE id = ?
    `
		)
			.bind(id)
			.all<Blogs>()
		if (result) {
			return result.results[0] || null
		}
	} catch (error) {
		return null
	}
}

export async function getRecommendations(locals: App.Locals) {
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
      ORDER BY created_at DESC
    `
		).all<Recommendations>()
		if (result) {
			return result.results
		}
	} catch (error) {
		return null
	}
}

export async function getRecommendationById(locals: App.Locals, id: string) {
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
			.bind(id)
			.all<Recommendations>()

		if (result) {
			return result.results[0]
		}
	} catch (error) {
		return null
	}
}
