import React from "react";

import { Home } from "lucide-react"; // Puedes cambiar el icono si lo prefieres

type PageTitleProps = {
  children: React.ReactNode; // Título de la página
  size?: "sm" | "md" | "lg"; // Opción para personalizar el tamaño del título
  icon?: boolean; // Opción para incluir un icono antes del título
};

export default function PageTitle({ children, size = "md", icon = false }: PageTitleProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <div className="flex items-center space-x-4">
      {icon ? (
        <Home size={24} className="text-gray-600 transition-transform duration-300 hover:scale-110 dark:text-white" />
      ) : null}
      <h1
        className={`font-bold text-gray-900 dark:text-white ${sizeClasses[size]} relative transition-all duration-300 hover:text-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:text-blue-400`}
      >
        {children}
        <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-linear-to-r from-blue-500 to-teal-400 transition-all duration-300 group-hover:scale-x-100" />
      </h1>
    </div>
  );
}
