import React from 'react';
import { cn } from '@/lib/utils';

interface SelectInputProps {
  /** Visual style variant */
  variant?: 'default' | 'destructive';
  /** Size of the select */
  size?: 'default' | 'sm' | 'lg';
  /** Icon component to display on the left */
  icon?: React.ComponentType<{ className?: string }>;
  /** Label text */
  label?: string;
  /** Description text shown below the select */
  description?: string;
  /** Error message to display */
  error?: string | string[];
  /** Additional CSS classes */
  className?: string;
  /** All standard select props */
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  /** Options for the select */
  children: React.ReactNode;
}

const selectInputVariants = {
  variant: {
    default: 'border-border focus:border-primary focus:ring-primary/20',
    destructive: 'border-destructive focus:border-destructive focus:ring-destructive/20',
  },
  size: {
    default: 'py-3 px-3 text-sm',
    sm: 'py-2 px-3 text-sm',
    lg: 'py-4 px-4 text-base',
  },
};

const iconSizes = {
  default: 'h-4 w-4',
  sm: 'h-3.5 w-3.5',
  lg: 'h-5 w-5',
};

export function SelectInput({
  variant = 'default',
  size = 'default',
  icon: Icon,
  label,
  description,
  error,
  className,
  selectProps,
  children,
  ...props
}: SelectInputProps) {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = Boolean(errorMessage);
  const finalVariant = hasError ? 'destructive' : variant;

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <label
          htmlFor={selectProps?.id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {selectProps?.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={cn('fill-muted-foreground', iconSizes[size])} />
          </div>
        )}
        
        <select
          className={cn(
            'w-full rounded-md border focus:ring focus:ring-opacity-50 transition-colors appearance-none bg-background',
            selectInputVariants.variant[finalVariant],
            selectInputVariants.size[size],
            Icon ? 'pl-10' : 'pl-3',
            'pr-8'
          )}
          {...selectProps}
        >
          {children}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 fill-muted-foreground" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {description && !hasError && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {hasError && (
        <p className="text-destructive text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
