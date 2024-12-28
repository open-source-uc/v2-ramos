"use client";

import { useParams } from 'next/navigation';

export default function DetalleCurso() {
  const params = useParams();
  const nrc = params.nrc;          
  const nombre_curso = params.name

  return (
    <div>
      <h1>Detalle del curso</h1>
      <p>NRC: {nrc}</p>
      <p>Nombre del curso: {nombre_curso}</p>
    </div>
  );
}
