"use client";

import { useState, useMemo, useEffect } from "react"
import { Search } from "../search/SearchInput"
import type { Course } from "../../table/columns"
import { DataTable } from "../../table/data-table"
import { Combobox, type ComboboxOption } from "../../ui/combobox"
import { Skeleton } from "../../ui/skeleton"
import { cn } from "@/lib/utils"

interface SearchableTableDisplayProps {
  initialSearchValue?: string;
}

export function SearchableTableDisplay({ initialSearchValue = "" }: SearchableTableDisplayProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue)
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [selectedCampus, setSelectedCampus] = useState<string>("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
              setCourses((prev) => [...prev, item]);
            }
          }
        }

        // Procesar último fragmento si queda algo
        if (buffer.trim()) {
          const item = JSON.parse(buffer);
          setCourses((prev) => [...prev, item]);
        }
      } catch (error) {
        console.error("Failed to fetch courses as stream:", error);
      } finally {
        setIsLoading(false);
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

  // Get unique campuses from the data
  const uniqueCampuses = useMemo(() => {
    const campuses = courses
      .flatMap((course) => course.campus || course.campus || []) // Handle both field names
      .filter((campus) => campus && campus.trim() !== ""); // Filter out empty strings
    return Array.from(new Set(campuses)).sort();
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

    if (selectedCampus !== "all") {
      filtered = filtered.filter((course) => {
        const campusArray = course.campus || [];
        return campusArray.includes(selectedCampus);
      });
    }

    if (selectedSchool !== "all") {
      filtered = filtered.filter((course) => course.school === selectedSchool);
    }

    return filtered;
  }, [courses, selectedArea, selectedCampus, selectedSchool]);

  const handleSearch = (normalizedValue: string) => {
    setSearchValue(normalizedValue);
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
  };

  const handleCampusChange = (value: string) => {
    setSelectedCampus(value);
  };

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
  };

  return (
    <div className="container mx-auto py-4">
      {isLoading ? (
        <div className="space-y-4">
          {/* Search and Filters Skeleton */}
          <div className="flex flex-col gap-4 items-stretch justify-between tablet:flex-row tablet:items-center">
            <Skeleton className="h-10 w-full tablet:max-w-md" />
            
            <div className="flex flex-col-reverse items-stretch gap-4 w-full tablet:flex-row-reverse tablet:items-center">
              <Skeleton className="h-10 w-full tablet:max-w-[300px]" />
              <Skeleton className="h-10 w-full tablet:max-w-[300px]" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="space-y-3">
            {/* Table Header Skeleton */}
            <div className="flex items-center space-x-4 py-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Table Rows Skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 border-b">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
