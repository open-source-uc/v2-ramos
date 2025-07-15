import type { APIRoute } from 'astro'
import CoursesRaw from '../../../migration/json/cursos-simplificado.json'
import type { CourseStaticInfo, CourseSummary } from '@/types'

const coursesData = CoursesRaw as Record<string, CourseStaticInfo>

export const GET: APIRoute = async ({ request, locals }) => {
	const API_SECRET = import.meta.env.API_SECRET
	if (!API_SECRET) {
		return new Response('Internal Server Error', { status: 500 })
	}

	const authHeader = request.headers.get('Authorization')

	if (!authHeader || authHeader !== `Bearer ${API_SECRET}`) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const result = await locals.runtime.env.DB.prepare(
			`
            SELECT 
            id,
            sigle,
            superlikes,
            likes,
            dislikes,
            votes_low_workload,
            votes_medium_workload,
            votes_high_workload,
            votes_mandatory_attendance,
            votes_optional_attendance,
            avg_weekly_hours,
            sort_index
            FROM course_summary ORDER BY sort_index DESC, id
        `
		).all<CourseSummary>()

		const stream = new ReadableStream({
			start(controller) {
				try {
					for (const course of result.results) {
						const staticInfo = coursesData[course.sigle]
						course.name = staticInfo?.name ?? course.sigle
						course.credits = staticInfo?.credits ?? 0
						course.req = staticInfo?.req ?? ''
						course.conn = staticInfo?.conn ?? ''
						course.restr = staticInfo?.restr ?? ''
						course.equiv = staticInfo?.equiv ?? ''
						course.format = staticInfo?.format ?? []
						course.campus = staticInfo?.campus ?? []
						course.is_removable = staticInfo?.is_removable ?? []
						course.is_special = staticInfo?.is_special ?? []
						course.is_english = staticInfo?.is_english ?? []
						course.school = staticInfo?.school ?? ''
						course.area = staticInfo?.area ?? ''
						course.category = staticInfo?.category ?? ''
						course.last_semester = staticInfo?.last_semester ?? ''

						const line = JSON.stringify(course) + '\n'
						controller.enqueue(new TextEncoder().encode(line))
					}
					controller.close()
				} catch (err) {
					console.error('Error in stream:', err)
					controller.error(err)
				}
			},
		})

		return new Response(stream, {
			status: 200,
			headers: {
				'Content-Type': 'application/x-ndjson; charset=utf-8',
			},
		})
	} catch (err) {
		console.error('Error in GET handler:', err)
		return new Response('Internal Server Error', { status: 500 })
	}
}
