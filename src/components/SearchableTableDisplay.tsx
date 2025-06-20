"use client"

import { useState, useMemo } from "react"
import { Search } from "./Search"
import type { Course } from "./table/columns"
import { DataTable } from "./table/data-table"
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface SearchableTableDisplayProps {
  data: Course[]
  initialSearchValue?: string
}

export function SearchableTableDisplay({ data, initialSearchValue = "" }: SearchableTableDisplayProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue)
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")

  // Get unique areas from the data
  const uniqueAreas = useMemo(() => {
    const areas = data
      .map(course => course.area)
      .filter(area => area && area !== "Ninguna") // Filter out null/undefined and "Ninguna"
    return Array.from(new Set(areas)).sort()
  }, [data])

  // Get unique schools from the data
  const uniqueSchools = useMemo(() => {
    const schools = data
      .map(course => course.school)
      .filter(school => school && school.trim() !== "") // Filter out null/undefined and empty strings
    return Array.from(new Set(schools)).sort()
  }, [data])

  // Filter data based on both search and area selection
  const filteredData = useMemo(() => {
    let filtered = data
    
    if (selectedArea !== "all") {
      filtered = filtered.filter(course => course.area === selectedArea)
    }
    
    if (selectedSchool !== "all") {
      filtered = filtered.filter(course => course.school === selectedSchool)
    }
    
    return filtered
  }, [data, selectedArea, selectedSchool])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleAreaChange = (value: string) => {
    setSelectedArea(value)
  }

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value)
  }

  return (
    <div className="container mx-auto py-4">
      <div className="">
        
        {/* Search Component */}
        <div className="mb-6 flex w-full gap-4 items-center justify-between">
          <Search 
            onSearch={handleSearch}
            placeholder="Buscar por nombre o sigla..."
            className="w-full max-w-md"
            initialValue={initialSearchValue}
          />
          
          <div className="flex items-center gap-4">
              {/* School Filter */}
              <Select value={selectedSchool} onValueChange={handleSchoolChange}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Facultades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Filtrar por Facultad</SelectLabel>
                    <SelectItem value="all">Todas las facultades</SelectItem>
                    {uniqueSchools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Area Filter */}
              <Select value={selectedArea} onValueChange={handleAreaChange}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Áreas de Formación General" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Filtrar por Área de Formación General</SelectLabel>
                    <SelectItem value="all">Todas las áreas de formación general</SelectItem>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

          </div>
  
        </div>
      </div>
      
      {/* Data Table */}
      <DataTable data={filteredData} externalSearchValue={searchValue} />

    </div>
  )
}
