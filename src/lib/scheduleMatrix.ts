import type { CourseSections, ScheduleMatrix, ScheduleBlock } from '@/types'

// Mapeo de franjas horarias
export const TIME_SLOTS = [
	'08:20',
	'09:40',
	'11:00',
	'12:20',
	'14:50',
	'16:10',
	'17:30',
	'18:50',
	'20:10',
]

// Días de la semana (incluye sábado)
export const DAYS = ['L', 'M', 'W', 'J', 'V', 'S']

// Mapeo de bloques (L=Lunes, M=Martes, W=Miércoles, J=Jueves, V=Viernes, S=Sábado)
export const BLOCK_MAP: Record<string, { dia: string; hora: string }> = {
	l1: { dia: 'L', hora: '08:20' },
	l2: { dia: 'L', hora: '09:40' },
	l3: { dia: 'L', hora: '11:00' },
	l4: { dia: 'L', hora: '12:20' },
	l5: { dia: 'L', hora: '14:50' },
	l6: { dia: 'L', hora: '16:10' },
	l7: { dia: 'L', hora: '17:30' },
	l8: { dia: 'L', hora: '18:50' },
	l9: { dia: 'L', hora: '20:10' },
	m1: { dia: 'M', hora: '08:20' },
	m2: { dia: 'M', hora: '09:40' },
	m3: { dia: 'M', hora: '11:00' },
	m4: { dia: 'M', hora: '12:20' },
	m5: { dia: 'M', hora: '14:50' },
	m6: { dia: 'M', hora: '16:10' },
	m7: { dia: 'M', hora: '17:30' },
	m8: { dia: 'M', hora: '18:50' },
	m9: { dia: 'M', hora: '20:10' },
	w1: { dia: 'W', hora: '08:20' },
	w2: { dia: 'W', hora: '09:40' },
	w3: { dia: 'W', hora: '11:00' },
	w4: { dia: 'W', hora: '12:20' },
	w5: { dia: 'W', hora: '14:50' },
	w6: { dia: 'W', hora: '16:10' },
	w7: { dia: 'W', hora: '17:30' },
	w8: { dia: 'W', hora: '18:50' },
	w9: { dia: 'W', hora: '20:10' },
	j1: { dia: 'J', hora: '08:20' },
	j2: { dia: 'J', hora: '09:40' },
	j3: { dia: 'J', hora: '11:00' },
	j4: { dia: 'J', hora: '12:20' },
	j5: { dia: 'J', hora: '14:50' },
	j6: { dia: 'J', hora: '16:10' },
	j7: { dia: 'J', hora: '17:30' },
	j8: { dia: 'J', hora: '18:50' },
	j9: { dia: 'J', hora: '20:10' },
	v1: { dia: 'V', hora: '08:20' },
	v2: { dia: 'V', hora: '09:40' },
	v3: { dia: 'V', hora: '11:00' },
	v4: { dia: 'V', hora: '12:20' },
	v5: { dia: 'V', hora: '14:50' },
	v6: { dia: 'V', hora: '16:10' },
	v7: { dia: 'V', hora: '17:30' },
	v8: { dia: 'V', hora: '18:50' },
	v9: { dia: 'V', hora: '20:10' },
	s1: { dia: 'S', hora: '08:20' },
	s2: { dia: 'S', hora: '09:40' },
	s3: { dia: 'S', hora: '11:00' },
	s4: { dia: 'S', hora: '12:20' },
	s5: { dia: 'S', hora: '14:50' },
	s6: { dia: 'S', hora: '16:10' },
	s7: { dia: 'S', hora: '17:30' },
	s8: { dia: 'S', hora: '18:50' },
	s9: { dia: 'S', hora: '20:10' },
}

/**
 * Crea una matriz de horarios a partir de las secciones de cursos
 * @param courseSections - Objeto que contiene las secciones de cursos con sus horarios
 * @param selectedCourses - Array de IDs curso-sección a incluir (formato: "ID_CURSO-SECCION")
 * @returns Una matriz 3D [franjaHoraria][diaSemana][clases] que representa el horario
 */
