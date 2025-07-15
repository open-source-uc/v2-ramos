import { describe, it, expect } from 'vitest'
import {
	createScheduleMatrix,
	getClassesAt,
	detectScheduleConflicts,
	getScheduleDisplay,
	TIME_SLOTS,
	DAYS,
	BLOCK_MAP,
} from '@/lib/scheduleMatrix'
import type { CourseSections } from '@/types'

// Datos de prueba simulados
const mockCourseSections: CourseSections = {
	IIC2214: {
		'1': {
			schedule: {
				l1: ['CLAS', 'SALA A1'],
				w2: ['LAB', 'LAB 1'],
				v3: ['AYUD', 'SALA B2'],
			},
		},
		'2': {
			schedule: {
				l1: ['CLAS', 'SALA A2'], // Misma hora que IIC2214-1, debería crear conflicto
				m4: ['LAB', 'LAB 2'],
			},
		},
	},
	MAT1610: {
		'1': {
			schedule: {
				m1: ['CLAS', 'AUDITORIO'],
				j1: ['CLAS', 'AUDITORIO'],
				v2: ['AYUD', 'SALA C1'],
			},
		},
	},
	FIS1503: {
		'1': {
			schedule: {
				l2: ['CLAS', 'FISICA 1'],
				w1: ['LAB', 'LAB FISICA'],
				v4: ['AYUD', 'SALA F1'],
			},
		},
	},
}

