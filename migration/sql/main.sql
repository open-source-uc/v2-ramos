DROP TABLE IF EXISTS course_reviews;
DROP TABLE IF EXISTS course_summary;


CREATE TABLE course_reviews ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_sigle TEXT NOT NULL,

    like_dislike INTEGER CHECK (like_dislike IN (0, 1, 2)), -- 0=dislike, 1=like, 2=superlike
    workload_vote INTEGER CHECK (workload_vote IN (0, 1, 2)), -- 0=low, 1=medium, 2=high
    attendance_type INTEGER CHECK (attendance_type IN (0, 1, 2)), -- 0=none, 1=optional, 2=mandatory

    weekly_hours INTEGER CHECK (weekly_hours >= 0), -- horas semanales estimadas

    year_taken INTEGER,
    semester_taken INTEGER CHECK (semester_taken IN (1, 2)),

    comment TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (course_sigle) REFERENCES course_summary(sigle)
);

CREATE TRIGGER trg_course_reviews_set_updated_at
BEFORE UPDATE ON course_reviews
FOR EACH ROW
BEGIN
  UPDATE course_reviews
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.id;
END;


CREATE TABLE course_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sigle TEXT UNIQUE KEY,
    school_id INTEGER,
    area_id INTEGER,
    category_id INTEGER,

    likes INTEGER DEFAULT 0,
    superlikes INTEGER DEFAULT 0,  -- Agregado para manejar superlikes
    dislikes INTEGER DEFAULT 0,

    votes_low_workload INTEGER DEFAULT 0,
    votes_medium_workload INTEGER DEFAULT 0,
    votes_high_workload INTEGER DEFAULT 0,

    avg_weekly_hours REAL DEFAULT 0.0, -- promedio de horas semanales desde las reviews

    sort_index INTEGER DEFAULT 0
);

CREATE TRIGGER trg_course_reviews_after_insert
AFTER INSERT ON course_reviews
BEGIN
  UPDATE course_summary
  SET
    likes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND like_dislike = 1
    ),
    superlikes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND like_dislike = 2
    ),
    dislikes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND like_dislike = 0
    ),
    votes_low_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND workload_vote = 0
    ),
    votes_medium_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND workload_vote = 1
    ),
    votes_high_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND workload_vote = 2
    ),
    avg_weekly_hours = (
      SELECT AVG(weekly_hours * 1.0) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND weekly_hours IS NOT NULL
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
      WHERE course_sigle = NEW.course_sigle
    )
  WHERE sigle = NEW.course_sigle;
END;

CREATE TRIGGER trg_course_reviews_after_update
AFTER UPDATE ON course_reviews
BEGIN
  UPDATE course_summary
  SET
    likes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND like_dislike = 1
    ),
    superlikes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND like_dislike = 2
    ),
    dislikes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND like_dislike = 0
    ),
    votes_low_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND workload_vote = 0
    ),
    votes_medium_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND workload_vote = 1
    ),
    votes_high_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND workload_vote = 2
    ),
    avg_weekly_hours = (
      SELECT AVG(weekly_hours * 1.0) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND weekly_hours IS NOT NULL
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
      WHERE course_sigle = NEW.course_sigle
    )
  WHERE sigle = NEW.course_sigle;
END;

CREATE TRIGGER trg_course_reviews_after_delete
AFTER DELETE ON course_reviews
BEGIN
  UPDATE course_summary
  SET
    likes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND like_dislike = 1
    ),
    superlikes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND like_dislike = 2
    ),
    dislikes = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND like_dislike = 0
    ),
    votes_low_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND workload_vote = 0
    ),
    votes_medium_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND workload_vote = 1
    ),
    votes_high_workload = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND workload_vote = 2
    ),
    avg_weekly_hours = (
      SELECT AVG(weekly_hours * 1.0) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND weekly_hours IS NOT NULL
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
      WHERE course_sigle = OLD.course_sigle
    )
  WHERE sigle = OLD.course_sigle;
END;

CREATE INDEX idx_course_summary_school_id ON course_summary(school_id);
CREATE INDEX idx_course_summary_area_id ON course_summary(area_id);
CREATE INDEX idx_course_summary_category_id ON course_summary(category_id);
CREATE INDEX idx_course_summary_likes ON course_summary(likes);
CREATE INDEX idx_course_summary_superlikes ON course_summary(superlikes);
CREATE INDEX idx_course_summary_dislikes ON course_summary(dislikes);
CREATE INDEX idx_course_summary_avg_weekly_hours ON course_summary(avg_weekly_hours);
CREATE INDEX idx_course_summary_sort_index ON course_summary(sort_index);

-- Índices compuestos para consultas más complejas
CREATE INDEX idx_course_summary_school_sort ON course_summary(school_id, sort_index DESC);
CREATE INDEX idx_course_summary_area_sort ON course_summary(area_id, sort_index DESC);
CREATE INDEX idx_course_summary_category_sort ON course_summary(category_id, sort_index DESC);
CREATE INDEX idx_course_summary_superlikes_likes ON course_summary(superlikes DESC, likes DESC);

-- Índices para la tabla course_reviews
CREATE INDEX idx_course_reviews_course_sigle ON course_reviews(course_sigle);
CREATE INDEX idx_course_reviews_user_id ON course_reviews(user_id);
CREATE INDEX idx_course_reviews_sigle_updated ON course_reviews(course_sigle, updated_at DESC);
CREATE INDEX idx_course_reviews_like_dislike ON course_reviews(like_dislike);
CREATE INDEX idx_course_reviews_workload_vote ON course_reviews(workload_vote);
CREATE INDEX idx_course_reviews_year_semester ON course_reviews(year_taken, semester_taken);