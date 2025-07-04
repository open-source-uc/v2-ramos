DROP TABLE IF EXISTS course_reviews;
DROP TABLE IF EXISTS course_summary;

-- Primero se crea course_summary
CREATE TABLE course_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sigle TEXT UNIQUE,  -- "UNIQUE KEY" no es válido en SQLite; solo usa UNIQUE

    likes INTEGER DEFAULT 0,
    superlikes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,

    votes_low_workload INTEGER DEFAULT 0,
    votes_medium_workload INTEGER DEFAULT 0,
    votes_high_workload INTEGER DEFAULT 0,

    votes_mandatory_attendance INTEGER DEFAULT 0,
    votes_optional_attendance INTEGER DEFAULT 0,

    avg_weekly_hours REAL DEFAULT 0.0,
    sort_index INTEGER DEFAULT 0
);

-- Luego se crea course_reviews
CREATE TABLE course_reviews ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_sigle TEXT NOT NULL,

    like_dislike INTEGER CHECK (like_dislike IN (0, 1, 2)),
    workload_vote INTEGER CHECK (workload_vote IN (0, 1, 2)),
    attendance_type INTEGER CHECK (attendance_type IN (0, 1)),  -- Solo 0 (mandatory) y 1 (optional)

    weekly_hours INTEGER CHECK (weekly_hours >= 0),

    year_taken INTEGER,
    semester_taken INTEGER CHECK (semester_taken IN (1, 2, 3)), -- 1: Spring, 2: Summer, 3: TAV

    comment_path TEXT, --url al documento de la review que es en un bucket de R2

    status INTEGER DEFAULT 0, -- 0: pending, 1: approved, 2: reported, 3: hidden

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (course_sigle) REFERENCES course_summary(sigle)
);


-- Índices simples para course_summary (orden descendente para métricas numéricas)
CREATE INDEX idx_course_summary_likes ON course_summary(likes DESC);
CREATE INDEX idx_course_summary_superlikes ON course_summary(superlikes DESC);
CREATE INDEX idx_course_summary_dislikes ON course_summary(dislikes DESC);
CREATE INDEX idx_course_summary_avg_weekly_hours ON course_summary(avg_weekly_hours DESC);
CREATE INDEX idx_course_summary_sort_index ON course_summary(sort_index DESC);

-- Índices para los votos de asistencia (solo mandatory y optional)
CREATE INDEX idx_course_summary_mandatory_attendance ON course_summary(votes_mandatory_attendance DESC);
CREATE INDEX idx_course_summary_optional_attendance ON course_summary(votes_optional_attendance DESC);

-- Índices compuestos para consultas más complejas
CREATE INDEX idx_course_summary_superlikes_likes ON course_summary(superlikes DESC, likes DESC);

-- Índices con id como segundo criterio de ordenamiento
CREATE INDEX idx_course_summary_sort_index_id ON course_summary(sort_index DESC, id DESC);
CREATE INDEX idx_course_summary_sigle_id ON course_summary(sigle, id DESC);

-- Índices para la tabla course_reviews
CREATE INDEX idx_course_reviews_course_sigle ON course_reviews(course_sigle);
CREATE INDEX idx_course_reviews_user_id ON course_reviews(user_id);
CREATE INDEX idx_course_reviews_sigle_updated ON course_reviews(course_sigle, updated_at DESC);
CREATE INDEX idx_course_reviews_like_dislike ON course_reviews(like_dislike DESC);
CREATE INDEX idx_course_reviews_workload_vote ON course_reviews(workload_vote DESC);
CREATE INDEX idx_course_reviews_attendance_type ON course_reviews(attendance_type DESC);
CREATE INDEX idx_course_reviews_year_semester ON course_reviews(year_taken DESC, semester_taken DESC);
CREATE INDEX idx_course_reviews_visible_updated
ON course_reviews(course_sigle, updated_at DESC)
WHERE status != 3;

CREATE INDEX idx_course_reviews_status_updated
ON course_reviews(course_sigle, status, updated_at DESC);

-- Si una review es aprobada, se actualiza el campo updated_at y se cambia el estado a pending
-- Si una review es reportada, se cambia el estado a reported
-- Si una review es oculta, se cambia el estado a hidden
CREATE TRIGGER trg_course_reviews_set_updated_at
BEFORE UPDATE ON course_reviews
FOR EACH ROW
BEGIN
  UPDATE course_reviews
  SET
    updated_at = CURRENT_TIMESTAMP,
    status = CASE
      WHEN OLD.status = 1 THEN 0      -- approved → pending
      ELSE OLD.status                 -- reported/hidden se mantiene
    END
  WHERE id = OLD.id;
END;



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
    votes_mandatory_attendance = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND attendance_type = 0
    ),
    votes_optional_attendance = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND attendance_type = 1
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
    votes_mandatory_attendance = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND attendance_type = 0
    ),
    votes_optional_attendance = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = NEW.course_sigle AND attendance_type = 1
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
    votes_mandatory_attendance = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND attendance_type = 0
    ),
    votes_optional_attendance = (
      SELECT COUNT(*) FROM course_reviews
      WHERE course_sigle = OLD.course_sigle AND attendance_type = 1
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