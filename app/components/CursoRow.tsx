import { Curso } from "@/app/types";

type CursoRowProps = {
  curso?: Curso;
  isLogged?: boolean;
};

export default function CursoRow({ curso, isLogged }: CursoRowProps) {
  if (!curso) {
    return null;
  }

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700">
      <td className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
        {curso.nrc}
      </td>
      <td className="px-2 py-4 text-black dark:text-white text-center">
        {curso.nombre_curso}
      </td>
      <td className="px-2 py-4 text-black dark:text-white text-center">
        {curso.creditos}
      </td>
      <td className="px-6 py-4 text-cyan-600 font-bold text-center">{curso.mas}</td>
      <td className="px-6 py-4 text-red-500 font-bold text-center">{curso.menos}</td>
      <td className="px-6 py-4 text-black dark:text-white text-center">
        {curso.promedio}
      </td>
    </tr>
  );
}