describe('Utilidad de Matriz de Horarios', () => {
	describe('Constantes', () => {
		it('debería tener franjas horarias correctas', () => {
			expect(TIME_SLOTS).toEqual([
				'08:20',
				'09:40',
				'11:00',
				'12:20',
				'14:50',
				'16:10',
				'17:30',
				'18:50',
				'20:10',
			])
		})

		it('debería tener días correctos', () => {
			expect(DAYS).toEqual(['L', 'M', 'W', 'J', 'V'])
		})

		it('debería tener mapeo de bloques válido', () => {
			expect(BLOCK_MAP['l1']).toEqual({ dia: 'L', hora: '08:20' })
			expect(BLOCK_MAP['m2']).toEqual({ dia: 'M', hora: '09:40' })
			expect(BLOCK_MAP['v9']).toEqual({ dia: 'V', hora: '20:10' })
		})
	})

	describe('createScheduleMatrix', () => {
		it('debería crear una matriz vacía para ningún curso', () => {
			const matrix = createScheduleMatrix(mockCourseSections, [])

			// Debería tener 9 franjas horarias y 5 días
			expect(matrix).toHaveLength(9)
			expect(matrix[0]).toHaveLength(5)

			// Todas las celdas deberían estar vacías
			for (const timeSlot of matrix) {
				for (const daySlot of timeSlot) {
					expect(daySlot).toEqual([])
				}
			}
		})

		it('debería colocar correctamente un solo curso', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1'])

			// Verificar l1 (Lunes, 08:20)
			const mondayFirstSlot = getClassesAt(matrix, '08:20', 'L')
			expect(mondayFirstSlot).toHaveLength(1)
			expect(mondayFirstSlot[0]).toEqual({
				type: 'CLAS',
				classroom: 'SALA A1',
				courseId: 'IIC2214',
				section: '1',
			})

			// Verificar w2 (Miércoles, 09:40)
			const wednesdaySecondSlot = getClassesAt(matrix, '09:40', 'W')
			expect(wednesdaySecondSlot).toHaveLength(1)
			expect(wednesdaySecondSlot[0]).toEqual({
				type: 'LAB',
				classroom: 'LAB 1',
				courseId: 'IIC2214',
				section: '1',
			})

			// Verificar v3 (Viernes, 11:00)
			const fridayThirdSlot = getClassesAt(matrix, '11:00', 'V')
			expect(fridayThirdSlot).toHaveLength(1)
			expect(fridayThirdSlot[0]).toEqual({
				type: 'AYUD',
				classroom: 'SALA B2',
				courseId: 'IIC2214',
				section: '1',
			})
		})

		it('debería manejar múltiples cursos sin conflictos', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1', 'MAT1610-1'])

			// Verificar que ambos cursos se coloquen correctamente
			const mondayFirstSlot = getClassesAt(matrix, '08:20', 'L')
			expect(mondayFirstSlot).toHaveLength(1)
			expect(mondayFirstSlot[0].courseId).toBe('IIC2214')

			const tuesdayFirstSlot = getClassesAt(matrix, '08:20', 'M')
			expect(tuesdayFirstSlot).toHaveLength(1)
			expect(tuesdayFirstSlot[0].courseId).toBe('MAT1610')

			const thursdayFirstSlot = getClassesAt(matrix, '08:20', 'J')
			expect(thursdayFirstSlot).toHaveLength(1)
			expect(thursdayFirstSlot[0].courseId).toBe('MAT1610')
		})

		it('debería manejar cursos en conflicto', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1', 'IIC2214-2'])

			// Ambas secciones tienen l1 (Monday, 08:20), por lo que debería haber conflicto
			const mondayFirstSlot = getClassesAt(matrix, '08:20', 'L')
			expect(mondayFirstSlot).toHaveLength(2)
			expect(mondayFirstSlot[0].courseId).toBe('IIC2214')
			expect(mondayFirstSlot[1].courseId).toBe('IIC2214')
			expect(mondayFirstSlot[0].section).toBe('1')
			expect(mondayFirstSlot[1].section).toBe('2')
		})

		it('debería ignorar selecciones de cursos inválidos', () => {
			const matrix = createScheduleMatrix(mockCourseSections, [
				'IIC2214-1',
				'INVALID-1',
				'IIC2214-999',
				'MAT1610-1',
			])

			// Debería tener solo los cursos válidos
			const mondayFirstSlot = getClassesAt(matrix, '08:20', 'L')
			expect(mondayFirstSlot).toHaveLength(1)
			expect(mondayFirstSlot[0].courseId).toBe('IIC2214')

			const tuesdayFirstSlot = getClassesAt(matrix, '08:20', 'M')
			expect(tuesdayFirstSlot).toHaveLength(1)
			expect(tuesdayFirstSlot[0].courseId).toBe('MAT1610')
		})
	})

	describe('getClassesAt', () => {
		it('debería retornar array vacío para hora/día inválidos', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1'])

			expect(getClassesAt(matrix, 'INVALID', 'L')).toEqual([])
			expect(getClassesAt(matrix, '08:20', 'INVALID')).toEqual([])
			expect(getClassesAt(matrix, 'INVALID', 'INVALID')).toEqual([])
		})

		it('debería retornar clases correctas para hora/día válidos', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1', 'MAT1610-1'])

			const classes = getClassesAt(matrix, '08:20', 'L')
			expect(classes).toHaveLength(1)
			expect(classes[0].courseId).toBe('IIC2214')
		})
	})

	describe('detectScheduleConflicts', () => {
		it('debería retornar array vacío cuando no hay conflictos', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1', 'MAT1610-1'])
			const conflicts = detectScheduleConflicts(matrix)

			expect(conflicts).toEqual([])
		})

		it('debería detectar conflictos correctamente', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1', 'IIC2214-2'])
			const conflicts = detectScheduleConflicts(matrix)

			expect(conflicts).toHaveLength(1)
			expect(conflicts[0]).toHaveLength(2)
			expect(conflicts[0][0].courseId).toBe('IIC2214')
			expect(conflicts[0][1].courseId).toBe('IIC2214')
		})

		it('debería detectar múltiples conflictos', () => {
			// Crear un escenario de conflicto más complejo
			const complexMockData: CourseSections = {
				COURSE1: {
					'1': { schedule: { l1: ['CLAS', 'SALA1'], m2: ['LAB', 'LAB1'] } },
				},
				COURSE2: {
					'1': { schedule: { l1: ['CLAS', 'SALA2'], m2: ['LAB', 'LAB2'] } },
				},
				COURSE3: {
					'1': { schedule: { l1: ['AYUD', 'SALA3'] } },
				},
			}

			const matrix = createScheduleMatrix(complexMockData, ['COURSE1-1', 'COURSE2-1', 'COURSE3-1'])
			const conflicts = detectScheduleConflicts(matrix)

			expect(conflicts).toHaveLength(2) // conflictos l1 y m2

			// conflicto l1 debería tener 3 clases
			const l1Conflict = conflicts.find((conflict) => conflict.some((c) => c.type === 'AYUD'))
			expect(l1Conflict).toHaveLength(3)

			// conflicto m2 debería tener 2 clases
			const m2Conflict = conflicts.find((conflict) => conflict.every((c) => c.type === 'LAB'))
			expect(m2Conflict).toHaveLength(2)
		})
	})

	describe('getScheduleDisplay', () => {
		it('debería retornar objeto vacío para horario vacío', () => {
			const matrix = createScheduleMatrix(mockCourseSections, [])
			const display = getScheduleDisplay(matrix)

			for (const day of DAYS) {
				expect(display[day]).toEqual({})
			}
		})

		it('debería retornar estructura de visualización correcta', () => {
			const matrix = createScheduleMatrix(mockCourseSections, ['IIC2214-1', 'MAT1610-1'])
			const display = getScheduleDisplay(matrix)

			// Verificar Lunes
			expect(display.L['08:20']).toHaveLength(1)
			expect(display.L['08:20'][0].courseId).toBe('IIC2214')

			// Verificar Martes
			expect(display.M['08:20']).toHaveLength(1)
			expect(display.M['08:20'][0].courseId).toBe('MAT1610')

			// Verificar Miércoles
			expect(display.W['09:40']).toHaveLength(1)
			expect(display.W['09:40'][0].courseId).toBe('IIC2214')

			// Verificar Jueves
			expect(display.J['08:20']).toHaveLength(1)
			expect(display.J['08:20'][0].courseId).toBe('MAT1610')

			// Verificar Viernes
			expect(display.V['11:00']).toHaveLength(1)
			expect(display.V['11:00'][0].courseId).toBe('IIC2214')

			expect(display.V['09:40']).toHaveLength(1)
			expect(display.V['09:40'][0].courseId).toBe('MAT1610')
		})
	})

	describe('Pruebas de integración', () => {
		it('debería manejar un escenario de horario realista', () => {
			const courses = ['IIC2214-1', 'MAT1610-1', 'FIS1503-1']
			const matrix = createScheduleMatrix(mockCourseSections, courses)

			// Verificar que no hay conflictos
			const conflicts = detectScheduleConflicts(matrix)
			expect(conflicts).toEqual([])

			// Verificar visualización de horario
			const display = getScheduleDisplay(matrix)

			// Contar clases totales
			let totalClasses = 0
			for (const day of DAYS) {
				for (const time of Object.keys(display[day])) {
					totalClasses += display[day][time].length
				}
			}

			// Debería tener 9 clases totales (3 por curso)
			expect(totalClasses).toBe(9)
		})

		it('debería manejar casos límite', () => {
			// Probar con selecciones de cursos malformadas
			const matrix = createScheduleMatrix(mockCourseSections, [
				'IIC2214-1',
				'', // cadena vacía
				'INVALID', // sin guión
				'A-B-C-D', // demasiados guiones
				'MAT1610-1',
			])

			// Debería seguir funcionando con cursos válidos
			const mondayClasses = getClassesAt(matrix, '08:20', 'L')
			const tuesdayClasses = getClassesAt(matrix, '08:20', 'M')

			expect(mondayClasses).toHaveLength(1)
			expect(tuesdayClasses).toHaveLength(1)
		})
	})
})
