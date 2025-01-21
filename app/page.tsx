"use client";
import TarCurso from "./components/TarjetaCurso";
import { useEffect, useState } from "react";

// Aqui hay que hacer el fetch a la lista de OFGS
// seria algo asi como  api/ofgs -> [ cursos : {nombre : "ARTES", id = 0 ....}]
// despues para hacer el fetch de los cursos del ofg [en la tabla]
// api/ofgs/0 -> [ cursos : {nombre : "Dibujo", nrc = 2001, creditos: 10  ....}]

export default function Home() {
  const [cursos, setCursos] = useState<Record<string, Array<string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const response = await fetch("assets/cursosdummy.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCursos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-600">Error loading courses: {error}</div>
      </div>
    );
  }
  return (
    <>
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        {/* <main className="row-start-2 flex flex-col items-center gap-2 sm:items-start"> */}
        <div className="mx-auto mb-3">
          <img
            src="assets/logo.jpg"
            alt=""
            style={{ overflow: "hidden", borderRadius: "50%", mixBlendMode: "multiply" }}
          />
        </div>
        {Object.keys(cursos).length > 0 ? (
          <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(cursos).map((curso) => (
              <TarCurso key={curso} titulo={curso} cursos={cursos[curso]} />
            ))}
          </section>
        ) : (
          <div className="text-center text-gray-500">No courses found</div>
        )}

        {/* </main> */}
      </div>
    </>
  );
}
