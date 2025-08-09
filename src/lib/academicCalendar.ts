/**
 * Utilidades para manejar el calendario académico usando configuración JSON
 */
import { CURRENT_SEMESTER } from './currentSemester'
import academicCalendarData from '@/data/academicCalendar.json'
import type { semester } from './icsHorario'

const stringToIcs = (dateString: string): [number, number, number] => {
	const date = dateString.split('-')
	return [parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])]
}

const SEMESTER = academicCalendarData[CURRENT_SEMESTER]

const SEMESTER_START = new Date(...stringToIcs(SEMESTER.semesterStart))
const SEMESTER_END = new Date(...stringToIcs(SEMESTER.semesterEnd))

const EXCLUDED_DATES = SEMESTER.excludedDates.map((date) => new Date(...stringToIcs(date['date'])))

export const ACTUAL_SEMESTER: semester = {
	name: CURRENT_SEMESTER,
	start: SEMESTER_START,
	end: SEMESTER_END,
	excludedDates: EXCLUDED_DATES,
}
