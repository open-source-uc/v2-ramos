'use client'

import { useState, useMemo } from 'react'
import { Search } from '../search/SearchInput'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select'
import { Pill } from '@/components/ui/pill'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types'

interface SearchableRecommendationsDisplayProps {
	recommendations: Recommendation[]
	initialSearchValue?: string
}

// Utility function to normalize text by removing accents and converting to lowercase
const normalizeText = (text: string): string => {
	return text
		.toLowerCase()
		.normalize('NFD') // Decompose accented characters
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
		.replace(/[^\w\s]/g, '') // Remove special characters except word characters and spaces
}

export function SearchableRecommendationsDisplay({
	recommendations,
	initialSearchValue = '',
}: SearchableRecommendationsDisplayProps) {
	const [searchValue, setSearchValue] = useState(initialSearchValue)
	const [selectedFaculty, setSelectedFaculty] = useState<string>('all')
	const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-1')

	// Get unique faculties from the data
	const uniqueFaculties = useMemo(() => {
		const faculties = recommendations
			.map((rec) => rec.data.faculty)
			.filter((faculty) => faculty && faculty.trim() !== '') // Filter out null/undefined and empty strings
		return Array.from(new Set(faculties)).sort()
	}, [recommendations])

	// Get unique periods from the data
	const uniquePeriods = useMemo(() => {
		const periods = recommendations
			.map((rec) => rec.data.period)
			.filter((period) => period && period.trim() !== '') // Filter out null/undefined and empty strings
		return Array.from(new Set(periods)).sort()
	}, [recommendations])

	// Filter data based on search, faculty and period selection
	const filteredRecommendations = useMemo(() => {
		let filtered = recommendations

		// Filter by faculty
		if (selectedFaculty !== 'all') {
			filtered = filtered.filter((rec) => rec.data.faculty === selectedFaculty)
		}

		// Filter by period
		if (selectedPeriod !== 'all') {
			filtered = filtered.filter((rec) => rec.data.period === selectedPeriod)
		}

		// Filter by search value
		if (searchValue.trim() !== '') {
			const normalizedSearch = normalizeText(searchValue)
			filtered = filtered.filter((rec) => {
				const { title, code, initiative, tags, resume } = rec.data

				return (
					normalizeText(title).includes(normalizedSearch) ||
					normalizeText(code).includes(normalizedSearch) ||
					normalizeText(initiative).includes(normalizedSearch) ||
					normalizeText(resume).includes(normalizedSearch) ||
					tags.some((tag: string) => normalizeText(tag).includes(normalizedSearch))
				)
			})
		}

		return filtered
	}, [recommendations, selectedFaculty, selectedPeriod, searchValue])

	const handleSearch = (value: string) => {
		setSearchValue(value)
	}

	const handleFacultyChange = (value: string) => {
		setSelectedFaculty(value)
	}

	const handlePeriodChange = (value: string) => {
		setSelectedPeriod(value)
	}
	return (
		<main className="flex flex-col gap-8">
			<header className="flex flex-col justify-between md:flex-row">
				<h1 className="text-2xl font-bold">Recomendaciones</h1>
			</header>
			{/* Search and Filters */}
			<section
				className="tablet:flex-row flex w-full flex-col items-center justify-between gap-4"
				aria-label="Filtros de búsqueda"
			>
				<Search
					onSearch={handleSearch}
					placeholder="Buscar por título, código, iniciativa, tags..."
					className="w-full max-w-md"
					initialValue={initialSearchValue}
				/>

				<div className="tablet:flex-row-reverse flex w-full flex-col-reverse items-center gap-4">
					{/* Faculty Filter */}
					<Select value={selectedFaculty} onValueChange={handleFacultyChange}>
						<SelectTrigger
							className={cn(
								'tablet:max-w-[250px] w-full',
								selectedFaculty !== 'all' &&
									'bg-primary-foreground text-primary border-primary border'
							)}
						>
							<SelectValue placeholder="Facultades" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Filtrar por Facultad</SelectLabel>
								<SelectItem value="all">Todas las facultades</SelectItem>
								{uniqueFaculties.map((faculty) => (
									<SelectItem key={faculty} value={faculty}>
										{faculty}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					{/* Period Filter */}
					<Select value={selectedPeriod} onValueChange={handlePeriodChange}>
						<SelectTrigger
							className={cn(
								'tablet:max-w-[200px] w-full',
								selectedPeriod !== 'all' &&
									'bg-primary-foreground text-primary border-primary border'
							)}
						>
							<SelectValue placeholder="Períodos" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Filtrar por Período</SelectLabel>
								<SelectItem value="all">Todos los períodos</SelectItem>
								{uniquePeriods.map((period) => (
									<SelectItem key={period} value={period}>
										{period}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</section>
			{/* Results */}
			<section className="space-y-4" aria-label="Resultados de recomendaciones">
				<div className="text-foreground-muted-dark text-sm" role="status" aria-live="polite">
					{filteredRecommendations.length} recomendaciones encontradas
				</div>
				<div
					className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
					role="list"
					aria-label="Lista de recomendaciones"
				>
					{filteredRecommendations.map((rec) => {
						const { slug, data } = rec
						const { title, code, initiative, period, faculty, qualification, tags, resume } = data
						return (
							<a
								key={slug}
								href={`/recommendations/${code}-${initiative.replace(/\s/g, '')}`}
								className="border-border focus:ring-ring block cursor-pointer rounded-lg border p-6 no-underline transition-shadow hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
								role="listitem"
								aria-label={`Ver detalles de la recomendación: ${title} - ${code}`}
							>
								<article className="space-y-3">
									<header className="flex items-start justify-between gap-4">
										<div className="flex flex-col items-start gap-2">
											<h3
												className="text-lg leading-tight font-semibold"
												style={{
													viewTransitionName: `recommendation-title-${code}-${initiative.replace(
														/\s/g,
														''
													)}`,
												}}
											>
												{title}
											</h3>
											<div
												style={{
													viewTransitionName: `transition-pill-${code}-${initiative.replace(
														/\s/g,
														''
													)}`,
												}}
											>
												<Pill size="sm">Iniciativa estudiantil reconocida</Pill>
											</div>
										</div>
										<span
											className="font-mono text-sm font-semibold"
											aria-label={`Código del curso: ${code}`}
											style={{
												viewTransitionName: `code-${code}-${initiative.replace(/\s/g, '')}`,
											}}
										>
											{code}
										</span>
									</header>
									<div className="text-muted-foreground space-y-1 text-sm">
										<div
											className="font-medium"
											style={{
												viewTransitionName: `initiative-${code}-${initiative.replace(/\s/g, '')}`,
											}}
										>
											{initiative}
										</div>
										<div className="flex items-center gap-1">
											<span
												aria-label="Facultad"
												style={{
													viewTransitionName: `faculty-${code}-${initiative.replace(/\s/g, '')}`,
												}}
											>
												{faculty}
											</span>
											<span aria-hidden="true">•</span>
											<span
												aria-label="Período"
												style={{
													viewTransitionName: `period-${code}-${initiative.replace(/\s/g, '')}`,
												}}
											>
												{period}
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span
											className="text-muted-foreground text-sm"
											style={{
												viewTransitionName: `qualification-label-${code}-${initiative.replace(
													/\s/g,
													''
												)}`,
											}}
										>
											Calificación:
										</span>
										<div
											className="font-semibold"
											aria-label={`Calificación: ${qualification} de 7`}
											style={{
												viewTransitionName: `qualification-${code}-${initiative.replace(
													/\s/g,
													''
												)}`,
											}}
										>
											<span className="text-lg">{qualification}</span>
											<span className="text-muted-foreground text-sm">/7</span>
										</div>
									</div>
									<p className="line-clamp-3 text-sm leading-relaxed">{resume}</p>
									<footer
										className="flex flex-wrap gap-1"
										aria-label="Etiquetas"
										role="list"
										style={{
											viewTransitionName: `tags-${code}-${initiative.replace(/\s/g, '')}`,
										}}
									>
										{tags.map((tag: string, index: number) => (
											<Pill key={index} size="sm" variant="ghost_blue">
												{tag}
											</Pill>
										))}
									</footer>
								</article>
							</a>
						)
					})}
				</div>
				{filteredRecommendations.length === 0 && (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">
							No se encontraron recomendaciones que coincidan con tu búsqueda.
						</p>
					</div>
				)}
			</section>
		</main>
	)
}
