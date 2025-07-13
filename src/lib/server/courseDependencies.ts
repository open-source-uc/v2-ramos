import { parsePrerequisites } from "@/lib/courseReq";
import type { PrerequisiteGroup } from "@/types";

/**
 * Recursively finds all course dependencies for a given course
 * @param courseSigle The course code (e.g., "MAT1124")
 * @param coursesMap Map of course sigle to course data
 * @param visited Set of already visited courses to prevent infinite loops
 * @param startingCourse The original course to exclude from dependencies
 * @returns Array of all prerequisite course codes that this course depends on
 */
export async function getAllCourseDependencies(
  courseSigle: string,
  coursesMap?: Map<string, any>,
  visited?: Set<string>,
  startingCourse?: string
): Promise<string[]> {
  // Track the original starting course to exclude it from final results
  const originalCourse = startingCourse || courseSigle;
  
  // Initialize visited set if not provided
  const visitedSet = visited || new Set<string>();
  
  // Prevent infinite loops
  if (visitedSet.has(courseSigle)) {
    return [];
  }
  visitedSet.add(courseSigle);

  // Get courses data if not provided
  let courseData: Map<string, any>;
  if (coursesMap) {
    courseData = coursesMap;
  } else {
    const { getCollection } = await import("astro:content");
    const courses = await getCollection("coursesStatic");
    courseData = new Map(courses.map(course => [course.data.sigle, course.data]));
  }

  // Find the course
  const course = courseData.get(courseSigle);
  if (!course) {
    return [];
  }

  // Parse prerequisites
  const prerequisitesString = course.req;
  const parsed = parsePrerequisites(prerequisitesString);
  
  if (!parsed.hasPrerequisites || !parsed.structure) {
    return [];
  }

  // Extract all prerequisite course codes
  const directPrerequisites = extractAllCoursesFromStructure(parsed.structure);
  
  // Recursively get dependencies for each prerequisite
  const allDependencies = new Set<string>();
  
  for (const prereqSigle of directPrerequisites) {
    // Add the direct prerequisite
    allDependencies.add(prereqSigle);
    
    // Recursively get its dependencies
    const subDependencies = await getAllCourseDependencies(
      prereqSigle,
      courseData,
      new Set(visitedSet), // Pass a copy to avoid interference
      originalCourse
    );
    
    // Add all sub-dependencies
    subDependencies.forEach(dep => allDependencies.add(dep));
  }

  // Remove the original course from dependencies (a course shouldn't depend on itself)
  allDependencies.delete(originalCourse);

  return Array.from(allDependencies).sort();
}

/**
 * Extracts all course codes from a prerequisite structure
 * @param group The prerequisite group structure
 * @returns Array of course codes
 */
function extractAllCoursesFromStructure(group: PrerequisiteGroup): string[] {
  const courses: string[] = [];
  
  // Add direct courses
  if (group.courses) {
    courses.push(...group.courses.map(course => course.sigle));
  }
  
  // Recursively add courses from subgroups
  if (group.groups) {
    for (const subGroup of group.groups) {
      courses.push(...extractAllCoursesFromStructure(subGroup));
    }
  }
  
  return courses;
}