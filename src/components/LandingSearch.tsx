"use client"

import { useState } from "react"
import { Search } from "./Search"
import { Button } from "./ui/button"
import { Pill } from "./ui/pill"
import { 
  BuildingIcon, 
  AreaIcon, 
  HourglassIcon, 
  ResourcesIcon
} from "./icons/icons"

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const floatingPills = [
    { icon: BuildingIcon, text: "Facultades", variant: "blue" as const, position: "top-0 left-8", delay: "0s" },
    { icon: AreaIcon, text: "Áreas", variant: "pink" as const, position: "top-0 right-8", delay: "0.2s" },
    { icon: HourglassIcon, text: "Créditos", variant: "green" as const, position: "top-24 left-12", delay: "0.4s" },
    { icon: ResourcesIcon, text: "Recursos", variant: "blue" as const, position: "top-24 right-12", delay: "1.2s" } 
  ]

  return (
    <div className="relative max-w-4xl w-full mx-auto mb-8 mt-24 tablet:my-12 desktop:my-16 px-4 tablet:px-6 desktop:px-8">
      {/* Floating Pills - Only visible on desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingPills.map((pill, index) => (
          <div
            key={index}
            className={`absolute ${pill.position} animate-pulse hidden desktop:block`}
            style={{ 
              animationDelay: pill.delay,
              animationDuration: "3s"
            }}
          >
            <Pill
              variant={pill.variant}
              size="sm"
              icon={pill.icon}
              className="opacity-60 hover:opacity-80 transition-opacity duration-300 shadow-sm"
            >
              {pill.text}
            </Pill>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8 tablet:mb-10 desktop:mb-12">
          <h1 className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-foreground mb-3 tablet:mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text leading-tight">
            ¿En qué curso estás pensando?
          </h1>
          <p className="text-base tablet:text-lg text-muted-foreground max-w-xl mx-auto px-4 tablet:px-0">
            Descubre opiniones, estadísticas y recursos de miles de cursos de la UC
          </p>
        </div>
        
        <div className="relative">
          <form onSubmit={handleSearch} className="relative group" role="search" aria-label="Buscar cursos">
            <div className="relative">
              <Search
                onSearch={handleSearchChange}
                placeholder="Buscar por nombre o sigla del curso..."
                initialValue={searchTerm}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-pink/5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div id="search-instructions" className="sr-only">
              Escribe el nombre o sigla del curso que buscas y presiona Enter para buscar
            </div>
            <button type="submit" className="sr-only">
              Buscar cursos
            </button>
          </form>
        </div>
        
        <div className="flex flex-col tablet:flex-row mt-6 tablet:mt-8 justify-center gap-3 tablet:gap-4 pt-4" role="group" aria-label="Acciones de navegación">
          <Button
            variant="outline"
            size="lg"
            className="text-sm border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-background/80 backdrop-blur-sm w-full tablet:w-auto"
            onClick={() => window.location.href = '/catalog'}
            aria-label="Ver todos los cursos disponibles en el catálogo"
          >
            Ver todos los cursos 
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="text-sm border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-background/80 backdrop-blur-sm w-full tablet:w-auto"
            onClick={() => window.location.href = '/404'}
            aria-label="Conocer más información acerca de nosotros"
          >
            Conocer más acerca de nosotros
          </Button>
        </div>

<<<<<<< HEAD
        <Button
          variant="outline"
          size="lg"
          className="text-sm border border-muted"
          onClick={() => window.location.href = '/contributions'}
          aria-label="Conocer más información acerca de nosotros"
        >
          Conocer más acerca de nosotros
        </Button>
=======
>>>>>>> main
      </div>
    </div>
  )
}
