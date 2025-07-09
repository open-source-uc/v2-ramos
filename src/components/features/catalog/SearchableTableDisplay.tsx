"use client";

import { useState, useMemo, useEffect } from "react"
import { Search } from "../search/SearchInput"
import type { Course } from "../../table/columns"
import { DataTable } from "../../table/data-table"
import { Combobox, type ComboboxOption } from "../../ui/combobox"
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
        const response = await fetch("https://public.osuc.dev/courses-score.ndjson");

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

  // Convert unique areas to combobox options
  const areaOptions = useMemo((): ComboboxOption[] => {
    const options: ComboboxOption[] = [
      { value: "all", label: "Todos los cursos" }
    ];
    
    uniqueAreas.forEach((area) => {
      options.push({ value: area, label: area });
    });
    
    return options;
  }, [uniqueAreas]);

  // Convert unique schools to combobox options
  const schoolOptions = useMemo((): ComboboxOption[] => {
    const options: ComboboxOption[] = [
      { value: "all", label: "Todas las unidades académicas" }
    ];
    
    uniqueSchools.forEach((school) => {
      options.push({ value: school, label: school });
    });
    
    return options;
  }, [uniqueSchools]);

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
      <div className="flex flex-col gap-4 items-stretch justify-between tablet:flex-row tablet:items-center">
        <Search
          onSearch={handleSearch}
          placeholder="Buscar por nombre o sigla..."
          className="w-full tablet:max-w-md"
          initialValue={initialSearchValue}
        />

        <div className="flex flex-col-reverse items-stretch gap-4 w-full tablet:flex-row-reverse tablet:items-center">
          {/* Area Filter */}
          <Combobox
            options={areaOptions}
            value={selectedArea}
            onValueChange={handleAreaChange}
            placeholder="Áreas de Formación General"
            searchPlaceholder="Buscar área..."
            emptyMessage="No se encontraron áreas."
            className="w-full tablet:max-w-[300px]"
            buttonClassName={cn(
              selectedArea !== "all" &&
              "bg-primary-foreground text-primary border border-primary"
            )}
            aria-label="Filtrar por Área de Formación General"
          />

          {/* School Filter */}
          <Combobox
            options={schoolOptions}
            value={selectedSchool}
            onValueChange={handleSchoolChange}
            placeholder="Facultades"
            searchPlaceholder="Buscar facultad..."
            emptyMessage="No se encontraron facultades."
            className="w-full tablet:max-w-[300px]"
            buttonClassName={cn(
              selectedSchool !== "all" &&
              "bg-primary-foreground text-primary border border-primary"
            )}
            aria-label="Filtrar por Unidad Académica"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={filteredData} externalSearchValue={searchValue} />
    </div>
  );
}
