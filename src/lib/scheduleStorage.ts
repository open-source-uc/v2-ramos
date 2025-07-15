/**
 * Utility functions for managing user schedule storage
 */

const SCHEDULE_STORAGE_KEY = 'scheduleCourses'

/**
 * Get saved courses from localStorage
 */
export function getSavedCourses(): string[] {
	if (typeof window === 'undefined') return []

	try {
		const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY)
		return saved ? JSON.parse(saved) : []
	} catch (error) {
		console.error('Error loading saved courses:', error)
		return []
	}
}

/**
 * Save courses to localStorage
 */
export function saveCourses(courses: string[]): void {
	if (typeof window === 'undefined') return

	try {
		localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(courses))
	} catch (error) {
		console.error('Error saving courses:', error)
	}
}

/**
 * Add a course to the saved schedule
 */
export function addCourseToSchedule(courseId: string): boolean {
	const currentCourses = getSavedCourses()

	if (currentCourses.includes(courseId)) {
		return false // Already exists
	}

	const updatedCourses = [...currentCourses, courseId]
	saveCourses(updatedCourses)
	return true
}

/**
 * Remove a course from the saved schedule
 */
export function removeCourseFromSchedule(courseId: string): boolean {
	const currentCourses = getSavedCourses()
	const updatedCourses = currentCourses.filter((id) => id !== courseId)

	if (updatedCourses.length === currentCourses.length) {
		return false // Course wasn't in the list
	}

	saveCourses(updatedCourses)
	return true
}

/**
 * Check if a course is already in the schedule
 */
export function isCourseInSchedule(courseId: string): boolean {
	return getSavedCourses().includes(courseId)
}

/**
 * Clear all courses from the schedule
 */
export function clearSchedule(): void {
	saveCourses([])
}

/**
 * Get the total number of courses in the schedule
 */
export function getScheduleCount(): number {
	return getSavedCourses().length
}
