import { TIME_SLOTS } from '@/lib/scheduleMatrix'
import { ACTUAL_SEMESTER } from './academicCalendar'
import { VCalendar, exDate } from './icsHorario'
import type { icsEvent, semester } from './icsHorario'

// Utilidad para descargar un archivo ICS en el navegador
function downloadICS(filename: string, content: string) {
	const blob = new Blob([content], { type: 'text/calendar' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()
	URL.revokeObjectURL(url)
}

// Mapea el nombre del día a RFC5545 (ics)
const DAY_TO_ICS: Record<string, icsEvent['day']> = {
	L: 'MO',
	M: 'TU',
	W: 'WE',
	J: 'TH',
	V: 'FR',
	S: 'SA',
	D: 'SU',
}

// Mapea el string de hora a [hora, minuto]
function parseTimeSlot(time: string): [number, number] {
	// Ejemplo: '08:20' => [8, 20]
	const [h, m] = time.split(':').map(Number)
	return [h, m]
}

// Dada la matriz y los datos, genera eventos ICS
export default function generateICSFromSchedule({
	matrix,
	hiddenCourses = [],
	filterType,
}: {
	matrix: any // ScheduleMatrix
	hiddenCourses?: string[]
	filterType?: string
}) {
	const excludeTypes: string[] = []
	excludeTypes.push('holiday')
	excludeTypes.push('final_exam')
	excludeTypes.push('custom')

	// Días de la semana en orden
	const DAYS = ['L', 'M', 'W', 'J', 'V', 'S', 'D']

	matrix.forEach((row: any[], timeIndex: number) => {
		row.forEach((classes: any[], dayIndex: number) => {
			classes.forEach((classInfo: any) => {
				if (filterType && classInfo.type !== filterType) return

				// Construir el ID único para este bloque y verificar si está oculto
				const dayLetter = DAYS[dayIndex]
				const startTimeStr = TIME_SLOTS[timeIndex]
				const blockId = `${classInfo.courseId}-${classInfo.section}-${dayLetter}-${startTimeStr}`
				if (hiddenCourses.includes(blockId)) return

				const icsDay = DAY_TO_ICS[dayLetter]
				if (!icsDay) return

				// Cada bloque en UC dura 1:10 (1 hora y 10 minutos)
				const [startHour, startMinute] = parseTimeSlot(startTimeStr)

				// Calcular hora de fin: agregar 1 hora y 10 minutos
				let endHour = startHour + 1
				let endMinute = startMinute + 10

				// Ajustar si los minutos pasan de 60
				if (endMinute >= 60) {
					endHour += 1
					endMinute -= 60
				}

				// Buscar el primer día de la semana correspondiente al día de la clase
				const firstDay = ACTUAL_SEMESTER.start
				const jsDayIndex = ['D', 'L', 'M', 'W', 'J', 'V', 'S'].indexOf(dayLetter)
				let diff = jsDayIndex - firstDay.getDay()
				if (diff < 0) diff += 7
				firstDay.setDate(firstDay.getDate() + diff)
			})
		})
	})
}
