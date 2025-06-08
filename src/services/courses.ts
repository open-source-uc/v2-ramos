export const getCourses = async (locals: App.Locals) => {
  const result = await locals.runtime.env.DB.prepare(`
    SELECT 
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
      avg_weekly_hours,
      sort_index
    FROM course_summary ORDER BY sort_index DESC LIMIT 36
  `).all<CourseSummary>()

  console.log('getCourses', result);
  return result.results;
};
