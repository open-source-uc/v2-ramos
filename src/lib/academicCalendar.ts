/**
 * Utilidades para manejar el calendario académico usando configuración JSON
 */
import academicCalendarData from '@/data/academicCalendar.json'

// Tipos para la configuración del calendario
export interface ExcludedDate {
  date: string
  name: string
  type: 'holiday' | 'exam_week' | 'final_exam' | 'custom'
}

export interface SemesterConfig {
  semesterStart: string
  semesterEnd: string
  excludedDates: ExcludedDate[]
}

export interface AcademicCalendarConfig {
  [semesterCode: string]: SemesterConfig
}

/**
 * Obtiene todas las fechas que deben excluirse de la recurrencia
 */
export function getExcludedDates(
  semesterCode: string, 
  excludeTypes: string[] = ['holiday', 'exam_week', 'final_exam']
): Date[] {
  const config = academicCalendarData as AcademicCalendarConfig
  const semesterConfig = config[semesterCode]
  
  if (!semesterConfig) {
    console.warn(`No se encontró configuración para el semestre: ${semesterCode}`)
    return []
  }

  return semesterConfig.excludedDates
    .filter(item => excludeTypes.includes(item.type))
    .map(item => new Date(item.date))
    .sort((a, b) => a.getTime() - b.getTime())
}

/**
 * Obtiene fechas excluidas por tipo específico
 */
export function getExcludedDatesByType(
  semesterCode: string, 
  type: 'holiday' | 'exam_week' | 'final_exam' | 'custom'
): Date[] {
  return getExcludedDates(semesterCode, [type])
}

/**
 * Obtiene solo los feriados (excluyendo semanas de exámenes)
 */
export function getHolidaysOnly(semesterCode: string): Date[] {
  return getExcludedDates(semesterCode, ['holiday'])
}

/**
 * Obtiene solo las semanas de exámenes
 */
export function getExamWeeksOnly(semesterCode: string): Date[] {
  return getExcludedDates(semesterCode, ['exam_week', 'final_exam'])
}

/**
 * Convierte fechas a formato ICS para exclusionDates
 * Incluye hora y minutos para mejor compatibilidad con Google Calendar
 */
export function datesToICSExdate(dates: Date[], startHour: number = 0, startMinute: number = 0): [number, number, number, number, number][] {
  return dates.map(date => [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    startHour,
    startMinute
  ] as [number, number, number, number, number])
}

/**
 * Obtiene información completa del semestre
 */
export function getSemesterInfo(semesterCode: string): SemesterConfig | null {
  const config = academicCalendarData as AcademicCalendarConfig
  return config[semesterCode] || null
}

/**
 * Lista todos los semestres disponibles
 */
export function getAvailableSemesters(): string[] {
  const config = academicCalendarData as AcademicCalendarConfig
  return Object.keys(config).sort()
}
