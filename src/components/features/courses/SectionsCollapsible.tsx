import { useState, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon, PlusIcon, BuildingIcon, LinkIcon, CategoryIcon, AttendanceIcon } from "@/components/icons/icons";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ScheduleMatrix, CourseSections } from "@/types";
import { createScheduleMatrix, TIME_SLOTS, DAYS, convertNDJSONToSections } from "@/lib/scheduleMatrix";
import { addCourseToSchedule, isCourseInSchedule } from "@/lib/scheduleStorage";
import { ScheduleLegend, getClassTypeColor, getClassTypeShort } from "./schedules/ScheduleLegend";
import { useCoursesSections } from "@/components/hooks/useCoursesSections";

interface Props {
    sectionIds: string[];
    placeholderSections: CourseSections;
    courseSigle: string;
    className?: string;
}

function ScheduleGrid({ matrix, sectionId, courseSigle, onAddToSchedule, sectionData }: {
    matrix: ScheduleMatrix;
    sectionId: string;
    courseSigle: string;
    onAddToSchedule: (courseId: string, success: boolean) => void;
    sectionData?: any;
}) {
    const [isInSchedule, setIsInSchedule] = useState(false);
    const courseId = `${courseSigle}-${sectionId}`;

    // Get section data for NRC and campus from NDJSON data
    const nrc = sectionData?.nrc || "Sin NRC";
    const campus = sectionData?.campus || "Sin campus";
    const category = sectionData?.category || "";
    const format = sectionData?.format || "Sin formato";

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

    // Check if there are Saturday classes
    const hasSaturdayClasses = TIME_SLOTS.some((_, timeIndex) =>
        matrix[timeIndex] && matrix[timeIndex][5] && matrix[timeIndex][5].length > 0 // Saturday is index 5
    );

    // Always show weekdays (L-V), add Saturday only if it has classes
    const displayDays = hasSaturdayClasses ? DAYS : DAYS.slice(0, 5); // L-V or L-S

    return (
        <div className="border border-border rounded-lg p-3 tablet:p-4">
            <div className="flex items-center justify-between mb-2 tablet:mb-3">
                <h3 className="text-base tablet:text-lg font-semibold">Sección {sectionId}</h3>
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
            <div className="overflow-x-auto mt-4">
                <div className="min-w-[280px]">
                    {/* Header with days */}
                    <div className={`grid gap-0.5 tablet:gap-1 mb-1 tablet:mb-2`} style={{ gridTemplateColumns: `32px repeat(${displayDays.length}, 1fr)` }}>
                        <div className="w-8 tablet:w-12"></div>
                        {displayDays.map(day => (
                            <div key={day} className="text-[10px] tablet:text-xs font-medium text-center text-muted-foreground px-0.5 tablet:px-1 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Time slots - always start from 08:20, then show consecutive slots with classes */}
                    {TIME_SLOTS.map((time, timeIndex) => {
                        // Always show from 08:20 onwards if there are any classes in this time slot or later
                        const hasClassFromThisTimeOnwards = TIME_SLOTS.slice(timeIndex).some((_, futureIndex) =>
                            displayDays.some((day) => {
                                const dayIndex = DAYS.indexOf(day);
                                return matrix[timeIndex + futureIndex] && matrix[timeIndex + futureIndex][dayIndex] && matrix[timeIndex + futureIndex][dayIndex].length > 0;
                            })
                        );

                        // Only show if we're at 08:20 or later AND there are classes from this time onwards
                        if (timeIndex === 0 || hasClassFromThisTimeOnwards) {
                            return (
                                <div key={time} className={`grid gap-0.5 tablet:gap-1 mb-0.5 tablet:mb-1`} style={{ gridTemplateColumns: `32px repeat(${displayDays.length}, 1fr)` }}>
                                    {/* Time label */}
                                    <div className="text-[10px] tablet:text-xs text-muted-foreground px-0.5 tablet:px-1 py-1 text-right w-8 tablet:w-12">
                                        {time}
                                    </div>

                                    {/* Day columns */}
                                    {displayDays.map((day) => {
                                        const dayIndex = DAYS.indexOf(day);
                                        const classes = matrix[timeIndex][dayIndex];
                                        const hasClass = classes.length > 0;
                                        const classInfo = hasClass ? classes[0] : null;

                                        return (
                                            <div
                                                key={`${day}-${timeIndex}`}
                                                className="flex items-center justify-center min-h-[24px] tablet:min-h-[32px] px-0.5 tablet:px-1 py-1"
                                            >
                                                {hasClass && classInfo && (
                                                    <Pill
                                                        variant={getClassTypeColor(classInfo.type)}
                                                        size="xs"
                                                        className="text-[9px] tablet:text-[10px] px-1 py-0.5 min-w-0 leading-none"
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

            {/* Separator */}
            <div className="border-t border-border mt-3 tablet:mt-4 pt-3 tablet:pt-4">
                {/* Section Info Pills */}
                <div className="flex items-center flex-wrap gap-2">
                    <Pill variant="blue" icon={BuildingIcon} size="sm">
                        {campus}
                    </Pill>
                    <Pill variant="green" icon={LinkIcon} size="sm">
                        NRC {nrc}
                    </Pill>
                    {category && (
                        <Pill variant="purple" icon={CategoryIcon} size="sm">
                            {category}
                        </Pill>
                    )}
                    <Pill variant="orange" icon={AttendanceIcon} size="sm">
                        {format}
                    </Pill>
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
    const [coursesData, isPending] = useCoursesSections()
    
    // Ensure coursesData is an array
    const courses = Array.isArray(coursesData) ? coursesData : [];

    // Find the specific course from NDJSON data
    const courseData = courses.find((course: any) => course.sigle === courseSigle);
    const sections = courseData?.sections || {};
    const sectionIds = Object.keys(sections);

    // Convert to the format expected by createScheduleMatrix
    const courseSectionsData = courses.length > 0 ? convertNDJSONToSections(courses) : {};

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

    // If no sections available and not loading, show non-collapsible message
    if (!isPending && sectionIds.length === 0) {
        return (
            <section className={`${className}`}>
                <div className="border border-border rounded-md p-6 overflow-hidden">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="p-2 bg-muted text-muted-foreground border border-border rounded-lg flex-shrink-0">
                            <CalendarIcon className="h-5 w-5 fill-current" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-semibold">
                                Secciones
                            </h2>
                            <p className="text-sm">
                                No hay secciones disponibles para este semestre
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

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
                            {!isPending && sectionIds.length > 0 ? (
                                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
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
                                                sectionData={sections[sectionId]}
                                            />
                                        );
                                    })}
                                </div>
                            ) : isPending ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        Cargando secciones...
                                    </p>
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
                                        useShortNames={false}
                                        className="text-xs"
                                    />
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </section>
        </>
    );
}
