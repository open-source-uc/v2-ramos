/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";

export default function DarkModeSelector() {
  const [isDark, setIsDark] = useState(false);

  const switchTheme = () => {
    document.documentElement.classList.toggle("dark", !isDark);
    setIsDark(!isDark);
    localStorage.theme = !isDark ? "dark" : "light";
  };

  const setSystemTheme = () => {
    const savedTheme = localStorage.theme;
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      switchTheme();
    }
  };

  useEffect(() => {
    setSystemTheme();
  }, []);

  return (
    <div className="ml-auto flex items-center">
      <button className="rounded-lg p-1 text-xl hover:bg-sky-700" onClick={() => switchTheme()}>
        {isDark ? "🌙" : "🌞"}
      </button>
    </div>
  );
}
