export const getCourseBySigle = async (locals: App.Locals, sigle: string) => {
  const result = await locals.runtime.env.DB.prepare(`
    SELECT 
      id,
      sigle,
      school_id,
      area_id,
      category_id,
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