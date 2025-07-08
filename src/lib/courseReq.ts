import type { PrerequisiteCourse, PrerequisiteGroup, ParsedPrerequisites } from "@/types";

/**
 * Analiza una cadena de prerrequisitos en un formato estructurado
 * @param req La cadena de prerrequisitos (ej: "(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007) o (IMT2220 o IMT2230)")
 * @returns Estructura de prerrequisitos analizada
 */
export function parsePrerequisites(req: string): ParsedPrerequisites {
  // Manejar prerrequisitos vacíos o inexistentes
  if (!req || req.trim() === '' || req.trim() === 'No tiene') {
    return { hasPrerequisites: false };
  }

  // Limpiar la cadena de entrada
  const cleanReq = req.trim();
  
  try {
    const structure = parsePrerequisiteExpression(cleanReq);
    return {
      hasPrerequisites: true,
      structure
    };
  } catch (error) {
    console.error('Error parsing prerequisites:', error);
    return { hasPrerequisites: false };
  }
}

/**
 * Analiza recursivamente una expresión de prerrequisitos
 */
function parsePrerequisiteExpression(expression: string): PrerequisiteGroup {
  // Remover paréntesis externos si envuelven toda la expresión
  const trimmed = expression.trim();
  if (trimmed.startsWith('(') && trimmed.endsWith(')') && isBalancedParentheses(trimmed)) {
    const inner = trimmed.slice(1, -1);
    if (isCompletelyWrapped(inner)) {
      return parsePrerequisiteExpression(inner);
    }
  }

  // Encontrar el operador principal (y o o) en el nivel superior
  const mainOperator = findMainOperator(trimmed);
  
  if (!mainOperator) {
    // Curso único o grupo de cursos sin operadores
    const courses = extractCourses(trimmed);
    if (courses.length === 1) {
      return {
        type: 'AND',
        courses: courses
      };
    } else {
      // Múltiples cursos separados por espacios (tratar como OR)
      return {
        type: 'OR',
        courses: courses
      };
    }
  }

  // Dividir por el operador principal
  const parts = splitByOperator(trimmed, mainOperator);
  const groups: PrerequisiteGroup[] = [];
  const courses: PrerequisiteCourse[] = [];

  for (const part of parts) {
    const partTrimmed = part.trim();
    if (partTrimmed.includes('y') || partTrimmed.includes('o') || partTrimmed.includes('(')) {
      // Esta parte necesita análisis adicional
      const subGroup = parsePrerequisiteExpression(partTrimmed);
      // Si es un curso único simple, agregarlo directamente en lugar de crear un grupo
      if (subGroup.courses && subGroup.courses.length === 1 && !subGroup.groups) {
        courses.push(...subGroup.courses);
      } else {
        groups.push(subGroup);
      }
    } else {
      // Esta parte contiene solo cursos
      courses.push(...extractCourses(partTrimmed));
    }
  }

  return {
    type: mainOperator === 'y' ? 'AND' : 'OR',
    courses: courses,
    groups: groups.length > 0 ? groups : undefined
  };
}

/**
 * Encuentra el operador principal (y o o) en el nivel superior de la expresión
 */
function findMainOperator(expression: string): 'y' | 'o' | null {
  let parenthesesCount = 0;
  let hasY = false;
  let hasO = false;

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (char === '(') {
      parenthesesCount++;
    } else if (char === ')') {
      parenthesesCount--;
    } else if (parenthesesCount === 0) {
      if (char === 'y' && (i === 0 || expression[i - 1] === ' ') && (i === expression.length - 1 || expression[i + 1] === ' ')) {
        hasY = true;
      } else if (char === 'o' && (i === 0 || expression[i - 1] === ' ') && (i === expression.length - 1 || expression[i + 1] === ' ')) {
        hasO = true;
      }
    }
  }

  // AND (y) tiene mayor precedencia que OR (o)
  if (hasY) return 'y';
  if (hasO) return 'o';
  return null;
}

/**
 * Divide una expresión por el operador dado en el nivel superior
 */
function splitByOperator(expression: string, operator: 'y' | 'o'): string[] {
  const parts: string[] = [];
  let currentPart = '';
  let parenthesesCount = 0;
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];
    
    if (char === '(') {
      parenthesesCount++;
      currentPart += char;
    } else if (char === ')') {
      parenthesesCount--;
      currentPart += char;
    } else if (parenthesesCount === 0 && char === operator && 
               (i === 0 || expression[i - 1] === ' ') && 
               (i === expression.length - 1 || expression[i + 1] === ' ')) {
      // Encontró el operador en el nivel superior
      parts.push(currentPart.trim());
      currentPart = '';
      i++; // Saltar el operador
      // Saltar cualquier espacio siguiente
      while (i < expression.length && expression[i] === ' ') {
        i++;
      }
      continue;
    } else {
      currentPart += char;
    }
    i++;
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return parts;
}

/**
 * Extrae siglas de cursos de una cadena
 */
function extractCourses(text: string): PrerequisiteCourse[] {
  const courses: PrerequisiteCourse[] = [];
  
  // Primero, identificar cursos corriculares antes de remover paréntesis
  const corriculars = text.match(/[A-Z]{2,4}\d{1,4}[A-Z]?\(c\)/g) || [];
  const corricularsSet = new Set(corriculars.map(c => c.replace('(c)', '')));
  
  // Remover solo paréntesis de agrupación, no los marcadores (c)
  const cleanText = text.replace(/[()]/g, ' ').trim();
  const words = cleanText.split(/\s+/);
  
  for (const word of words) {
    if (word && word !== 'y' && word !== 'o' && word !== 'c') {
      // Limpiar la palabra de cualquier fragmento restante
      const cleanWord = word.replace(/[^\w]/g, '');
      
      // Validación básica: la sigla del curso debe tener letras y números
      if (/^[A-Z]{2,4}\d{1,4}[A-Z]?$/.test(cleanWord)) {
        courses.push({
          sigle: cleanWord,
          isCorricular: corricularsSet.has(cleanWord)
        });
      }
    }
  }
  
  return courses;
}

/**
 * Verifica si los paréntesis están balanceados en una cadena
 */
function isBalancedParentheses(text: string): boolean {
  let count = 0;
  for (const char of text) {
    if (char === '(') count++;
    else if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

/**
 * Verifica si toda la cadena está envuelta en paréntesis
 */
function isCompletelyWrapped(text: string): boolean {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') count++;
    else if (text[i] === ')') count--;
    if (count === 0 && i < text.length - 1) return false;
  }
  return count === 0;
}