export function createScheduleMatrix(
	courseSections: CourseSections,
	selectedCourses: string[]
): ScheduleMatrix {
	// Inicializar matriz vacía: [franjaHoraria][diaSemana][clases]
	const matrix: ScheduleMatrix = TIME_SLOTS.map(() => DAYS.map(() => []))

	// Procesar cada curso seleccionado
	for (const courseSelection of selectedCourses) {
		const [courseId, sectionId] = courseSelection.split('-')

		// Obtener los datos de la sección del curso
		const courseData = courseSections[courseId]
		if (!courseData) continue

		const sectionData = courseData[sectionId]
		if (!sectionData || !sectionData.schedule) continue

		// Procesar cada bloque de horario para esta sección del curso
		for (const [blockCode, [type, classroom]] of Object.entries(sectionData.schedule)) {
			const blockInfo = BLOCK_MAP[blockCode]
			if (!blockInfo) continue

			// Encontrar los índices de franja horaria y día
			const timeIndex = TIME_SLOTS.indexOf(blockInfo.hora)
			const dayIndex = DAYS.indexOf(blockInfo.dia)

			if (timeIndex === -1 || dayIndex === -1) continue

			// Agregar la clase a la matriz, incluyendo campus si existe
			const scheduleBlock: ScheduleBlock = {
				type,
				classroom,
				courseId,
				section: sectionId,
				campus: sectionData.campus,
			}

			matrix[timeIndex][dayIndex].push(scheduleBlock)
		}
	}

	return matrix
}

/**
 * Obtiene todas las clases en una hora y día específicos
 * @param matrix - La matriz de horarios
 * @param timeSlot - La franja horaria (ej: "08:20")
 * @param day - El día de la semana (ej: "L")
 * @returns Array de bloques de horario en esa hora y día
 */
export function getClassesAt(
	matrix: ScheduleMatrix,
	timeSlot: string,
	day: string
): ScheduleBlock[] {
	const timeIndex = TIME_SLOTS.indexOf(timeSlot)
	const dayIndex = DAYS.indexOf(day)

	if (timeIndex === -1 || dayIndex === -1) {
		return []
	}

	return matrix[timeIndex][dayIndex]
}

/**
 * Verifica si hay conflictos de horario en la matriz
 * @param matrix - La matriz de horarios
 * @returns Array de conflictos, donde cada conflicto contiene las clases que se superponen
 */
export function detectScheduleConflicts(matrix: ScheduleMatrix): ScheduleBlock[][] {
	const conflicts: ScheduleBlock[][] = []

	for (let timeIndex = 0; timeIndex < matrix.length; timeIndex++) {
		for (let dayIndex = 0; dayIndex < matrix[timeIndex].length; dayIndex++) {
			const classes = matrix[timeIndex][dayIndex]
			if (classes.length > 1) {
				conflicts.push([...classes])
			}
		}
	}

	return conflicts
}

/**
 * Obtiene una representación legible del horario
 * @param matrix - La matriz de horarios
 * @returns Objeto con información del horario organizada por día y hora
 */
export function getScheduleDisplay(
	matrix: ScheduleMatrix
): Record<string, Record<string, ScheduleBlock[]>> {
	const display: Record<string, Record<string, ScheduleBlock[]>> = {}

	DAYS.forEach((day, dayIndex) => {
		display[day] = {}
		TIME_SLOTS.forEach((time, timeIndex) => {
			const classes = matrix[timeIndex][dayIndex]
			if (classes.length > 0) {
				display[day][time] = classes
			}
		})
	})

	return display
}

/**
 * Convierte los datos JSON de cursos al formato esperado por la utilidad de matriz de horarios
 * @param coursesJSON - Los datos de cursos en crudo del JSON
 * @returns Datos de secciones de cursos formateados
 */
export function convertCourseDataToSections(coursesJSON: any): CourseSections {
	const sections: CourseSections = {}

	for (const [courseId, courseData] of Object.entries(coursesJSON)) {
		const course = courseData as any
		sections[courseId] = {}

		for (const [sectionId, sectionData] of Object.entries(course.sections)) {
			const section = sectionData as any
			sections[courseId][sectionId] = {
				schedule: section.schedule || {},
			}
		}
	}

	return sections
}

/**
 * Convierte los datos NDJSON de cursos al formato esperado por la utilidad de matriz de horarios
 * @param coursesArray - Array de cursos desde NDJSON
 * @returns Datos de secciones de cursos formateados
 */
export function convertNDJSONToSections(coursesArray: any[]): CourseSections {
	const sections: CourseSections = {}

	for (const course of coursesArray) {
		if (course.sigle && course.sections) {
			sections[course.sigle] = {}

			for (const [sectionId, sectionData] of Object.entries(course.sections)) {
				const section = sectionData as any
				sections[course.sigle][sectionId] = {
					schedule: section.schedule || {},
					campus: section.campus || undefined,
				}
			}
		}
	}

	return sections
}

/**
 * Genera datos de secciones de muestra para un curso (placeholder)
 * @param courseId - ID del curso
 * @returns Datos de secciones con horarios de ejemplo
 */
