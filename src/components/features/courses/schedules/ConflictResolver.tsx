import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import {
  findConflictResolution,
  applySectionSuggestions,
  type SectionSuggestion,
  type ConflictResolutionResult
} from "@/lib/scheduleMatrix";
import type { CourseSections } from "@/types";
import { FixIcon, SwapIcon, AlertIcon, CheckIcon } from "@/components/icons/icons";
import { cn } from "@/lib/utils";

interface ConflictResolverProps {
  selectedCourses: string[];
  courseSections: CourseSections;
  courseOptions: Array<{ id: string; sigle: string; nombre: string; seccion: string; nrc: string }>;
  onApplySuggestions: (newCourses: string[]) => void;
  hasConflicts: boolean;
}

export default function ConflictResolver({
  selectedCourses,
  courseSections,
  courseOptions,
  onApplySuggestions,
  hasConflicts
}: ConflictResolverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [resolution, setResolution] = useState<ConflictResolutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAnalyzeConflicts = async () => {
    setIsLoading(true);
    try {
      // Add a small delay to ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = findConflictResolution(selectedCourses, courseSections, courseOptions);
      setResolution(result);
    } catch (error) {
      console.error("Error analyzing conflicts:", error);
      setResolution({
        canResolve: false,
        suggestions: [],
        remainingConflicts: [],
        message: "Error al analizar los conflictos. Por favor, inténtalo de nuevo."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestions = () => {
    if (!resolution || resolution.suggestions.length === 0) return;
    
    const newCourses = applySectionSuggestions(selectedCourses, resolution.suggestions);
    onApplySuggestions(newCourses);
    setIsOpen(false);
    setResolution(null);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    handleAnalyzeConflicts();
  };

  const getSectionInfo = (courseId: string, sectionId: string) => {
    const option = courseOptions.find(opt => opt.id === `${courseId}-${sectionId}`);
    return option || { 
      id: `${courseId}-${sectionId}`, 
      sigle: courseId, 
      nombre: "Curso no encontrado", 
      seccion: sectionId,
      nrc: "N/A"
    };
  };

  if (!hasConflicts || !isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleOpenDialog}
          variant="orange" 
          size="sm"
        >
          <FixIcon className="h-4 w-4 mr-2" />
          Resolver Conflictos
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Resolución de Conflictos de Horario
          </DialogTitle>
          <DialogDescription>
            Analiza automáticamente tus conflictos de horario y encuentra secciones alternativas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-orange border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Analizando conflictos...</p>
              </div>
            </div>
          ) : resolution ? (
            <div className="space-y-4">
              {/* Status Message */}
              <div className={cn(
                "p-4 rounded-lg border flex items-start gap-3",
                resolution.canResolve 
                  ? "bg-green-light border-green/20 text-green"
                  : "bg-red-light border-red/20 text-red"
              )}>
                <div className="mt-0.5">
                  {resolution.canResolve ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <AlertIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {resolution.canResolve ? "¡Solución encontrada!" : "Solución parcial o no disponible"}
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    {resolution.message}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {resolution.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    Cambios Sugeridos ({resolution.suggestions.length})
                  </h4>
                  
                  <div className="space-y-3">
                    {resolution.suggestions.map((suggestion, index) => {
                      const currentInfo = getSectionInfo(suggestion.courseId, suggestion.currentSection);
                      const suggestedInfo = getSectionInfo(suggestion.courseId, suggestion.suggestedSection);
                      
                      return (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-center justify-between gap-4">
                            {/* Current Section */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground mb-1">
                                {currentInfo.sigle} - {suggestion.courseName || currentInfo.nombre}
                              </p>
                              <div className="flex items-center gap-2">
                                <Pill variant="schedule_red" size="xs" className="text-xs">
                                  Actual: Sección {currentInfo.seccion}
                                </Pill>
                                <span className="text-xs text-muted-foreground">
                                  NRC {currentInfo.nrc}
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0">
                              <SwapIcon className="h-4 w-4 text-muted-foreground" />
                            </div>

                            {/* Suggested Section */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground mb-1">
                                Cambiar a:
                              </p>
                              <div className="flex items-center gap-2">
                                <Pill variant="schedule_green" size="xs" className="text-xs">
                                  Sección {suggestedInfo.seccion}
                                </Pill>
                                <span className="text-xs text-muted-foreground">
                                  NRC {suggestedInfo.nrc}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Remaining Conflicts Warning */}
              {resolution.remainingConflicts.length > 0 && (
                <div className="p-3 bg-yellow-light border border-yellow/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertIcon className="h-4 w-4 text-yellow mt-0.5" />
                    <div className="text-sm text-yellow">
                      <p className="font-medium">Conflictos restantes</p>
                      <p className="text-xs mt-1 opacity-90">
                        Aún quedan {resolution.remainingConflicts.length} conflicto(s) después de aplicar estos cambios.
                        Es posible que necesites eliminar algunos cursos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="ghost_border" 
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          
          {resolution && resolution.suggestions.length > 0 && (
            <Button 
              onClick={handleApplySuggestions}
              variant="green"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Aplicar Cambios
            </Button>
          )}
          
          {resolution && resolution.suggestions.length === 0 && !resolution.canResolve && (
            <Button 
              onClick={() => setIsOpen(false)}
              variant="red"
              className="bg-red text-white hover:bg-red/90"
            >
              Entendido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}