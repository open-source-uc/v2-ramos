import Image from "next/image";
import { Card } from "./components/Card";
import TarCurso from "./components/TarjetaCurso";

export default function Home() {
  const ofgs: Array<string> = ["Curso de Python", "Curso de JavaScript", "Curso de React", "Curso de Next.js"];
  const ofgs2: Array<string> = [
    "Historia de Grecia, Roma y Egipto",
    "Historia de la Edad Media",
    "Historia de la Edad Moderna",
    "Historia de la Edad Contemporánea",
  ];
  const ofgs3: Array<string> = ["Algebra Lineal", "Calculo Diferencial", "Calculo Integral", "Calculo Vectorial"];
  const cursos: Record<string, Array<string>> = { Programacion: ofgs, Historia: ofgs2, Matematicas: ofgs3 };
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-2 sm:items-start">
        <div className="h-50 grid grid-cols-2 p-8">
          <div className="text-stonecol-span-1">
            <Card team="FrontEnd" image="https://nextjs.org/icons/next.svg" people={5}></Card>
          </div>
          <div className="text-stone col-span-1">
            <Card team="BackEnd" image="https://nextjs.org/icons/next.svg" people={15}></Card>
          </div>
        </div>

        <div></div>
        <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
          <li className="mb-2">
            Biba osuc{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">app/page.tsx</code>.
          </li>
          <li>Biba osuc</li>
        </ol>

        <section className="grid grid-cols-3 gap-4">
          {Object.keys(cursos).map((curso, index) => (
            <TarCurso key={index} titulo={curso} cursos={cursos[curso]} />
          ))}
        </section>
      </main>
    </div>
  );
}
