/**
 * Semestre actual
 * Se debe actualizar al inicio de cada semestre
 */
export const CURRENT_SEMESTER = '2025-1'

/**
 * Chequea si el semestre dado es el semestre actual
 * @param semester - Semestre en el formato "YYYY-N"
 * @returns verdadero si es el semestre actual, falso en caso contrario
 */
export function isCurrentSemester(semester: string): boolean {
	return semester === CURRENT_SEMESTER
}

/**
 * Obtiene el texto de prefijo apropiado para la visualización del campus
 * @param lastSemester - El último semestre en el que se ofreció el curso
 * @returns "Actualmente dado en" si es el semestre actual, "Previamente dado en" si es un semestre pasado
 */
export function getCampusPrefix(lastSemester: string): string {
	return isCurrentSemester(lastSemester) ? 'Actualmente ofrecido en' : 'Previamente ofrecido en'
}

/**
 * Parsea un semestre en formato "YYYY-N" y devuelve año y número de semestre
 * @param semester - Semestre en formato "YYYY-N"
 * @returns objeto con year (número) y semesterNumber (número)
 */
export function parseSemester(semester: string): { year: number; semesterNumber: number } {
	const [yearStr, semesterStr] = semester.split('-')
	return {
		year: parseInt(yearStr, 10),
		semesterNumber: parseInt(semesterStr, 10),
	}
}

/**
 * Convierte año y número de semestre a string formato "YYYY-N"
 * @param year - Año
 * @param semesterNumber - Número de semestre (1, 2, o 3)
 * @returns semestre en formato "YYYY-N"
 */
export function formatSemester(year: number, semesterNumber: number): string {
	return `${year}-${semesterNumber}`
}

/**
 * Chequea si una combinación de año y semestre está en el futuro
 * @param year - Año a validar
 * @param semesterNumber - Número de semestre a validar (1, 2, o 3)
 * @returns true si la combinación está en el futuro, false en caso contrario
 */
export function isFutureSemester(year: number, semesterNumber: number): boolean {
	const current = parseSemester(CURRENT_SEMESTER)

	// Si el año es mayor al actual, es futuro
	if (year > current.year) {
		return true
	}

	// Si es el mismo año, comparar semestres
	if (year === current.year && semesterNumber > current.semesterNumber) {
		return true
	}

	return false
}

/**
 * Obtiene el año máximo permitido para reviews
 * @returns año actual
 */
export function getMaxAllowedYear(): number {
	return parseSemester(CURRENT_SEMESTER).year
}

/**
 * Obtiene los semestres permitidos para un año dado
 * @param year - Año para el cual obtener semestres permitidos
 * @returns array de números de semestre permitidos
 */
export function getAllowedSemestersForYear(year: number): number[] {
	const current = parseSemester(CURRENT_SEMESTER)

	// Si es un año anterior al actual, permitir todos los semestres
	if (year < current.year) {
		return [1, 2, 3]
	}

	// Si es el año actual, solo permitir semestres hasta el actual
	if (year === current.year) {
		const allowedSemesters = []
		for (let i = 1; i <= current.semesterNumber; i++) {
			allowedSemesters.push(i)
		}
		return allowedSemesters
	}

	// Si es un año futuro, no permitir ningún semestre
	return []
}
