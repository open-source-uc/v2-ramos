'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { 
  HourglassIcon, 
  PlusIcon, 
  AreaIcon,
  BuildingIcon,
  CalendarIcon,
  CloseIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  SwapVertIcon
} from '@/components/icons/icons';
import { cn } from '@/lib/utils';
import { formatSemester, isCurrentSemester, isPreviousSemester } from '@/lib/currentSemester';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CourseSearchCommand } from './CourseSearchCommand';
import {
  getSavedMallaData,
  addCourseToSemester,
  addSemester,
  removeSemester,
  moveCourseBetweenSemesters,
  getCreditsForSemester,
  removeCourseFromMalla,
  type MallaCourse,
  type MallaSemester,
  type MallaData
} from '@/lib/mallaStorage';
import type { Course } from '@/components/table/columns';


// Draggable Course Card Component
const CourseCard = ({ 
  course, 
  locked, 
  onDelete, 
  onHover, 
  onHoverEnd,
  isHighlighted = false
}: { 
  course: MallaCourse; 
  locked: boolean; 
  onDelete: (courseId: string) => void;
  onHover: (courseSigle: string) => void;
  onHoverEnd: () => void;
  isHighlighted?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: course.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-colors border rounded-md shadow-sm relative touch-manipulation",
        // Mobile-first: larger padding and better touch targets
        "p-4 tablet:p-3",
        isHighlighted 
          ? "bg-primary/20 border-primary hover:bg-primary/30" 
          : "bg-background hover:bg-muted/50",
        isDragging && "opacity-50"
      )}
      onMouseEnter={() => onHover(course.sigle)}
      onMouseLeave={onHoverEnd}
      onTouchStart={() => onHover(course.sigle)}
      onTouchEnd={onHoverEnd}
    >
      <div className="space-y-3">
        {/* Course header */}
        <div className="flex items-start justify-between gap-3">
          <div 
            className="flex-1 min-w-0 cursor-grab active:cursor-grabbing touch-manipulation"
            {...listeners}
            {...attributes}
          >
            <p className="text-xs text-muted-foreground font-mono">{course.sigle}</p>
            <h3 className="font-semibold text-sm tablet:text-sm leading-tight">{course.name}</h3>
          </div>
          <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
            <Pill variant="green" size="sm" icon={HourglassIcon}>
              {course.credits}
            </Pill>
            {!locked && (
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(course.id);
                }}
                className="h-8 w-8 tablet:h-6 tablet:w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 touch-manipulation"
                aria-label={`Eliminar ${course.sigle}`}
              >
                <CloseIcon className="h-4 w-4 tablet:h-3 tablet:w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Course description - also draggable */}
        {course.description && (
          <div 
            className="cursor-grab active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            <p className="text-xs text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          </div>
        )}

        {/* Course metadata - also draggable */}
        <div 
          className="flex flex-wrap gap-2 cursor-grab active:cursor-grabbing touch-manipulation"
          {...listeners}
          {...attributes}
        >
          {course.area && (
            <Pill variant="pink" size="xs" icon={AreaIcon}>
              {course.area}
            </Pill>
          )}
          {course.school && (
            <Pill variant="orange" size="xs" icon={BuildingIcon}>
              <span className="truncate max-w-[120px] tablet:max-w-[100px]">{course.school}</span>
            </Pill>
          )}
        </div>
      </div>
    </div>
  );
};


