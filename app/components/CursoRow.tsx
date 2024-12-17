
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
            <td className="px-2 py-4 text-black dark:text-white text-center">{curso.nombre_curso}</td>
            <td className="px-2 py-4 text-black dark:text-white text-center">{curso.creditos}</td>
            <td className="px-6 py-4 text-cyan-600 font-bold text-center">{curso.mas}</td>
            <td className="px-6 py-4 text-red-500 font-bold text-center">{curso.menos}</td>
            <td className="px-6 py-4 text-black dark:text-white text-center">{curso.promedio}</td>
            {isLogged ? (
                <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            className="w-5 h-5 flex items-center justify-center bg-cyan-500 dark:bg-blue-500 hover:bg-cyan-700 text-white font-bold rounded-full shadow-md transition-all duration-200"
                            title="Incrementar"
                        >
                            +
                        </button>
                        <button
                            className="w-5 h-5 flex items-center justify-center bg-rose-400 hover:bg-red-700 text-white dark:bg-amber-600 font-bold rounded-full shadow-md transition-all duration-200"
                            title="Disminuir"
                        >
                            -
                        </button>
                    </div>
                </td>
            ) : null}
        </tr>
    );
}