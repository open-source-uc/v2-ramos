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
      votes_no_attendance,
      avg_weekly_hours,
      sort_index
    FROM course_summary WHERE sigle = ?
  `).bind(sigle).all<CourseSummary>()

  console.log('getCourseBySigle', result.meta);
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
      comment,
      created_at,
      updated_at
    FROM course_reviews 
    WHERE course_sigle = ?
    ORDER BY updated_at DESC
    LIMIT ?
  `).bind(sigle, limit).all<CourseReview>()

  console.log('getCourseReviews', result.meta);
  return result.results;
};