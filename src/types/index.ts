interface CourseSummary {
    id: number;
    sigle: string;
    school_id: number;
    area_id: number;
    category_id: number;
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
}

interface CourseReview {
    id: number;
    user_id: number;
    course_sigle: string;
    like_dislike: number; // 0: dislike, 1: like, 2: superlike
    workload_vote: number; // 0: low, 1: medium, 2: high
    attendance_type: number; // 0: mandatory, 1: optional, 2: no attendance
    weekly_hours: number;
    year_taken: number;
    semester_taken: number; // 1 or 2
    comment: string;
    created_at: string;
    updated_at: string;
}

interface CourseStaticInfo {
    sigle: string;
    name: string;
    credits: number;
    program: string;
}