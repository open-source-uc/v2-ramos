-- Insert sample reviews for testing
INSERT INTO course_reviews (
    user_id, course_sigle, like_dislike, workload_vote, attendance_type, 
    weekly_hours, year_taken, semester_taken, comment
) VALUES 
-- Reviews for IIC1253 (sample course)
(1, 'IIC1253', 2, 1, 1, 6, 2024, 1, 'Excelente curso, muy bien explicado y con buenos ejercicios prácticos. El profesor es muy claro en sus explicaciones.'),
(2, 'IIC1253', 1, 0, 1, 4, 2024, 1, 'Buen curso en general. La carga de trabajo es manejable y los contenidos son interesantes.'),
(3, 'IIC1253', 1, 1, 0, 5, 2023, 2, 'Me gustó mucho, aunque algunas clases eran un poco largas. Los proyectos son desafiantes pero entretenidos.'),
(4, 'IIC1253', 0, 2, 0, 8, 2023, 2, 'Muy difícil, requiere mucho tiempo de estudio. Las evaluaciones son complejas.'),
(5, 'IIC1253', 1, 1, 1, 5, 2024, 2, 'Recomendado. Los ayudantes son muy buenos y siempre están dispuestos a ayudar.'),

-- Reviews for MAT1610 (sample course)
(6, 'MAT1610', 1, 2, 0, 7, 2024, 1, 'Curso fundamental pero muy exigente. Requiere dedicación constante.'),
(7, 'MAT1610', 2, 1, 0, 6, 2023, 2, 'Excelente base matemática. El profesor hace que los conceptos difíciles sean más comprensibles.'),
(8, 'MAT1610', 0, 2, 0, 9, 2024, 1, 'Muy difícil, especialmente para quienes no tienen una base sólida en matemáticas.'),
(9, 'MAT1610', 1, 1, 1, 5, 2023, 1, 'Buen curso, aunque algunos temas podrían explicarse con más ejemplos prácticos.'),

-- Reviews for IIC2233 (sample course)  
(10, 'IIC2233', 2, 1, 1, 8, 2024, 1, 'Uno de los mejores cursos de la carrera. Muy completo y bien estructurado.'),
(11, 'IIC2233', 1, 2, 1, 10, 2023, 2, 'Excelente contenido pero muy demandante. Los proyectos son muy buenos para aprender.'),
(12, 'IIC2233', 1, 1, 0, 6, 2024, 2, 'Me encantó la metodología de enseñanza. Los conceptos se ven de forma muy práctica.'),
(13, 'IIC2233', 2, 0, 1, 4, 2023, 1, 'Súper recomendado. Los profesores son excelentes y el material está muy bien preparado.');
