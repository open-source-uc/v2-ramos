import CursoRow from "./CursoRow";
import { Curso } from "../types";
import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";

type TablaCursosProps = {
  cursos: Array<Curso>;
  isLogged?: boolean;
  categoria: string;
};

//

export default function TablaCursos({ cursos, isLogged, categoria }: TablaCursosProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return cursos.filter(
      (course) =>
        course.nrc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.nombre_curso.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      <div className="mx-5 rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                NRC
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Nombre Curso
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Créditos
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                +
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                -
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Promedio
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0
              ? filteredCourses.map((curso, index) => (
                  <CursoRow categoria={categoria} key={index} curso={curso} isLogged={isLogged} />
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
