import { parsePrerequisites } from "@/lib/courseReq";
import type { PrerequisiteGroup, PrerequisiteCourse } from "@/types";
import { Pill } from "@/components/ui/pill";

interface PrerequisitesDisplayProps {
  prerequisites: PrerequisiteGroup;
  className?: string;
}

export const PrerequisitesDisplay = ({ prerequisites, className = "" }: PrerequisitesDisplayProps) => {

  const hasPrerequisites = (prerequisites.courses?.length ?? 0) > 0 || (prerequisites.groups?.length ?? 0) > 0;

  if (!hasPrerequisites) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="p-3 bg-muted rounded-lg">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm">
            Este curso no tiene prerrequisitos específicos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background border border-border rounded-lg p-4 ${className}`}>
      <PrerequisiteGroupComponent group={prerequisites} />
    </div>
  );
};

interface PrerequisiteGroupComponentProps {
  group: PrerequisiteGroup;
  isNested?: boolean;
}

const PrerequisiteGroupComponent = ({ group, isNested = false }: PrerequisiteGroupComponentProps) => {
  const groupLabel = group.type === 'AND' ? 'Debes pasar todos estos ramos' : 'Debes pasar uno de estos ramos';
  const groupLabelColor = group.type === 'AND' ? 'text-blue-600' : 'text-green-600';
  
  const renderCourse = (course: PrerequisiteCourse, index: number) => (
    <div key={`${course.sigle}-${index}`} className="flex items-center gap-2">
      <Pill 
        variant={course.isCorricular ? 'orange' : 'blue'} 
        size="sm"
        className="font-mono font-semibold"
      >
        {course.sigle}
      </Pill>
      {course.isCorricular && (
        <Pill variant="orange" size="sm" className="text-xs font-bold">
          CORRICULAR
        </Pill>
      )}
      {course.name && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate" title={course.name}>
            {course.name}
          </p>
        </div>
      )}
    </div>
  );

  const renderGroup = (subGroup: PrerequisiteGroup, index: number) => (
    <div key={`group-${index}`} className="border border-border rounded-lg p-3 bg-muted/30">
      <PrerequisiteGroupComponent group={subGroup} isNested={true} />
    </div>
  );

  const courses = group.courses || [];
  const groups = group.groups || [];
  const hasMultipleItems = courses.length + groups.length > 1;

  return (
    <div className={`space-y-3 ${isNested ? '' : ''}`}>
      {/* Group header with label */}
      {hasMultipleItems && (
        <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${group.type === 'AND' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-muted-foreground">
              {group.type === 'AND' ? 'Todos requeridos' : 'Uno requerido'}
            </span>
          </div>
          <span className={`text-xs font-medium ${groupLabelColor}`}>
            {groupLabel}
          </span>
        </div>
      )}
      
      {/* Courses */}
      <div className="space-y-2">
        {courses.map((course, index) => renderCourse(course, index))}
      </div>
      
      {/* Groups */}
      {groups.length > 0 && (
        <div className="space-y-3">
          {groups.map((subGroup, index) => renderGroup(subGroup, index))}
        </div>
      )}
    </div>
  );
};
