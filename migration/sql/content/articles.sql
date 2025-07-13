-- Tabla para organizaciones estudiantiles
CREATE TABLE organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, -- ID de la cuenta de la organización
    organization_name TEXT NOT NULL UNIQUE,
    faculty TEXT NOT NULL, -- Facultad a la que pertenece la organización
    title TEXT, -- Título opcional (ej: "CAI", "Representante de Carrera")
    logo_url TEXT NOT NULL, -- URL del logo de la organización
    page_link TEXT NOT NULL UNIQUE, -- Link interno de la página (ej: "/organizations/cai")
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para blogs
CREATE TABLE blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  period_time TEXT NOT NULL,
  readtime INTEGER NOT NULL,
  tags TEXT, -- Json String con los tags del blog
  content_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  faculty TEXT NOT NULL, -- Facultad a la que pertenece la recomendación
  title TEXT NOT NULL,
  period_time TEXT NOT NULL,
  readtime INTEGER NOT NULL,
  code TEXT NOT NULL,
  qualification INTEGER CHECK (qualification >= 0 AND qualification <= 5),
  content_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para la tabla organizations
CREATE INDEX idx_organizations_user_id ON organizations(user_id);
CREATE INDEX idx_organizations_faculty ON organizations(faculty);
CREATE INDEX idx_organizations_organization_name ON organizations(organization_name);
CREATE INDEX idx_organizations_page_link ON organizations(page_link);
CREATE INDEX idx_organizations_created_at ON organizations(created_at);

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
CREATE INDEX idx_organizations_faculty_created ON organizations(faculty, created_at);
