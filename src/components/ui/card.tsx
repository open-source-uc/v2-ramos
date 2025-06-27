import React from "react";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
    return (
      <div
        className={`bg-white dark:bg-zinc-900 text-black dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm p-4 ${className}`}
      >
        {children}
      </div>
    );
  }
  
