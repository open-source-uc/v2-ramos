import { createEvents } from 'ics'
import type { EventAttributes } from 'ics'
import { recurrenceRuleGenWeekly } from '@/lib/icsHorario'
import { TIME_SLOTS } from '@/lib/scheduleMatrix'
import type { WeekDay } from '@/lib/icsHorario'

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
const DAY_TO_ICS: Record<string, WeekDay> = {
  'L': 'MO',
  'M': 'TU',
  'W': 'WE',
  'J': 'TH',
  'V': 'FR',
  'S': 'SA',
  'D': 'SU',
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
  courseSectionsData,
  selectedCourses,
  semesterStart,
  semesterEnd,
  semesterCode,
  hiddenCourses = [],
  filterType,
}: {
  matrix: any // ScheduleMatrix
  courseSectionsData: any // CourseSections
  selectedCourses: string[]
  semesterStart: Date
  semesterEnd: Date
  semesterCode: string // e.g. '2025-1'
  hiddenCourses?: string[]
  filterType?: string
}) {
  const events: EventAttributes[] = []

  // Días de la semana en orden (ajusta según tu config)
  const DAYS = ['L', 'M', 'W', 'J', 'V', 'S', 'D']

  matrix.forEach((row: any[], timeIndex: number) => {
    row.forEach((classes: any[], dayIndex: number) => {
      classes.forEach((classInfo: any) => {
        if (filterType && classInfo.type !== filterType) return;
        const dayLetter = DAYS[dayIndex]
        const icsDay = DAY_TO_ICS[dayLetter]
        if (!icsDay) return

        // Usar el bloque horario real para la hora de inicio y fin
        const startTimeStr = TIME_SLOTS[timeIndex]
        let endTimeStr = TIME_SLOTS[timeIndex + 1] || '21:30'
        if (startTimeStr === "12:20") endTimeStr = "13:30" // Ajuste especial para el bloque de almuerzo

        // Construir el ID único para este bloque
        const blockId = `${classInfo.courseId}-${classInfo.section}-${dayLetter}-${startTimeStr}`
        if (hiddenCourses.includes(blockId)) return

        const [startHour, startMinute] = parseTimeSlot(startTimeStr)
        const [endHour, endMinute] = parseTimeSlot(endTimeStr)

        // Buscar el primer día de la semana correspondiente al día de la clase
        const firstDay = new Date(semesterStart)
        const jsDayIndex = ['D','L','M','W','J','V','S'].indexOf(dayLetter)
        let diff = jsDayIndex - firstDay.getDay()
        if (diff < 0) diff += 7
        firstDay.setDate(firstDay.getDate() + diff)

        events.push({
          start: [firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate(), startHour, startMinute],
          end: [firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate(), endHour, endMinute],
          title: `${classInfo.courseId} - ${classInfo.type}`,
          description: `${classInfo.courseId} - ${classInfo.type}\n${classInfo.campus}\nSemestre: ${semesterCode}`,
          location: classInfo.campus,
          recurrenceRule: recurrenceRuleGenWeekly(
            icsDay,
            1,
            semesterEnd.getFullYear(),
            semesterEnd.getMonth() + 1,
            semesterEnd.getDate()
          ),
        })
      })
    })
  })

  createEvents(events, (error, value) => {
		if (!error && value) {
      const filename = `horario-${filterType}-${semesterCode}.ics`
      downloadICS(filename, value)
    }
  })
}