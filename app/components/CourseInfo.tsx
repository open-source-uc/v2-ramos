import { Book, Star } from "lucide-react";
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
export default function CourseInfo({ course }: { course: Course }) {
  return (
    <article className="group relative mx-auto flex w-full flex-col rounded-2xl bg-white p-6 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Header section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <h3 className="mb-2 font-[Inter] text-2xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {course.name}
            </span>
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">{course.sigle}</span>
            <span className="text-gray-600">•</span>
            <span className="font-medium text-gray-600">{course.credits} créditos</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
            Categoría {course.category_id}
          </span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">Área {course.area_id}</span>
        </div>
      </div>

      {/* Rating section */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Star className="h-5 w-5 text-amber-500" />
            Calificación del curso
            <span className="ml-2 rounded bg-amber-100 px-2 py-1 text-amber-800">
              {course.promedio > 0 ? (course.promedio * 5).toFixed(1) : "N/A"}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
              style={{ width: `${course.promedio * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Book className="h-5 w-5 text-indigo-500" />
            Dificultad estimada
            <span className="ml-2 rounded bg-indigo-100 px-2 py-1 text-indigo-800">
              {course.promedio_creditos_est > 0 ? (course.promedio_creditos_est * 5).toFixed(1) : "N/A"}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"
              style={{ width: `${course.promedio_creditos_est * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="leading-relaxed text-gray-600">
          Curso perteneciente a la categoría {course.category_id}, enfocado en el área {course.area_id}. Ofrece{" "}
          {course.credits} créditos académicos y forma parte del programa de estudios de la institución{" "}
          {course.school_id}.
        </p>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <a
          href={`/${course.sigle}/criticar`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg md:w-auto"
        >
          Escribir reseña
          <Star className="ml-2 h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
