import { useState, useEffect, lazy, Suspense } from "react";
import { useCoursesSections } from "@/components/hooks/useCoursesSections";
import {
  createScheduleMatrix,
  detectScheduleConflicts,
  TIME_SLOTS,
  DAYS,
  convertNDJSONToSections,
  applySectionSuggestions,
  shuffleSections,
  getAvailableSections
} from "@/lib/scheduleMatrix";
import { 
  getSavedCourses, 
  saveCourses,
  addCourseToSchedule,
  removeCourseFromSchedule 
} from "@/lib/scheduleStorage";
import type { ScheduleMatrix, CourseSections } from "@/types";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SearchIcon, SelectionIcon, LockClosedIcon, LockOpenIcon, CalendarIcon, CloseIcon, CheckIcon, ShuffleIcon} from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import { getClassTypeLong } from "./ScheduleLegend";
import { Search } from "@/components/features/search/SearchInput";
import { useFuseSearch } from "@/components/hooks/useFuseSearch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const ConflictResolver = lazy(() => import("./ConflictResolver"));
const ScheduleCombinations = lazy(() => import("./ScheduleCombinations"));

// Define color variants for different courses
const COLOR_VARIANTS = [
  "schedule_blue", "schedule_green", "schedule_pink",
  "schedule_purple", "schedule_orange", "schedule_red"
] as const;

// Course option interface
interface CourseOption {
  id: string;
  sigle: string;
  seccion: string;
  nombre: string;
  nrc: string;
}

// Helper to generate course options from fetched data
function getCourseOptions(courses: any[]): CourseOption[] {
  return courses.flatMap((course) => {
    if (!course.sections) return [];
    return Object.keys(course.sections).map((seccion) => ({
      id: `${course.sigle}-${seccion}`,
      sigle: course.sigle,
      seccion,
      nombre: course.name || "Sin nombre",
      nrc: course.sections[seccion].nrc || "N/A"
    }));
  });
}

