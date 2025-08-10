import { TIME_SLOTS } from '@/lib/scheduleMatrix'
import { ACTUAL_SEMESTER } from './academicCalendar'
import { VCalendar, eventTemplate } from './icsHorario'
import type { icsEvent } from './icsHorario'
import type { ScheduleMatrix, ScheduleBlock } from '@/types'

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

// Mapea el tipo de clase a descripción completa
function getClassTypeDescription(type: string): string {
	const typeMap: Record<string, string> = {
		CLAS: 'Cátedra',
		LAB: 'Laboratorio',
		AYUD: 'Ayudantía',
		TAYL: 'Talleres',
		TERR: 'Trabajo de Terreno',
		PRAC: 'Práctica',
		OTRO: 'Otro',
	}
	return typeMap[type] || type
}

// Función principal para generar y descargar el archivo ICS
export default function generateICSFromSchedule({
	matrix,
	hiddenCourses = [],
	filterType,
}: {
	matrix: ScheduleMatrix
	hiddenCourses?: string[]
	filterType?: string
}) {
	const events: icsEvent[] = []

	// Días de la semana en orden (sin domingo en la matriz)
	const DAYS = ['L', 'M', 'W', 'J', 'V', 'S']

	// Iterar sobre la matriz de horarios
	matrix.forEach((row: ScheduleBlock[][], timeIndex: number) => {
		row.forEach((classes: ScheduleBlock[], dayIndex: number) => {
			classes.forEach((classInfo: ScheduleBlock) => {
				// Si hay filtro de tipo, solo incluir clases del tipo especificado
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
				const jsDayIndex = ['D', 'L', 'M', 'W', 'J', 'V', 'S'].indexOf(dayLetter)
				let diff = jsDayIndex - ACTUAL_SEMESTER.start.getDay()
				if (diff < 0) diff += 7

				// Crear las fechas de inicio y fin del evento
				const startDate = new Date(ACTUAL_SEMESTER.start)
				startDate.setDate(ACTUAL_SEMESTER.start.getDate() + diff)
				startDate.setHours(startHour, startMinute, 0, 0)

				const endDate = new Date(startDate)
				endDate.setHours(endHour, endMinute, 0, 0)

				// Crear el evento ICS
				const event: icsEvent = {
					start: startDate,
					end: endDate,
					summary: `${classInfo.courseId} - ${getClassTypeDescription(classInfo.type)}`,
					description: `${classInfo.courseId} - ${classInfo.type}\\n${classInfo.campus || 'Sin campus'}\\nSemestre: ${ACTUAL_SEMESTER.name}`,
					location: classInfo.classroom,
					day: icsDay,
				}

				events.push(event)
			})
		})
	})

	// Si no hay eventos, no generar archivo
	if (events.length === 0) {
		console.warn('No hay eventos para exportar')
		return
	}

	// Generar el contenido del archivo ICS
	const calendarEvents = events.map((event) => eventTemplate(event, ACTUAL_SEMESTER)).join('')

	const icsContent = VCalendar(calendarEvents)

	// Generar nombre del archivo
	const typeFilter = filterType ? `_${getClassTypeDescription(filterType)}` : ''
	let filename = ''
	if (typeFilter) {
		filename = `horario_${ACTUAL_SEMESTER.name}${typeFilter}.ics`
	} else {
		filename = `horario_${ACTUAL_SEMESTER.name}.ics`
	}

	// Descargar el archivo
	downloadICS(filename, icsContent)

	console.log(`Archivo ICS generado: ${filename} con ${events.length} eventos`)
}
