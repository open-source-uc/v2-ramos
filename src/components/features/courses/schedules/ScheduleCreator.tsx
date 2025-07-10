import { useState, useEffect } from "react";
import cursosJSON from "@/migration/json/2025-1.json";

const horarios = [
  ["08:20", "09:30"], ["09:40", "10:50"], ["11:00", "12:10"], ["12:20", "13:30"],
  ["14:50", "16:00"], ["16:10", "17:20"], ["17:30", "18:40"], ["18:50", "20:00"], ["20:10", "21:20"]
];

const dias = ["L", "M", "W", "J", "V"];

const bloqueMap: Record<string, { dia: string, hora: string }> = {
  l1: { dia: "L", hora: "08:20" }, l2: { dia: "L", hora: "09:40" }, l3: { dia: "L", hora: "11:00" },
  l4: { dia: "L", hora: "12:20" }, l5: { dia: "L", hora: "14:50" }, l6: { dia: "L", hora: "16:10" },
  l7: { dia: "L", hora: "17:30" }, l8: { dia: "L", hora: "18:50" }, l9: { dia: "L", hora: "20:10" },
  m1: { dia: "M", hora: "08:20" }, m2: { dia: "M", hora: "09:40" }, m3: { dia: "M", hora: "11:00" },
  m4: { dia: "M", hora: "12:20" }, m5: { dia: "M", hora: "14:50" }, m6: { dia: "M", hora: "16:10" },
  m7: { dia: "M", hora: "17:30" }, m8: { dia: "M", hora: "18:50" }, m9: { dia: "M", hora: "20:10" },
  w1: { dia: "W", hora: "08:20" }, w2: { dia: "W", hora: "09:40" }, w3: { dia: "W", hora: "11:00" },
  w4: { dia: "W", hora: "12:20" }, w5: { dia: "W", hora: "14:50" }, w6: { dia: "W", hora: "16:10" },
  w7: { dia: "W", hora: "17:30" }, w8: { dia: "W", hora: "18:50" }, w9: { dia: "W", hora: "20:10" },
  j1: { dia: "J", hora: "08:20" }, j2: { dia: "J", hora: "09:40" }, j3: { dia: "J", hora: "11:00" },
  j4: { dia: "J", hora: "12:20" }, j5: { dia: "J", hora: "14:50" }, j6: { dia: "J", hora: "16:10" },
  j7: { dia: "J", hora: "17:30" }, j8: { dia: "J", hora: "18:50" }, j9: { dia: "J", hora: "20:10" },
  v1: { dia: "V", hora: "08:20" }, v2: { dia: "V", hora: "09:40" }, v3: { dia: "V", hora: "11:00" },
  v4: { dia: "V", hora: "12:20" }, v5: { dia: "V", hora: "14:50" }, v6: { dia: "V", hora: "16:10" },
  v7: { dia: "V", hora: "17:30" }, v8: { dia: "V", hora: "18:50" }, v9: { dia: "V", hora: "20:10" }
};

const colores = [
  "bg-green", "bg-muted", "bg-pink",
  "bg-purple", "bg-orange", "bg-blue"
];

const opcionesCursos = Object.entries(cursosJSON).flatMap(([sigla, data]) =>
  Object.keys(data.sections).map((seccion) => ({
    id: `${sigla}-${seccion}`,
    sigla,
    seccion,
    nombre: data.name
  }))
);

export default function HorarioPage() {
  const [cursos, setCursos] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("horarioCursos");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("horarioCursos", JSON.stringify(cursos));
    }
  }, [cursos]);

  const opcionesFiltradas = opcionesCursos.filter(op =>
    `${op.sigla}-${op.seccion}`.toLowerCase().includes(input.toLowerCase())
  );

  const pintarCelda = (dia: string, hora: string) => {
    const celdas: JSX.Element[] = [];

    for (let i = 0; i < cursos.length; i++) {
      const cursoID = cursos[i];
      const color = colores[i % colores.length];

      const [sigla, seccion] = cursoID.split("-");
      const curso = cursosJSON[sigla];
      const bloques = curso?.sections?.[seccion]?.schedule ?? {};

      for (const bloque in bloques) {
        const map = bloqueMap[bloque];
        if (map && map.dia === dia && map.hora === hora) {
          const tipo = bloques[bloque][0];
          celdas.push(
            <div
              key={`${dia}-${hora}-${cursoID}`}
              className={`w-full px-1 py-0.5 rounded text-[11px] font-medium text-center border border-black/20 ${color}`}
            >
              <div>{`${sigla}-${seccion}`}</div>
              <div className="text-[10px] font-normal opacity-80">{tipo}</div>
            </div>
          );
        }
      }
    }

    return celdas.length > 0 ? (
      <div className="flex flex-col gap-[2px] items-center justify-center w-full h-full overflow-y-auto">
        {celdas}
      </div>
    ) : "";
  };

  const obtenerColorCurso = (siglaSeccion: string) => {
    const index = cursos.indexOf(siglaSeccion);
    return index >= 0 ? colores[index % colores.length] : "";
  };

  const eliminarCurso = (siglaSeccion: string) => {
    setCursos(cursos.filter(c => c !== siglaSeccion));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Creador de Horario</h1>

      <div className="relative w-full mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Ingresa código del curso, ej: IIC2214"
        />
        {input && (
          <div className="absolute z-10 bg-white border rounded mt-1 max-h-48 overflow-y-auto w-full shadow-md">
            {opcionesFiltradas.slice(0, 10).map((op) => (
              <div
                key={op.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex flex-col"
                onClick={() => {
                  if (!cursos.includes(op.id)) {
                    setCursos([...cursos, op.id]);
                    setInput("");
                  }
                }}
              >
                <span className="font-semibold">{op.id}</span>
                <span className="text-sm text-gray-500">{op.nombre}</span>
              </div>
            ))}
            {opcionesFiltradas.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-400">No se encontraron cursos</div>
            )}
          </div>
        )}
      </div>

      <table className="table-fixed border-collapse w-full">
        <thead>
          <tr>
            <th className="w-28 border p-2">Horario</th>
            {dias.map((dia) => (
              <th key={dia} className="border p-2 w-32">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map(([inicio, fin], idx) => (
            <tr key={inicio}>
              <td className="border p-2 font-semibold text-center text-sm">{inicio} - {fin}</td>
              {dias.map((dia) => (
                <td key={dia + inicio} className="border h-20 text-center p-0 align-top">
                  {pintarCelda(dia, inicio)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {cursos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Cursos agregados:</h2>
          <div className="flex flex-wrap gap-2">
            {cursos.map((siglaSeccion) => (
              <span
                key={siglaSeccion}
                className={`px-3 py-1 rounded-full text-sm font-medium 
                            ${obtenerColorCurso(siglaSeccion)} flex items-center gap-1`}
              >
                {siglaSeccion}
                <button
                  onClick={() => eliminarCurso(siglaSeccion)}
                  className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
