"use client";

import { useRouter } from 'next/navigation';

type TarCursoProps = {
  titulo: string;
  cursos: Array<string>;
};

export default function TarCurso({ titulo, cursos }: TarCursoProps) {
  const router = useRouter();

  const goToCurso = (nombreC: string) => {
    router.push(`/cursos/${nombreC}`);
  };

  return (
    <div 
      className="m-2 h-full w-full rounded-lg border p-8 hover:bg-slate-100 cursor-pointer"
      onClick={() => goToCurso(titulo)}
      
    >
      <div className="relative h-full w-full">
        <div className="flex h-full w-full flex-col justify-end">
          <h2 className="pb-4 text-center text-lg">{titulo}</h2>
          <hr className="m-3 pb-2"></hr>
          <div>
            <ol className="list-outside list-decimal">
              {cursos.map((curso, index) => (
                <li className="" key={index}>
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
