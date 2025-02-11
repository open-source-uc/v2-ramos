import React, { FC } from "react";
import { Home } from "lucide-react";  // Puedes cambiar el icono si lo prefieres

type PageTitleProps = {
    children: React.ReactNode;  // Título de la página
    size?: "sm" | "md" | "lg";  // Opción para personalizar el tamaño del título
    icon?: boolean;  // Opción para incluir un icono antes del título
};

const PageTitle: FC<PageTitleProps> = ({ children, size = "md", icon = false }) => {
    const sizeClasses = {
        sm: "text-2xl",
        md: "text-4xl",
        lg: "text-6xl",
    };

    return (
        <div className="flex items-center space-x-4">
            {icon && (
                <Home size={24} className="text-gray-600 dark:text-white transition-transform duration-300 hover:scale-110" />
            )}
            <h1
                className={`font-bold text-gray-900 dark:text-white ${sizeClasses[size]} relative 
                    transition-all duration-300 
                    hover:text-blue-500 dark:hover:text-blue-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
                {children}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-teal-400 scale-x-0 transition-all duration-300 group-hover:scale-x-100" />
            </h1>
        </div>
    );
};

export default PageTitle;