export function generatePlaceholderSections(courseId: string): CourseSections {
	const sections: CourseSections = {
		[courseId]: {
			'1': {
				schedule: {
					l3: ['CLAS', 'Aula 201'],
					l4: ['CLAS', 'Aula 201'],
					w3: ['AYUD', 'Aula 105'],
					j2: ['LAB', 'Lab 301'],
				},
			},
			'2': {
				schedule: {
					m2: ['CLAS', 'Aula 150'],
					m3: ['CLAS', 'Aula 150'],
					j4: ['AYUD', 'Aula 203'],
					v1: ['LAB', 'Lab 302'],
				},
			},
			'3': {
				schedule: {
					l1: ['CLAS', 'Aula 180'],
					w1: ['CLAS', 'Aula 180'],
					v3: ['AYUD', 'Aula 107'],
					s2: ['LAB', 'Lab 303'],
				},
			},
		},
	}

	return sections
}

/**
 * Interface para representar una sugerencia de cambio de sección
 */
export interface SectionSuggestion {
	courseId: string
	currentSection: string
	suggestedSection: string
	courseName?: string
}

/**
 * Interface para el resultado del análisis de resolución de conflictos
 */
export interface ConflictResolutionResult {
	canResolve: boolean
	suggestions: SectionSuggestion[]
	remainingConflicts: ScheduleBlock[][]
	message: string
}

/**
 * Encuentra las posibles secciones alternativas para un curso específico
 * @param courseId - ID del curso
 * @param courseSections - Datos de todas las secciones disponibles
 * @returns Array de secciones disponibles para el curso
 */
export function getAvailableSections(courseId: string, courseSections: CourseSections): string[] {
	const courseData = courseSections[courseId]
	if (!courseData) return []

	return Object.keys(courseData)
}

/**
 * Verifica si una combinación de cursos tiene conflictos
 * @param selectedCourses - Array de cursos seleccionados en formato "COURSE_ID-SECTION"
 * @param courseSections - Datos de todas las secciones disponibles
 * @returns true si hay conflictos, false si no
 */
export function hasScheduleConflicts(
	selectedCourses: string[],
	courseSections: CourseSections
): boolean {
	const matrix = createScheduleMatrix(courseSections, selectedCourses)
	const conflicts = detectScheduleConflicts(matrix)
	return conflicts.length > 0
}

/**
 * Encuentra sugerencias para resolver conflictos de horario
 * @param selectedCourses - Array de cursos seleccionados
 * @param courseSections - Datos de todas las secciones disponibles
 * @param courseOptions - Opciones de cursos con nombres para mostrar
 * @returns Resultado del análisis de resolución de conflictos
 */
export function findConflictResolution(
	selectedCourses: string[],
	courseSections: CourseSections,
	courseOptions: Array<{ id: string; sigle: string; nombre: string; seccion: string }> = []
): ConflictResolutionResult {
	// Crear matriz actual y detectar conflictos
	const currentMatrix = createScheduleMatrix(courseSections, selectedCourses)
	const currentConflicts = detectScheduleConflicts(currentMatrix)

	if (currentConflicts.length === 0) {
		return {
			canResolve: true,
			suggestions: [],
			remainingConflicts: [],
			message: 'No hay conflictos en el horario actual.',
		}
	}

	// Extraer cursos únicos que tienen conflictos
	const conflictingCourses = new Set<string>()
	currentConflicts.forEach((conflict) => {
		conflict.forEach((block) => {
			conflictingCourses.add(`${block.courseId}-${block.section}`)
		})
	})

	const suggestions: SectionSuggestion[] = []

	// Para cada curso en conflicto, intentar encontrar una sección alternativa
	for (const conflictingCourse of conflictingCourses) {
		const [courseId, currentSection] = conflictingCourse.split('-')
		const availableSections = getAvailableSections(courseId, courseSections)

		// Probar cada sección alternativa
		for (const alternativeSection of availableSections) {
			if (alternativeSection === currentSection) continue

			// Crear una nueva lista con la sección alternativa
			const testCourses = selectedCourses.map((course) =>
				course === conflictingCourse ? `${courseId}-${alternativeSection}` : course
			)

			// Verificar si esta combinación resuelve los conflictos
			if (!hasScheduleConflicts(testCourses, courseSections)) {
				// Encontrar el nombre del curso
				const courseInfo = courseOptions.find(
					(opt) => opt.id === `${courseId}-${alternativeSection}`
				)
				const courseName = courseInfo?.nombre || courseId

				suggestions.push({
					courseId,
					currentSection,
					suggestedSection: alternativeSection,
					courseName,
				})
				break // Solo necesitamos una sugerencia por curso
			}
		}
	}

	// Si encontramos sugerencias, verificar si resuelven todos los conflictos
	if (suggestions.length > 0) {
		// Aplicar todas las sugerencias y verificar
		let testCourses = [...selectedCourses]
		suggestions.forEach((suggestion) => {
			const oldCourse = `${suggestion.courseId}-${suggestion.currentSection}`
			const newCourse = `${suggestion.courseId}-${suggestion.suggestedSection}`
			testCourses = testCourses.map((course) => (course === oldCourse ? newCourse : course))
		})

		const testMatrix = createScheduleMatrix(courseSections, testCourses)
		const remainingConflicts = detectScheduleConflicts(testMatrix)

		if (remainingConflicts.length === 0) {
			return {
				canResolve: true,
				suggestions,
				remainingConflicts: [],
				message: `Se encontraron ${suggestions.length} cambio(s) de sección que resuelven todos los conflictos.`,
			}
		} else {
			return {
				canResolve: false,
				suggestions,
				remainingConflicts,
				message: `Se encontraron ${suggestions.length} cambio(s) de sección, pero aún quedan ${remainingConflicts.length} conflicto(s).`,
			}
		}
	}

	// No se encontraron soluciones
	return {
		canResolve: false,
		suggestions: [],
		remainingConflicts: currentConflicts,
		message:
			'No se pudieron encontrar secciones alternativas que resuelvan los conflictos. Es posible que necesites eliminar algunos cursos.',
	}
}

