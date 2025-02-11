import { Book, Star } from "lucide-react";
type Course = {
    name: string;
    school_id: number;
    course_id: number;
    sigle: string;
    category_id: number;
    area_id: number;
    credits: number;
    promedio: number;  // de 0 a 1
    promedio_creditos_est: number;  // de 0 a 1
};
export default function CourseInfo({ course }: { course: Course }) {
    return (
        <article className="group relative flex flex-col w-full mx-auto p-6 bg-white rounded-2xl shadow-xl shadow-gray-100/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 font-[Inter]">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {course.name}
                        </span>
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                            {course.sigle}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600 font-medium">{course.credits} créditos</span>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        Categoría {course.category_id}
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                        Área {course.area_id}
                    </span>
                </div>
            </div>

            {/* Rating section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Star className="w-5 h-5 text-amber-500" />
                        Calificación del curso
                        <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded">
                            {course.promedio > 0 ? (course.promedio * 5).toFixed(1) : 'N/A'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
                            style={{ width: `${course.promedio * 100}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Book className="w-5 h-5 text-indigo-500" />
                        Dificultad estimada
                        <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                            {course.promedio_creditos_est > 0 ? (course.promedio_creditos_est * 5).toFixed(1) : 'N/A'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${course.promedio_creditos_est * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">
                    Curso perteneciente a la categoría {course.category_id}, enfocado en el área {course.area_id}.
                    Ofrece {course.credits} créditos académicos y forma parte del programa de estudios de la institución {course.school_id}.
                </p>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
                <a
                    href={`/${course.sigle}/criticar`}
                    className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02]"
                >
                    Escribir reseña
                    <Star className="w-4 h-4 ml-2" />
                </a>
            </div>
        </article>
    );
}