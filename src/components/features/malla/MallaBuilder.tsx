'use client';

import { useState, useEffect } from 'react';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent
} from '@/components/ui/kibo-ui/kanban';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { 
  HourglassIcon, 
  PlusIcon, 
  AreaIcon,
  BuildingIcon,
  CalendarIcon 
} from '@/components/icons/icons';
import { cn } from '@/lib/utils';
import { getSavedCourses } from '@/lib/scheduleStorage';
import { CURRENT_SEMESTER, parseSemester, formatSemester } from '@/lib/currentSemester';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CourseSearchCommand } from './CourseSearchCommand';
import type { CourseStaticInfo } from '@/types';
import type { Course } from '@/components/table/columns';

// Course type for the malla
interface MallaCourse {
  id: string;
  name: string;
  column: string; // semester column id
  sigle: string;
  credits: number;
  area?: string;
  school?: string;
  description?: string;
}

// Semester column type
interface SemesterColumn {
  id: string;
  name: string;
  year: number;
  semester: number;
}

// Storage key for malla data
const MALLA_STORAGE_KEY = 'mallaData';

// Malla data type for localStorage
interface MallaData {
  courses: MallaCourse[];
  columns: SemesterColumn[];
}

// Helper function to get course data by sigle
const fetchCourseData = async (sigle: string): Promise<CourseStaticInfo | null> => {
  try {
    const response = await fetch(`/api/course/${sigle}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }
  return null;
};

// Convert course sigle to MallaCourse
const createMallaCourse = (sigle: string, columnId: string): MallaCourse => ({
  id: `course-${sigle}`,
  name: sigle, // Will be updated when data is fetched
  sigle,
  credits: 0, // Will be updated when data is fetched
  column: columnId
});

// Get current semester info
const currentSemesterInfo = parseSemester(CURRENT_SEMESTER);

// Generate initial semester columns (just current semester)
const generateInitialColumns = (): SemesterColumn[] => {
  const currentSemesterName = `${currentSemesterInfo.year} - ${currentSemesterInfo.semesterNumber === 1 ? '1er' : '2do'} Sem`;
  
  return [
    { 
      id: CURRENT_SEMESTER, 
      name: currentSemesterName, 
      year: currentSemesterInfo.year, 
      semester: currentSemesterInfo.semesterNumber 
    }
  ];
};

// Save malla data to localStorage
const saveMallaData = (data: MallaData): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MALLA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving malla data:', error);
  }
};

// Load malla data from localStorage
const loadMallaData = (): MallaData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(MALLA_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading malla data:', error);
    return null;
  }
};

// Course Card Component
const CourseCard = ({ course }: { course: MallaCourse }) => {
  return (
    <KanbanCard
      id={course.id}
      name={course.name}
      className="bg-background hover:bg-muted/50 transition-colors"
    >
      <div className="space-y-3">
        {/* Course header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-mono">{course.sigle}</p>
            <h3 className="font-semibold text-sm leading-tight">{course.name}</h3>
          </div>
          <Pill variant="green" size="sm" icon={HourglassIcon}>
            {course.credits}
          </Pill>
        </div>

        {/* Course description */}
        {course.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Course metadata */}
        <div className="flex flex-wrap gap-1">
          {course.area && (
            <Pill variant="pink" size="xs" icon={AreaIcon}>
              {course.area}
            </Pill>
          )}
          {course.school && (
            <Pill variant="orange" size="xs" icon={BuildingIcon}>
              <span className="truncate max-w-[100px]">{course.school}</span>
            </Pill>
          )}
        </div>
      </div>
    </KanbanCard>
  );
};

// Add Course Button Component
const AddCourseButton = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onAdd}
      className="w-full border-dashed hover:bg-muted/50"
      icon={PlusIcon}
    >
      Agregar Curso
    </Button>
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
  const [courses, setCourses] = useState<MallaCourse[]>([]);
  const [columns, setColumns] = useState<SemesterColumn[]>(generateInitialColumns());
  const [isLoading, setIsLoading] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  // Initialize data on component mount
  useEffect(() => {
    const initializeMalla = async () => {
      setIsLoading(true);
      
      // Try to load saved malla data first
      const savedData = loadMallaData();
      
      if (savedData) {
        setCourses(savedData.courses);
        setColumns(savedData.columns);
      } else {
        // Load courses from schedule storage for current semester
        const savedCourses = getSavedCourses();
        const initialCourses: MallaCourse[] = savedCourses.map(sigle => 
          createMallaCourse(sigle, CURRENT_SEMESTER)
        );
        setCourses(initialCourses);
        
        // Fetch course data for each course
        for (const course of initialCourses) {
          try {
            // For now, we'll use mock data since the API might not be available in client
            // In a real implementation, you'd fetch from an API or use server-side data
            const mockData = {
              name: `Curso ${course.sigle}`,
              credits: 10,
              area: 'General',
              school: 'Escuela de Ingeniería',
              description: `Descripción del curso ${course.sigle}`
            };
            
            setCourses(prev => prev.map(c => 
              c.id === course.id ? {
                ...c,
                name: mockData.name,
                credits: mockData.credits,
                area: mockData.area,
                school: mockData.school,
                description: mockData.description
              } : c
            ));
          } catch (error) {
            console.error(`Error fetching data for course ${course.sigle}:`, error);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    initializeMalla();
  }, []);
  
  // Save data whenever courses or columns change
  useEffect(() => {
    if (!isLoading) {
      saveMallaData({ courses, columns });
    }
  }, [courses, columns, isLoading]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Find the column the item was dropped on
    const targetColumnId = over.id as string;
    
    // Update the course's column
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === active.id 
          ? { ...course, column: targetColumnId }
          : course
      )
    );
  };
  
  const handleAddSemester = () => {
    const lastColumn = columns[columns.length - 1];
    let nextYear = lastColumn.year;
    let nextSemester = lastColumn.semester + 1;
    
    // Handle semester overflow (go to next year)
    if (nextSemester > 2) {
      nextYear += 1;
      nextSemester = 1;
    }
    
    const newColumnId = formatSemester(nextYear, nextSemester);
    const newColumnName = `${nextYear} - ${nextSemester === 1 ? '1er' : '2do'} Sem`;
    
    const newColumn: SemesterColumn = {
      id: newColumnId,
      name: newColumnName,
      year: nextYear,
      semester: nextSemester
    };
    
    setColumns(prev => [...prev, newColumn]);
  };
  
  const handleDeleteColumn = (columnId: string) => {
    // Don't allow deleting if it's the only column
    if (columns.length <= 1) return;
    
    // Move courses from deleted column to the first available column
    const remainingColumns = columns.filter(col => col.id !== columnId);
    const targetColumnId = remainingColumns[0]?.id;
    
    if (targetColumnId) {
      // Move all courses from deleted column to target column
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.column === columnId 
            ? { ...course, column: targetColumnId }
            : course
        )
      );
    }
    
    // Remove the column
    setColumns(remainingColumns);
  };

  const handleAddCourse = (columnId: string) => {
    setSelectedColumnId(columnId);
    setCommandOpen(true);
  };

  const handleCourseSelect = (course: Course) => {
    // Check if course already exists in the malla
    const existingCourse = courses.find(c => c.sigle === course.sigle);
    
    if (existingCourse) {
      // Move existing course to the new column instead of duplicating
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.sigle === course.sigle 
            ? { ...c, column: selectedColumnId }
            : c
        )
      );
    } else {
      // Convert Course to MallaCourse and add to the selected column
      const newCourse: MallaCourse = {
        id: `course-${course.sigle}-${Date.now()}`, // Unique ID
        name: course.name,
        sigle: course.sigle,
        credits: course.credits,
        area: course.area,
        school: course.school,
        description: course.name, // Use course name as description
        column: selectedColumnId
      };

      // Add new course to the selected column
      setCourses(prevCourses => [...prevCourses, newCourse]);
    }
  };

  // Calculate total credits per semester
  const getCreditsForColumn = (columnId: string) => {
    return courses
      .filter(course => course.column === columnId)
      .reduce((total, course) => total + course.credits, 0);
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

  // Show empty state if no courses
  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Add semester button */}
      <div className="flex justify-between items-center">
        <div className="hidden tablet:block"></div>
        <Button
          variant="outline"
          onClick={handleAddSemester}
          icon={CalendarIcon}
          className="w-full tablet:w-auto"
        >
          <span className="tablet:hidden">Agregar Semestre</span>
          <span className="hidden tablet:inline">Agregar Semestre</span>
        </Button>
      </div>
      
      {/* Horizontal scrollable kanban container */}
      <div className="relative border border-border rounded-md overflow-hidden">
        {/* Scroll hint for mobile */}
        {columns.length > 1 && (
          <div className="absolute top-4 right-4 z-10 tablet:hidden">
            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
              Desliza →
            </div>
          </div>
        )}
        <ScrollArea className="w-full">
          <div className="p-4 pb-6">
          <KanbanProvider
            data={courses}
            columns={columns}
            onDataChange={setCourses}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex gap-4 min-h-[600px]",
              // Mobile: single column takes most of screen width
              "w-max",
              // Ensure minimum space for drag and drop
              "px-2"
            )}
          >
            {(column) => (
              <KanbanBoard
                id={column.id}
                className={cn(
                  "min-h-[500px] flex-shrink-0",
                  // Mobile-first: wider columns on small screens
                  "w-[280px] tablet:w-[300px] desktop:w-[320px]"
                )}
              >
                <KanbanHeader className="flex items-center justify-between border-b border-border p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate">{column.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getCreditsForColumn(column.id)} créditos totales
                    </p>
                  </div>
                  {/* Delete column button - only show if more than one column */}
                  {columns.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteColumn(column.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2"
                      aria-label={`Eliminar semestre ${column.name}`}
                    >
                      {/* Placeholder for icon - will be replaced */}
                      ×
                    </Button>
                  )}
                </KanbanHeader>
                
                <KanbanCards id={column.id} className="p-2 space-y-2 min-h-[400px]">
                  {(course) => <CourseCard key={course.id} course={course} />}
                </KanbanCards>
                
                <div className="p-2 border-t border-border">
                  <AddCourseButton onAdd={() => handleAddCourse(column.id)} />
                </div>
              </KanbanBoard>
            )}
          </KanbanProvider>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Summary section */}
      <div className="border border-border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen de la Malla</h2>
        {/* Responsive grid that adjusts based on number of columns */}
        <ScrollArea className="w-full">
          <div className={cn(
            "grid gap-4 pb-2",
            // Mobile-first: 2 columns, then adapt based on number of semesters
            "grid-cols-2",
            columns.length > 2 && "tablet:grid-cols-3",
            columns.length > 3 && "desktop:grid-cols-4",
            columns.length > 4 && "desktop:grid-cols-5"
          )}>
            {columns.map((column) => {
              const credits = getCreditsForColumn(column.id);
              return (
                <div key={column.id} className="text-center min-w-0">
                  <p className="text-sm font-medium truncate">{column.name}</p>
                  <p className="text-lg font-bold text-green-600">{credits}</p>
                  <p className="text-xs text-muted-foreground">créditos</p>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total de créditos planificados:</span>
            <span className="text-xl font-bold">
              {courses.reduce((total, course) => total + course.credits, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Course Search Command Dialog */}
      <CourseSearchCommand
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onCourseSelect={handleCourseSelect}
        columnName={columns.find(col => col.id === selectedColumnId)?.name || ''}
      />
    </div>
  );
};