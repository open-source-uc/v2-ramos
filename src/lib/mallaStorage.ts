/**
 * Simplified utility functions for managing user malla (curriculum plan) storage
 * Each semester contains its own array of courses
 */

import { CURRENT_SEMESTER, parseSemester } from './currentSemester';

const MALLA_STORAGE_KEY = "mallaData";

// Course type for the malla
export interface MallaCourse {
  id: string;
  name: string;
  sigle: string;
  credits: number;
  area?: string;
  school?: string;
  description?: string;
}

// Semester type - contains courses array
export interface MallaSemester {
  id: string;
  name: string;
  year: number;
  semester: number;
  courses: MallaCourse[];
}

// Simplified malla data type for localStorage
export interface MallaData {
  semesters: MallaSemester[];
}

/**
 * Get current semester info and generate initial semester
 */
function generateInitialSemester(): MallaSemester {
  const currentSemesterInfo = parseSemester(CURRENT_SEMESTER);
  const currentSemesterName = `${currentSemesterInfo.year} - ${currentSemesterInfo.semesterNumber === 1 ? '1er' : '2do'} Sem`;
  
  return {
    id: CURRENT_SEMESTER,
    name: currentSemesterName,
    year: currentSemesterInfo.year,
    semester: currentSemesterInfo.semesterNumber,
    courses: []
  };
}

/**
 * Get saved malla data from localStorage
 */
