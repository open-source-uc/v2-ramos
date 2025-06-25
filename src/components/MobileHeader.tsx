"use client";

import * as React from "react";
import { MenuIcon, CloseIcon } from "./icons/icons";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Catálogo de Cursos",
    href: "/catalog",
    description: "Descubre los cursos disponibles en este semestre en la universidad.",
  },
  {
    title: "Sobre las Áreas de Formación General",
    href: "https://formaciongeneral.uc.cl/sobre-la-formacion-general/#conoce-las-%c3%a1reas-formativas",
    description: "Conoce las áreas de formación general y cómo se relacionan con los cursos.",
  }
];

export default function MobileHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="tablet:hidden flex w-full items-center justify-between py-4 px-4 border-b border-foreground-muted-dark">
        <a href="/" onClick={closeMenu}>
          <img
            src="/logos/Placeholder.svg"
            alt="Open Source eUC Logo"
            width={200}
            height={200}
            className="h-12 w-auto"
          />
        </a>
        
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-primary-light hover:text-primary rounded-md transition-colors"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="tablet:hidden fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header with close button */}
          <div className="flex w-full items-center justify-between py-4 px-4 border-b border-foreground-muted-dark flex-shrink-0">
            <a href="/" onClick={closeMenu}>
              <img
                src="/logos/Placeholder.svg"
                alt="Open Source eUC Logo"
                width={200}
                height={200}
                className="h-12 w-auto"
              />
            </a>
            
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-primary-light hover:text-primary rounded-md transition-colors"
              aria-label="Cerrar menú"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Menu content - scrollable */}
          <div className="flex flex-col p-4 space-y-6 overflow-y-auto flex-1">
            {/* Courses section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">CURSOS</h3>
              <div className="space-y-3">
                {components.map((component) => (
                  <a
                    key={component.title}
                    href={component.href}
                    onClick={closeMenu}
                    className="block p-3 rounded-md hover:bg-primary-light hover:text-primary transition-colors"
                  >
                    <div className="font-medium text-sm leading-none">{component.title}</div>
                    <p className="text-muted-foreground text-sm leading-snug mt-1">
                      {component.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* About section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">ACERCA</h3>
              <div className="space-y-3">
                <a
                  href="https://osuc.dev"
                  onClick={closeMenu}
                  className="block p-3 rounded-md bg-gradient-to-br from-foreground to-primary text-background hover:opacity-90 transition-opacity"
                >
                  <div className="font-medium text-sm leading-none mb-2">
                    Creado por Open Source eUC
                  </div>
                  <p className="text-background text-sm leading-snug opacity-90">
                    La comunidad estudiantil de innovación y desarrollo de software de la UC.
                  </p>
                </a>
                
                <a
                  href="/resources/respect"
                  onClick={closeMenu}
                  className="block p-3 rounded-md hover:bg-primary-light hover:text-primary transition-colors"
                >
                  <div className="font-medium text-sm leading-none">BuscaRamos: Un espacio libre de acoso</div>
                  <p className="text-muted-foreground text-sm leading-snug mt-1">
                    Conoce cómo mantenemos un ambiente seguro y respetuoso.
                  </p>
                </a>
                
              </div>
            </div>

            {/* Account section */}
            <div className="space-y-3">
              <a
                href={`https://auth.osuc.dev/?ref=${typeof window !== 'undefined' ? new URL(window.location.href).toString() : ''}`}
                onClick={closeMenu}
                className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-1.5 text-center text-xs transition-colors duration-200 w-full"
              >
                Tu Cuenta
              </a>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">ENLACES RÁPIDOS</h3>
              <div className="space-y-2">
                <a
                  href="https://buscacursos.uc.cl/"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-1.5 text-center text-xs transition-colors duration-200 w-full"
                >
                  BUSCACURSOS ORIGINAL
                </a>
                <a
                  href="https://portal.uc.cl/"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-1.5 text-center text-xs transition-colors duration-200 w-full"
                >
                  PORTAL UC
                </a>
                <a
                  href="https://cursos.canvas.uc.cl/"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-1.5 text-center text-xs transition-colors duration-200 w-full"
                >
                  CANVAS UC
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
