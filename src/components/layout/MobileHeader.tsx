'use client'

import * as React from 'react'
import { MenuIcon, CloseIcon } from '../icons/icons'
import HighContrastToggle from '../common/HighContrastToggle'
import DarkThemeToggle from '../common/DarkThemeToggle'

const components: { title: string; href: string; description: string }[] = [
	{
		title: 'Sobre las Áreas de Formación General',
		href: 'https://formaciongeneral.uc.cl/sobre-la-formacion-general/#conoce-las-%c3%a1reas-formativas',
		description: 'Conoce las áreas de formación general y cómo se relacionan con los cursos.',
	},
	{
		title: 'Preguntas Frecuentes',
		href: 'https://registrosacademicos.uc.cl/informacion-para-estudiantes/inscripcion-y-retiro-de-cursos/preguntas-frecuentes/',
		description: 'Resuelve tus dudas sobre los cursos, desde inscripciones, retiros y más.',
	},
]

export default function MobileHeader() {
	const [isOpen, setIsOpen] = React.useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const closeMenu = () => {
		setIsOpen(false)
	}

	return (
		<>
			<header className="tablet:hidden border-background flex w-full items-center justify-between border-b px-4 py-4">
				<a href="/" onClick={closeMenu}>
					<img
						src="/logos/Placeholder.svg"
						alt="Logo de BuscaRamos"
						width={200}
						height={200}
						className="fill-foreground h-12 w-auto"
					/>
				</a>

				<button
					onClick={toggleMenu}
					className="hover:bg-muted hover:text-muted-foreground rounded-md p-2 transition-colors"
					aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
				>
					{isOpen ? (
						<CloseIcon className="fill-foreground h-6 w-6" />
					) : (
						<MenuIcon className="fill-foreground h-6 w-6" />
					)}
				</button>
			</header>

			{/* Mobile menu overlay */}
			{isOpen && (
				<div className="tablet:hidden bg-background fixed inset-0 z-50 flex flex-col">
					{/* Header with close button */}
					<div className="border-border flex w-full flex-shrink-0 items-center justify-between border-b px-4 py-4">
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
							className="hover:bg-muted hover:text-muted-foreground rounded-md p-2 transition-colors"
							aria-label="Cerrar menú"
						>
							<CloseIcon className="h-6 w-6" />
						</button>
					</div>

					{/* Menu content - scrollable */}
					<div className="flex flex-1 flex-col space-y-8 overflow-y-auto p-6">
						{/* Account section */}
						<section className="border-border rounded-md border p-6">
							<h3 className="text-foreground mb-4 text-lg font-semibold text-nowrap">
								CUENTA OSUC
							</h3>
							<div className="space-y-3">
								<a
									href={`https://auth.osuc.dev/?ref=${typeof window !== 'undefined' ? new URL(window.location.href).toString() : ''}`}
									onClick={closeMenu}
									className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block w-full rounded-lg border-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200"
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
						<section className="border-border rounded-md border p-6">
							<h3 className="text-foreground mb-4 text-lg font-semibold">Navegación</h3>
							<div className="space-y-3">
								<a
									href="/catalog"
									onClick={closeMenu}
									className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block w-full rounded-lg border-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200"
								>
									CATÁLOGO
								</a>
								<a
									href="/horario"
									onClick={closeMenu}
									className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block w-full rounded-lg border-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200"
								>
									HORARIO
								</a>
							</div>
						</section>

						{/* FAQ section */}
						<section className="border-border rounded-md border p-6">
							<h3 className="text-foreground mb-4 text-lg font-semibold">FAQ</h3>
							<div className="space-y-3">
								{components.map((component) => (
									<a
										key={component.title}
										href={component.href}
										onClick={closeMenu}
										className="border-border hover:bg-primary-light hover:text-primary hover:border-primary block rounded-md border p-4 transition-colors"
									>
										<div className="text-foreground text-sm leading-none font-medium">
											{component.title}
										</div>
										<p className="text-muted-foreground mt-2 text-sm leading-snug">
											{component.description}
										</p>
									</a>
								))}
							</div>
						</section>

						{/* About section */}
						<section className="border-border rounded-md border p-6">
							<h3 className="text-foreground mb-4 text-lg font-semibold">Acerca de</h3>
							<div className="space-y-3">
								<a
									href="https://osuc.dev"
									onClick={closeMenu}
									className="from-background to-primary border-border block rounded-md border bg-gradient-to-br p-4 transition-opacity hover:opacity-60"
								>
									<div className="mb-2 text-sm leading-none font-medium">
										Creado por Open Source eUC
									</div>
									<p className="text-sm leading-snug opacity-90">
										La comunidad estudiantil de innovación y desarrollo de software de la UC.
									</p>
								</a>

								<a
									href="/team"
									onClick={closeMenu}
									className="border-border hover:bg-primary-light hover:text-primary hover:border-primary block rounded-md border p-4 transition-colors"
								>
									<div className="text-foreground text-sm leading-none font-medium">
										Conoce al Equipo
									</div>
									<p className="text-muted-foreground mt-2 text-sm leading-snug">
										Conoce a los estudiantes detrás de este proyecto, sus roles y carreras.
									</p>
								</a>
							</div>
						</section>

						{/* Quick links */}
						<section className="border-border rounded-md border p-6">
							<h3 className="text-foreground mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
							<div className="grid grid-cols-1 gap-3">
								<a
									href="https://buscacursos.uc.cl/"
									onClick={closeMenu}
									className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block w-full rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors duration-200"
								>
									BUSCACURSOS
								</a>
								<a
									href="https://registration9.uc.cl/StudentRegistrationSsb/ssb/registration"
									onClick={closeMenu}
									className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block w-full rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors duration-200"
								>
									INSCRIPCIÓN CURSOS
								</a>
							</div>
						</section>
					</div>
				</div>
			)}
		</>
	)
}
