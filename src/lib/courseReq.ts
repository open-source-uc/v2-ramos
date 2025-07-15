import type { PrerequisiteCourse, PrerequisiteGroup, ParsedPrerequisites } from '@/types'

/**
 * Analiza una cadena de prerrequisitos en un formato estructurado
 * @param req La cadena de prerrequisitos (ej: "(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007) o (IMT2220 o IMT2230)")
 * @returns Estructura de prerrequisitos analizada
 */
export function parsePrerequisites(req: string): ParsedPrerequisites {
	// Manejar prerrequisitos vacíos o inexistentes
	if (!req || req.trim() === '' || req.trim() === 'No tiene') {
		return { hasPrerequisites: false }
	}

	// Limpiar la cadena de entrada
	const cleanReq = req.trim()

	try {
		const structure = parsePrerequisiteExpression(cleanReq)
		return {
			hasPrerequisites: true,
			structure,
		}
	} catch (error) {
		console.error('Error parsing prerequisites:', error)
		return { hasPrerequisites: false }
	}
}

/**
 * Analiza recursivamente una expresión de prerrequisitos
 */
function parsePrerequisiteExpression(expression: string): PrerequisiteGroup {
	// Remover paréntesis externos si envuelven toda la expresión
	let trimmed = expression.trim()
	if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
		const inner = trimmed.slice(1, -1).trim()
		if (isBalancedParentheses(inner)) {
			trimmed = inner
		}
	}

	// Si es un curso simple (sin operadores ni paréntesis)
	if (!trimmed.includes(' y ') && !trimmed.includes(' o ') && !trimmed.includes('(')) {
		const courses = extractCourses(trimmed)
		return {
			type: 'AND',
			courses,
		}
	}

	// Primero intentar dividir por 'o', luego por 'y' en el nivel superior
	const orParts = splitByOperator(trimmed, 'o')
	if (orParts.length > 1) {
		const groups = orParts.map((part) => parsePrerequisiteExpression(part.trim()))
		return {
			type: 'OR',
			courses: [],
			groups,
		}
	}

	const andParts = splitByOperator(trimmed, 'y')
	if (andParts.length > 1) {
		const groups = andParts.map((part) => parsePrerequisiteExpression(part.trim()))
		return {
			type: 'AND',
			courses: [],
			groups,
		}
	}

	// Si llegamos aquí, debe ser un curso simple
	const courses = extractCourses(trimmed)
	return {
		type: 'AND',
		courses,
	}
}

/**
 * Divide una expresión por el operador dado en el nivel superior
 */
function splitByOperator(expression: string, operator: 'y' | 'o'): string[] {
	const parts: string[] = []
	let currentPart = ''
	let parenthesesCount = 0

	for (let i = 0; i < expression.length; i++) {
		const char = expression[i]

		if (char === '(') {
			parenthesesCount++
			currentPart += char
		} else if (char === ')') {
			parenthesesCount--
			currentPart += char
		} else if (parenthesesCount === 0 && expression.slice(i).startsWith(` ${operator} `)) {
			if (currentPart.trim()) {
				parts.push(currentPart.trim())
			}
			currentPart = ''
			i += operator.length + 1 // Skip operator and one space
		} else {
			currentPart += char
		}
	}

	if (currentPart.trim()) {
		parts.push(currentPart.trim())
	}

	return parts
}

/**
 * Extrae siglas de cursos de una cadena
 */
function extractCourses(text: string): PrerequisiteCourse[] {
	const courses: PrerequisiteCourse[] = []

	// Identificar cursos y correquisitos
	const matches = text.match(/[A-Z]{2,4}\d{1,4}[A-Z]?(?:\(c\))?/g) || []

	for (const match of matches) {
		if (match) {
			const isCoreq = match.endsWith('(c)')
			const sigle = isCoreq ? match.slice(0, -3) : match

			if (/^[A-Z]{2,4}\d{1,4}[A-Z]?$/.test(sigle)) {
				courses.push({
					sigle,
					isCoreq,
				})
			}
		}
	}

	return courses
}

/**
 * Verifica si los paréntesis están balanceados en una cadena
 */
function isBalancedParentheses(text: string): boolean {
	let count = 0
	for (const char of text) {
		if (char === '(') count++
		else if (char === ')') count--
		if (count < 0) return false
	}
	return count === 0
}
