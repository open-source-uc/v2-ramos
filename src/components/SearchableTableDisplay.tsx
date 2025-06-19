"use client"

import { useState } from "react"
import { Search } from "./Search"
import type { Course } from "./table/columns"
import { DataTable } from "./table/data-table"

interface SearchableTableDisplayProps {
  data: Course[]
  initialSearchValue?: string
}

export function SearchableTableDisplay({ data, initialSearchValue = "" }: SearchableTableDisplayProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue)

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className="container mx-auto py-4">
      <div className="">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Catálogo de Cursos</h1>
        <p className="text-gray-600 mb-6">Explora todos los cursos disponibles, filtra por sigla y ordena por diferentes criterios</p>
        
        {/* Search Component */}
        <div className="mb-6">
          <Search 
            onSearch={handleSearch}
            placeholder="Buscar por nombre o sigla..."
            className="max-w-md"
            initialValue={initialSearchValue}
          />
        </div>
      </div>
      
      {/* Data Table */}
      <DataTable data={data} externalSearchValue={searchValue} />

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Instrucciones de uso</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Búsqueda</h3>
            <p>Utiliza el campo de búsqueda para filtrar cursos por nombre o sigla.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ordenamiento</h3>
            <p>Haz clic en los encabezados de las columnas para ordenar los resultados por ese criterio.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
