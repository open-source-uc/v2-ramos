"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
    <div className="max-w-2xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Encuentra tu curso ideal
        </h1>
        <p className="text-xl text-gray-600">
          Explora miles de cursos y encuentra el que mejor se adapte a tus necesidades
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-4">
        <Input
          type="text"
          placeholder="Buscar por nombre o sigla del curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-12 text-lg"
        />
        <Button 
          type="submit" 
          size="lg"
          className="h-12 px-8 text-lg font-semibold"
        >
          Buscar
        </Button>
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
