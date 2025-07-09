import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-background border border-border hover:bg-primary-foreground hover:text-primary hover:border-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-accent hover:bg-muted hover:text-muted-foreground",
        secondary:
          "bg-muted text-muted-foreground hover:bg-muted/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        ghost_border: "border border-border hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        ghost_blue: "bg-transparent text-primary border border-border hover:bg-primary-foreground hover:text-primary",
        ghost_pink: "bg-transparent text-pink border border-border hover:bg-pink-light hover:text-pink",
        ghost_green: "bg-transparent text-green border border-border hover:bg-green-light hover:text-green",
        ghost_purple: "bg-transparent text-purple border border-border hover:bg-purple-light hover:text-purple",
        ghost_orange: "bg-transparent text-orange border border-border hover:bg-orange-light hover:text-orange",
        ghost_red: "bg-transparent text-red border border-border hover:bg-red-light hover:text-red",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  href?: string
  target?: string
  rel?: string
  icon?: React.ComponentType<{ className?: string }>
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText = "Loading...", disabled, children, href, target, rel, icon: Icon, ...props }, ref) => {
    const isLink = Boolean(href)
    const isDisabled = disabled || loading
    
    // Common props for both button and link
    const commonProps = {
      className: cn(buttonVariants({ variant, size, className }), isDisabled && isLink && "pointer-events-none opacity-50"),
      ref: ref as any,
      "aria-busy": loading,
    }

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

    const content = loading ? (
      <>
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="sr-only">{loadingText}</span>
        {loadingText}
      </>
    ) : (
      <>
        {Icon && <Icon className={`h-4 w-4 -ml-1 mr-2 ${getIconColor()}`} />}
        {children}
      </>
    )

    if (asChild) {
      return (
        <Slot {...commonProps} {...props}>
          {content}
        </Slot>
      )
    }

    if (isLink) {
      const { onClick, ...restProps } = props
      return (
        <a
          {...commonProps}
          href={isDisabled ? undefined : href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : rel}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
          onClick={isDisabled ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault() : onClick as any}
          {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        {...commonProps}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
