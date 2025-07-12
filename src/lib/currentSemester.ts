/**
 * Semestre actual
 * Se debe actualizar al inicio de cada semestre
 */
export const CURRENT_SEMESTER = "2025-1";

/**
 * Chequea si el semestre dado es el semestre actual
 * @param semester - Semestre en el formato "YYYY-N"
 * @returns verdadero si es el semestre actual, falso en caso contrario
 */
export function isCurrentSemester(semester: string): boolean {
  return semester === CURRENT_SEMESTER;
}

/**
 * Obtiene el texto de prefijo apropiado para la visualización del campus
 * @param lastSemester - El último semestre en el que se ofreció el curso
 * @returns "Actualmente dado en" si es el semestre actual, "Previamente dado en" si es un semestre pasado
 */
export function getCampusPrefix(lastSemester: string): string {
  return isCurrentSemester(lastSemester) ? "Actualmente dado en" : "Previamente dado en";
}