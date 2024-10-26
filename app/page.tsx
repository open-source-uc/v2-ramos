import Image from "next/image";
import { Card } from "./components/Card"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">

        <div className="h-50 grid grid-cols-2 p-8">
          <div className="text-stonecol-span-1">
            <Card
              team="FrontEnd"
              image="https://nextjs.org/icons/next.svg"
              people={5}
            ></Card>
          </div>
          <div className="text-stone col-span-1">
            <Card
              team="BackEnd"
              image="https://nextjs.org/icons/next.svg"
              people={15}
            ></Card>
          </div>
        </div>

        <div>
      </div>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Biba osuc{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Biba osuc</li>
        </ol>

      <section className="w-1/2 flex justify-left items-start ">
      <p>
      Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.

      </p>
        
      </section>  
        
      <section className="w-1/2 flex justify-center items-start">
      <Image src="/assets/cuadrado.png" alt="Logo" width={200} height={200} />

      </section>
      </main>
  );
}
