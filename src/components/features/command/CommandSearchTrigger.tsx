"use client";

import * as React from "react";
import { SearchIcon, LoadingIcon } from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import { useCommand } from "@/components/providers/CommandProvider";

export default function CommandSearchTrigger() {
  const { setIsOpen } = useCommand();
  const [isSearching, setIsSearching] = React.useState(false);

  const handleClick = () => {
    // Dispatch custom event to communicate across hydration boundaries
    window.dispatchEvent(new CustomEvent('openCommandSearch'));
    setIsOpen(true);
  };

  return (
    <button
      className={cn(
        "inline-flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-background px-3 py-1 text-sm",
        "text-muted-foreground/70 transition-colors hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      )}
      onClick={handleClick}
      aria-label="Buscar cursos y comandos"
    >
      {isSearching ? (
        <LoadingIcon className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        <SearchIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span className="grow text-left font-normal text-sm">Buscar...</span>
      <kbd className="hidden inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  );
}