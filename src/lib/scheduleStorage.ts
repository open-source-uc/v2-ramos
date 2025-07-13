/**
 * Utility functions for managing user schedule storage
 * Now syncs with malla storage for the current semester
 */

import { 
  getSavedMallaData, 
  addCourseToSemester, 
  removeCourseFromMalla,
  type MallaCourse 
} from './mallaStorage';
import { CURRENT_SEMESTER } from './currentSemester';

const SCHEDULE_STORAGE_KEY = "scheduleCourses";

/**
 * Get saved courses from localStorage
 */
export function getSavedCourses(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading saved courses:", error);
    return [];
  }
}

/**
 * Save courses to localStorage
 */
export function saveCourses(courses: string[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error("Error saving courses:", error);
  }
}

/**
 * Convert a schedule course ID to a MallaCourse object
 * Attempts to fetch course details from session cache or uses defaults
 */
function scheduleIdToMallaCourse(courseId: string): MallaCourse {
  const [sigle, section] = courseId.split('-');
  
  // Try to get course details from the courses cache
  let courseDetails = null;
  try {
    const cache = sessionStorage.getItem("coursesSectionsCache");
    if (cache) {
      const courses = JSON.parse(cache);
      courseDetails = courses.find((course: any) => course.sigle === sigle);
    }
  } catch (error) {
    console.warn('Could not fetch course details from cache:', error);
  }
  
  return {
    id: `course-${courseId}-${Date.now()}`,
    name: courseDetails?.name || `Curso ${sigle}`,
    sigle: sigle,
    credits: courseDetails?.credits || 10, // Default 10 credits if not found
    area: courseDetails?.area,
    school: courseDetails?.school,
    description: courseDetails?.name || `Curso ${sigle} - Sección ${section}`
  };
}

/**
 * Sync malla courses back to schedule storage for the current semester
 * This ensures both storages stay in sync when courses are modified from the malla side
 */
export function syncMallaToSchedule(): void {
  const mallaData = getSavedMallaData();
  const currentSemester = mallaData.semesters.find(s => s.id === CURRENT_SEMESTER);
  
  if (!currentSemester) return;
  
  // Get course IDs that should be in the schedule based on malla
  const mallaScheduleCourses = currentSemester.courses
    .map(course => `${course.sigle}-1`) // Default to section 1
    .filter(courseId => courseId.includes('-')); // Ensure valid format
  
  // Update schedule storage to match malla
  saveCourses(mallaScheduleCourses);
}

/**
 * Add a course to the saved schedule and sync with malla
 */
export function addCourseToSchedule(courseId: string): boolean {
  const currentCourses = getSavedCourses();
  
  if (currentCourses.includes(courseId)) {
    return false; // Already exists
  }
  
  const updatedCourses = [...currentCourses, courseId];
  saveCourses(updatedCourses);
  
  // Sync with malla - add to current semester
  const mallaCourse = scheduleIdToMallaCourse(courseId);
  addCourseToSemester(mallaCourse, CURRENT_SEMESTER);
  
  return true;
}

/**
 * Remove a course from the saved schedule and sync with malla
 */
export function removeCourseFromSchedule(courseId: string): boolean {
  const currentCourses = getSavedCourses();
  const updatedCourses = currentCourses.filter(id => id !== courseId);
  
  if (updatedCourses.length === currentCourses.length) {
    return false; // Course wasn't in the list
  }
  
  saveCourses(updatedCourses);
  
  // Sync with malla - remove course from current semester
  // Find the course in malla by sigle and remove it
  const [sigle] = courseId.split('-');
  const mallaData = getSavedMallaData();
  const currentSemester = mallaData.semesters.find(s => s.id === CURRENT_SEMESTER);
  
  if (currentSemester) {
    const courseToRemove = currentSemester.courses.find(c => c.sigle === sigle);
    if (courseToRemove) {
      removeCourseFromMalla(courseToRemove.id);
    }
  }
  
  return true;
}

/**
 * Check if a course is already in the schedule
 */
export function isCourseInSchedule(courseId: string): boolean {
  return getSavedCourses().includes(courseId);
}

/**
 * Clear all courses from the schedule and sync with malla
 */
export function clearSchedule(): void {
  const currentCourses = getSavedCourses();
  saveCourses([]);
  
  // Sync with malla - remove all courses from current semester that match schedule courses
  const mallaData = getSavedMallaData();
  const currentSemester = mallaData.semesters.find(s => s.id === CURRENT_SEMESTER);
  
  if (currentSemester) {
    const scheduleSigles = currentCourses.map(courseId => courseId.split('-')[0]);
    const coursesToRemove = currentSemester.courses.filter(c => scheduleSigles.includes(c.sigle));
    
    coursesToRemove.forEach(course => {
      removeCourseFromMalla(course.id);
    });
  }
}

/**
 * Get the total number of courses in the schedule
 */
export function getScheduleCount(): number {
  return getSavedCourses().length;
}
