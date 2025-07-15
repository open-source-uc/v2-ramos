import { useState, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon, SwapIcon, CheckIcon } from "@/components/icons/icons";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CourseSections } from "@/types";
import { 
  createScheduleMatrix, 
  TIME_SLOTS, 
  DAYS, 
  detectScheduleConflicts,
  getAvailableSections 
} from "@/lib/scheduleMatrix";
import { getClassTypeColor, getClassTypeShort } from "./ScheduleLegend";
import { cn } from "@/lib/utils";

interface ScheduleCombinationsProps {
  selectedCourses: string[];
  courseSections: CourseSections;
  onApplyCombination: (newCourses: string[]) => void;
  className?: string;
}

interface CombinationInfo {
  courses: string[];
  conflicts: number;
  id: string;
}

// Generate all possible combinations of sections for selected courses
function generateAllCombinations(
  selectedCourses: string[],
  courseSections: CourseSections,
  maxToReturn: number = 12
): CombinationInfo[] {
  if (selectedCourses.length === 0) return [];

  // Get available sections for each course
  const courseOptionsMap: Record<string, string[]> = {};
  selectedCourses.forEach(courseSelection => {
    const [courseId] = courseSelection.split('-');
    const availableSections = getAvailableSections(courseId, courseSections);
    courseOptionsMap[courseId] = availableSections;
  });

  // Generate ALL combinations first (no early termination)
  const combinations: string[][] = [];
  
  function generateRecursive(currentCombination: string[], courseIndex: number) {
    if (courseIndex >= selectedCourses.length) {
      combinations.push([...currentCombination]);
      return;
    }

    const [courseId] = selectedCourses[courseIndex].split('-');
    const availableSections = courseOptionsMap[courseId] || [];

    for (const section of availableSections) {
      currentCombination[courseIndex] = `${courseId}-${section}`;
      generateRecursive(currentCombination, courseIndex + 1);
    }
  }

  generateRecursive(new Array(selectedCourses.length), 0);

  // Calculate conflicts for each combination
  const combinationsWithInfo: CombinationInfo[] = combinations.map((combination, index) => {
    const matrix = createScheduleMatrix(courseSections, combination);
    const conflicts = detectScheduleConflicts(matrix);
    
    return {
      courses: combination,
      conflicts: conflicts.length,
      id: `combo-${index}`
    };
  });

  // Sort by conflicts (best first), then by course order, and take only the best ones
  return combinationsWithInfo
    .sort((a, b) => {
      if (a.conflicts !== b.conflicts) {
        return a.conflicts - b.conflicts;
      }
      return a.courses.join('').localeCompare(b.courses.join(''));
    })
    .slice(0, maxToReturn);
}

