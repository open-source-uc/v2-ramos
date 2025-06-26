import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { 
  VeryHappyIcon, 
  SadIcon,
  CalendarIcon, 
  BuildingIcon, 
  SearchIcon,
  QuestionIcon,
  ThumbUpIcon,
  HappyIcon,
  ClockIcon,
  PlusIcon
} from "@/components/icons/icons"

// Icon mapping for the Banner component
const iconMap = {
  VeryHappyIcon,
  SadIcon,
  CalendarIcon,
  BuildingIcon,
  SearchIcon,
  QuestionIcon,
  ThumbUpIcon,
  HappyIcon,
  ClockIcon,
  PlusIcon,
} as const;

type IconName = keyof typeof iconMap;

const bannerVariants = cva(
  "w-full flex items-center border font-medium",
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
        sm: "gap-2 px-3 py-2 text-xs",
        md: "gap-3 px-4 py-3 text-sm",
        lg: "gap-3 px-5 py-4 text-base",
        xl: "gap-4 px-6 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "md",
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  icon?: IconName
  dismissible?: boolean
  onDismiss?: () => void
  bannerId?: string // Unique identifier for the banner
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant, size, icon, children, dismissible = false, onDismiss, bannerId, ...props }, ref) => {
    // Generate a unique banner ID based on content and props if not provided
    const generateBannerId = () => {
      if (bannerId) return bannerId;
      
      // Create a simple hash based on the banner content and props
      const content = typeof children === 'string' ? children : JSON.stringify(children);
      const bannerData = `${variant}-${size}-${icon}-${content}`;
      return btoa(bannerData).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    };

    const finalBannerId = generateBannerId();
    const storageKey = `banner-dismissed-${finalBannerId}`;

    // Check if banner was previously dismissed
    const [isVisible, setIsVisible] = React.useState(() => {
      if (typeof window === 'undefined') return true; // SSR fallback
      try {
        const dismissed = localStorage.getItem(storageKey);
        return dismissed !== 'true';
      } catch {
        return true; // Fallback if localStorage is not available
      }
    });

    const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : size === "xl" ? "h-7 w-7" : "h-5 w-5";

    // Get the icon component from the mapping
    const IconComponent = icon ? iconMap[icon] : null;

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

    const handleDismiss = () => {
      setIsVisible(false);
      
      // Store dismissal in localStorage
      try {
        localStorage.setItem(storageKey, 'true');
      } catch {
        // Silently fail if localStorage is not available
      }
      
      onDismiss?.();
    };

    if (!isVisible) {
      return null;
    }
    
    return (
      <div
        className={cn(bannerVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {IconComponent && <IconComponent className={`${iconSize} ${getIconColor()} flex-shrink-0`} />}
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`${iconSize} hidden flex-shrink-0 ml-2 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded-sm`}
            aria-label="Cerrar Banner"
          >
            <svg
              className={`${iconSize} ${getIconColor()}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Banner.displayName = "Banner"

export { Banner, bannerVariants }
