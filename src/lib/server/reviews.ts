import type { CourseReview } from '@/types'

export async function getReviewById(locals: App.Locals, reviewId: string) {
	try {
		const result = await locals.runtime.env.DB.prepare(
			`
				SELECT 
					id, 
					user_id,
					course_sigle, 
					like_dislike, 
					workload_vote, 
					attendance_type, 
					weekly_hours, 
					year_taken, 
					semester_taken, 
					comment_path, 
					status, 
					created_at, 
					updated_at, 
					votes
				FROM course_reviews
				WHERE id = ? AND status != 3
			`
		)
			.bind(reviewId)
			.first<CourseReview>()

		return result || null
	} catch (error) {
		console.error('Error fetching review by ID:', error)
		return null
	}
}

export async function getReviewContent(locals: App.Locals, comment_path: string) {
	const R2 = locals.runtime.env.R2
	const head = await R2.head(comment_path)

	if (!head) {
		return null
	}

	const object = await R2.get(comment_path)
	if (!object) {
		return new Response('Not Found', { status: 404 })
	}

	const markdownContent = await object.text()

	return markdownContent
}
