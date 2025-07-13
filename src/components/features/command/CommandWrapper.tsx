"use client";

import * as React from "react";
import { CommandProvider } from "@/components/providers/CommandProvider";
import CommandSearch from "./commandSearch";

export default function CommandWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CommandProvider>
      {children}
      <CommandSearch />
    </CommandProvider>
  );
}