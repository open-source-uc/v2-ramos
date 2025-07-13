'use client';

import * as React from "react";
import {
  SearchIcon,
  LoadingIcon,
  PlusIcon
} from "@/components/icons/icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { normalizeSearchText } from "@/components/features/search/SearchInput";
import type { Course } from "@/components/table/columns";
import { Pill } from "@/components/ui/pill";

interface CourseSearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseSelect: (course: Course) => void;
  columnName: string;
}

export function CourseSearchCommand({ 
  open, 
  onOpenChange, 
  onCourseSelect, 
  columnName 
}: CourseSearchCommandProps) {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    if (open && courses.length === 0) {
      fetchCourses();
    }
  }, [open]);

  const fetchCourses = async () => {
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
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            const item = JSON.parse(line);
            setCourses((prev) => [...prev, item]);
          }
        }
      }

      if (buffer.trim()) {
        const item = JSON.parse(buffer);
        setCourses((prev) => [...prev, item]);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const normalizedQuery = normalizeSearchText(searchQuery);
    
    return courses
      .filter((course) => {
        const normalizedSigle = normalizeSearchText(course.sigle || "");
        const normalizedName = normalizeSearchText(course.name || "");
        
        return (
          normalizedSigle.includes(normalizedQuery) ||
          normalizedName.includes(normalizedQuery)
        );
      })
      .slice(0, 8); // Show more results for selection
  }, [courses, searchQuery]);

  // Add debounced search effect for loading state
  React.useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCourseSelect = (course: Course) => {
    onCourseSelect(course);
    onOpenChange(false);
    setSearchQuery(""); // Reset search
  };

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title={`Agregar curso a ${columnName}`}
      description="Busca y selecciona un curso para agregar al semestre"
    >
      <CommandInput 
        placeholder="Buscar cursos por nombre o sigla..." 
        onValueChange={handleSearchChange}
        value={searchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {isLoading 
            ? "Cargando cursos..." 
            : searchQuery.trim()
              ? "No se encontraron cursos."
              : "Escribe para buscar cursos."
          }
        </CommandEmpty>
        
        {searchQuery.trim() && filteredCourses.length > 0 && (
          <CommandGroup heading={`Agregar a ${columnName}`}>
            {filteredCourses.map((course) => (
              <CommandItem
                key={course.id}
                value={`${course.sigle} ${course.name}`}
                onSelect={() => handleCourseSelect(course)}
              >
                <div className="flex items-center gap-3 w-full">
                  <PlusIcon className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{course.sigle}</span>
                      <Pill variant="green" size="xs">
                        {course.credits} créditos
                      </Pill>
                      {course.area && (
                        <Pill variant="pink" size="xs">{course.area}</Pill>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {course.name}
                    </span>
                    {course.school && (
                      <span className="text-xs text-muted-foreground/70 truncate">
                        {course.school}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!searchQuery.trim() && !isLoading && (
          <CommandGroup heading="Sugerencia">
            <CommandItem disabled>
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Escribe el nombre o sigla del curso que deseas agregar
              </span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}