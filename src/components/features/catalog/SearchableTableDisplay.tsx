"use client";

import { useState, useMemo, useEffect } from "react"
import { Search } from "../search/SearchInput"
import type { Course } from "../../table/columns"
import { DataTable } from "../../table/data-table"
import { Combobox, type ComboboxOption } from "../../ui/combobox"
import { Skeleton } from "../../ui/skeleton"
import { Switch } from "../../ui/switch"
import { Button } from "../../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible"
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from "../../icons/icons"
import { cn } from "@/lib/utils"

interface SearchableTableDisplayProps {
  initialSearchValue?: string;
}

export function SearchableTableDisplay({ initialSearchValue = "" }: SearchableTableDisplayProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue)
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [selectedCampus, setSelectedCampus] = useState<string>("all")
  const [showRetirableOnly, setShowRetirableOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
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

  // Convert unique campuses to combobox options
  const campusOptions = useMemo((): ComboboxOption[] => {
    const options: ComboboxOption[] = [
      { value: "all", label: "Todos los campus" }
    ];
    
    uniqueCampuses.forEach((campus) => {
      options.push({ value: campus, label: campus });
    });
    
    return options;
  }, [uniqueCampuses]);

  // Filter data based on all filter criteria
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

    if (showRetirableOnly) {
      filtered = filtered.filter((course) => {
        const retirableArray = course.is_removable || [];
        return retirableArray.some(removable => removable === true);
      });
    }

    return filtered;
  }, [courses, selectedArea, selectedCampus, selectedSchool, showRetirableOnly]);

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

  const handleRetirableToggle = (checked: boolean) => {
    setShowRetirableOnly(checked);
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedArea !== "all") count++;
    if (selectedCampus !== "all") count++;
    if (selectedSchool !== "all") count++;
    if (showRetirableOnly) count++;
    return count;
  }, [selectedArea, selectedCampus, selectedSchool, showRetirableOnly]);

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
          <div className="flex flex-col gap-4 items-stretch justify-between tablet:flex-row tablet:items-center mb-6">
            <Search
              onSearch={handleSearch}
              placeholder="Buscar por nombre o sigla..."
              className="w-full"
              initialValue={initialSearchValue}
            />
          </div>

          {/* Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <div className="border border-border rounded-md mb-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <h3 className="text-md font-semibold">Filtros</h3>
                  {activeFiltersCount > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
                      {activeFiltersCount}
                    </div>
                  )}
                </div>
                {filtersOpen ? (
                  <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="border-t border-border">
                <div className="p-6 space-y-6">
                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4">
                    {/* Campus Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Campus</label>
                      <Combobox
                        options={campusOptions}
                        value={selectedCampus}
                        onValueChange={handleCampusChange}
                        placeholder="Seleccionar campus"
                        searchPlaceholder="Buscar campus..."
                        emptyMessage="No se encontraron campus."
                        className="w-full"
                        buttonClassName={cn(
                          selectedCampus !== "all" &&
                          "bg-primary-foreground text-primary border border-primary"
                        )}
                        aria-label="Filtrar por Campus"
                      />
                    </div>

                    {/* Area Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Área de Formación General</label>
                      <Combobox
                        options={areaOptions}
                        value={selectedArea}
                        onValueChange={handleAreaChange}
                        placeholder="Seleccionar área"
                        searchPlaceholder="Buscar área..."
                        emptyMessage="No se encontraron áreas."
                        className="w-full"
                        buttonClassName={cn(
                          selectedArea !== "all" &&
                          "bg-primary-foreground text-primary border border-primary"
                        )}
                        aria-label="Filtrar por Área de Formación General"
                      />
                    </div>

                    {/* School Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Unidad Académica</label>
                      <Combobox
                        options={schoolOptions}
                        value={selectedSchool}
                        onValueChange={handleSchoolChange}
                        placeholder="Seleccionar unidad"
                        searchPlaceholder="Buscar unidad..."
                        emptyMessage="No se encontraron unidades."
                        className="w-full"
                        buttonClassName={cn(
                          selectedSchool !== "all" &&
                          "bg-primary-foreground text-primary border border-primary"
                        )}
                        aria-label="Filtrar por Unidad Académica"
                      />
                    </div>

                    {/* Retirable Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Solo Cursos Retirables</label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="retirable-filter"
                          checked={showRetirableOnly}
                          onCheckedChange={handleRetirableToggle}
                          aria-label="Mostrar solo cursos retirables"
                        />
                        <label htmlFor="retirable-filter" className="text-sm text-muted-foreground cursor-pointer">
                          {showRetirableOnly ? "Activado" : "Desactivado"}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {activeFiltersCount > 0 && (
                    <div className="pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={CloseIcon}
                        onClick={() => {
                          setSelectedArea("all");
                          setSelectedCampus("all");
                          setSelectedSchool("all");
                          setShowRetirableOnly(false);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Limpiar todos los filtros ({activeFiltersCount})
                      </Button>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Data Table */}
          <DataTable data={filteredData} externalSearchValue={searchValue} />
        </>
      )}
    </div>
  );
}
