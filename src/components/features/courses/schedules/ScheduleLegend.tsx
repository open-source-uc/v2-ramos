import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

// Dictionary of class types with short (3 char) and long versions
export const CLASS_TYPES = {
  'CLAS': {
    short: 'CLS',
    long: 'Cátedra'
  },
  'LAB': {
    short: 'LAB',
    long: 'Laboratorio'
  },
  'AYUD': {
    short: 'AYU',
    long: 'Ayudantía'
  },
  'AYU': {
    short: 'AYU',
    long: 'Ayudantía'
  },
  'PRA': {
    short: 'PRA',
    long: 'Práctica'
  },
  'SUP': {
    short: 'SUP',
    long: 'Supervisión'
  },
  'TAL': {
    short: 'TAL',
    long: 'Taller'
  },
  'TER': {
    short: 'TER',
    long: 'Terreno'
  },
  'TES': {
    short: 'TES',
    long: 'Tesis'
  }
} as const;

// Color variants for different class types
const CLASS_TYPE_COLORS = {
  'CLAS': 'schedule_blue',
  'LAB': 'schedule_green',
  'AYUD': 'schedule_purple',
  'AYU': 'schedule_purple',
  'PRA': 'schedule_orange',
  'SUP': 'schedule_pink',
  'TAL': 'schedule_red',
  'TER': 'schedule_blue',
  'TES': 'schedule_green'
} as const;

interface ScheduleLegendProps {
  /**
   * Array of class types to show in the legend.
   * If not provided, all class types will be shown.
   */
  classTypes?: string[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show the legend in a compact format (horizontal layout)
   */
  compact?: boolean;
  /**
   * Whether to use short or long names for class types
   */
  useShortNames?: boolean;
}

export function ScheduleLegend({ 
  classTypes, 
  className, 
  compact = false, 
  useShortNames = false 
}: ScheduleLegendProps) {
  // Use provided class types or all available ones
  const typesToShow = classTypes || Object.keys(CLASS_TYPES);
  
  // Filter out types that don't exist in our dictionary and normalize them
  const validTypes = [...new Set(typesToShow
    .map(type => normalizeClassType(type))
    .filter(type => type in CLASS_TYPES)
  )];
  
  if (validTypes.length === 0) {
    return null;
  }

  const gridCols = compact 
    ? "grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4"
    : "grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3";

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold">Leyenda</h3>
      <div className={cn("grid gap-3", gridCols)}>
        {validTypes.map((type) => {
          const classInfo = CLASS_TYPES[type as keyof typeof CLASS_TYPES];
          const colorVariant = CLASS_TYPE_COLORS[type as keyof typeof CLASS_TYPE_COLORS] || 'schedule_blue';
          const displayName = useShortNames ? classInfo.short : classInfo.long;
          
          return (
            <div 
              key={type} 
              className="flex items-center gap-2 text-sm"
            >
              <Pill 
                variant={colorVariant} 
                size="xs" 
                className="text-[10px] tablet:text-xs px-2 py-1 min-w-0"
              >
                {classInfo.short}
              </Pill>
              <span className="text-muted-foreground">
                {displayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export individual functions for getting class info
export function normalizeClassType(type: string): string {
  // Normalize AYUD to AYU for consistency
  if (type === 'AYUD') return 'AYU';
  return type;
}

export function getClassTypeInfo(type: string) {
  const normalizedType = normalizeClassType(type);
  return CLASS_TYPES[normalizedType as keyof typeof CLASS_TYPES];
}

export function getClassTypeColor(type: string) {
  const normalizedType = normalizeClassType(type);
  return CLASS_TYPE_COLORS[normalizedType as keyof typeof CLASS_TYPE_COLORS] || 'schedule_blue';
}

export function getClassTypeShort(type: string) {
  const normalizedType = normalizeClassType(type);
  return CLASS_TYPES[normalizedType as keyof typeof CLASS_TYPES]?.short || type;
}

export function getClassTypeLong(type: string) {
  const normalizedType = normalizeClassType(type);
  return CLASS_TYPES[normalizedType as keyof typeof CLASS_TYPES]?.long || type;
}
