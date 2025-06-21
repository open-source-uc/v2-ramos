import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillVariants = cva(
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium",
  {
    variants: {
      variant: {
        blue: "bg-primary-foreground text-primary border-primary/20",
        pink: "bg-pink-light text-pink border-pink/20",
        green: "bg-green-light text-green border-green/20",
        purple: "bg-purple-light text-purple border-purple/20",
        orange: "bg-orange-light text-orange border-orange/20",
        red: "bg-red-light text-red border-red/20",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
)

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  icon?: React.ComponentType<{ className?: string }>
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ className, variant, icon: Icon, children, ...props }, ref) => {
    return (
      <div
        className={cn(pillVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4 fill-current" />}
        {children}
      </div>
    )
  }
)
Pill.displayName = "Pill"

export { Pill, pillVariants }
