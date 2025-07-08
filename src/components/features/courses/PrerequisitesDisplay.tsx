import { parsePrerequisites } from "@/lib/courseReq";
import type { PrerequisiteGroup, PrerequisiteCourse } from "@/types";

interface PrerequisitesDisplayProps {
  prerequisites: PrerequisiteGroup;
  className?: string;
}

export const PrerequisitesDisplay = ({ prerequisites, className = "" }: PrerequisitesDisplayProps) => {
  return (
    <div className={`prerequisites-display ${className}`}>
      <PrerequisiteGroupComponent group={prerequisites} />
    </div>
  );
};

interface PrerequisiteGroupComponentProps {
  group: PrerequisiteGroup;
  isNested?: boolean;
}

const PrerequisiteGroupComponent = ({ group, isNested = false }: PrerequisiteGroupComponentProps) => {
  const operatorText = group.type === 'AND' ? 'y' : 'o';
  const operatorColor = group.type === 'AND' ? 'text-blue-600' : 'text-green-600';
  
  const renderCourse = (course: PrerequisiteCourse, index: number, isLast: boolean) => (
    <span key={`${course.sigle}-${index}`} className="inline-flex items-center gap-1 flex-wrap">
      <span className={`font-mono text-sm px-2 py-1 rounded border ${
        course.isCorricular 
          ? 'bg-orange-50 text-orange-800 border-orange-200' 
          : 'bg-blue-50 text-blue-800 border-blue-200'
      }`}>
        {course.sigle}
        {course.isCorricular && (
          <span className="text-orange-600 font-bold ml-1">(c)</span>
        )}
      </span>
      {course.name && (
        <span className="text-muted-foreground text-sm truncate max-w-[200px]" title={course.name}>
          {course.name}
        </span>
      )}
      {!isLast && (
        <span className={`mx-1 font-semibold ${operatorColor}`}>
          {operatorText}
        </span>
      )}
    </span>
  );

  const renderGroup = (subGroup: PrerequisiteGroup, index: number, isLast: boolean) => (
    <span key={`group-${index}`} className="inline-flex items-center gap-1 flex-wrap">
      <span className="inline-flex items-center gap-1 p-2 rounded border border-border bg-muted/30">
        <PrerequisiteGroupComponent group={subGroup} isNested={true} />
      </span>
      {!isLast && (
        <span className={`mx-1 font-semibold ${operatorColor}`}>
          {operatorText}
        </span>
      )}
    </span>
  );

  const courses = group.courses || [];
  const groups = group.groups || [];
  const totalItems = courses.length + groups.length;

  return (
    <div className={`flex flex-wrap items-center gap-1 ${isNested ? '' : 'p-3 bg-background rounded-lg border border-border'}`}>
      {courses.map((course, index) => 
        renderCourse(course, index, index === totalItems - 1)
      )}
      
      {courses.length > 0 && groups.length > 0 && (
        <span className={`mx-1 font-semibold ${operatorColor}`}>
          {operatorText}
        </span>
      )}
      
      {groups.map((subGroup, index) => 
        renderGroup(subGroup, index, courses.length + index === totalItems - 1)
      )}
    </div>
  );
};

// Example usage component
interface CoursePrerequisitesProps {
  req: string;
  courseNames?: Map<string, string>;
}

export const CoursePrerequisites = ({ req, courseNames }: CoursePrerequisitesProps) => {
  // This would typically be done server-side or in a hook
  const parsed = parsePrerequisites(req);
  
  if (!parsed.hasPrerequisites) {
    return (
      <div className="text-gray-500 italic">
        No tiene prerrequisitos
      </div>
    );
  }
  
  if (!parsed.structure) {
    return (
      <div className="text-red-500">
        Error al procesar prerrequisitos
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800">Prerrequisitos:</h3>
      <PrerequisitesDisplay prerequisites={parsed.structure} />
      
      <div className="text-xs text-gray-500 mt-2">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-blue-100 border border-blue-200 rounded"></span>
          Prerrequisito regular
        </span>
        <span className="inline-flex items-center gap-1 ml-4">
          <span className="inline-block w-3 h-3 bg-orange-100 border border-orange-200 rounded"></span>
          Prerrequisito corricular (c)
        </span>
      </div>
    </div>
  );
};
