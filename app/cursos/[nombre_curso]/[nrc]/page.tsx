"use client";

import FormComment from "@/app/components/FormComment";
import { Info } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type InfoCourse = {
  nrc: string;
  nombre_curso: string;
  creditos: number;
  mas: number;
  menos: number;
  promedio: number;
};

type RouteParams = {
  nrc: string;
};

export default function DetalleCurso() {
  const params = useParams() as RouteParams;
  const [curso, setCurso] = useState<InfoCourse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch("../../../assets/infocursos.json");
        if (!response.ok) {
          throw new Error("No se encontró el curso ... :c");
        }
        const data: InfoCourse[] = await response.json();
        const foundCourse = data.find((course) => course.nrc === params.nrc);
        setCurso(foundCourse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo falló ");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [params.nrc]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!curso) {
    return <div>Course not found</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="m-5 w-6/12 rounded-lg bg-slate-100 dark:bg-gray-800">
        <div className="m-3 mx-auto flex flex-col items-center dark:text-white">
          <h1 className="p-4 text-2xl">{curso.nombre_curso}</h1>
        </div>
        <div className="p-4 dark:text-white">
          <p>
            <span className="font-bold">Créditos : </span>
            {curso.creditos}
          </p>
          <p>
            <span className="font-bold">NRC : </span> {curso.nrc}
          </p>
          <p>
            <span className="font-bold">Puntaje promedio : </span> {curso.promedio}
          </p>
          <p>
            <span className="font-bold">Reseñas positivas: </span> {curso.mas}
          </p>
          <p>
            <span className="font-bold">Reseñas negativas : </span> {curso.menos}
          </p>
        </div>
        <hr />
        {isLogged && (
          <div className="p-4 dark:text-white">
            <h2>Deja una reseña</h2>
            <FormComment />
          </div>
        )}

        <div className="p-4 dark:text-white">
          <h2>Reseñas</h2>
          <div className="flex justify-center p-4">
            <Info size="64" />
          </div>
          <p className="text-center">No hay reseñas aún</p>
        </div>
      </div>
    </div>
  );
}
