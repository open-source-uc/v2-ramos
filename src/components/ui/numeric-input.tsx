import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const numericInputVariants = cva(
  "w-full rounded-md border transition-colors focus:ring focus:ring-opacity-50",
  {
    variants: {
      variant: {
        default: "border-border focus:border-primary focus:ring-primary/20",
        success: "border-green-300 focus:border-green-500 focus:ring-green/20",
        warning: "border-orange-300 focus:border-orange-500 focus:ring-orange/20",
        error: "border-red-300 focus:border-red-500 focus:ring-red/20",
        info: "border-blue-300 focus:border-blue-500 focus:ring-blue/20",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        default: "px-3 py-3 text-sm",
        lg: "px-4 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const iconContainerVariants = cva(
  "absolute inset-y-0 left-0 flex items-center pointer-events-none",
  {
    variants: {
      size: {
        sm: "pl-2.5",
        default: "pl-3",
        lg: "pl-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const iconVariants = cva(
  "fill-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        default: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof numericInputVariants> {
  icon?: React.ComponentType<{ className?: string }>
  label?: string
  description?: string
  error?: string | string[]
  "aria-describedby"?: string
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ 
    className, 
    variant, 
    size, 
    icon: Icon, 
    label,
    description,
    error,
    disabled,
    required,
    id,
    "aria-describedby": ariaDescribedby,
    ...props 
  }, ref) => {
    // Generate unique IDs for accessibility
    const inputId = id || React.useId()
    const labelId = React.useId()
    const descriptionId = React.useId()
    const errorId = React.useId()
    
    // Handle array or string errors
    const errorMessage = Array.isArray(error) ? error[0] : error
    
    // Build aria-describedby string
    const describedBy = [
      description ? descriptionId : null,
      errorMessage ? errorId : null,
      ariaDescribedby
    ].filter(Boolean).join(' ') || undefined

    // Use error variant if error exists
    const effectiveVariant = errorMessage ? "error" : variant

    // Calculate padding based on icon presence and size
    const paddingLeft = Icon ? (
      size === "sm" ? "pl-9" : 
      size === "lg" ? "pl-12" : 
      "pl-10"
    ) : undefined

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-foreground",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-destructive" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {Icon && (
            <div className={cn(iconContainerVariants({ size }))}>
              <Icon className={cn(iconVariants({ size }))} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type="number"
            id={inputId}
            disabled={disabled}
            required={required}
            aria-describedby={describedBy}
            aria-labelledby={label ? labelId : undefined}
            aria-invalid={errorMessage ? "true" : undefined}
            className={cn(
              numericInputVariants({ variant: effectiveVariant, size, className }),
              paddingLeft,
              disabled && "opacity-50 cursor-not-allowed"
            )}
            {...props}
          />
        </div>

        {/* Description */}
        {description && (
          <p 
            id={descriptionId}
            className={cn(
              "text-xs text-muted-foreground",
              disabled && "opacity-50"
            )}
          >
            {description}
          </p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p 
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
NumericInput.displayName = "NumericInput"

export { NumericInput, numericInputVariants, iconContainerVariants, iconVariants }
