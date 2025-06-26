import { useEffect, useState } from "react";

export default function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check if high contrast mode is already enabled
    const savedTheme = localStorage.getItem("high-contrast");
    const hasHighContrast = document.documentElement.classList.contains("high-contrast");
    
    // Check for system preference for high contrast
    const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches;
    
    if (savedTheme === "true" || hasHighContrast || (savedTheme === null && prefersHighContrast)) {
      setIsHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("high-contrast") === null) {
        setIsHighContrast(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("high-contrast");
        } else {
          document.documentElement.classList.remove("high-contrast");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    
    if (newValue) {
      document.documentElement.classList.add("high-contrast");
      localStorage.setItem("high-contrast", "true");
    } else {
      document.documentElement.classList.remove("high-contrast");
      localStorage.setItem("high-contrast", "false");
    }
  };

  return (
    <button
      onClick={toggleHighContrast}
      className="w-full tablet:w-3/5 bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary rounded-lg border-1 px-4 py-1.5 text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={isHighContrast ? "Desactivar alto contraste" : "Activar alto contraste"}
      title={isHighContrast ? "Desactivar alto contraste" : "Activar alto contraste"}
    >
      <div className="justify-center flex items-center space-x-2">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v18m0-18a9 9 0 110 18 9 9 0 010-18z"
          />
        </svg>
        <span className="text-nowrap">
          ALTO CONTRASTE
        </span>
      </div>
    </button>
  );
}
