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

    </div>
  )
}
