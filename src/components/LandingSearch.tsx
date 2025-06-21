"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"

export function LandingSearch() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Redirect to catalog page with search parameter
      window.location.href = `/catalog?search=${encodeURIComponent(searchTerm.trim())}`
    } else {
      window.location.href = '/catalog'
    }
  }

  return (
    <div className="max-w-2xl w-full mx-auto my-16">
        <h1 className="text-4xl font-semibold text-foreground mb-4 text-center mb-8">
          ¿En qué curso estás pensando?
        </h1>
      
      <form onSubmit={handleSearch} className="relative" role="search" aria-label="Buscar cursos">
        <label htmlFor="course-search" className="sr-only">
          Buscar por nombre o sigla del curso
        </label>
        <Input
          id="course-search"
          variant="search"
          inputSize="lg"
          type="text"
          placeholder="Buscar por nombre o sigla del curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-lg pl-10 shadow-sm"
          aria-describedby="search-instructions"
          autoComplete="off"
        />
        <div id="search-instructions" className="sr-only">
          Escribe el nombre o sigla del curso que buscas y presiona Enter para buscar
        </div>
        <button type="submit" className="sr-only">
          Buscar cursos
        </button>
      </form>
      
      <div className="flex mt-4 justify-center gap-4 pt-4" role="group" aria-label="Acciones de navegación">
        <Button
          variant="outline"
          size="lg"
          className="text-sm border border-muted"
          onClick={() => window.location.href = '/catalog'}
          aria-label="Ver todos los cursos disponibles en el catálogo"
        >
          Ver todos los cursos 
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="text-sm border border-muted"
          onClick={() => window.location.href = '/404'}
          aria-label="Conocer más información acerca de nosotros"
        >
          Conocer más acerca de nosotros
        </Button>
      </div>
    </div>
  )
}