function CombinationGrid({ 
  combination, 
  courseSections, 
  onApply, 
  isCurrentCombination,
  index 
}: {
  combination: CombinationInfo;
  courseSections: CourseSections;
  onApply: (courses: string[]) => void;
  isCurrentCombination: boolean;
  index: number;
}) {
  const matrix = createScheduleMatrix(courseSections, combination.courses);
  
  // Check if there are Saturday classes
  const hasSaturdayClasses = TIME_SLOTS.some((_, timeIndex) =>
    matrix[timeIndex] && matrix[timeIndex][5] && matrix[timeIndex][5].length > 0
  );

  const displayDays = hasSaturdayClasses ? DAYS : DAYS.slice(0, 5);

  const handleApply = () => {
    onApply(combination.courses);
    toast.success(`Combinación ${index + 1} aplicada a tu horario`);
  };

  return (
    <div className="border border-border rounded-lg p-3 tablet:p-4">
      <div className="flex items-center justify-between mb-2 tablet:mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm tablet:text-base font-medium">
            Opción {index + 1}
          </h4>
          {combination.conflicts === 0 ? (
            <Pill variant="green" size="xs">Sin conflictos</Pill>
          ) : (
            <Pill variant="red" size="xs">{combination.conflicts} conflicto{combination.conflicts > 1 ? 's' : ''}</Pill>
          )}
        </div>
        
        <Button
          variant={isCurrentCombination ? "outline" : "ghost_blue"}
          size="xs"
          onClick={handleApply}
          disabled={isCurrentCombination}
          icon={isCurrentCombination ? CheckIcon : SwapIcon}
        >
          {isCurrentCombination ? "Actual" : "Aplicar"}
        </Button>
      </div>

      {/* Course sections info */}
      <div className="mb-3 space-y-1">
        {combination.courses.map((courseSelection, idx) => {
          const [courseId, sectionId] = courseSelection.split('-');
          return (
            <div key={idx} className="text-xs text-muted-foreground">
              <span className="font-medium">{courseId}</span> - Sección {sectionId}
            </div>
          );
        })}
      </div>

      {/* Minimalist Schedule Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[280px]">
          {/* Header with days */}
          <div 
            className={`grid gap-0.5 tablet:gap-1 mb-1 tablet:mb-2`} 
            style={{ gridTemplateColumns: `32px repeat(${displayDays.length}, 1fr)` }}
          >
            <div className="w-8 tablet:w-12"></div>
            {displayDays.map(day => (
              <div key={day} className="text-[10px] tablet:text-xs font-medium text-center text-muted-foreground px-0.5 tablet:px-1 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {TIME_SLOTS.map((time, timeIndex) => {
            const hasClassFromThisTimeOnwards = TIME_SLOTS.slice(timeIndex).some((_, futureIndex) =>
              displayDays.some((day) => {
                const dayIndex = DAYS.indexOf(day);
                return matrix[timeIndex + futureIndex] && 
                       matrix[timeIndex + futureIndex][dayIndex] && 
                       matrix[timeIndex + futureIndex][dayIndex].length > 0;
              })
            );

            if (timeIndex === 0 || hasClassFromThisTimeOnwards) {
              return (
                <div 
                  key={time} 
                  className={`grid gap-0.5 tablet:gap-1 mb-0.5 tablet:mb-1`} 
                  style={{ gridTemplateColumns: `40px repeat(${displayDays.length}, 1fr)` }}
                >
                  {/* Time label */}
                  <div className="text-[10px] tablet:text-xs text-muted-foreground px-0.5 tablet:px-1 py-1 text-right w-4">
                    {time}
                  </div>

                  {/* Day columns */}
                  {displayDays.map((day) => {
                    const dayIndex = DAYS.indexOf(day);
                    const classes = matrix[timeIndex][dayIndex];
                    const hasConflict = classes.length > 1;

                    return (
                      <div
                        key={`${day}-${timeIndex}`}
                        className={cn(
                          "flex flex-col items-center justify-center min-h-[24px] tablet:min-h-[32px] px-0.5 tablet:px-1 py-1 gap-0.5",
                          hasConflict && "bg-red-light/30 border border-red/20 rounded"
                        )}
                      >
                        {classes.map((classInfo, classIndex) => (
                          <Pill
                            key={classIndex}
                            variant={getClassTypeColor(classInfo.type)}
                            size="xs"
                            className="text-[8px] tablet:text-[8px] px-1 py-0.5 min-w-0 leading-none"
                          >
                            {getClassTypeShort(classInfo.type)}
                          </Pill>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default function ScheduleCombinations({
  selectedCourses,
  courseSections,
  onApplyCombination,
  className = ""
}: ScheduleCombinationsProps) {
  const [combinations, setCombinations] = useState<CombinationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCourses.length === 0) {
      setCombinations([]);
      return;
    }

    setIsLoading(true);
    
    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      const allCombinations = generateAllCombinations(selectedCourses, courseSections, 12);
      setCombinations(allCombinations);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCourses, courseSections]);

  const handleApplyCombination = (newCourses: string[]) => {
    onApplyCombination(newCourses);
  };

  // Check if current selection matches any combination
  const getCurrentCombinationIndex = () => {
    const currentSorted = [...selectedCourses].sort();
    return combinations.findIndex(combo => 
      combo.courses.length === currentSorted.length &&
      combo.courses.every((course, index) => course === currentSorted[index])
    );
  };

  const currentCombinationIndex = getCurrentCombinationIndex();

  // Don't show if no courses selected
  if (selectedCourses.length === 0) {
    return null;
  }

  // Check if there are multiple sections available
  const hasMultipleSections = selectedCourses.some(courseSelection => {
    const [courseId] = courseSelection.split('-');
    const availableSections = getAvailableSections(courseId, courseSections);
    return availableSections.length > 1;
  });

  if (!hasMultipleSections) {
    return (
      <section className={className}>
        <div className="border border-border rounded-md p-6 overflow-hidden">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 bg-muted text-muted-foreground border border-border rounded-lg flex-shrink-0">
              <CalendarIcon className="h-5 w-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold">
                Combinaciones de Horario
              </h2>
              <p className="text-sm">
                Todos tus cursos tienen una sola sección disponible
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="border border-border rounded-md overflow-hidden">
        <Collapsible>
          <CollapsibleTrigger className="w-full px-6 py-4 text-left bg-background hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-purple-light text-purple border border-purple/20 rounded-lg flex-shrink-0">
                <CalendarIcon className="h-5 w-5 fill-current" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  Combinaciones de Horario
                </h2>
                <p className="text-sm text-muted-foreground">
                  Explora todas las posibles combinaciones de secciones de tus cursos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {combinations.length > 0 && (
                <span className="text-sm text-muted-foreground hidden tablet:inline">
                  {combinations.length} combinaciones
                </span>
              )}
              <span className="text-sm text-muted-foreground hidden tablet:inline">
                Expandir
              </span>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180" />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="w-full border-t border-border px-6 py-4 bg-muted/20 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-purple border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Generando combinaciones...
                </p>
              </div>
            ) : combinations.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Se encontraron <strong>{combinations.length}</strong> combinaciones posibles. 
                  {combinations.filter(c => c.conflicts === 0).length > 0 && (
                    <span className="text-green"> {combinations.filter(c => c.conflicts === 0).length} sin conflictos.</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                  {combinations.map((combination, index) => (
                    <CombinationGrid
                      key={combination.id}
                      combination={combination}
                      courseSections={courseSections}
                      onApply={handleApplyCombination}
                      isCurrentCombination={index === currentCombinationIndex}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No se pudieron generar combinaciones de horario.
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}