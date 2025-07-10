import { StarIcon, ChevronDownIcon } from "@/components/icons/icons";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import type { ScheduleMatrix, CourseSections } from "@/types";
import { createScheduleMatrix, TIME_SLOTS, DAYS } from "@/lib/scheduleMatrix";

interface Props {
    sectionIds: string[];
    placeholderSections: CourseSections;
    courseSigle: string;
    className?: string;
}

function ScheduleGrid({ matrix, sectionId }: { matrix: ScheduleMatrix; sectionId: string }) {
    return (
        <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Sección {sectionId}</h3>
                <span className="text-sm text-muted-foreground">Horario</span>
            </div>
            
            {/* Schedule Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[320px]">
                    {/* Header with days */}
                    <div className="grid grid-cols-6 gap-1 mb-2">
                        <div className="text-xs font-medium text-muted-foreground p-1 w-12"></div>
                        {DAYS.map(day => (
                            <div key={day} className="text-xs font-medium text-center text-muted-foreground p-1 min-w-[40px]">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* Time slots and schedule */}
                    {TIME_SLOTS.map((time, timeIndex) => (
                        <div key={time} className="grid grid-cols-6 gap-1 mb-1">
                            {/* Time label */}
                            <div className="text-xs text-muted-foreground p-1 text-right w-12">
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
                                        className={`
                                            text-xs p-1 rounded min-h-[32px] tablet:min-h-[28px] flex items-center justify-center min-w-[40px]
                                            ${hasClass && classInfo
                                                ? classInfo.type === 'CLAS' 
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : classInfo.type === 'LAB'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : classInfo.type === 'AYUD'
                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                : 'bg-gray-50 border border-gray-100'
                                            }
                                        `}
                                    >
                                        {hasClass && classInfo && (
                                            <div className="text-center">
                                                <div className="font-medium text-[10px] tablet:text-xs">
                                                    {classInfo.type}
                                                </div>
                                                {classInfo.classroom && (
                                                    <div className="text-[8px] tablet:text-[10px] opacity-75">
                                                        {classInfo.classroom}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                    <span className="text-muted-foreground">CLAS</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-muted-foreground">LAB</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                    <span className="text-muted-foreground">AYUD</span>
                </div>
            </div>
        </div>
    );
}

interface Props {
    sectionIds: string[];
    placeholderSections: CourseSections;
    courseSigle: string;
    className?: string;
}

export default function SectionsCollapsible({ 
    sectionIds, 
    placeholderSections, 
    courseSigle, 
    className = "" 
}: Props) {
    return (
        <section className={`mt-8 ${className}`}>
            <div className="border border-border rounded-md overflow-hidden">
                <Collapsible>
                    <CollapsibleTrigger className="w-full px-6 py-4 text-left bg-background hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-orange-light text-orange border border-orange/20 rounded-lg flex-shrink-0">
                                <StarIcon className="h-5 w-5 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Secciones Disponibles
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Horarios y ubicaciones de las diferentes secciones del curso
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <span className="text-sm text-muted-foreground">
                                {sectionIds.length} sección{sectionIds.length !== 1 ? 'es' : ''}
                            </span>
                            <span className="text-sm text-muted-foreground hidden tablet:inline">
                                • Click para expandir
                            </span>
                            <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180" />
                        </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="w-full border-t border-border px-6 py-4 bg-muted/20 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
                        {sectionIds.length > 0 ? (
                            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                                {sectionIds.map(sectionId => {
                                    const scheduleMatrix = createScheduleMatrix(
                                        placeholderSections, 
                                        [`${courseSigle}-${sectionId}`]
                                    );
                                    
                                    return (
                                        <ScheduleGrid 
                                            key={sectionId}
                                            matrix={scheduleMatrix}
                                            sectionId={sectionId}
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
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </section>
    );
}
