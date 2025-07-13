"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import ButtonNavbar from "../ui/button-navbar";
import MobileHeader from "./MobileHeader";
import DarkThemeToggle from "../common/DarkThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import HighContrastToggle from "../common/HighContrastToggle";
import CommandSearchTrigger from "../features/command/CommandSearchTrigger";

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

export default function Header() {
  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop/Tablet Header */}
      <header className="space-between tablet:space-x-8 hidden tablet:flex w-full items-center py-8 px-4">
        <a href="/">
          <img
            src="/logos/Placeholder.svg"
            alt="Logo de BuscaRamos"
            width={200}
            height={200}
            className="h-20 w-auto fill-foreground"
          />
        </a>

        <nav className="tablet:block hidden w-full space-y-3">
          <div className="border-foreground-muted-dark flex w-full justify-between space-x-4 border-b py-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <a href="/catalog" className="hover:bg-primary-light hover:text-primary">CATÁLOGO</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <a href="/horario" className="hover:bg-primary-light hover:text-primary">HORARIO</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:bg-primary-light hover:text-primary">
                    ACERCA
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-background to-primary-foreground from-80% hover:to-primary flex h-full w-full flex-col justify-end rounded-md bg-radial p-6 no-underline outline-none select-none focus:shadow-md"
                            href="https://osuc.dev"
                          >
                            <div className="mt-4 mb-2 text-lg font-medium">
                              Creado por <br /> Open Source eUC
                            </div>
                            <p className="text-sm leading-tight">
                              La comunidad estudiantil de innovación y desarrollo de software de la UC.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>

                      <ListItem href="/team" title="Conoce al Equipo">
                        Conoce a los estudiantes detrás de este proyecto, sus roles y carreras.
                      </ListItem>

                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:bg-primary-light hover:text-primary">
                    FAQ
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center text-nowrap gap-2">
              <CommandSearchTrigger />
              <ButtonNavbar
                text="CUENTA OSUC"
                url={`https://auth.osuc.dev/?ref=${typeof window !== 'undefined' ? new URL(window.location.href).toString() : ''}`} />
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-2">
              <ButtonNavbar text="BUSCACURSOS" url="https://buscacursos.uc.cl/" />
              <ButtonNavbar text="INSCRIPCIÓN CURSOS" url="https://registration9.uc.cl/StudentRegistrationSsb/ssb/registration" />
            </div>
            <div className="flex items-center gap-2">
              <HighContrastToggle />
              <DarkThemeToggle />
            </div>
          </div>
        </nav>
      </header >
    </>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          className={cn(
            "hover:bg-primary-light hover:text-primary block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
