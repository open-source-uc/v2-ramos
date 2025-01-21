import { Curso } from "@/app/types";
import { useRouter } from "next/navigation";

type CursoRowProps = {
  curso?: Curso;
  isLogged?: boolean;
  categoria: string;
};

export default function CursoRow({ curso, isLogged, categoria }: CursoRowProps) {
  const router = useRouter();
  if (!curso) {
    return null;
  }

  const handleRowClick = () => {
    router.push(`/cursos/${categoria}/${curso.nrc}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="cursor-pointer border-b bg-white hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <td className="whitespace-nowrap px-6 py-4 text-center font-medium text-gray-900 dark:text-white">{curso.nrc}</td>
      <td className="px-2 py-4 text-center text-black dark:text-white">{curso.nombre_curso}</td>
      <td className="px-2 py-4 text-center text-black dark:text-white">{curso.creditos}</td>
      <td className="px-6 py-4 text-center font-bold text-cyan-600">{curso.mas}</td>
      <td className="px-6 py-4 text-center font-bold text-red-500">{curso.menos}</td>
      <td className="px-6 py-4 text-center text-black dark:text-white">{curso.promedio}</td>
    </tr>
  );
}
