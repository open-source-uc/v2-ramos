import { Star, Book } from "lucide-react";

type Course = {
  name: string;
  school_id: number;
  course_id: number;
  sigle: string;
  category_id: number;
  area_id: number;
  credits: number;
  promedio: number; // de 0 a 1
  promedio_creditos_est: number; // de 0 a 1
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white px-2 py-3 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
      {/* Contenido */}
      <div className="flex items-end justify-end gap-2">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
          Categoría {course.category_id}
        </span>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">Área {course.area_id}</span>
      </div>
      <div className="flex flex-col px-6">
        {/* Nombre del curso */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{course.name}</h3>

        {/* Código y créditos */}
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Código: <span className="font-medium">{course.sigle}</span> | Créditos Oficiales: {course.credits}
        </p>

        {/* Promedio del curso */}
        <div className="mt-2 flex items-center gap-1 text-yellow-500">
          {course.promedio > 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} fill={i < Math.round(course.promedio * 5) ? "currentColor" : "none"} />
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">No hay críticas todavía...</span>
          )}
          {course.promedio > 0 && (
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {(course.promedio * 5).toFixed(1)} / 5
            </span>
          )}
        </div>

        {/* Créditos estimados */}
        <div className="mt-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
          {course.promedio_creditos_est > 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Book
                key={i}
                size={18}
                fill={i < Math.round(course.promedio_creditos_est * 5) ? "currentColor" : "none"}
              />
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">No hay críticas todavía...</span>
          )}
          {course.promedio_creditos_est > 0 && (
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {(course.promedio_creditos_est * 5).toFixed(1)} / 5
            </span>
          )}
        </div>

        {/* Botón de acción */}
        <a
          href={`/${course.sigle}`}
          className="mt-4 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
        >
          Ver más detalles
        </a>
      </div>
    </article>
  );
}
