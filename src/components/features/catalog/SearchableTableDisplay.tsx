'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search } from '../search/SearchInput'
import type { Course } from '../../table/columns'
import { DataTable } from '../../table/data-table'
import { Combobox, type ComboboxOption } from '../../ui/combobox'
import { Skeleton } from '../../ui/skeleton'
import { Switch } from '../../ui/switch'
import { Button } from '../../ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '../../icons/icons'
import { cn } from '@/lib/utils'
import { isCurrentSemester } from '@/lib/currentSemester'

interface SearchableTableDisplayProps {
	initialSearchValue?: string
}

export function SearchableTableDisplay({ initialSearchValue = '' }: SearchableTableDisplayProps) {
	const [searchValue, setSearchValue] = useState(initialSearchValue)
	const [selectedArea, setSelectedArea] = useState<string>('all')
	const [selectedSchool, setSelectedSchool] = useState<string>('all')
	const [selectedCampus, setSelectedCampus] = useState<string>('all')
	const [selectedFormat, setSelectedFormat] = useState<string>('all')
	const [selectedSemester, setSelectedSemester] = useState<string>('all')
	const [showRetirableOnly, setShowRetirableOnly] = useState(false)
	const [showEnglishOnly, setShowEnglishOnly] = useState(false)
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [courses, setCourses] = useState<Course[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSearching, setIsSearching] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('https://public.osuc.dev/courses-score.ndjson')

				if (!response.ok) throw new Error('Network response was not ok')
				if (!response.body) throw new Error('ReadableStream not supported')

				const reader = response.body.getReader()
				const decoder = new TextDecoder()
				let buffer = ''
				let firstDataLoaded = false

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					buffer += decoder.decode(value, { stream: true })

					const lines = buffer.split('\n')
					buffer = lines.pop() || '' // guarda línea incompleta

					for (const line of lines) {
						if (line.trim()) {
							const item = JSON.parse(line)
							setCourses((prev) => [...prev, item])

							// Set loading to false as soon as the first data loads
							if (!firstDataLoaded) {
								setIsLoading(false)
								firstDataLoaded = true
							}
						}
					}
				}

				// Procesar último fragmento si queda algo
				if (buffer.trim()) {
					const item = JSON.parse(buffer)
					setCourses((prev) => [...prev, item])

					// Set loading to false if this is the first (and only) item
					if (!firstDataLoaded) {
						setIsLoading(false)
					}
				}
			} catch (error) {
				console.error('Failed to fetch courses as stream:', error)
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	// Get unique areas from the data
	const uniqueAreas = useMemo(() => {
		const areas = courses.map((course) => course.area).filter((area) => area && area !== 'Ninguna') // Filter out null/undefined and "Ninguna"
		return Array.from(new Set(areas)).sort()
	}, [courses])

	// Get unique campuses from the data
	const uniqueCampuses = useMemo(() => {
		const campuses = courses
			.flatMap((course) => course.campus || course.campus || []) // Handle both field names
			.filter((campus) => campus && campus.trim() !== '') // Filter out empty strings
		return Array.from(new Set(campuses)).sort()
	}, [courses])

	// Get unique schools from the data
	const uniqueSchools = useMemo(() => {
		const schools = courses
			.map((course) => course.school)
			.filter((school) => school && school.trim() !== '') // Filter out null/undefined and empty strings
		return Array.from(new Set(schools)).sort()
	}, [courses])

	// Get unique formats from the data
	const uniqueFormats = useMemo(() => {
		const formats = courses
			.flatMap((course) => (Array.isArray(course.format) ? course.format : [course.format]))
			.filter((format) => format && typeof format === 'string' && format.trim() !== '') // Filter out null/undefined and empty strings
		return Array.from(new Set(formats)).sort()
	}, [courses])

	// Get unique semesters from the data
	const uniqueSemesters = useMemo(() => {
		const semesters = courses
			.map((course) => course.last_semester)
			.filter((semester) => semester && semester.trim() !== '') // Filter out null/undefined and empty strings
		const uniqueSet = Array.from(new Set(semesters))

		// Sort semesters with current semester first, then by year and semester number
		return uniqueSet.sort((a, b) => {
			// Current semester always comes first
			if (isCurrentSemester(a)) return -1
			if (isCurrentSemester(b)) return 1

			// Parse semesters for comparison
			const [yearA, semA] = a.split('-').map(Number)
			const [yearB, semB] = b.split('-').map(Number)

			// Sort by year descending, then by semester descending
			if (yearA !== yearB) return yearB - yearA
			return semB - semA
		})
	}, [courses])

	// Convert unique areas to combobox options
	const areaOptions = useMemo((): ComboboxOption[] => {
		const options: ComboboxOption[] = [{ value: 'all', label: 'Todos los cursos' }]

		uniqueAreas.forEach((area) => {
			options.push({ value: area, label: area })
		})

		return options
	}, [uniqueAreas])

	// Convert unique schools to combobox options
	const schoolOptions = useMemo((): ComboboxOption[] => {
		const options: ComboboxOption[] = [{ value: 'all', label: 'Todas las unidades académicas' }]

		uniqueSchools.forEach((school) => {
			options.push({ value: school, label: school })
		})

		return options
	}, [uniqueSchools])

	// Convert unique campuses to combobox options
	const campusOptions = useMemo((): ComboboxOption[] => {
		const options: ComboboxOption[] = [{ value: 'all', label: 'Todos los campus' }]

		uniqueCampuses.forEach((campus) => {
			options.push({ value: campus, label: campus })
		})

		return options
	}, [uniqueCampuses])

	// Convert unique formats to combobox options
	const formatOptions = useMemo((): ComboboxOption[] => {
		const options: ComboboxOption[] = [{ value: 'all', label: 'Todos los formatos' }]

		uniqueFormats.forEach((format) => {
			options.push({ value: format, label: format })
		})

		return options
	}, [uniqueFormats])

	// Convert unique semesters to combobox options
	const semesterOptions = useMemo((): ComboboxOption[] => {
		const options: ComboboxOption[] = [{ value: 'all', label: 'Todos los semestres' }]

		uniqueSemesters.forEach((semester) => {
			const isCurrentSem = isCurrentSemester(semester)
			const label = isCurrentSem ? `${semester} (actual)` : semester
			options.push({ value: semester, label })
		})

		return options
	}, [uniqueSemesters])

	// Filter data based on all filter criteria
	const filteredData = useMemo(() => {
		let filtered = courses

		if (selectedArea !== 'all') {
			filtered = filtered.filter((course) => course.area === selectedArea)
		}

		if (selectedCampus !== 'all') {
			filtered = filtered.filter((course) => {
				const campusArray = course.campus || []
				return campusArray.includes(selectedCampus)
			})
		}

		if (selectedSchool !== 'all') {
			filtered = filtered.filter((course) => course.school === selectedSchool)
		}

		if (selectedFormat !== 'all') {
			filtered = filtered.filter((course) => {
				if (Array.isArray(course.format)) {
					return course.format.includes(selectedFormat)
				}
				return course.format === selectedFormat
			})
		}

		if (showRetirableOnly) {
			filtered = filtered.filter((course) => {
				const retirableArray = course.is_removable || []
				return retirableArray.some((removable) => removable === true)
			})
		}

		if (showEnglishOnly) {
			filtered = filtered.filter((course) => {
				if (Array.isArray(course.is_english)) {
					return course.is_english.some((isEnglish) => isEnglish === true)
				}
				return course.is_english === true
			})
		}

		if (selectedSemester !== 'all') {
			filtered = filtered.filter((course) => course.last_semester === selectedSemester)
		}

		return filtered
	}, [
		courses,
		selectedArea,
		selectedCampus,
		selectedSchool,
		selectedFormat,
		selectedSemester,
		showRetirableOnly,
		showEnglishOnly,
	])

	// Add debounced search effect
	useEffect(() => {
		if (searchValue !== initialSearchValue) {
			setIsSearching(true)
			const timer = setTimeout(() => {
				setIsSearching(false)
			}, 300) // Show loading for 300ms after user stops typing

			return () => clearTimeout(timer)
		}
	}, [searchValue, initialSearchValue])

	const handleSearch = (normalizedValue: string) => {
		setSearchValue(normalizedValue)
	}

	const handleAreaChange = (value: string) => {
		setSelectedArea(value)
	}

	const handleCampusChange = (value: string) => {
		setSelectedCampus(value)
	}

	const handleSchoolChange = (value: string) => {
		setSelectedSchool(value)
	}

	const handleRetirableToggle = (checked: boolean) => {
		setShowRetirableOnly(checked)
	}

	const handleFormatChange = (value: string) => {
		setSelectedFormat(value)
	}

	const handleEnglishToggle = (checked: boolean) => {
		setShowEnglishOnly(checked)
	}

	const handleSemesterChange = (value: string) => {
		setSelectedSemester(value)
	}

	// Count active filters
	const activeFiltersCount = useMemo(() => {
		let count = 0
		if (selectedArea !== 'all') count++
		if (selectedCampus !== 'all') count++
		if (selectedSchool !== 'all') count++
		if (selectedFormat !== 'all') count++
		if (selectedSemester !== 'all') count++
		if (showRetirableOnly) count++
		if (showEnglishOnly) count++
		return count
	}, [
		selectedArea,
		selectedCampus,
		selectedSchool,
		selectedFormat,
		selectedSemester,
		showRetirableOnly,
		showEnglishOnly,
	])

	return (
		<div className="container mx-auto py-4">
			{isLoading ? (
				<div className="space-y-4">
					{/* Search and Filters Skeleton */}
					<div className="tablet:flex-row tablet:items-center flex flex-col items-stretch justify-between gap-4">
						<Skeleton className="tablet:max-w-md h-10 w-full" />

						<div className="tablet:flex-row-reverse tablet:items-center flex w-full flex-col-reverse items-stretch gap-4">
							<Skeleton className="tablet:max-w-[300px] h-10 w-full" />
							<Skeleton className="tablet:max-w-[300px] h-10 w-full" />
						</div>
					</div>

					{/* Table Skeleton */}
					<div className="space-y-3">
						{/* Table Header Skeleton */}
						<div className="flex items-center space-x-4 py-3">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-28" />
						</div>

						{/* Table Rows Skeleton */}
						{Array.from({ length: 8 }).map((_, index) => (
							<div key={index} className="flex items-center space-x-4 border-b py-3">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-28" />
							</div>
						))}
					</div>
				</div>
			) : (
				<>
					{/* Search Component */}
					<div className="tablet:flex-row tablet:items-center mb-6 flex flex-col items-stretch justify-between gap-4">
						<Search
							onSearch={handleSearch}
							placeholder="Buscar por nombre o sigla..."
							className="w-full"
							initialValue={initialSearchValue}
							isSearching={isSearching}
						/>
					</div>

					{/* Collapsible Filters */}
					<Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
						<div className="border-border mb-3 rounded-md border">
							<CollapsibleTrigger className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-2 transition-colors">
								<div className="flex items-center gap-3">
									<h3 className="text-md font-semibold">Filtros</h3>
									{activeFiltersCount > 0 && (
										<div className="bg-primary-foreground text-primary border-primary-foreground rounded-full border px-3 py-1 text-xs font-medium">
											{activeFiltersCount}
										</div>
									)}
								</div>
								{filtersOpen ? (
									<ChevronUpIcon className="text-muted-foreground h-5 w-5" />
								) : (
									<ChevronDownIcon className="text-muted-foreground h-5 w-5" />
								)}
							</CollapsibleTrigger>

							<CollapsibleContent className="border-border border-t">
								<div className="space-y-6 p-6">
									{/* Filter Grid */}
									<div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
										{/* Campus Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">Campus</label>
											<Combobox
												options={campusOptions}
												value={selectedCampus}
												onValueChange={handleCampusChange}
												placeholder="Seleccionar campus"
												searchPlaceholder="Buscar campus..."
												emptyMessage="No se encontraron campus."
												className="w-full"
												buttonClassName={cn(
													selectedCampus !== 'all' &&
														'bg-primary-foreground text-primary border border-primary'
												)}
												aria-label="Filtrar por Campus"
											/>
										</div>

										{/* Area Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">
												Área de Formación General
											</label>
											<Combobox
												options={areaOptions}
												value={selectedArea}
												onValueChange={handleAreaChange}
												placeholder="Seleccionar área"
												searchPlaceholder="Buscar área..."
												emptyMessage="No se encontraron áreas."
												className="w-full"
												buttonClassName={cn(
													selectedArea !== 'all' &&
														'bg-primary-foreground text-primary border border-primary'
												)}
												aria-label="Filtrar por Área de Formación General"
											/>
										</div>

										{/* School Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">
												Unidad Académica
											</label>
											<Combobox
												options={schoolOptions}
												value={selectedSchool}
												onValueChange={handleSchoolChange}
												placeholder="Seleccionar unidad"
												searchPlaceholder="Buscar unidad..."
												emptyMessage="No se encontraron unidades."
												className="w-full"
												buttonClassName={cn(
													selectedSchool !== 'all' &&
														'bg-primary-foreground text-primary border border-primary'
												)}
												aria-label="Filtrar por Unidad Académica"
											/>
										</div>

										{/* Format Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">Formato</label>
											<Combobox
												options={formatOptions}
												value={selectedFormat}
												onValueChange={handleFormatChange}
												placeholder="Seleccionar formato"
												searchPlaceholder="Buscar formato..."
												emptyMessage="No se encontraron formatos."
												className="w-full"
												buttonClassName={cn(
													selectedFormat !== 'all' &&
														'bg-primary-foreground text-primary border border-primary'
												)}
												aria-label="Filtrar por Formato"
											/>
										</div>

										{/* Semester Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">Último Semestre Impartido</label>
											<Combobox
												options={semesterOptions}
												value={selectedSemester}
												onValueChange={handleSemesterChange}
												placeholder="Seleccionar semestre"
												searchPlaceholder="Buscar semestre..."
												emptyMessage="No se encontraron semestres."
												className="w-full"
												buttonClassName={cn(
													selectedSemester !== 'all' &&
														'bg-primary-foreground text-primary border border-primary'
												)}
												aria-label="Filtrar por Último Semestre"
											/>
										</div>
									</div>

									{/* Switch Filters Row */}
									<div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
										{/* English Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">
												Solo Cursos en Inglés
											</label>
											<div className="flex items-center space-x-2 pt-2">
												<Switch
													id="english-filter"
													checked={showEnglishOnly}
													onCheckedChange={handleEnglishToggle}
													aria-label="Mostrar solo cursos en inglés"
												/>
												<label
													htmlFor="english-filter"
													className="text-muted-foreground cursor-pointer text-sm"
												>
													{showEnglishOnly ? 'Activado' : 'Desactivado'}
												</label>
											</div>
										</div>

										{/* Retirable Filter */}
										<div className="space-y-2">
											<label className="text-foreground text-sm font-medium">
												Solo Cursos Retirables
											</label>
											<div className="flex items-center space-x-2 pt-2">
												<Switch
													id="retirable-filter"
													checked={showRetirableOnly}
													onCheckedChange={handleRetirableToggle}
													aria-label="Mostrar solo cursos retirables"
												/>
												<label
													htmlFor="retirable-filter"
													className="text-muted-foreground cursor-pointer text-sm"
												>
													{showRetirableOnly ? 'Activado' : 'Desactivado'}
												</label>
											</div>
										</div>
									</div>

									{/* Clear Filters Button */}
									{activeFiltersCount > 0 && (
										<div className="border-border border-t pt-4">
											<Button
												variant="ghost"
												size="sm"
												icon={CloseIcon}
												onClick={() => {
													setSelectedArea('all')
													setSelectedCampus('all')
													setSelectedSchool('all')
													setSelectedFormat('all')
													setSelectedSemester('all')
													setShowRetirableOnly(false)
													setShowEnglishOnly(false)
												}}
												className="text-muted-foreground hover:text-foreground"
											>
												Limpiar todos los filtros ({activeFiltersCount})
											</Button>
										</div>
									)}
								</div>
							</CollapsibleContent>
						</div>
					</Collapsible>

					{/* Data Table */}
					<DataTable data={filteredData} externalSearchValue={searchValue} />
				</>
			)}
		</div>
	)
}
