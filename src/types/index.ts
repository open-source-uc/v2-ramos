export interface CourseSummary {
    id: number;
    sigle: string;
    superlikes: number;
    likes: number;
    dislikes: number;
    votes_low_workload: number;
    votes_medium_workload: number;
    votes_high_workload: number;
    votes_mandatory_attendance: number;
    votes_optional_attendance: number;
    avg_weekly_hours: number;
    sort_index: number;
    name?: string; // Added for convenience
    credits?: number; // Added for convenience
    school?: string; // Added for convenience
    area?: string; // Added for convenience
    category?: string; // Added for convenience.
    req?: string;
    conn?: string;
    restr?: string;
    equiv?: string;
    format?: Array<string>;
    compus?: Array<string>;
    is_removable?: Array<boolean>;
    is_special?: Array<boolean>;
    is_english?: Array<boolean>;
    description?: string;
    last_semester?: string; // Format: YYYY-S
}

export interface CourseReview {
    id: number;
    user_id: number;
    course_sigle: string;
    like_dislike: number; // 0: dislike, 1: like, 2: superlike
    workload_vote: number; // 0: low, 1: medium, 2: high
    attendance_type: number; // 0: mandatory, 1: optional, 2: no attendance
    weekly_hours: number;
    year_taken: number;
    semester_taken: number; // 1 or 2
    comment_path: string;
    status: number; // 0: pending, 1: approved, 2: reported, 3: hidden
    created_at: string;
    updated_at: string;
}

export interface CourseStaticInfo {
    sigle: string;
    name: string;
    credits: number;
    schedules?: Schedule[];
    req: string;
    conn: string;
    restr: string;
    equiv: string;
    format: Array<string>;
    compus: Array<string>;
    is_removable: Array<boolean>;
    is_special: Array<boolean>;
    is_english: Array<boolean>;
    description: string;
    school: string;
    area: string;
    category: string;
    last_semester: string; // Format: YYYY-S
}

export interface RecommendationData {
    title: string;
    code: string;
    initiative: string;
    period: string;
    faculty: string;
    qualification: number;
    tags: string[];
    resume: string;
}

export interface Schedule {
    day: string;
    start: string;
    end: string;
    classroom?: string;
    section?: string;
    teachers?: string[];
}

export interface Recommendation {
    id: string;
    slug: string;
    data: RecommendationData;
}

// Prerequisites types
export interface PrerequisiteCourse {
    sigle: string;
    name?: string;
    isCoreq: boolean; // true if the course has (c) suffix
}

export interface PrerequisiteGroup {
    type: 'AND' | 'OR';
    courses: PrerequisiteCourse[];
    groups?: PrerequisiteGroup[];
}

export interface ParsedPrerequisites {
    hasPrerequisites: boolean;
    structure?: PrerequisiteGroup;
}

// Tipos para matriz de horarios
export interface ScheduleBlock {
    type: string;        // Tipo de clase (CLAS, LAB, AYUD)
    classroom: string;   // Ubicación del aula
    courseId: string;    // Identificador del curso
    section: string;     // Identificador de la sección
}

export interface CourseSection {
    schedule: Record<string, [string, string]>; // código de bloque -> [tipo, aula]
}

export interface CourseSections {
    [courseId: string]: {
        [sectionId: string]: CourseSection;
    };
}

export type ScheduleMatrix = ScheduleBlock[][][]; // [franjaHoraria][diaSemana][clases]