"use client";
import TarCurso from "./components/TarjetaCurso";
import { useEffect, useState } from "react";

// Aqui hay que hacer el fetch a la lista de OFGS
// seria algo asi como  api/ofgs -> [ cursos : {nombre : "ARTES", id = 0 ....}]
// despues para hacer el fetch de los cursos del ofg [en la tabla]
// api/ofgs/0 -> [ cursos : {nombre : "Dibujo", nrc = 2001, creditos: 10  ....}]

export default function Home() {
  const [cursos, setCursos] = useState<Record<string, Array<string>>>({});

  useEffect(() => {
    const fetchCursos = async () => {
      const response = await fetch("assets/cursosdummy.json");
      const data = await response.json();
      setCursos(data);
    };
    fetchCursos();
  }, []);

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
        <section className="mt-9 grid grid-cols-3 gap-4">
          {Object.keys(cursos).map((curso, index) => (
            <TarCurso key={index} titulo={curso} cursos={cursos[curso]} />
          ))}
        </section>

        {/* </main> */}
      </div>
    </>
  );
}
