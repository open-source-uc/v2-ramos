import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillVariants = cva(
  "inline-flex items-center rounded-lg border font-medium",
  {
    variants: {
      variant: {
        blue: "bg-primary-foreground text-primary border-primary/20",
        pink: "bg-pink-light text-pink border-pink/20",
        green: "bg-green-light text-green border-green/20",
        purple: "bg-purple-light text-purple border-purple/20",
        orange: "bg-orange-light text-orange border-orange/20",
        red: "bg-red-light text-red border-red/20",
        ghost_blue: "bg-transparent text-muted-foreground border-border",
        ghost_pink: "bg-transparent text-muted-foreground border-border",
        ghost_green: "bg-transparent text-muted-foreground border-border",
        ghost_purple: "bg-transparent text-muted-foreground border-border",
        ghost_orange: "bg-transparent text-muted-foreground border-border",
        ghost_red: "bg-transparent text-muted-foreground border-border",
      },
      size: {
        xs: "gap-1 px-2 py-0.5 text-xs",
        sm: "gap-1 px-2 py-1 text-xs",
        md: "gap-2 px-3 py-1.5 text-sm",
        lg: "gap-2 px-4 py-2 text-base",
        xl: "gap-3 px-5 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "md",
    },
  }
)

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  icon?: React.ComponentType<{ className?: string }>
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ className, variant, size, icon: Icon, children, ...props }, ref) => {
    const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : size === "xl" ? "h-6 w-6" : "h-4 w-4";

    // Determine icon color for ghost variants
    const getIconColor = () => {
      if (!variant?.startsWith('ghost_')) return 'fill-current';
      
      switch (variant) {
        case 'ghost_blue': return 'fill-primary';
        case 'ghost_pink': return 'fill-pink';
        case 'ghost_green': return 'fill-green';
        case 'ghost_purple': return 'fill-purple';
        case 'ghost_orange': return 'fill-orange';
        case 'ghost_red': return 'fill-red';
        default: return 'fill-current';
      }
    };
    
    return (
      <div
        className={cn(pillVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className={`${iconSize} ${getIconColor()}`} />}
        {children}
      </div>
    )
  }
)
Pill.displayName = "Pill"

export { Pill, pillVariants }
