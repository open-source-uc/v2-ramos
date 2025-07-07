"use client"

import { Card } from "@/components/ui/card"
import { FaGithub, FaLinkedin } from "react-icons/fa";


type Props = {
  items: {
    nombre: string
    rol: string
    carrera: string
    linkedin: string
    github: string
    imagen: string
  }[]
}

export default function ContribuidoresSection({ items }: Props) {
  return (
    <div className="max-w-6xl mx-auto my-16 px-4">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Contribuidores del Proyecto
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((person, idx) => (
          <Card key={idx} className="p-6 flex flex-col md:flex-row items-center gap-6 text-left rounded-2xl shadow-md">
          
          <div className="flex-1">
            <h2 className="text-xl font-medium">{person.nombre}</h2>
            <p className="text-sm mt-1">{person.rol}</p>
            <p className="text-sm mt-1">{person.carrera}</p>
            <div className="flex gap-3 mt-4">
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="w-6 h-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
              </a>
              <a href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub className="w-6 h-6 text-zinc-800 hover:text-black dark:text-zinc-200 dark:hover:text-white" />
              </a>
            </div>
          </div>
          <img
            src={person.imagen}
            alt={`Foto de ${person.nombre}`}
            className="w-32 h-auto rounded-xl object-cover"
          />
        </Card>
        
        ))}
      </div>
    </div>
  )
}
