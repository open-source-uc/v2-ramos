"use client";
import * as React from "react"
import Link from "next/link"
import Image from 'next/image';
 
import { cn } from "@/lib/utils"
import ButtonNavbar from './new-ui/ButtonNavbar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./new-ui/NavigationMenu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Descubre Cursos",
    href: "/404",
    description:
      "Descubre los cursos más populares y recomendados.",
  },
  {
    title: "Optativos de Formación General",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  }
]

export default function Header() {
    return (
        <header className="flex items-center w-full py-8 space-between tablet:space-x-8">
            <Image src="assets/UC_Logo_Big.svg" alt="UC Logo" width={200} height={200} className="h-20 w-auto tablet:hidden" />
            <Image src="assets/UC_Logo_Small.svg" alt="UC Logo" width={200} height={200} className="h-20 w-auto hidden tablet:block" />

            <nav className="hidden space-y-3 w-full tablet:block">
                <div className="flex space-x-4 border-b border-foreground-muted-dark w-full justify-between py-2">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                            <NavigationMenuTrigger className="hover:bg-primary-light hover:text-primary">CURSOS</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {components.map((component) => (
                                    <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                    >
                                    {component.description}
                                    </ListItem>
                                ))}
                                </ul>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                            <NavigationMenuTrigger className="hover:bg-primary-light hover:text-primary">ACERCA</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                        Creado por <br/> Open Source UC
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                        Beautifully designed components built with Radix UI and
                                        Tailwind CSS.
                                        </p>
                                    </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/docs" title="Introduction">
                                    Re-usable components built using Radix UI and Tailwind CSS.
                                </ListItem>
                                <ListItem href="/docs/installation" title="Installation">
                                    How to install dependencies and structure your app.
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Typography">
                                    Styles for headings, paragraphs, lists...etc
                                </ListItem>
                                </ul>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center space-x-2">
                        <ButtonNavbar text="Login" url="/login" />
                        <ButtonNavbar text="Registrarse" url="/register" />
                    </div>
                </div>
            
                <div className="flex w-full space-x-2">
                    <ButtonNavbar text="MIS CURSOS FAVORITOS" url="/404" />
                    <ButtonNavbar text="MIS RESEÑAS" url="/404" />
                    <ButtonNavbar text="ORGANIZACIONES QUE SIGO" url="/404" />
                </div>
            </nav>
        </header>
    );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary-light hover:text-primary",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"