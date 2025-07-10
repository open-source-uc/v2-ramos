import { useState, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon, PlusIcon } from "@/components/icons/icons";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { ScheduleMatrix, CourseSections } from "@/types";
import { createScheduleMatrix, TIME_SLOTS, DAYS, convertCourseDataToSections } from "@/lib/scheduleMatrix";
import { addCourseToSchedule, isCourseInSchedule } from "@/lib/scheduleStorage";
import { ScheduleLegend, getClassTypeColor, getClassTypeShort } from "./schedules/ScheduleLegend";
import cursosJSON from "2025-1.json";

interface Props {
    sectionIds: string[];
    placeholderSections: CourseSections;
    courseSigle: string;
    className?: string;
}

function ScheduleGrid({ matrix, sectionId, courseSigle, onAddToSchedule }: { 
  matrix: ScheduleMatrix; 
  sectionId: string;
  courseSigle: string;
  onAddToSchedule: (courseId: string, success: boolean) => void;
}) {
    const [isInSchedule, setIsInSchedule] = useState(false);
    const courseId = `${courseSigle}-${sectionId}`;
    
    useEffect(() => {
        setIsInSchedule(isCourseInSchedule(courseId));
    }, [courseId]);

    const handleAddToSchedule = () => {
        const success = addCourseToSchedule(courseId);
        if (success) {
            setIsInSchedule(true);
        }
        onAddToSchedule(courseId, success);
    };

    return (
        <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Sección {sectionId}</h3>
                <Button
                    variant={isInSchedule ? "outline" : "ghost_blue"}
                    size="xs"
                    onClick={handleAddToSchedule}
                    disabled={isInSchedule}
                    icon={PlusIcon}
                >
                    {isInSchedule ? "En mi horario" : "Agregar"}
                </Button>
            </div>
            
            {/* Minimalist Schedule Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[320px]">
                    {/* Header with days */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        <div className="w-10"></div>
                        {DAYS.map(day => (
                            <div key={day} className="text-xs font-medium text-center text-muted-foreground p-1">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* Time slots - always start from 08:20, then show consecutive slots with classes */}
                    {TIME_SLOTS.map((time, timeIndex) => {
                        // Always show from 08:20 onwards if there are any classes in this time slot or later
                        const hasClassFromThisTimeOnwards = TIME_SLOTS.slice(timeIndex).some((_, futureIndex) =>
                            DAYS.some((_, dayIndex) => matrix[timeIndex + futureIndex] && matrix[timeIndex + futureIndex][dayIndex].length > 0)
                        );
                        
                        // Only show if we're at 08:20 or later AND there are classes from this time onwards
                        if (timeIndex === 0 || hasClassFromThisTimeOnwards) {
                            return (
                                <div key={time} className="grid grid-cols-7 gap-1 mb-1">
                                    {/* Time label */}
                                    <div className="text-xs text-muted-foreground p-1 text-right w-10">
                                        {time}
                                    </div>
                                    
                                    {/* Day columns */}
                                    {DAYS.map((day, dayIndex) => {
                                        const classes = matrix[timeIndex][dayIndex];
                                        const hasClass = classes.length > 0;
                                        const classInfo = hasClass ? classes[0] : null;
                                        
                                        return (
                                            <div
                                                key={`${day}-${timeIndex}`}
                                                className="flex items-center justify-center min-h-[32px] p-1"
                                            >
                                                {hasClass && classInfo && (
                                                    <Pill
                                                        variant={getClassTypeColor(classInfo.type)}
                                                        size="xs"
                                                        className="text-[10px] px-1 py-0.5 min-w-0"
                                                    >
                                                        {getClassTypeShort(classInfo.type)}
                                                    </Pill>
                                                )}
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

interface SectionsCollapsibleProps {
    courseSigle: string;
    className?: string;
}

export default function SectionsCollapsible({ 
    courseSigle, 
    className = "" 
}: SectionsCollapsibleProps) {
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Get real course data from the JSON
    const courseData = (cursosJSON as any)[courseSigle];
    const sections = courseData?.sections || {};
    const sectionIds = Object.keys(sections);
    
    // Convert to the format expected by createScheduleMatrix
    const courseSectionsData = convertCourseDataToSections(cursosJSON);

    // Extract unique class types present in this course's sections
    const getClassTypesInSections = (): string[] => {
        const classTypes = new Set<string>();
        
        Object.values(sections).forEach((section: any) => {
            if (section.schedule) {
                Object.values(section.schedule).forEach((timeSlot: any) => {
                    if (Array.isArray(timeSlot) && timeSlot.length > 0) {
                        classTypes.add(timeSlot[0]);
                    }
                });
            }
        });
        
        return Array.from(classTypes).sort();
    };

    const availableClassTypes = getClassTypesInSections();

    const handleAddToSchedule = (courseId: string, success: boolean) => {
        if (success) {
            toast.success(`${courseId} agregado a tu horario`);
        } else {
            toast.info(`${courseId} ya está en tu horario`);
        }
        // Force re-render to update button states
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <section className={`${className}`}>
                <div className="border border-border rounded-md overflow-hidden">
                <Collapsible>
                    <CollapsibleTrigger className="w-full px-6 py-4 text-left bg-background hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-orange-light text-orange border border-orange/20 rounded-lg flex-shrink-0">
                                <CalendarIcon className="h-5 w-5 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Secciones
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Conoce los horarios de las diferentes secciones del curso
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <span className="text-sm text-muted-foreground hidden tablet:inline">
                                Expandir
                            </span>
                            <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180" />
                        </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="w-full border-t border-border px-6 py-4 bg-muted/20 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
                        {sectionIds.length > 0 ? (
                            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                                {sectionIds.map(sectionId => {
                                    const scheduleMatrix = createScheduleMatrix(
                                        courseSectionsData, 
                                        [`${courseSigle}-${sectionId}`]
                                    );
                                    
                                    return (
                                        <ScheduleGrid 
                                            key={`${sectionId}-${refreshKey}`}
                                            matrix={scheduleMatrix}
                                            sectionId={sectionId}
                                            courseSigle={courseSigle}
                                            onAddToSchedule={handleAddToSchedule}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    No hay secciones disponibles para este semestre.
                                </p>
                            </div>
                        )}
                        
                        {/* Legend */}
                        {availableClassTypes.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-border">
                                <ScheduleLegend 
                                    classTypes={availableClassTypes}
                                    compact={true}
                                    useShortNames={true}
                                    className="text-xs"
                                />
                            </div>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </section>
        <Toaster />
    </>);
}