export function getSavedMallaData(): MallaData {
  if (typeof window === "undefined") {
    return {
      semesters: [generateInitialSemester()]
    };
  }
  
  try {
    const saved = localStorage.getItem(MALLA_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as MallaData;
      // Ensure we always have at least the current semester
      if (parsed.semesters.length === 0) {
        parsed.semesters = [generateInitialSemester()];
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error loading saved malla data:", error);
  }
  
  return {
    semesters: [generateInitialSemester()]
  };
}

/**
 * Save malla data to localStorage
 */
export function saveMallaData(data: MallaData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(MALLA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving malla data:", error);
  }
}

/**
 * Add a course to a specific semester
 */
export function addCourseToSemester(course: MallaCourse, semesterId: string): boolean {
  const currentData = getSavedMallaData();
  const semester = currentData.semesters.find(s => s.id === semesterId);
  
  if (!semester) return false;
  
  // Check if course already exists in any semester
  const existingSemester = currentData.semesters.find(s => 
    s.courses.some(c => c.sigle === course.sigle)
  );
  
  if (existingSemester) {
    // Remove from existing semester
    existingSemester.courses = existingSemester.courses.filter(c => c.sigle !== course.sigle);
  }
  
  // Add to target semester
  semester.courses.push(course);
  
  saveMallaData(currentData);
  
  // Sync to schedule storage if this is the current semester
  if (semesterId === CURRENT_SEMESTER) {
    syncCurrentSemesterToSchedule();
  }
  
  return true;
}

/**
 * Remove a course from the malla
 */
export function removeCourseFromMalla(courseId: string): boolean {
  const currentData = getSavedMallaData();
  let removed = false;
  let wasFromCurrentSemester = false;
  
  currentData.semesters.forEach(semester => {
    const initialLength = semester.courses.length;
    semester.courses = semester.courses.filter(course => course.id !== courseId);
    if (semester.courses.length !== initialLength) {
      removed = true;
      if (semester.id === CURRENT_SEMESTER) {
        wasFromCurrentSemester = true;
      }
    }
  });
  
  if (removed) {
    saveMallaData(currentData);
    
    // Sync to schedule storage if course was removed from current semester
    if (wasFromCurrentSemester) {
      syncCurrentSemesterToSchedule();
    }
    
    return true;
  }
  
  return false;
}

/**
 * Move a course between semesters (for drag and drop)
 */
export function moveCourseBetweenSemesters(courseId: string, targetSemesterId: string): boolean {
  const currentData = getSavedMallaData();
  
  // Find the course and its current semester
  let courseToMove: MallaCourse | null = null;
  let sourceSemester: MallaSemester | null = null;
  
  for (const semester of currentData.semesters) {
    const courseIndex = semester.courses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      courseToMove = semester.courses[courseIndex];
      sourceSemester = semester;
      break;
    }
  }
  
  if (!courseToMove || !sourceSemester) return false;
  
  // Find target semester
  const targetSemester = currentData.semesters.find(s => s.id === targetSemesterId);
  if (!targetSemester) return false;
  
  // Remove from source
  sourceSemester.courses = sourceSemester.courses.filter(c => c.id !== courseId);
  
  // Add to target
  targetSemester.courses.push(courseToMove);
  
  saveMallaData(currentData);
  
  // Sync to schedule storage if either source or target is the current semester
  if (sourceSemester.id === CURRENT_SEMESTER || targetSemester.id === CURRENT_SEMESTER) {
    syncCurrentSemesterToSchedule();
  }
  
  return true;
}

/**
 * Add a semester to the malla
 */
export function addSemester(semester: MallaSemester): boolean {
  const currentData = getSavedMallaData();
  
  // Check if semester already exists
  if (currentData.semesters.find(s => s.id === semester.id)) {
    return false;
  }
  
  currentData.semesters.push(semester);
  saveMallaData(currentData);
  return true;
}

/**
 * Remove a semester from the malla
 */
export function removeSemester(semesterId: string): boolean {
  const currentData = getSavedMallaData();
  
  // Don't allow removing the last semester
  if (currentData.semesters.length <= 1) {
    return false;
  }
  
  // Don't allow removing the current semester
  if (semesterId === CURRENT_SEMESTER) {
    return false;
  }
  
  const semesterToRemove = currentData.semesters.find(s => s.id === semesterId);
  if (!semesterToRemove) return false;
  
  // Move courses to the first remaining semester
  const remainingSemesters = currentData.semesters.filter(s => s.id !== semesterId);
  const targetSemester = remainingSemesters[0];
  
  if (targetSemester && semesterToRemove.courses.length > 0) {
    targetSemester.courses.push(...semesterToRemove.courses);
  }
  
  currentData.semesters = remainingSemesters;
  saveMallaData(currentData);
  
  // Sync to schedule storage if we removed the current semester
  if (semesterId === CURRENT_SEMESTER) {
    syncCurrentSemesterToSchedule();
  }
  
  return true;
}

/**
 * Get total credits for a specific semester
 */
export function getCreditsForSemester(semesterId: string): number {
  const currentData = getSavedMallaData();
  const semester = currentData.semesters.find(s => s.id === semesterId);
  return semester ? semester.courses.reduce((total, course) => total + course.credits, 0) : 0;
}

/**
 * Clear all malla data
 */
export function clearMallaData(): void {
  const initialData: MallaData = {
    semesters: [generateInitialSemester()]
  };
  saveMallaData(initialData);
  syncCurrentSemesterToSchedule();
}

/**
 * Check if a course exists in the malla
 */
export function isCourseInMalla(sigle: string): boolean {
  const currentData = getSavedMallaData();
  return currentData.semesters.some(semester => 
    semester.courses.some(course => course.sigle === sigle)
  );
}

/**
 * Get total number of courses in the malla
 */
export function getMallaCourseCount(): number {
  const currentData = getSavedMallaData();
  return currentData.semesters.reduce((total, semester) => total + semester.courses.length, 0);
}

/**
 * Get total credits across all semesters
 */
export function getTotalMallaCredits(): number {
  const currentData = getSavedMallaData();
  return currentData.semesters.reduce((total, semester) => 
    total + semester.courses.reduce((semTotal, course) => semTotal + course.credits, 0), 0
  );
}

/**
 * Sync current semester courses to schedule storage
 * Call this after modifying courses in the current semester
 */
export function syncCurrentSemesterToSchedule(): void {
  if (typeof window === "undefined") return;
  
  const currentData = getSavedMallaData();
  const currentSemester = currentData.semesters.find(s => s.id === CURRENT_SEMESTER);
  
  if (!currentSemester) return;
  
  // Convert malla courses back to schedule format
  const scheduleIds = currentSemester.courses
    .map(course => `${course.sigle}-1`) // Default to section 1
    .filter(id => id.includes('-')); // Ensure valid format
  
  // Update schedule storage
  try {
    localStorage.setItem("scheduleCourses", JSON.stringify(scheduleIds));
  } catch (error) {
    console.error("Error syncing to schedule storage:", error);
  }
}