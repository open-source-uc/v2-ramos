import { OsucPermissions } from '@/types/permissions'
import { getUserDataByToken } from './auth'
import type { CourseReview } from '@/types/index'

export async function getPendingReviews(locals: App.Locals, token: string) {
	const user = await getUserDataByToken(token)

	if (!user) throw new Error('User not found')

	if (!user.permissions.includes(OsucPermissions.userIsRoot))
		throw new Error('You do not have permission to access this resource')

	const DB = locals.runtime.env.DB

	const result = await DB.prepare(
		'SELECT id, user_id, course_sigle, like_dislike, workload_vote, attendance_type, weekly_hours, year_taken, semester_taken, comment_path, status, created_at, updated_at FROM course_reviews WHERE status = 0 ORDER BY updated_at DESC'
	).all<CourseReview>()

	const reviews = result.results

	return reviews
}

export async function getReportedReviews(locals: App.Locals, token: string) {
	const user = await getUserDataByToken(token)

	if (!user) throw new Error('User not found')

	if (!user.permissions.includes(OsucPermissions.userIsRoot))
		throw new Error('You do not have permission to access this resource')

	const DB = locals.runtime.env.DB

	const result = await DB.prepare(
		'SELECT id, user_id, course_sigle, like_dislike, workload_vote, attendance_type, weekly_hours, year_taken, semester_taken, comment_path, status, created_at, updated_at FROM course_reviews WHERE status = 2 ORDER BY updated_at DESC'
	).all<CourseReview>()

	const reviews = result.results

	return reviews
}

export async function getDashboardStats(locals: App.Locals, token: string) {
	const user = await getUserDataByToken(token)

	if (!user) throw new Error('User not found')

	if (!user.permissions.includes(OsucPermissions.userIsRoot))
		throw new Error('You do not have permission to access this resource')

	const DB = locals.runtime.env.DB

	// Get total reviews count by status
	const reviewStats = await DB.prepare(
		`
        SELECT 
            status,
            COUNT(*) as count
        FROM course_reviews 
        GROUP BY status
    `
	).all()

	// Get total courses with reviews
	const coursesWithReviews = await DB.prepare(
		`
        SELECT COUNT(DISTINCT course_sigle) as count 
        FROM course_reviews WHERE status = 1
    `
	).first<{ count: number }>()

	// Get recent activity (last 7 days)
	const recentActivity = await DB.prepare(
		`
        SELECT COUNT(*) as count 
        FROM course_reviews 
        WHERE created_at >= datetime('now', '-7 days')
    `
	).first<{ count: number }>()

	// Get top courses by review count
	const topCourses = await DB.prepare(
		`
        SELECT 
            course_sigle,
            COUNT(*) as review_count
        FROM course_reviews 
        WHERE status = 1
        GROUP BY course_sigle
        ORDER BY review_count DESC
        LIMIT 5
    `
	).all<{ course_sigle: string; review_count: number }>()

	// Get sentiment distribution
	const sentimentStats = await DB.prepare(
		`
        SELECT 
            like_dislike,
            COUNT(*) as count
        FROM course_reviews 
        WHERE status = 1
        GROUP BY like_dislike
    `
	).all<{ like_dislike: number; count: number }>()

	// Get recent reports (last 30 days)
	const recentReports = await DB.prepare(
		`
        SELECT COUNT(*) as count 
        FROM course_reviews 
        WHERE status = 2 AND updated_at >= datetime('now', '-30 days')
    `
	).first<{ count: number }>()

	return {
		reviewStats: reviewStats.results,
		coursesWithReviews: coursesWithReviews?.count || 0,
		recentActivity: recentActivity?.count || 0,
		topCourses: topCourses.results,
		sentimentStats: sentimentStats.results,
		recentReports: recentReports?.count || 0,
	}
}

export async function getSystemHealth(locals: App.Locals, token: string) {
	const user = await getUserDataByToken(token)

	if (!user) throw new Error('User not found')

	if (!user.permissions.includes(OsucPermissions.userIsRoot))
		throw new Error('You do not have permission to access this resource')

	const DB = locals.runtime.env.DB

	// Check for orphaned reviews (reviews for courses that don't exist)
	const orphanedReviews = await DB.prepare(
		`
        SELECT COUNT(*) as count 
        FROM course_reviews cr
        LEFT JOIN course_summary cs ON cr.course_sigle = cs.sigle
        WHERE cs.sigle IS NULL
    `
	).first<{ count: number }>()

	// Check for reviews pending approval for more than 7 days
	const staleReviews = await DB.prepare(
		`
        SELECT COUNT(*) as count 
        FROM course_reviews 
        WHERE status = 0 AND created_at <= datetime('now', '-7 days')
    `
	).first<{ count: number }>()

	return {
		orphanedReviews: orphanedReviews?.count || 0,
		staleReviews: staleReviews?.count || 0,
	}
}

export async function getHiddenReviews(locals: App.Locals, token: string) {
	const user = await getUserDataByToken(token)

	if (!user) throw new Error('User not found')

	if (!user.permissions.includes(OsucPermissions.userIsRoot))
		throw new Error('You do not have permission to access this resource')

	const DB = locals.runtime.env.DB

	const result = await DB.prepare(
		'SELECT id, user_id, course_sigle, like_dislike, workload_vote, attendance_type, weekly_hours, year_taken, semester_taken, comment_path, status, created_at, updated_at FROM course_reviews WHERE status = 3 ORDER BY updated_at DESC'
	).all<CourseReview>()

	const reviews = result.results

	return reviews
}
