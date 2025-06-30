import { useEffect, useState } from "react";

export default function DarkThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check if dark theme is already enabled
    const savedTheme = localStorage.getItem("dark-theme");
    const hasDarkTheme = document.documentElement.classList.contains("dark");
    
    // Check for system preference for dark theme
    const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "true" || hasDarkTheme || (savedTheme === null && prefersDarkTheme)) {
      setIsDarkTheme(true);
      document.documentElement.classList.add("dark");
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("dark-theme") === null) {
        setIsDarkTheme(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkTheme = () => {
    const newValue = !isDarkTheme;
    setIsDarkTheme(newValue);
    
    if (newValue) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-theme", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-theme", "false");
    }
  };

  return (
    <button
      onClick={toggleDarkTheme}
      className="w-full tablet:w-auto bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary rounded-lg border-1 px-4 py-1.5 text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={isDarkTheme ? "Desactivar tema oscuro" : "Activar tema oscuro"}
      title={isDarkTheme ? "Desactivar tema oscuro" : "Activar tema oscuro"}
    >
      <div className="justify-center flex items-center space-x-2">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isDarkTheme ? (
            // Sun icon for light mode
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          ) : (
            // Moon icon for dark mode
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          )}
        </svg>
        <span className="text-nowrap">
          TEMA OSCURO
        </span>
      </div>
    </button>
  );
}
