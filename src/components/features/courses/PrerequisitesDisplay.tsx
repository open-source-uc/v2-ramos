import { parsePrerequisites } from "@/lib/courseReq";
import type { PrerequisiteGroup, PrerequisiteCourse } from "@/types";
import { Pill } from "@/components/ui/pill";
import { DocsIcon, DeceasedIcon, TextureIcon, OpenInFullIcon} from "@/components/icons/icons";

interface PrerequisitesDisplayProps {
  prerequisites: PrerequisiteGroup;
  className?: string;
}

export const PrerequisitesDisplay = ({ prerequisites, className = "" }: PrerequisitesDisplayProps) => {

  const hasPrerequisites = (prerequisites.courses?.length ?? 0) > 0 || (prerequisites.groups?.length ?? 0) > 0;

  if (!hasPrerequisites) {
    return (
      <div className={`py-6 w-full ${className}`}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 bg-green-light text-green border border-green/20 rounded-lg flex-shrink-0">
            <DocsIcon className="h-5 w-5 fill-current" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              Este curso no tiene prerrequisitos específicos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-6 w-full overflow-hidden ${className}`}>
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
    
    if (!hasName) {
      return (
        <div key={`${course.sigle}-${index}`} className="flex items-center gap-3 py-2 px-3 w-full">
          <Pill 
            icon={DeceasedIcon}
            variant="ghost_blue"
            size="xs"
          >
            {course.sigle}
          </Pill>
        </div>
      );
    }
    
    return (
      <div
        key={`${course.sigle}-${index}`} 
        className="flex items-center justify-between gap-3 py-2 rounded-lg px-3 transition-colors duration-200 hover:bg-muted/50 cursor-pointer group w-full min-w-0"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Pill 
            icon={course.isCoreq ? TextureIcon : undefined}
            variant={course.isCoreq ? 'orange' : 'blue'} 
            size="xs"
            className="flex-shrink-0"
          >
            {course.sigle}
          </Pill>

          <a
            href={`/${course.sigle}`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground text-wrap" title={course.name}>
                  {course.name}
                </p>
              </div>
          </a>
        </div>

        <OpenInFullIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200 flex-shrink-0" />
      </div>
    );
  };

  const renderGroup = (subGroup: PrerequisiteGroup, index: number) => (
    <div key={`group-${index}`} className="border border-border rounded-lg py-4 px-2 bg-muted/30 my-2 w-full overflow-hidden">
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
    <div className={`w-full overflow-hidden ${isNested ? 'space-y-2' : 'space-y-3'}`}>
      {/* Group header for nested groups */}
      {isNested && hasMultipleItems && (
        <div className="flex items-center gap-3 pb-3 px-2 border-b border-border w-full">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${group.type === 'AND' ? 'bg-primary' : 'bg-green'}`}></div>
          <span className={`text-sm font-semibold text-muted-foreground flex-1 min-w-0`}>
            {groupLabel}
          </span>
        </div>
      )}

      {/* Render courses and groups with separators */}
      <div className="space-y-1 w-full">
        {allItems.map((item, index) => {
          const isGroup = 'type' in item;
          const isLast = index === allItems.length - 1;
          
          return (
            <div key={`item-${index}`} className="w-full">
              {isGroup ? renderGroup(item as PrerequisiteGroup, index) : renderCourse(item as PrerequisiteCourse, index)}
              {!isNested && !isLast && renderSeparatorPill(group.type)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
