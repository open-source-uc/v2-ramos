import CursoRow from "./CursoRow";
import { Curso } from "../types";
import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';


type TablaCursosProps = {
    cursos: Array<Curso>;
    isLogged?: boolean;
};

// 

export default function TablaCursos({ cursos, isLogged }: TablaCursosProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = useMemo(() => {
        return cursos.filter(course => 
          course.nrc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.nombre_curso.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [searchTerm]);

      return (
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex justify-center">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>
    
          <div className="mx-5 rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">NRC</th>
                  <th scope="col" className="px-6 py-3 text-center">Nombre Curso</th>
                  <th scope="col" className="px-6 py-3 text-center">Créditos</th>
                  <th scope="col" className="px-6 py-3 text-center">+</th>
                  <th scope="col" className="px-6 py-3 text-center">-</th>
                  <th scope="col" className="px-6 py-3 text-center">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0
                  ? filteredCourses.map((curso, index) => (
                      <CursoRow
                        key={index}
                        curso={curso}
                        isLogged={isLogged}
                      />
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      );
    }