// Course search and selection component
function CourseSearch({
  onCourseSelect,
  selectedCourses,
  courseOptions,
  isLoading
}: {
  onCourseSelect: (courseId: string) => void;
  selectedCourses: string[];
  courseOptions: CourseOption[];
  isLoading: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fuseSearch = useFuseSearch({
    data: courseOptions,
    keys: ['id', 'nombre', 'sigle'],
    threshold: 0.3,
    minMatchCharLength: 1,
  });

  const filteredOptions = fuseSearch(searchTerm);

  const handleSelect = (courseId: string) => {
    if (!selectedCourses.includes(courseId)) {
      onCourseSelect(courseId);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  return (
    <div className="relative">
      <Search
        onSearch={handleSearch}
        placeholder="Buscar curso (ej: IIC2214, Matemáticas)"
        initialValue={searchTerm}
        useFuzzySearch={true}
      />

      {isLoading ? (
        <div className="absolute z-10 w-full mt-1">
          <div className="bg-background border border-border rounded-lg shadow-lg p-0 text-center py-4 text-muted-foreground">
            Cargando cursos...
          </div>
        </div>
      ) : isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-1">
          <div className="bg-background border border-border rounded-lg shadow-lg p-0">
            <Command>
              <CommandList className="max-h-64">
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  No se encontraron cursos
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.slice(0, 10).map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => handleSelect(option.id)}
                      disabled={selectedCourses.includes(option.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 cursor-pointer",
                        "hover:bg-muted transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          selectedCourses.includes(option.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="font-medium text-foreground">{option.sigle} - {option.nombre}</span>
                        <span className="text-sm text-muted-foreground">Sección {option.seccion}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}

// Schedule grid component
function ScheduleGrid({ 
  matrix, 
  selectedCourses,
  courseSectionsData,
  courseOptions,
  onApplySuggestions
}: { 
  matrix: ScheduleMatrix;
  selectedCourses: string[];
  courseSectionsData: CourseSections;
  courseOptions: CourseOption[];
  onApplySuggestions: (newCourses: string[]) => void;
}) {
  const conflicts = detectScheduleConflicts(matrix);
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[700px] tablet:min-w-[800px] desktop:min-w-[900px]">
          {/* Header */}
          <div className="grid grid-cols-7 bg-muted/50 border-b border-border">
            <div className="p-3 text-sm font-medium text-muted-foreground">
              Horario
            </div>
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-sm font-medium text-center text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {TIME_SLOTS.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-7 border-b border-border hover:bg-muted/25 transition-colors">
              {/* Time label */}
              <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/25">
                {time}
              </div>

              {/* Day columns */}
              {DAYS.map((day, dayIndex) => {
                const classes = matrix[timeIndex][dayIndex];
                const hasConflict = classes.length > 1;
                
                return (
                  <div
                    key={`${day}-${timeIndex}`}
                    className={cn(
                      "p-2 min-h-[60px] tablet:min-h-[70px] flex flex-col gap-1 items-center justify-center",
                      hasConflict && "bg-red-light border-red/20"
                    )}
                  >
                    {classes.map((classInfo, index) => {
                      const courseIndex = selectedCourses.findIndex(c => c === `${classInfo.courseId}-${classInfo.section}`);
                      const colorVariant = COLOR_VARIANTS[courseIndex % COLOR_VARIANTS.length];
                      
                      return (
                        <div
                          key={`${classInfo.courseId}-${classInfo.section}-${index}`}
                          className="w-full"
                        >
                          <Pill
                            variant={colorVariant}
                            size="xs"
                            className="text-[10px] tablet:text-xs px-1.5 py-0.5 w-full justify-center min-w-0"
                          >
                            <div className="text-center">
                              <div className="font-medium">{classInfo.courseId}-{classInfo.section}</div>
                              <div className="text-[9px] tablet:text-[10px] opacity-80">{getClassTypeLong(classInfo.type)}</div>
                            </div>
                          </Pill>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Conflicts warning */}
      {hasConflicts && (
        <div className="p-4 bg-red-light/20 border-t border-red/20">
          <div className="flex flex-col tablet:flex-row tablet:items-center justify-between gap-8 tablet:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-red">
                  Conflictos detectados: {conflicts.length} 
                </span>
                <p className="text-xs text-red/80 mt-1">
                  Hay {conflicts.length} conflicto{conflicts.length > 1 ? 's' : ''} de horario en tu selección
                </p>
              </div>
            </div>
            
            <Suspense fallback={<div className="animate-pulse bg-muted h-8 w-32 rounded"></div>}>
              <ConflictResolver
                selectedCourses={selectedCourses}
                courseSections={courseSectionsData}
                courseOptions={courseOptions}
                onApplySuggestions={onApplySuggestions}
                hasConflicts={hasConflicts}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component
export default function ScheduleCreator() {
  const [locked, setLocked] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(() => getSavedCourses());
  const [isShuffling, setIsShuffling] = useState(false);
  const hookResult = useCoursesSections();
  const courses = Array.isArray(hookResult[0]) ? hookResult[0] : [];
  const isLoading = typeof hookResult[1] === 'boolean' ? hookResult[1] : false;

  // Generate course options from fetched data
  const courseOptions = getCourseOptions(courses);

  // Save to localStorage whenever courses change
  useEffect(() => {
    saveCourses(selectedCourses);
  }, [selectedCourses]);

  // Create schedule matrix from selected courses and fetched data
  // Use convertNDJSONToSections to get the correct structure
  const courseSectionsData = convertNDJSONToSections(courses);
  const scheduleMatrix = createScheduleMatrix(courseSectionsData, selectedCourses);

  // Check if there are courses with multiple sections available for shuffling
  const hasShufflableCourses = selectedCourses.some(courseSelection => {
    const [courseId] = courseSelection.split('-');
    const availableSections = getAvailableSections(courseId, courseSectionsData);
    return availableSections.length > 1;
  });

  const handleCourseSelect = (courseId: string) => {
    if (addCourseToSchedule(courseId)) {
      setSelectedCourses(getSavedCourses());
      toast.success(`${courseId} agregado a tu horario`);
    } else {
      toast.info(`${courseId} ya está en tu horario`);
    }
  };

  const handleCourseRemove = (courseId: string) => {
    if (removeCourseFromSchedule(courseId)) {
      setSelectedCourses(getSavedCourses());
      toast.success(`${courseId} eliminado de tu horario`);
    }
  };

  const handleApplySuggestions = (newCourses: string[]) => {
    setSelectedCourses(newCourses);
    saveCourses(newCourses);
    toast.success("Conflictos resueltos - se han aplicado los cambios de sección");
  };

  const handleShuffleSections = async () => {
    if (selectedCourses.length === 0) return;
    
    // Verificar si hay cursos con múltiples secciones
    const coursesWithMultipleSections = selectedCourses.filter(courseSelection => {
      const [courseId] = courseSelection.split('-');
      const availableSections = getAvailableSections(courseId, courseSectionsData);
      return availableSections.length > 1;
    });
    
    if (coursesWithMultipleSections.length === 0) {
      toast.info("No hay cursos con secciones alternativas para mezclar");
      return;
    }
    
    setIsShuffling(true);
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const shuffledCourses = shuffleSections(selectedCourses, courseSectionsData);
      
      // Verificar si hubo cambios
      const hasChanges = shuffledCourses.some((course, index) => course !== selectedCourses[index]);
      
      if (hasChanges) {
        setSelectedCourses(shuffledCourses);
        saveCourses(shuffledCourses);
        
        // Contar cursos que cambiaron de sección
        const changedCourses = shuffledCourses.filter((course, index) => course !== selectedCourses[index]);
        
        // Verificar si la nueva combinación tiene menos conflictos
        const oldMatrix = createScheduleMatrix(courseSectionsData, selectedCourses);
        const newMatrix = createScheduleMatrix(courseSectionsData, shuffledCourses);
        const oldConflicts = detectScheduleConflicts(oldMatrix).length;
        const newConflicts = detectScheduleConflicts(newMatrix).length;
        
        if (newConflicts < oldConflicts) {
          toast.success(`¡Mezcla exitosa! ${changedCourses.length} curso(s) cambiaron de sección y se redujeron los conflictos`);
        } else if (newConflicts === 0 && oldConflicts > 0) {
          toast.success(`¡Perfecto! ${changedCourses.length} curso(s) cambiaron de sección y no hay conflictos`);
        } else {
          toast.success(`Secciones mezcladas: ${changedCourses.length} curso(s) cambiaron de sección`);
        }
      } else {
        // Incluso si no hubo cambios, mostrar que se ejecutó la mezcla
        toast.info(`Mezcla realizada: las secciones aleatorias coincidieron con las actuales`);
      }
    } finally {
      setIsShuffling(false);
    }
  };

  const getCourseColor = (courseId: string) => {
    const index = selectedCourses.indexOf(courseId);
    return index >= 0 ? COLOR_VARIANTS[index % COLOR_VARIANTS.length] : "schedule_blue";
  };

  const getCourseInfo = (courseId: string) => {
    const option = courseOptions.find(opt => opt.id === courseId);
    return option || { id: courseId, sigle: "", seccion: "", nombre: "Curso no encontrado", nrc: "N/A" };
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Course Search */}
        <div className="mb-8">
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-light text-blue border border-blue/20 rounded-lg">
                <SearchIcon className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Buscar</h2>
                <p className="text-sm text-muted-foreground">
                  Agrega cursos a tu horario usando el buscador
                </p>
              </div>
            </div>

            <CourseSearch
              onCourseSelect={handleCourseSelect}
              selectedCourses={selectedCourses}
              courseOptions={courseOptions}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Selected Courses */}
        {selectedCourses.length > 0 && (
          <div className="mb-8">
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-light text-green border border-green/20 rounded-lg">
                    <SelectionIcon className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Cursos Seleccionados</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''} en tu horario
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleShuffleSections}
                    aria-label="Shuffle sections"
                    variant="ghost_border"
                    size="icon"
                    disabled={!hasShufflableCourses || isShuffling}
                    title={hasShufflableCourses ? "Mezclar secciones al azar" : "No hay secciones alternativas"}
                    className={isShuffling ? "animate-pulse" : "hidden"}
                  >
                    <ShuffleIcon className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      isShuffling && "animate-spin"
                    )} />
                  </Button>
                  <Button
                    onClick={() => setLocked(!locked)}
                    aria-label={locked ? "Unlock courses" : "Lock courses"}
                    variant="ghost_border"
                    size="icon"
                    title={locked ? "Desbloquear cursos" : "Bloquear cursos"}
                  >
                    {locked ? (
                      <LockClosedIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <LockOpenIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCourses.map((courseId) => {
                  const courseInfo = getCourseInfo(courseId);
                  const colorVariant = getCourseColor(courseId);
                  return (
                    <div
                      key={courseId}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm",
                        colorVariant === "schedule_blue" && "bg-blue-light text-blue border-blue/20",
                        colorVariant === "schedule_green" && "bg-green-light text-green border-green/20",
                        colorVariant === "schedule_pink" && "bg-pink-light text-pink border-pink/20",
                        colorVariant === "schedule_purple" && "bg-purple-light text-purple border-purple/20",
                        colorVariant === "schedule_orange" && "bg-orange-light text-orange border-orange/20",
                        colorVariant === "schedule_red" && "bg-red-light text-red border-red/20"
                      )}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium">{courseInfo.sigle} - {courseInfo.nombre}</span>
                        <span className="text-xs opacity-80">Sección {courseInfo.seccion} - NRC {courseInfo.nrc}</span>
                      </div>
                      {!locked && (
                        <button
                          onClick={() => handleCourseRemove(courseId)}
                          className="text-xs bg-background/50 hover:bg-background/80 rounded-full w-5 h-5 flex items-center justify-center transition-colors flex-shrink-0"
                          aria-label={`Eliminar ${courseId}`}
                        >
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Grid */}
        <div className="mb-8">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-light text-orange border border-orange/20 rounded-lg">
                  <CalendarIcon className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Tu Horario</h2>
                  <p className="text-sm text-muted-foreground">
                    Visualiza tu horario semanal
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {selectedCourses.length > 0 ? (
                <ScheduleGrid
                  matrix={scheduleMatrix}
                  selectedCourses={selectedCourses}
                  courseSectionsData={courseSectionsData}
                  courseOptions={courseOptions}
                  onApplySuggestions={handleApplySuggestions}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    No hay cursos seleccionados
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Agrega cursos usando el buscador de arriba para ver tu horario
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Combinations */}
        <Suspense fallback={
          <div className="border border-border rounded-lg p-6">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-48"></div>
                <div className="h-3 bg-muted rounded w-64"></div>
              </div>
            </div>
          </div>
        }>
          <ScheduleCombinations
            selectedCourses={selectedCourses}
            courseSections={courseSectionsData}
            onApplyCombination={handleApplySuggestions}
            className="mb-8"
          />
        </Suspense>

      </div>
    </>
  );
}