// Unified Semester Component that works for both layouts
const SemesterColumn = ({ 
  semester, 
  onAddCourse, 
  onDeleteSemester,
  onToggleVisibility,
  locked,
  onRemoveCourse,
  onCourseHover,
  onCourseHoverEnd,
  highlightedCourses,
  mobileViewMode
}: { 
  semester: MallaSemester; 
  onAddCourse: (semesterId: string) => void;
  onDeleteSemester: (semesterId: string) => void;
  onToggleVisibility: (semesterId: string) => void;
  locked: boolean;
  onRemoveCourse: (courseId: string) => void;
  onCourseHover: (courseSigle: string) => void;
  onCourseHoverEnd: () => void;
  highlightedCourses: Set<string>;
  mobileViewMode?: 'vertical' | 'horizontal';
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: semester.id,
  });

  const isVerticalMobile = mobileViewMode === 'vertical';

  return (
    <div
      className={cn(
        "border rounded-md bg-secondary touch-manipulation",
        isOver && "ring-2 ring-primary",
        // Responsive layout
        isVerticalMobile 
          ? "w-full tablet:w-[300px] desktop:w-[320px] min-h-[200px] tablet:min-h-[500px]" 
          : "min-h-[500px] flex-shrink-0 w-[260px] tablet:w-[280px] desktop:w-[300px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm truncate">{semester.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {getCreditsForSemester(semester.id)} créditos totales
          </p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {/* Hide/Show button for previous semester */}
          {isPreviousSemester(semester.id) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleVisibility(semester.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted ml-2"
              aria-label={`Ocultar semestre ${semester.name}`}
              title="Ocultar semestre anterior"
            >
              ×
            </Button>
          )}
          
          {/* Delete semester button - hide for current semester */}
          {!isCurrentSemester(semester.id) && !isPreviousSemester(semester.id) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteSemester(semester.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label={`Eliminar semestre ${semester.name}`}
            >
              ×
            </Button>
          )}
        </div>
      </div>
      
      {/* Course cards area */}
      <div 
        ref={setNodeRef}
        className={cn(
          "min-h-[120px]",
          isVerticalMobile 
            ? "p-4 space-y-3 tablet:p-2 tablet:space-y-2 tablet:min-h-[400px]"
            : "p-2 space-y-2 min-h-[400px]"
        )}
      >
        {semester.courses.length > 0 ? (
          <div className={cn(
            isVerticalMobile 
              ? "space-y-3 tablet:space-y-2"
              : "space-y-2"
          )}>
            {semester.courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                locked={locked} 
                onDelete={onRemoveCourse} 
                onHover={onCourseHover}
                onHoverEnd={onCourseHoverEnd}
                isHighlighted={highlightedCourses.has(course.sigle)}
              />
            ))}
          </div>
        ) : (
          /* Empty state hint */
          <div className={cn(
            "flex-1 flex items-center justify-center text-center",
            isVerticalMobile ? "p-6 tablet:p-8" : "p-8"
          )}>
            <div className="text-muted-foreground">
              <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className={cn(
                isVerticalMobile ? "text-sm tablet:text-xs" : "text-xs"
              )}>
                {isVerticalMobile ? "Toca el botón + para agregar cursos" : "Arrastra cursos aquí o usa el botón para agregar"}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Add course button */}
      <div className="p-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddCourse(semester.id)}
          className="w-full border-dashed hover:bg-muted/50"
          icon={PlusIcon}
        >
          Agregar Curso
        </Button>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => {
  return (
    <div className="border border-dashed border-border rounded-md p-8 text-center">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No tienes cursos en tu horario</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Ve al <a href="/horario" className="text-primary hover:underline">creador de horarios</a> para 
        agregar cursos a tu semestre actual, luego regresa aquí para planificar tu malla.
      </p>
      <Button
        variant="outline"
        href="/catalog"
        icon={PlusIcon}
      >
        Explorar Cursos
      </Button>
    </div>
  );
};

export const MallaBuilder = () => {
  const [mallaData, setMallaData] = useState<MallaData>({ semesters: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [draggedCourse, setDraggedCourse] = useState<MallaCourse | null>(null);
  const [locked, setLocked] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [highlightedCourses, setHighlightedCourses] = useState<Set<string>>(new Set());
  const [hiddenSemesters, setHiddenSemesters] = useState<Set<string>>(new Set());
  const [mobileViewMode, setMobileViewMode] = useState<'horizontal' | 'vertical'>('vertical');

  // Initialize data on component mount
  useEffect(() => {
    const initializeMalla = async () => {
      setIsLoading(true);
      
      try {
        // Load saved malla data
        let savedData = getSavedMallaData();
        
        // Malla starts empty - users add courses manually through the interface
        
        setMallaData(savedData);
      } catch (error) {
        console.error('Error initializing malla:', error);
        // Fallback to empty state
        const fallbackData = getSavedMallaData();
        setMallaData(fallbackData);
      }
      
      setIsLoading(false);
    };
    
    initializeMalla();
  }, []);
  
  // Handle drag and drop
  const handleDragStart = (event: any) => {
    const courseId = event.active.id;
    // Find the course being dragged
    for (const semester of mallaData.semesters) {
      const course = semester.courses.find(c => c.id === courseId);
      if (course) {
        setDraggedCourse(course);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedCourse(null);
    
    if (!over) return;
    
    const courseId = active.id as string;
    const targetSemesterId = over.id as string;
    
    // Move course between semesters
    if (moveCourseBetweenSemesters(courseId, targetSemesterId)) {
      setMallaData(getSavedMallaData());
    }
  };
  
  const handleAddSemester = () => {
    const lastSemester = mallaData.semesters[mallaData.semesters.length - 1];
    let nextYear = lastSemester.year;
    let nextSemester = lastSemester.semester + 1;
    
    // Handle semester overflow (go to next year)
    if (nextSemester > 2) {
      nextYear += 1;
      nextSemester = 1;
    }
    
    const newSemesterId = formatSemester(nextYear, nextSemester);
    const newSemesterName = `${nextYear} - ${nextSemester === 1 ? '1er' : '2do'} Sem`;
    
    const newSemester: MallaSemester = {
      id: newSemesterId,
      name: newSemesterName,
      year: nextYear,
      semester: nextSemester,
      courses: []
    };
    
    if (addSemester(newSemester)) {
      setMallaData(getSavedMallaData());
    }
  };
  
  const handleDeleteSemester = (semesterId: string) => {
    if (mallaData.semesters.length <= 1) return; // Don't delete last semester
    if (isCurrentSemester(semesterId)) return; // Don't delete current semester
    
    if (removeSemester(semesterId)) {
      setMallaData(getSavedMallaData());
    }
  };

  const handleAddCourse = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
    setCommandOpen(true);
  };

  const handleCourseSelect = (course: Course) => {
    const newCourse: MallaCourse = {
      id: `course-${course.sigle}-${Date.now()}`,
      name: course.name,
      sigle: course.sigle,
      credits: course.credits,
      area: course.area,
      school: course.school,
      description: course.name
    };
    
    // Add course to selected semester
    if (addCourseToSemester(newCourse, selectedSemesterId)) {
      setMallaData(getSavedMallaData());
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    if (removeCourseFromMalla(courseId)) {
      setMallaData(getSavedMallaData());
    }
  };

  const handleToggleSemesterVisibility = (semesterId: string) => {
    setHiddenSemesters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(semesterId)) {
        newSet.delete(semesterId);
      } else {
        newSet.add(semesterId);
      }
      return newSet;
    });
  };

  const handleCourseHover = async (courseSigle: string) => {
    setHoveredCourse(courseSigle);
    try {
      const response = await fetch(`/api/course-dependencies?sigle=${encodeURIComponent(courseSigle)}`);
      if (response.ok) {
        const data: { dependencies: string[] } = await response.json();
        const dependencyList = data.dependencies || [];
        setPrerequisites(dependencyList);
        
        // Find which prerequisite courses are present in the malla and highlight them
        const coursesToHighlight = findCoursesInMalla(dependencyList);
        setHighlightedCourses(coursesToHighlight);
      } else {
        console.error('Failed to fetch prerequisites');
        setPrerequisites([]);
        setHighlightedCourses(new Set());
      }
    } catch (error) {
      console.error('Error fetching prerequisites:', error);
      setPrerequisites([]);
      setHighlightedCourses(new Set());
    }
  };

  const handleCourseHoverEnd = () => {
    setHoveredCourse(null);
    setPrerequisites([]);
    setHighlightedCourses(new Set());
  };

  // Helper function to find courses in malla that match prerequisites
  const findCoursesInMalla = (prerequisiteSigles: string[]): Set<string> => {
    const coursesInMalla = new Set<string>();
    
    // Go through all semesters and courses to find matches
    mallaData.semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (prerequisiteSigles.includes(course.sigle)) {
          coursesInMalla.add(course.sigle);
        }
      });
    });
    
    return coursesInMalla;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu malla...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no courses in any semester
  const totalCourses = mallaData.semesters.reduce((total, semester) => total + semester.courses.length, 0);
  if (totalCourses === 0) {
    return <EmptyState />;
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setLocked(!locked)}
              variant="ghost_border"
              size="icon"
              aria-label={locked ? "Desbloquear cursos" : "Bloquear cursos"}
            >
              {locked ? (
                <LockClosedIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <LockOpenIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            {/* Mobile view toggle */}
            <Button
              onClick={() => setMobileViewMode(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
              variant="ghost_border"
              size="icon"
              className="tablet:hidden"
              aria-label="Cambiar vista"
              title={mobileViewMode === 'vertical' ? 'Cambiar a vista horizontal' : 'Cambiar a vista vertical'}
            >
              <SwapVertIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={handleAddSemester}
            icon={CalendarIcon}
            className="flex-shrink-0"
          >
            <span className="tablet:hidden">Nuevo</span>
            <span className="hidden tablet:inline">Agregar Semestre</span>
          </Button>
        </div>
        
        {/* Hidden semesters indicator */}
        {hiddenSemesters.size > 0 && (
          <div className="border border-dashed border-border rounded-md p-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {hiddenSemesters.size} semestre{hiddenSemesters.size > 1 ? 's' : ''} oculto{hiddenSemesters.size > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex gap-2">
                {Array.from(hiddenSemesters).map(semesterId => {
                  const semester = mallaData.semesters.find(s => s.id === semesterId);
                  return semester ? (
                    <Button
                      key={semesterId}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleSemesterVisibility(semesterId)}
                      className="h-7 px-2 text-xs"
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      {semester.name}
                    </Button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Semester container */}
        <div className="relative border border-border rounded-md overflow-hidden">
          {/* Scroll hint for mobile horizontal */}
          {mobileViewMode === 'horizontal' && mallaData.semesters.length > 1 && (
            <div className="absolute top-4 right-4 z-10 tablet:hidden">
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                Desliza →
              </div>
            </div>
          )}
          
          {/* Mobile vertical layout */}
          {mobileViewMode === 'vertical' && (
            <div className="tablet:hidden">
              <div className="p-4 space-y-4">
                {mallaData.semesters
                  .filter(semester => !hiddenSemesters.has(semester.id))
                  .map((semester) => (
                    <SemesterColumn
                      key={semester.id}
                      semester={semester}
                      onAddCourse={handleAddCourse}
                      onDeleteSemester={handleDeleteSemester}
                      onToggleVisibility={handleToggleSemesterVisibility}
                      locked={locked}
                      onRemoveCourse={handleRemoveCourse}
                      onCourseHover={handleCourseHover}
                      onCourseHoverEnd={handleCourseHoverEnd}
                      highlightedCourses={highlightedCourses}
                      mobileViewMode={mobileViewMode}
                    />
                  ))}
              </div>
            </div>
          )}
          
          {/* Horizontal layout for mobile horizontal mode and desktop */}
          <div className={cn(
            mobileViewMode === 'horizontal' ? "tablet:hidden" : "hidden tablet:block"
          )}>
              <ScrollArea className="w-full">
                <div className="p-4 pb-6 w-fit">
                  <div className="flex gap-3 min-h-[600px]">
                    {mallaData.semesters
                      .filter(semester => !hiddenSemesters.has(semester.id))
                      .map((semester) => (
                        <SemesterColumn
                          key={semester.id}
                          semester={semester}
                          onAddCourse={handleAddCourse}
                          onDeleteSemester={handleDeleteSemester}
                          onToggleVisibility={handleToggleSemesterVisibility}
                          locked={locked}
                          onRemoveCourse={handleRemoveCourse}
                          onCourseHover={handleCourseHover}
                          onCourseHoverEnd={handleCourseHoverEnd}
                          highlightedCourses={highlightedCourses}
                          mobileViewMode={mobileViewMode}
                        />
                      ))}
                  </div>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
        </div>

        {/* Prerequisites display - enhanced for mobile */}
        {hoveredCourse && (
          <div className="border border-border rounded-md p-3 tablet:p-4 bg-muted/30">
            <h3 className="font-semibold text-sm tablet:text-sm mb-2">
              Prerrequisitos de {hoveredCourse}:
            </h3>
            {prerequisites.length > 0 ? (
              <div className="text-sm text-muted-foreground">
                <p className="mb-3 tablet:mb-2">Este curso depende de los siguientes cursos:</p>
                <div className="grid grid-cols-2 tablet:flex tablet:flex-wrap gap-2">
                  {prerequisites.map((prereq) => (
                    <span 
                      key={prereq} 
                      className="bg-background border rounded px-2 py-1 text-xs font-mono text-center tablet:text-left"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este curso no tiene prerrequisitos.
              </p>
            )}
          </div>
        )}

        {/* Summary section */}
        <div className="border border-border rounded-md p-4 tablet:p-6">
          <h2 className="text-lg tablet:text-xl font-semibold mb-4">Resumen de la Malla</h2>
          {/* Responsive grid that adjusts based on number of semesters */}
          <ScrollArea className="w-full">
            <div className={cn(
              "grid gap-3 tablet:gap-4 pb-2",
              // Mobile-first: 2 columns, then adapt based on number of semesters
              "grid-cols-2",
              mallaData.semesters.length > 2 && "tablet:grid-cols-3",
              mallaData.semesters.length > 3 && "desktop:grid-cols-4",
              mallaData.semesters.length > 4 && "desktop:grid-cols-5"
            )}>
              {mallaData.semesters
                .filter(semester => !hiddenSemesters.has(semester.id))
                .map((semester) => {
                const credits = getCreditsForSemester(semester.id);
                return (
                  <div key={semester.id} className="text-center min-w-0 p-2 tablet:p-0">
                    <p className="text-xs tablet:text-sm font-medium truncate">{semester.name}</p>
                    <p className="text-xl tablet:text-lg font-bold text-green-600">{credits}</p>
                    <p className="text-xs text-muted-foreground">créditos</p>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-col tablet:flex-row tablet:justify-between tablet:items-center gap-2">
              <span className="text-sm font-medium">Total de créditos planificados:</span>
              <span className="text-2xl tablet:text-xl font-bold">
                {mallaData.semesters
                  .filter(semester => !hiddenSemesters.has(semester.id))
                  .reduce((total, semester) => 
                  total + semester.courses.reduce((semTotal, course) => semTotal + course.credits, 0), 0
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Course Search Command Dialog */}
        <CourseSearchCommand
          open={commandOpen}
          onOpenChange={setCommandOpen}
          onCourseSelect={handleCourseSelect}
          columnName={mallaData.semesters.find(s => s.id === selectedSemesterId)?.name || ''}
        />
      </div>
      
      {/* Drag overlay */}
      <DragOverlay>
        {draggedCourse && (
          <CourseCard 
            course={draggedCourse} 
            locked={locked} 
            onDelete={handleRemoveCourse} 
            onHover={handleCourseHover}
            onHoverEnd={handleCourseHoverEnd}
            isHighlighted={highlightedCourses.has(draggedCourse.sigle)}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};