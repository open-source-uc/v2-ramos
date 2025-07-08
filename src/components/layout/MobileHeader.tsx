"use client";

import * as React from "react";
import { MenuIcon, CloseIcon } from "../icons/icons";
import HighContrastToggle from "../common/HighContrastToggle";
import DarkThemeToggle from "../common/DarkThemeToggle";

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
      <header className="tablet:hidden flex w-full items-center justify-between py-4 px-4 border-b border-background">
        <a href="/" onClick={closeMenu}>
          <img
            src="/logos/Placeholder.svg"
            alt="Logo de BuscaRamos"
            width={200}
            height={200}
            className="h-12 w-auto fill-foreground"
          />
        </a>
        
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-muted hover:text-muted-foreground rounded-md transition-colors"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? (
            <CloseIcon className="h-6 w-6 fill-foreground" />
          ) : (
            <MenuIcon className="h-6 w-6 fill-foreground" />
          )}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="tablet:hidden fixed inset-0 z-50 bg-background flex flex-col">
          {/* Header with close button */}
          <div className="flex w-full items-center justify-between py-4 px-4 border-b border-border flex-shrink-0">
            <a href="/" onClick={closeMenu}>
              <img
                src="/logos/Placeholder.svg"
                alt="Logo de BuscaRamos"
                width={200}
                height={200}
                className="h-12 w-auto"
              />
            </a>
            
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-muted hover:text-muted-foreground rounded-md transition-colors"
              aria-label="Cerrar menú"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Menu content - scrollable */}
          <div className="flex flex-col p-6 space-y-8 overflow-y-auto flex-1">
            {/* Account section */}
            <section className="border border-border rounded-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 text-nowrap">CUENTA OSUC</h3>
              <div className="space-y-3">
                <a
                  href={`https://auth.osuc.dev/?ref=${typeof window !== 'undefined' ? new URL(window.location.href).toString() : ''}`}
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  Iniciar Sesión
                </a>
                <div className="flex items-center space-x-2">
                  <HighContrastToggle />
                  <DarkThemeToggle />
                </div>
              </div>
            </section>
            
            {/* Courses section */}
            <section className="border border-border rounded-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Cursos</h3>
              <div className="space-y-3">
                {components.map((component) => (
                  <a
                    key={component.title}
                    href={component.href}
                    onClick={closeMenu}
                    className="block p-4 border border-border rounded-md hover:bg-primary-light hover:text-primary hover:border-primary transition-colors"
                  >
                    <div className="font-medium text-sm leading-none text-foreground">{component.title}</div>
                    <p className="text-muted-foreground text-sm leading-snug mt-2">
                      {component.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* About section */}
            <section className="border border-border rounded-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Acerca de</h3>
              <div className="space-y-3">
                <a
                  href="https://osuc.dev"
                  onClick={closeMenu}
                  className="block p-4 rounded-md bg-gradient-to-br from-background to-primary hover:opacity-60 transition-opacity border border-border"
                >
                  <div className="font-medium text-sm leading-none mb-2">
                    Creado por Open Source eUC
                  </div>
                  <p className="text-sm leading-snug opacity-90">
                    La comunidad estudiantil de innovación y desarrollo de software de la UC.
                  </p>
                </a>
                
                <a
                  href="/resources/respect"
                  onClick={closeMenu}
                  className="hidden block p-4 border border-border rounded-md hover:bg-primary-light hover:text-primary hover:border-primary transition-colors"
                >
                  <div className="font-medium text-sm leading-none text-foreground">BuscaRamos: Un espacio libre de acoso</div>
                  <p className="text-muted-foreground text-sm leading-snug mt-2">
                    Conoce cómo mantenemos un ambiente seguro y respetuoso.
                  </p>
                </a>

                <a
                  href="/team"
                  onClick={closeMenu}
                  className="block p-4 border border-border rounded-md hover:bg-primary-light hover:text-primary hover:border-primary transition-colors"
                >
                  <div className="font-medium text-sm leading-none text-foreground">Conoce al Equipo</div>
                  <p className="text-muted-foreground text-sm leading-snug mt-2">
                    Conoce a los estudiantes detrás de este proyecto, sus roles y carreras.
                  </p>
                </a>
              </div>
            </section>

            {/* Quick links */}
            <section className="border border-border rounded-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
              <div className="grid grid-cols-1 gap-3">
                <a
                  href="https://buscacursos.uc.cl/"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  BuscaCursos Original
                </a>
                <a
                  href="https://portal.uc.cl/"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  Portal UC
                </a>
                <a
                  href="https://cursos.canvas.uc.cl/"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  Canvas UC
                </a>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
