"use client";

import * as React from "react";
import { MenuIcon, CloseIcon } from "../icons/icons";
import HighContrastToggle from "../common/HighContrastToggle";
import DarkThemeToggle from "../common/DarkThemeToggle";
import CommandSearch from "../features/command/commandSearch";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Sobre las Áreas de Formación General",
    href: "https://formaciongeneral.uc.cl/sobre-la-formacion-general/#conoce-las-%c3%a1reas-formativas",
    description: "Conoce las áreas de formación general y cómo se relacionan con los cursos.",
  },
  {
    title: "Preguntas Frecuentes",
    href: "https://registrosacademicos.uc.cl/informacion-para-estudiantes/inscripcion-y-retiro-de-cursos/preguntas-frecuentes/",
    description: "Resuelve tus dudas sobre los cursos, desde inscripciones, retiros y más.",
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

        <div className="flex items-center gap-2">

          <CommandSearch />
          
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
        </div>
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
            
            {/* Navigation section */}
            <section className="border border-border rounded-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Navegación</h3>
              <div className="space-y-3">
                <a
                  href="/catalog"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  CATÁLOGO
                </a>
                <a
                  href="/horario"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  HORARIO
                </a>
              </div>
            </section>
            
            {/* FAQ section */}
            <section className="border border-border rounded-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">FAQ</h3>
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
                  BUSCACURSOS
                </a>
                <a
                  href="https://registration9.uc.cl/StudentRegistrationSsb/ssb/registration"
                  onClick={closeMenu}
                  className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors duration-200 w-full"
                >
                  INSCRIPCIÓN CURSOS
                </a>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
