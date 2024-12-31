"use client";

import { useRouter } from "next/navigation";

type TarCursoProps = {
  titulo: string;
  cursos: Array<string>;
};

export default function TarCurso({ titulo, cursos }: TarCursoProps) {
  const router = useRouter();

  const goToCurso = (nombreC: string) => {
    // split '-'
    nombreC = nombreC.split(" ")[0];
    router.push(`/cursos/${nombreC}`);
  };

  return (
    <div
      className="m-2 w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
      onClick={() => goToCurso(titulo)}
    >
      <div className="relative h-full w-full">
        <div className="flex h-full w-full flex-col justify-end text-gray-800 dark:text-gray-200">
          <h2 className="pb-4 text-center text-2xl font-semibold text-cyan-600 dark:text-cyan-400">{titulo}</h2>
          <hr className="m-3 border-t-2 border-gray-300 dark:border-gray-600" />
          <div>
            <ol className="list-outside list-decimal pl-5">
              {cursos.map((curso, index) => (
                <li className="text-gray-700 hover:list-disc dark:text-gray-300" key={index}>
                  {curso}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
