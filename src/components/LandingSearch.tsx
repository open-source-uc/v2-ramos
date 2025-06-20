"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

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
      
      <form onSubmit={handleSearch} className="relative">
        <Input
          variant="search"
          inputSize="lg"
          type="text"
          placeholder="Buscar por nombre o sigla del curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-lg pl-10"
        />
      </form>
      
      <div className="mt-4 text-center">
        <a 
          href="/catalog" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Ver todos los cursos
        </a>
      </div>
    </div>
  )
}
