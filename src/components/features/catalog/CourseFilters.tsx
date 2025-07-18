'use client'

import { useMemo } from 'react'
import { Combobox, type ComboboxOption } from '../../ui/combobox'
import { Switch } from '../../ui/switch'
import { Button } from '../../ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '../../icons/icons'
import { cn } from '@/lib/utils'
import { isCurrentSemester } from '@/lib/currentSemester'
import type { Course } from '../../table/columns'

interface CourseFiltersProps {
	courses: Course[]
	selectedArea: string
	selectedSchool: string
	selectedCampus: string
	selectedFormat: string
	selectedSemester: string
	showRetirableOnly: boolean
	showEnglishOnly: boolean
	filtersOpen: boolean
	onAreaChange: (value: string) => void
	onSchoolChange: (value: string) => void
	onCampusChange: (value: string) => void
	onFormatChange: (value: string) => void
	onSemesterChange: (value: string) => void
	onRetirableToggle: (checked: boolean) => void
	onEnglishToggle: (checked: boolean) => void
	onFiltersOpenChange: (open: boolean) => void
	onClearFilters: () => void
}

export function CourseFilters({
	courses,
	selectedArea,
	selectedSchool,
	selectedCampus,
	selectedFormat,
	selectedSemester,
	showRetirableOnly,
	showEnglishOnly,
	filtersOpen,
	onAreaChange,
	onSchoolChange,
	onCampusChange,
	onFormatChange,
	onSemesterChange,
	onRetirableToggle,
	onEnglishToggle,
	onFiltersOpenChange,
	onClearFilters,
}: CourseFiltersProps) {
	// Get unique areas from the data
	const uniqueAreas = useMemo(() => {
		const areas = courses.map((course) => course.area).filter((area) => area && area !== 'Ninguna')
		return Array.from(new Set(areas)).sort()
	}, [courses])

	// Get unique campuses from the data
	const uniqueCampuses = useMemo(() => {
		const campuses = courses
			.flatMap((course) => course.campus || course.campus || [])
			.filter((campus) => campus && campus.trim() !== '')
		return Array.from(new Set(campuses)).sort()
	}, [courses])

	// Get unique schools from the data
	const uniqueSchools = useMemo(() => {
		const schools = courses
			.map((course) => course.school)
			.filter((school) => school && school.trim() !== '')
		return Array.from(new Set(schools)).sort()
	}, [courses])

	// Get unique formats from the data
	const uniqueFormats = useMemo(() => {
		const formats = courses
			.flatMap((course) => (Array.isArray(course.format) ? course.format : [course.format]))
			.filter((format) => format && typeof format === 'string' && format.trim() !== '')
		return Array.from(new Set(formats)).sort()
	}, [courses])

	// Get unique semesters from the data
	const uniqueSemesters = useMemo(() => {
		const semesters = courses
			.map((course) => course.last_semester)
			.filter((semester) => semester && semester.trim() !== '')
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
		const options: ComboboxOption[] = [
			{ value: 'all', label: 'Todos los cursos' },
			{ value: 'formacion-general', label: 'Solo cursos de formación general' },
		]

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
		<Collapsible open={filtersOpen} onOpenChange={onFiltersOpenChange}>
			<div className="bg-accent rounded-md">
				<CollapsibleTrigger className={`${filtersOpen ? 'rounded-t-md' : 'rounded-md'} flex w-full items-center border border-border justify-between px-4 py-2 transition-colors`}>
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

				<CollapsibleContent className="border-border border rounded-b-md">
					<div className="space-y-6 p-6">
						{/* Filter Grid */}
						<div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
							{/* Campus Filter */}
							<div className="space-y-2">
								<label className="text-foreground text-sm font-medium">Campus</label>
								<Combobox
									options={campusOptions}
									value={selectedCampus}
									onValueChange={onCampusChange}
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
									onValueChange={onAreaChange}
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
									onValueChange={onSchoolChange}
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
									onValueChange={onFormatChange}
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
									onValueChange={onSemesterChange}
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
										onCheckedChange={onEnglishToggle}
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
										onCheckedChange={onRetirableToggle}
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
									onClick={onClearFilters}
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
	)
}