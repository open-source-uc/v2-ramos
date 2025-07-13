"use client";

import * as React from "react";

interface CommandContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

const CommandContext = React.createContext<CommandContextType | undefined>(undefined);

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleOpen]);

  return (
    <CommandContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </CommandContext.Provider>
  );
}

export function useCommand() {
  const context = React.useContext(CommandContext);
  if (context === undefined) {
    // Return default values for SSR or when not wrapped in CommandProvider
    return {
      isOpen: false,
      setIsOpen: () => {},
      toggleOpen: () => {},
    };
  }
  return context;
}