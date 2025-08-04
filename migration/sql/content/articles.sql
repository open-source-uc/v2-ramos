-- Tabla para blogs
CREATE TABLE blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  organization_id INTEGER NOT NULL,
  organization_name TEXT NOT NULL,
  title TEXT NOT NULL,
  period_time TEXT NOT NULL,
  readtime INTEGER NOT NULL,
  tags TEXT, -- tag1,tag2,tag3,...
  content_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  organization_id INTEGER NOT NULL,
  organization_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  title TEXT NOT NULL,
  period_time TEXT NOT NULL,
  readtime INTEGER NOT NULL,
  code TEXT NOT NULL,
  qualification INTEGER CHECK (qualification >= 0 AND qualification <= 5),
  content_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_blogs_updated_at
    AFTER UPDATE ON blogs
    FOR EACH ROW
    BEGIN
        UPDATE blogs
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END;

CREATE TRIGGER update_recommendations_updated_at
    AFTER UPDATE ON recommendations
    FOR EACH ROW
    BEGIN
        UPDATE recommendations
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END;



-- Índices para la tabla blogs
CREATE INDEX idx_blogs_user_id ON blogs(user_id);
CREATE INDEX idx_blogs_organization_id ON blogs(organization_id);
CREATE INDEX idx_blogs_period_time ON blogs(period_time);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
CREATE INDEX idx_blogs_title ON blogs(title);
CREATE INDEX idx_blogs_readtime ON blogs(readtime);

-- Índices para la tabla recommendations
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_organization_id ON recommendations(organization_id);
CREATE INDEX idx_recommendations_faculty ON recommendations(faculty);
CREATE INDEX idx_recommendations_code ON recommendations(code);
CREATE INDEX idx_recommendations_qualification ON recommendations(qualification);
CREATE INDEX idx_recommendations_period_time ON recommendations(period_time);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at);

-- Índices compuestos para consultas más complejas
CREATE INDEX idx_blogs_org_period ON blogs(organization_id, period_time);
CREATE INDEX idx_recommendations_faculty_code ON recommendations(faculty, code);
CREATE INDEX idx_recommendations_qualification_faculty ON recommendations(qualification, faculty);
