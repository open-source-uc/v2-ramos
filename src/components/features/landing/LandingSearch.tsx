'use client'

import { useState } from 'react'
import { Search } from '../search/SearchInput'
import { Button } from '../../ui/button'
import { Pill } from '../../ui/pill'
import { BuildingIcon, AreaIcon, HourglassIcon, ResourcesIcon } from '../../icons/icons'

export function LandingSearch() {
	const [searchTerm, setSearchTerm] = useState('')

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			// Redirect to catalog page with search parameter
			window.location.href = `/catalog?search=${encodeURIComponent(searchTerm.trim())}`
		} else {
			window.location.href = '/catalog'
		}
	}

	const handleSearchChange = (value: string) => {
		setSearchTerm(value)
	}

	const floatingPills = [
		{
			icon: BuildingIcon,
			text: 'Facultades',
			variant: 'blue' as const,
			position: 'top-0 left-8',
			delay: '0s',
		},
		{
			icon: AreaIcon,
			text: 'Áreas',
			variant: 'pink' as const,
			position: 'top-0 right-8',
			delay: '0.2s',
		},
		{
			icon: HourglassIcon,
			text: 'Créditos',
			variant: 'green' as const,
			position: 'top-24 left-12',
			delay: '0.4s',
		},
		{
			icon: ResourcesIcon,
			text: 'Recursos',
			variant: 'blue' as const,
			position: 'top-24 right-12',
			delay: '1.2s',
		},
	]

	return (
		<div className="tablet:my-12 desktop:my-16 tablet:px-6 desktop:px-8 relative mx-auto mt-24 mb-8 w-full max-w-4xl px-4">
			{/* Floating Pills - Only visible on desktop */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{floatingPills.map((pill, index) => (
					<div
						key={index}
						className={`absolute ${pill.position} desktop:block hidden animate-pulse`}
						style={{
							animationDelay: pill.delay,
							animationDuration: '3s',
						}}
					>
						<Pill
							variant={pill.variant}
							size="sm"
							icon={pill.icon}
							className="opacity-60 shadow-sm transition-opacity duration-300 hover:opacity-80"
						>
							{pill.text}
						</Pill>
					</div>
				))}
			</div>

			{/* Main Content */}
			<div className="relative z-10 mx-auto max-w-2xl">
				<div className="tablet:mb-10 desktop:mb-12 mb-8 text-center">
					<h1 className="tablet:text-4xl desktop:text-5xl text-foreground tablet:mb-4 from-foreground to-muted-foreground mb-3 bg-gradient-to-br bg-clip-text text-3xl leading-tight font-bold">
						¿En qué curso estás pensando?
					</h1>
					<p className="tablet:text-lg text-muted-foreground tablet:px-0 mx-auto max-w-xl px-4 text-base">
						Descubre opiniones, estadísticas y recursos de miles de cursos de la UC
					</p>
				</div>

				<div className="relative">
					<form
						onSubmit={handleSearch}
						className="group relative"
						role="search"
						aria-label="Buscar cursos"
					>
						<div className="relative">
							<Search
								onSearch={handleSearchChange}
								placeholder="Buscar por nombre o sigla del curso..."
								initialValue={searchTerm}
								className="w-full"
							/>
							<div className="from-primary/5 to-pink/5 pointer-events-none absolute inset-0 rounded-md bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						</div>
						<div id="search-instructions" className="sr-only">
							Escribe el nombre o sigla del curso que buscas y presiona Enter para buscar
						</div>
						<button type="submit" className="sr-only">
							Buscar cursos
						</button>
					</form>
				</div>

				<div
					className="tablet:flex-row tablet:mt-8 tablet:gap-4 mt-6 flex flex-col justify-center gap-3 pt-4"
					role="group"
					aria-label="Acciones de navegación"
				>
					<Button
						variant="outline"
						size="lg"
						onClick={() => (window.location.href = '/catalog')}
						aria-label="Ver todos los cursos disponibles en el catálogo"
					>
						Ver todos los cursos
					</Button>

					<Button
						variant="outline"
						size="lg"
						onClick={() => (window.location.href = 'https://osuc.dev/')}
						aria-label="Conocer más información acerca de nosotros"
					>
						Conocer más acerca de nosotros
					</Button>
				</div>
			</div>
		</div>
	)
}
