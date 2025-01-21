"use client";

import { useParams } from "next/navigation";
import TablaCursos from "../../components/TablaCursos";
import { Curso } from "@/app/types";

// Aqui deberiamos hacer el fetch a la API/BD para obtener los cursos

// dummy data :
const cursos: Curso[] = [
  { nrc: "12345", nombre_curso: "Curso 1", creditos: 3, mas: 10, menos: 5, promedio: 7.5 },
  { nrc: "12346", nombre_curso: "Curso 2", creditos: 4, mas: 9, menos: 3, promedio: 6 },
  { nrc: "12347", nombre_curso: "Curso 3", creditos: 5, mas: 8, menos: 2, promedio: 5 },
  { nrc: "12348", nombre_curso: "Curso 4", creditos: 6, mas: 7, menos: 1, promedio: 4 },
  { nrc: "12349", nombre_curso: "Curso 5", creditos: 7, mas: 6, menos: 0, promedio: 3 },
  { nrc: "12350", nombre_curso: "Curso 6", creditos: 8, mas: 5, menos: 0, promedio: 2.5 },
  { nrc: "12351", nombre_curso: "Curso 7", creditos: 9, mas: 4, menos: 0, promedio: 2 },
  { nrc: "12352", nombre_curso: "Curso 8", creditos: 10, mas: 3, menos: 0, promedio: 1.5 },
  { nrc: "12353", nombre_curso: "Curso 9", creditos: 11, mas: 2, menos: 0, promedio: 1 },
  { nrc: "12354", nombre_curso: "Curso 10", creditos: 12, mas: 1, menos: 0, promedio: 0.5 },
];
export default function CoursePage() {
  const curso = useParams();
  const nombre_curso = curso.nombre_curso as string;

  return (
    <div className="pt-5 text-center">
      <h1 className="mx-5 my-5 text-4xl font-bold dark:text-slate-100">Cursos {nombre_curso}</h1>

      <TablaCursos categoria={nombre_curso} cursos={cursos} isLogged={true} />
    </div>
  );
}
