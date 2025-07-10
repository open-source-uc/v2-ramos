import type { CourseSections, ScheduleMatrix, ScheduleBlock } from '@/types';

// Mapeo de franjas horarias
export const TIME_SLOTS = [
  "08:20", "09:40", "11:00", "12:20", "14:50", 
  "16:10", "17:30", "18:50", "20:10"
];

// Días de la semana
export const DAYS = ["L", "M", "W", "J", "V"];

// Mapeo de bloques
export const BLOCK_MAP: Record<string, { dia: string, hora: string }> = {
  l1: { dia: "L", hora: "08:20" }, l2: { dia: "L", hora: "09:40" }, l3: { dia: "L", hora: "11:00" },
  l4: { dia: "L", hora: "12:20" }, l5: { dia: "L", hora: "14:50" }, l6: { dia: "L", hora: "16:10" },
  l7: { dia: "L", hora: "17:30" }, l8: { dia: "L", hora: "18:50" }, l9: { dia: "L", hora: "20:10" },
  m1: { dia: "M", hora: "08:20" }, m2: { dia: "M", hora: "09:40" }, m3: { dia: "M", hora: "11:00" },
  m4: { dia: "M", hora: "12:20" }, m5: { dia: "M", hora: "14:50" }, m6: { dia: "M", hora: "16:10" },
  m7: { dia: "M", hora: "17:30" }, m8: { dia: "M", hora: "18:50" }, m9: { dia: "M", hora: "20:10" },
  w1: { dia: "W", hora: "08:20" }, w2: { dia: "W", hora: "09:40" }, w3: { dia: "W", hora: "11:00" },
  w4: { dia: "W", hora: "12:20" }, w5: { dia: "W", hora: "14:50" }, w6: { dia: "W", hora: "16:10" },
  w7: { dia: "W", hora: "17:30" }, w8: { dia: "W", hora: "18:50" }, w9: { dia: "W", hora: "20:10" },
  j1: { dia: "J", hora: "08:20" }, j2: { dia: "J", hora: "09:40" }, j3: { dia: "J", hora: "11:00" },
  j4: { dia: "J", hora: "12:20" }, j5: { dia: "J", hora: "14:50" }, j6: { dia: "J", hora: "16:10" },
  j7: { dia: "J", hora: "17:30" }, j8: { dia: "J", hora: "18:50" }, j9: { dia: "J", hora: "20:10" },
  v1: { dia: "V", hora: "08:20" }, v2: { dia: "V", hora: "09:40" }, v3: { dia: "V", hora: "11:00" },
  v4: { dia: "V", hora: "12:20" }, v5: { dia: "V", hora: "14:50" }, v6: { dia: "V", hora: "16:10" },
  v7: { dia: "V", hora: "17:30" }, v8: { dia: "V", hora: "18:50" }, v9: { dia: "V", hora: "20:10" }
};

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
  const matrix: ScheduleMatrix = TIME_SLOTS.map(() => 
    DAYS.map(() => [])
  );

  // Procesar cada curso seleccionado
  for (const courseSelection of selectedCourses) {
    const [courseId, sectionId] = courseSelection.split('-');
    
    // Obtener los datos de la sección del curso
    const courseData = courseSections[courseId];
    if (!courseData) continue;
    
    const sectionData = courseData[sectionId];
    if (!sectionData || !sectionData.schedule) continue;

    // Procesar cada bloque de horario para esta sección del curso
    for (const [blockCode, [type, classroom]] of Object.entries(sectionData.schedule)) {
      const blockInfo = BLOCK_MAP[blockCode];
      if (!blockInfo) continue;

      // Encontrar los índices de franja horaria y día
      const timeIndex = TIME_SLOTS.indexOf(blockInfo.hora);
      const dayIndex = DAYS.indexOf(blockInfo.dia);
      
      if (timeIndex === -1 || dayIndex === -1) continue;

      // Agregar la clase a la matriz
      const scheduleBlock: ScheduleBlock = {
        type,
        classroom,
        courseId,
        section: sectionId
      };

      matrix[timeIndex][dayIndex].push(scheduleBlock);
    }
  }

  return matrix;
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
  const timeIndex = TIME_SLOTS.indexOf(timeSlot);
  const dayIndex = DAYS.indexOf(day);
  
  if (timeIndex === -1 || dayIndex === -1) {
    return [];
  }
  
  return matrix[timeIndex][dayIndex];
}

/**
 * Verifica si hay conflictos de horario en la matriz
 * @param matrix - La matriz de horarios
 * @returns Array de conflictos, donde cada conflicto contiene las clases que se superponen
 */
export function detectScheduleConflicts(matrix: ScheduleMatrix): ScheduleBlock[][] {
  const conflicts: ScheduleBlock[][] = [];
  
  for (let timeIndex = 0; timeIndex < matrix.length; timeIndex++) {
    for (let dayIndex = 0; dayIndex < matrix[timeIndex].length; dayIndex++) {
      const classes = matrix[timeIndex][dayIndex];
      if (classes.length > 1) {
        conflicts.push([...classes]);
      }
    }
  }
  
  return conflicts;
}

/**
 * Obtiene una representación legible del horario
 * @param matrix - La matriz de horarios
 * @returns Objeto con información del horario organizada por día y hora
 */
export function getScheduleDisplay(matrix: ScheduleMatrix): Record<string, Record<string, ScheduleBlock[]>> {
  const display: Record<string, Record<string, ScheduleBlock[]>> = {};
  
  DAYS.forEach((day, dayIndex) => {
    display[day] = {};
    TIME_SLOTS.forEach((time, timeIndex) => {
      const classes = matrix[timeIndex][dayIndex];
      if (classes.length > 0) {
        display[day][time] = classes;
      }
    });
  });
  
  return display;
}

/**
 * Convierte los datos JSON de cursos al formato esperado por la utilidad de matriz de horarios
 * @param coursesJSON - Los datos de cursos en crudo del JSON
 * @returns Datos de secciones de cursos formateados
 */
export function convertCourseDataToSections(coursesJSON: any): CourseSections {
  const sections: CourseSections = {};
  
  for (const [courseId, courseData] of Object.entries(coursesJSON)) {
    const course = courseData as any;
    sections[courseId] = {};
    
    for (const [sectionId, sectionData] of Object.entries(course.sections)) {
      const section = sectionData as any;
      sections[courseId][sectionId] = {
        schedule: section.schedule || {}
      };
    }
  }
  
  return sections;
}
