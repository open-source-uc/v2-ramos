import { parsePrerequisites } from "@/lib/courseReq";
import type { PrerequisiteGroup, PrerequisiteCourse } from "@/types";
import { Pill } from "@/components/ui/pill";
import { DocsIcon, DeceasedIcon, TextureIcon } from "@/components/icons/icons";

interface PrerequisitesDisplayProps {
  prerequisites: PrerequisiteGroup;
  className?: string;
}

export const PrerequisitesDisplay = ({ prerequisites, className = "" }: PrerequisitesDisplayProps) => {

  const hasPrerequisites = (prerequisites.courses?.length ?? 0) > 0 || (prerequisites.groups?.length ?? 0) > 0;

  if (!hasPrerequisites) {
    return (
      <div className={`py-6 ${className}`}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 bg-green-light text-green border border-green/20 rounded-lg">
            <DocsIcon className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Este curso no tiene prerrequisitos específicos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-6 ${className}`}>
      <PrerequisiteGroupComponent group={prerequisites} />
    </div>
  );
};

interface PrerequisiteGroupComponentProps {
  group: PrerequisiteGroup;
  isNested?: boolean;
}

const PrerequisiteGroupComponent = ({ group, isNested = false }: PrerequisiteGroupComponentProps) => {
  const groupLabel = group.type === 'AND' ? 'Debes aprobar todos los cursos de este grupo' : 'Debes aprobar solo uno de los cursos de este grupo';
  
  const renderCourse = (course: PrerequisiteCourse, index: number) => {
    const hasName = course.name && course.name.trim() !== '';
    
    return (
      <div key={`${course.sigle}-${index}`} className="flex items-center gap-3 py-2">
        <Pill 
          icon={!hasName ? DeceasedIcon : course.isCoreq ? TextureIcon : undefined}
          variant={!hasName ? 'ghost_blue' : course.isCoreq ? 'orange' : 'blue'} 
          size="xs"
        >
          {course.sigle}
        </Pill>

        {hasName && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" title={course.name}>
              {course.name}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (subGroup: PrerequisiteGroup, index: number) => (
    <div key={`group-${index}`} className="border border-border rounded-lg p-4 bg-muted/30 my-3">
      <PrerequisiteGroupComponent group={subGroup} isNested={true} />
    </div>
  );

  const courses = group.courses || [];
  const groups = group.groups || [];
  const allItems = [...courses, ...groups];
  
  const renderSeparatorPill = (separatorType: 'AND' | 'OR') => {
    const separatorText = separatorType === 'AND' ? 'Y' : 'O';
    
    return (
      <div className="flex justify-center py-2">
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
          separatorType === 'AND' 
            ? 'bg-blue-light text-blue border-blue/20' 
            : 'bg-green-light text-green border-green/20'
        }`}>
          {separatorText}
        </div>
      </div>
    );
  };

  const hasMultipleItems = allItems.length > 1;

  return (
    <div className={`${isNested ? 'space-y-2' : 'space-y-3'}`}>
      {/* Group header for nested groups */}
      {isNested && hasMultipleItems && (
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className={`w-2 h-2 rounded-full ${group.type === 'AND' ? 'bg-primary' : 'bg-green'}`}></div>
          <span className={`text-sm font-semibold text-muted-foreground`}>
            {groupLabel}
          </span>
        </div>
      )}

      {/* Render courses and groups with separators */}
      <div className="space-y-1">
        {allItems.map((item, index) => {
          const isGroup = 'type' in item;
          const isLast = index === allItems.length - 1;
          
          return (
            <div key={`item-${index}`}>
              {isGroup ? renderGroup(item as PrerequisiteGroup, index) : renderCourse(item as PrerequisiteCourse, index)}
              {!isNested && !isLast && renderSeparatorPill(group.type)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