/**
 * Aplica las sugerencias de cambio de sección a una lista de cursos seleccionados
 * @param selectedCourses - Array de cursos seleccionados actual
 * @param suggestions - Sugerencias de cambio de sección
 * @returns Nueva lista de cursos con las sugerencias aplicadas
 */
export function applySectionSuggestions(
	selectedCourses: string[],
	suggestions: SectionSuggestion[]
): string[] {
	let updatedCourses = [...selectedCourses]

	suggestions.forEach((suggestion) => {
		const oldCourse = `${suggestion.courseId}-${suggestion.currentSection}`
		const newCourse = `${suggestion.courseId}-${suggestion.suggestedSection}`
		updatedCourses = updatedCourses.map((course) => (course === oldCourse ? newCourse : course))
	})

	return updatedCourses
}

/**
 * Genera una combinación aleatoria de secciones para los cursos seleccionados
 * @param selectedCourses - Array de cursos seleccionados actual
 * @param courseSections - Datos de todas las secciones disponibles
 * @returns Nueva lista de cursos con secciones aleatorias
 */
export function shuffleSections(
	selectedCourses: string[],
	courseSections: CourseSections
): string[] {
	return selectedCourses.map((courseSelection) => {
		const [courseId] = courseSelection.split('-')
		const availableSections = getAvailableSections(courseId, courseSections)

		if (availableSections.length <= 1) {
			// Si solo hay una sección disponible, mantener la actual
			return courseSelection
		}

		// Seleccionar una sección completamente aleatoria (incluyendo la actual)
		const randomSection = availableSections[Math.floor(Math.random() * availableSections.length)]
		return `${courseId}-${randomSection}`
	})
}

/**
 * Genera múltiples combinaciones aleatorias y retorna la mejor (con menos conflictos)
 * @param selectedCourses - Array de cursos seleccionados actual
 * @param courseSections - Datos de todas las secciones disponibles
 * @param attempts - Número de intentos aleatorios (default: 10)
 * @returns La mejor combinación encontrada
 */
export function shuffleSectionsOptimal(
	selectedCourses: string[],
	courseSections: CourseSections,
	attempts: number = 10
): string[] {
	let bestCombination = selectedCourses
	let bestConflictCount = Infinity

	// Evaluar la combinación actual
	const currentMatrix = createScheduleMatrix(courseSections, selectedCourses)
	const currentConflicts = detectScheduleConflicts(currentMatrix)
	bestConflictCount = currentConflicts.length

	// Generar múltiples combinaciones aleatorias
	for (let i = 0; i < attempts; i++) {
		const shuffledCourses = shuffleSections(selectedCourses, courseSections)
		const matrix = createScheduleMatrix(courseSections, shuffledCourses)
		const conflicts = detectScheduleConflicts(matrix)

		if (conflicts.length < bestConflictCount) {
			bestCombination = shuffledCourses
			bestConflictCount = conflicts.length

			// Si encontramos una combinación sin conflictos, usar esa
			if (conflicts.length === 0) break
		}
	}

	return bestCombination
}
