interface CourseSummary {
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
    avg_weekly_hours: number;
    sort_index: number;
}

interface CourseStaticInfo {
    sigle: string;
    name: string;
    credits: number;
    program: string;
    school: string;
    area: string;
    category: string;
}