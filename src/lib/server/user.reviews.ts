import type { CourseReview } from '@/types'

export async function getUserReviews(locals: App.Locals, userId: string) {
	const DB = locals.runtime.env.DB

	const reviews = await DB.prepare(
		`
		SELECT 
			id, course_sigle, like_dislike, workload_vote, attendance_type, attendance_type, weekly_hours, year_taken, semester_taken, comment_path, status, created_at, updated_at, votes
		FROM 
			course_reviews 
		WHERE 
			user_id = ? AND status != 2
		ORDER BY 
			created_at DESC
		LIMIT 100
		`
	)
		.bind(userId)
		.all<CourseReview>()

	return reviews.results
}
