import type { CourseReview, CourseSummary, PrerequisiteGroup } from "@/types";
import { parsePrerequisites } from "@/lib/courseReq";

export const getCourseBySigle = async (locals: App.Locals, sigle: string) => {
  const result = await locals.runtime.env.DB.prepare(`
    SELECT 
      id,
      sigle,
      superlikes,
      likes,
      dislikes,
      votes_low_workload,
      votes_medium_workload,
      votes_high_workload,
      votes_mandatory_attendance,
      votes_optional_attendance,
      avg_weekly_hours,
      sort_index
    FROM course_summary WHERE sigle = ?
  `).bind(sigle).all<CourseSummary>()

  return result.results[0] ?? null;
};

export const getCourseReviews = async (locals: App.Locals, sigle: string, limit: number = 20) => {
  const result = await locals.runtime.env.DB.prepare(`
    SELECT 
      id,
      user_id,
      course_sigle,
      like_dislike,
      workload_vote,
      attendance_type,
      weekly_hours,
      year_taken,
      semester_taken,
      comment_path,
      created_at,
      updated_at
    FROM course_reviews 
    WHERE course_sigle = ? AND status != 3
    ORDER BY updated_at DESC
    LIMIT ?
  `).bind(sigle, limit).all<CourseReview>()

  return result.results;
};

export const getCourseReviewByUserIdAndSigle = async (locals: App.Locals, sigle: string, userId: string) => {
  const result = await locals.runtime.env.DB.prepare(`
    SELECT 
      id,
      user_id,
      course_sigle,
      like_dislike,
      workload_vote,
      attendance_type,
      weekly_hours,
      year_taken,
      semester_taken,
      comment_path,
      created_at,
      updated_at
    FROM course_reviews 
    WHERE course_sigle = ? AND user_id = ?
  `).bind(sigle, userId).first<CourseReview>()

  return result ?? {
    id: null,
    user_id: userId,
    course_sigle: sigle,
    like_dislike: null,
    workload_vote: null,
    attendance_type: null,
    weekly_hours: null,
    year_taken: null,
    semester_taken: null,
    comment_path: null,
    created_at: null,
    updated_at: null
  };
}

/**
 * Obtiene los nombres de los cursos a partir de sus siglas
 * @param locals App locals que contiene la conexión a la base de datos
 * @param sigles Array de siglas de cursos
 * @returns Mapa de siglas a nombres de cursos
 */
export const getCourseNames = async (locals: App.Locals, sigles: string[]): Promise<Map<string, string>> => {
  if (sigles.length === 0) {
    return new Map();
  }

  const placeholders = sigles.map(() => '?').join(',');
  const result = await locals.runtime.env.DB.prepare(`
    SELECT sigle, name 
    FROM course_static_info 
    WHERE sigle IN (${placeholders})
  `).bind(...sigles).all<{sigle: string, name: string}>();

  const courseNames = new Map<string, string>();
  result.results.forEach(row => {
    courseNames.set(row.sigle, row.name);
  });

  return courseNames;
};

/**
 * Obtiene información detallada de los cursos para prerrequisitos
 * @param locals App locals que contiene la conexión a la base de datos
 * @param req String de prerrequisitos
 * @returns Prerrequisitos parseados con nombres de cursos
 */
export const getPrerequisitesWithNames = async (locals: App.Locals, req: string) => {
  const parsed = parsePrerequisites(req);
  
  if (!parsed.hasPrerequisites || !parsed.structure) {
    return parsed;
  }

  const sigles = extractSiglesFromStructure(parsed.structure);
  const courseNames = await getCourseNames(locals, sigles);
  const structureWithNames = addNamesToStructure(parsed.structure, courseNames);
  
  return {
    ...parsed,
    structure: structureWithNames
  };
};

/**
 * Obtiene las siglas de los cursos a partir de una estructura de prerrequisitos
 * @param group Grupo de prerrequisitos
 * @returns Array de siglas de cursos
 */
function extractSiglesFromStructure(group: PrerequisiteGroup): string[] {
  const sigles: string[] = [];
  
  if (group.courses) {
    sigles.push(...group.courses.map((course) => course.sigle));
  }
  
  if (group.groups) {
    for (const subGroup of group.groups) {
      sigles.push(...extractSiglesFromStructure(subGroup));
    }
  }
  
  return sigles;
}

/**
 * Recursivamente agrega los nombres de los cursos a una estructura de prerrequisitos
 */
function addNamesToStructure(group: PrerequisiteGroup, courseNames: Map<string, string>): PrerequisiteGroup {
  const updatedGroup: PrerequisiteGroup = {
    ...group,
    courses: group.courses?.map((course) => ({
      ...course,
      name: courseNames.get(course.sigle)
    })),
    groups: group.groups?.map((subGroup) => addNamesToStructure(subGroup, courseNames))
  };
  
  return updatedGroup;
}