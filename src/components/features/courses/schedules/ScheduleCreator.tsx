import { useState, useEffect } from "react";
import cursosJSON from "2025-1.json";
import { 
  createScheduleMatrix, 
  convertCourseDataToSections, 
  detectScheduleConflicts, 
  TIME_SLOTS, 
  DAYS 
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { SearchIcon, PlusIcon, CalendarIcon, CloseIcon } from "@/components/icons/icons";
import { cn } from "@/lib/utils";

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
}

// Convert course data to sections format
const courseSectionsData: CourseSections = convertCourseDataToSections(cursosJSON);

// Generate course options for the dropdown
const courseOptions: CourseOption[] = Object.entries(cursosJSON).flatMap(([sigle, data]) => {
  const courseData = data as any;
  return Object.keys(courseData.sections || {}).map((seccion) => ({
    id: `${sigle}-${seccion}`,
    sigle,
    seccion,
    nombre: courseData.name || "Sin nombre"
  }));
});

// Course search and selection component
function CourseSearch({ 
  onCourseSelect, 
  selectedCourses 
}: { 
  onCourseSelect: (courseId: string) => void;
  selectedCourses: string[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = courseOptions.filter(option =>
    option.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (courseId: string) => {
    if (!selectedCourses.includes(courseId)) {
      onCourseSelect(courseId);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Buscar curso (ej: IIC2214, Matemáticas)"
        />
      </div>
      
      {isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filteredOptions.slice(0, 10).map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={selectedCourses.includes(option.id)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-muted transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">{option.id}</span>
                <span className="text-sm text-muted-foreground truncate">{option.nombre}</span>
              </div>
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No se encontraron cursos
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Schedule grid component
function ScheduleGrid({ 
  matrix, 
  selectedCourses 
}: { 
  matrix: ScheduleMatrix;
  selectedCourses: string[];
}) {
  const conflicts = detectScheduleConflicts(matrix);
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[600px] tablet:min-w-[700px] desktop:min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-6 bg-muted/50 border-b border-border">
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
            <div key={time} className="grid grid-cols-6 border-b border-border hover:bg-muted/25 transition-colors">
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
                      hasConflict && "bg-red-light/30 border-red/20"
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
                              <div className="text-[9px] tablet:text-[10px] opacity-80">{classInfo.type}</div>
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
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red rounded-full"></div>
            <span className="text-sm font-medium text-red">
              Conflictos detectados: {conflicts.length} 
            </span>
          </div>
          <p className="text-xs text-red/80 mt-1">
            Hay {conflicts.length} conflicto{conflicts.length > 1 ? 's' : ''} de horario en tu selección
          </p>
        </div>
      )}
    </div>
  );
}

// Main component
export default function ScheduleCreator() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(() => getSavedCourses());

  // Save to localStorage whenever courses change
  useEffect(() => {
    saveCourses(selectedCourses);
  }, [selectedCourses]);

  // Create schedule matrix from selected courses
  const scheduleMatrix = createScheduleMatrix(courseSectionsData, selectedCourses);

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

  const getCourseColor = (courseId: string) => {
    const index = selectedCourses.indexOf(courseId);
    return index >= 0 ? COLOR_VARIANTS[index % COLOR_VARIANTS.length] : "schedule_blue";
  };

  const getCourseInfo = (courseId: string) => {
    const option = courseOptions.find(opt => opt.id === courseId);
    return option || { id: courseId, sigle: "", seccion: "", nombre: "Curso no encontrado" };
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creador de Horarios</h1>
        <p className="text-muted-foreground">
          Selecciona los cursos y secciones para crear tu horario personalizado
        </p>
      </div>

      {/* Course Search */}
      <div className="mb-8">
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-light text-blue border border-blue/20 rounded-lg">
              <SearchIcon className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Buscar Cursos</h2>
              <p className="text-sm text-muted-foreground">
                Ingresa el código del curso o nombre para agregarlo a tu horario
              </p>
            </div>
          </div>
          
          <CourseSearch 
            onCourseSelect={handleCourseSelect}
            selectedCourses={selectedCourses}
          />
        </div>
      </div>

      {/* Selected Courses */}
      {selectedCourses.length > 0 && (
        <div className="mb-8">
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-light text-green border border-green/20 rounded-lg">
                <CalendarIcon className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Cursos Seleccionados</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''} en tu horario
                </p>
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
                      <span className="font-medium">{courseId}</span>
                      <span className="text-xs opacity-80 truncate max-w-[150px] tablet:max-w-[200px]">
                        {courseInfo.nombre}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCourseRemove(courseId)}
                      className="text-xs bg-background/50 hover:bg-background/80 rounded-full w-5 h-5 flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label={`Eliminar ${courseId}`}
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
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
                  Visualiza tu horario semanal con todos los cursos seleccionados
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {selectedCourses.length > 0 ? (
              <ScheduleGrid 
                matrix={scheduleMatrix}
                selectedCourses={selectedCourses}
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

      {/* Legend */}
      {selectedCourses.length > 0 && (
        <div className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Leyenda</h3>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Pill variant="schedule_blue" size="xs" className="text-[10px]">CLAS</Pill>
              <span className="text-muted-foreground">Cátedra</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Pill variant="schedule_green" size="xs" className="text-[10px]">LAB</Pill>
              <span className="text-muted-foreground">Laboratorio</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Pill variant="schedule_purple" size="xs" className="text-[10px]">AYUD</Pill>
              <span className="text-muted-foreground">Ayudantía</span>
            </div>
          </div>
        </div>
      )}
      </div>
      <Toaster />
    </>
  );
}
