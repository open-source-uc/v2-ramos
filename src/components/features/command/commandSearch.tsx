import * as React from "react"
import {
  ArrowUpRightIcon,
  SearchIcon,
  LoadingIcon,
} from "@/components/icons/icons"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useFuseSearch } from "@/components/hooks/useFuseSearch"
import { useCommand } from "@/components/providers/CommandProvider"
import type { Course } from "@/components/table/columns"
import { Pill } from "@/components/ui/pill"

export default function CommandSearch() {
  const { isOpen: open, setIsOpen: setOpen } = useCommand()
  const [courses, setCourses] = React.useState<Course[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)

  React.useEffect(() => {
    if (open && courses.length === 0) {
      fetchCourses()
    }
  }, [open])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("https://public.osuc.dev/courses-score.ndjson")

      if (!response.ok) throw new Error("Network response was not ok")
      if (!response.body) throw new Error("ReadableStream not supported")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.trim()) {
            const item = JSON.parse(line)
            setCourses((prev) => [...prev, item])
          }
        }
      }

      if (buffer.trim()) {
        const item = JSON.parse(buffer)
        setCourses((prev) => [...prev, item])
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fuseSearch = useFuseSearch({
    data: courses,
    keys: ['name', 'sigle'],
    threshold: 0.3,
    minMatchCharLength: 1,
  });

  const filteredCourses = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    
    return fuseSearch(searchQuery).slice(0, 4) // Limit to 4 courses
  }, [fuseSearch, searchQuery])

  // Add debounced search effect for loading state
  React.useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        setIsSearching(false)
      }, 300) // Show loading for 300ms after user stops typing

      return () => clearTimeout(timer)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Buscar cursos por nombre o sigla..." 
          onValueChange={handleSearchChange}
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
            <CommandGroup heading="Cursos">
              {filteredCourses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={`${course.sigle} ${course.name}`}
                  onSelect={() => {
                    window.location.href = `/${course.sigle}`
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{course.sigle}</span>
                        {course.area && (
                          <Pill variant="pink" size="xs">{course.area}</Pill>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        {course.name}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!searchQuery.trim() && (
            <>
              <CommandGroup heading="Navegación rápida">
                <CommandItem onSelect={() => { window.location.href = "/catalog"; setOpen(false) }}>
                  <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Catálogo de cursos</span>
                </CommandItem>
                <CommandItem onSelect={() => { window.location.href = "/horario"; setOpen(false) }}>
                  <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Horarios</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
  )
}
