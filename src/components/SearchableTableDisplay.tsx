"use client";

import { useState, useMemo, useEffect } from "react"
import { Search } from "./Search"
import type { Course } from "./table/columns"
import { DataTable } from "./table/data-table"
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/lib/utils"
import type { InferEntrySchema, RenderedContent } from "astro:content"

interface SearchableTableDisplayProps {
  initialSearchValue?: string;
}

export function SearchableTableDisplay({ initialSearchValue = "" }: SearchableTableDisplayProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue)
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://public.osuc.dev/courses-score.json");

        if (!response.ok) throw new Error("Network response was not ok");
        if (!response.body) throw new Error("ReadableStream not supported");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // guarda línea incompleta

          for (const line of lines) {
            if (line.trim()) {
              const item = JSON.parse(line);
              setCourses((prev) => [...prev, item]); // si usaste jq -c '.[]'
            }
          }
        }

        // Procesar último fragmento si queda algo
        if (buffer.trim()) {
          const item = JSON.parse(buffer);
          setCourses((prev) => [...prev, item]);
        }
        console.log("Courses fetched successfully:", courses);
      } catch (error) {
        console.error("Failed to fetch courses as stream:", error);
      }
    };

    fetchData();
  }, []);


  // Get unique areas from the data
  const uniqueAreas = useMemo(() => {
    const areas = courses
      .map((course) => course.area)
      .filter((area) => area && area !== "Ninguna"); // Filter out null/undefined and "Ninguna"
    return Array.from(new Set(areas)).sort();
  }, [courses]);

  // Get unique schools from the data
  const uniqueSchools = useMemo(() => {
    const schools = courses
      .map((course) => course.school)
      .filter((school) => school && school.trim() !== ""); // Filter out null/undefined and empty strings
    return Array.from(new Set(schools)).sort();
  }, [courses]);

  // Filter data based on both search and area selection
  const filteredData = useMemo(() => {
    let filtered = courses;

    if (selectedArea !== "all") {
      filtered = filtered.filter((course) => course.area === selectedArea);
    }

    if (selectedSchool !== "all") {
      filtered = filtered.filter((course) => course.school === selectedSchool);
    }

    return filtered;
  }, [courses, selectedArea, selectedSchool]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
  };

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
  };

  return (
    <div className="container mx-auto py-4">
      {/* Search Component */}
      <div className="mb-6 flex flex-col w-full gap-4 items-center justify-between tablet:flex-row">
        <Search
          onSearch={handleSearch}
          placeholder="Buscar por nombre o sigla..."
          className="w-full max-w-md"
          initialValue={initialSearchValue}
        />

        <div className="flex flex-col-reverse items-center gap-4 w-full tablet:flex-row-reverse">
          {/* Area Filter */}
          <Select value={selectedArea} onValueChange={handleAreaChange}>
            <SelectTrigger
              className={cn(
                "w-full tablet:max-w-[300px]",
                selectedArea !== "all" &&
                "bg-primary-foreground text-primary border border-primary"
              )}
            >
              <SelectValue placeholder="Áreas de Formación General" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filtrar por Área de Formación General</SelectLabel>
                <SelectItem value="all">Todos los cursos</SelectItem>
                {uniqueAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* School Filter */}
          <Select value={selectedSchool} onValueChange={handleSchoolChange}>
            <SelectTrigger
              className={cn(
                "w-full tablet:max-w-[300px]",
                selectedSchool !== "all" &&
                "bg-primary-foreground text-primary border border-primary"
              )}
            >
              <SelectValue placeholder="Facultades" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filtrar por Unidad Académica</SelectLabel>
                <SelectItem value="all">
                  Todas las unidades académicas
                </SelectItem>
                {uniqueSchools.map((school) => (
                  <SelectItem key={school} value={school}>
                    {school}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={filteredData} externalSearchValue={searchValue} />
    </div>
  );
}
