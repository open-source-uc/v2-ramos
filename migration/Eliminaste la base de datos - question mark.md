Hola persona del futuro en caso que hayas reiniciado la tabla de summary por un extraña razon como a mi me paso
no te procupes, solo usa, solo seran 4M de writes D: (solo tendremos que pagar 5lukas), para la proxima primero prueba en local :D

```bash
UPDATE course_summary
SET
  likes = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND like_dislike = 1
  ),
  superlikes = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND like_dislike = 2
  ),
  dislikes = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND like_dislike = 0
  ),
  votes_low_workload = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND workload_vote = 0
  ),
  votes_medium_workload = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND workload_vote = 1
  ),
  votes_high_workload = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND workload_vote = 2
  ),
  votes_mandatory_attendance = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND attendance_type = 0
  ),
  votes_optional_attendance = (
    SELECT COUNT(*) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND attendance_type = 1
  ),
  avg_weekly_hours = (
    SELECT AVG(weekly_hours * 1.0) FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle AND weekly_hours IS NOT NULL
  ),
  sort_index = (
    SELECT
      CASE
        WHEN COUNT(CASE WHEN like_dislike IN (0,1,2) THEN 1 END) = 0 THEN 0
        ELSE (SUM(CASE like_dislike WHEN 1 THEN 1 WHEN 2 THEN 2 ELSE 0 END) * 100.0 /
              COUNT(CASE WHEN like_dislike IN (0,1,2) THEN 1 END)) *
              COUNT(CASE WHEN like_dislike IN (0,1,2) THEN 1 END) /
              (COUNT(CASE WHEN like_dislike IN (0,1,2) THEN 1 END) + 10)
      END
      + 3 * SUM(CASE workload_vote WHEN 0 THEN 1 ELSE 0 END)
      + 2 * SUM(CASE workload_vote WHEN 1 THEN 1 ELSE 0 END)
      + 1 * SUM(CASE workload_vote WHEN 2 THEN 1 ELSE 0 END)
    FROM course_reviews
    WHERE course_reviews.course_sigle = course_summary.sigle
  );
```
