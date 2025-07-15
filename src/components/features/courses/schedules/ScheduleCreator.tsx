import { useState, useEffect } from 'react'
import { useCoursesSections } from '@/components/hooks/useCoursesSections'
import {
	createScheduleMatrix,
	detectScheduleConflicts,
	TIME_SLOTS,
	DAYS,
	convertNDJSONToSections,
} from '@/lib/scheduleMatrix'
import {
	getSavedCourses,
	saveCourses,
	addCourseToSchedule,
	removeCourseFromSchedule,
} from '@/lib/scheduleStorage'
import type { ScheduleMatrix } from '@/types'
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
	SearchIcon,
	SelectionIcon,
	LockClosedIcon,
	LockOpenIcon,
	CalendarIcon,
	CloseIcon,
	CheckIcon,
} from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { getClassTypeLong } from './ScheduleLegend'
import { Search, normalizeSearchText } from '@/components/features/search/SearchInput'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command'

// Define color variants for different courses
const COLOR_VARIANTS = [
	'schedule_blue',
	'schedule_green',
	'schedule_pink',
	'schedule_purple',
	'schedule_orange',
	'schedule_red',
] as const

// Course option interface
interface CourseOption {
	id: string
	sigle: string
	seccion: string
	nombre: string
}

// Helper to generate course options from fetched data
function getCourseOptions(courses: any[]): CourseOption[] {
	return courses.flatMap((course) => {
		if (!course.sections) return []
		return Object.keys(course.sections).map((seccion) => ({
			id: `${course.sigle}-${seccion}`,
			sigle: course.sigle,
			seccion,
			nombre: course.name || 'Sin nombre',
		}))
	})
}

// Course search and selection component
function CourseSearch({
	onCourseSelect,
	selectedCourses,
	courseOptions,
	isLoading,
}: {
	onCourseSelect: (courseId: string) => void
	selectedCourses: string[]
	courseOptions: CourseOption[]
	isLoading: boolean
}) {
	const [searchTerm, setSearchTerm] = useState('')
	const [normalizedSearchTerm, setNormalizedSearchTerm] = useState('')
	const [isOpen, setIsOpen] = useState(false)

	const filteredOptions = courseOptions.filter((option) => {
		const normalizedId = normalizeSearchText(option.id)
		const normalizedName = normalizeSearchText(option.nombre)
		return (
			normalizedId.includes(normalizedSearchTerm) || normalizedName.includes(normalizedSearchTerm)
		)
	})

	const handleSelect = (courseId: string) => {
		if (!selectedCourses.includes(courseId)) {
			onCourseSelect(courseId)
			setSearchTerm('')
			setNormalizedSearchTerm('')
			setIsOpen(false)
		}
	}

	const handleSearch = (normalizedValue: string) => {
		setNormalizedSearchTerm(normalizedValue)
		setIsOpen(normalizedValue.length > 0)
	}

	return (
		<div className="relative">
			<Search
				onSearch={handleSearch}
				placeholder="Buscar curso (ej: IIC2214, Matemáticas)"
				initialValue={searchTerm}
			/>

			{isLoading ? (
				<div className="absolute z-10 mt-1 w-full">
					<div className="bg-background border-border text-muted-foreground rounded-lg border p-0 py-4 text-center shadow-lg">
						Cargando cursos...
					</div>
				</div>
			) : (
				isOpen &&
				normalizedSearchTerm && (
					<div className="absolute z-10 mt-1 w-full">
						<div className="bg-background border-border rounded-lg border p-0 shadow-lg">
							<Command>
								<CommandList className="max-h-64">
									<CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
										No se encontraron cursos
									</CommandEmpty>
									<CommandGroup>
										{filteredOptions.slice(0, 10).map((option) => (
											<CommandItem
												key={option.id}
												value={option.id}
												onSelect={() => handleSelect(option.id)}
												disabled={selectedCourses.includes(option.id)}
												className={cn(
													'flex cursor-pointer items-center gap-2 px-4 py-3',
													'hover:bg-muted transition-colors',
													'disabled:cursor-not-allowed disabled:opacity-50'
												)}
											>
												<CheckIcon
													className={cn(
														'h-4 w-4 shrink-0',
														selectedCourses.includes(option.id) ? 'opacity-100' : 'opacity-0'
													)}
												/>
												<div className="flex min-w-0 flex-1 flex-col gap-1">
													<span className="text-foreground font-medium">
														{option.sigle} - {option.nombre}
													</span>
													<span className="text-muted-foreground text-sm">
														Sección {option.seccion}
													</span>
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</div>
					</div>
				)
			)}
		</div>
	)
}

// Schedule grid component
function ScheduleGrid({
	matrix,
	selectedCourses,
}: {
	matrix: ScheduleMatrix
	selectedCourses: string[]
}) {
	const conflicts = detectScheduleConflicts(matrix)
	const hasConflicts = conflicts.length > 0

	return (
		<div className="border-border overflow-hidden rounded-lg border">
			<div className="overflow-x-auto">
				<div className="tablet:min-w-[800px] desktop:min-w-[900px] min-w-[700px]">
					{/* Header */}
					<div className="bg-muted/50 border-border grid grid-cols-7 border-b">
						<div className="text-muted-foreground p-3 text-sm font-medium">Horario</div>
						{DAYS.map((day) => (
							<div key={day} className="text-muted-foreground p-3 text-center text-sm font-medium">
								{day}
							</div>
						))}
					</div>

					{/* Time slots */}
					{TIME_SLOTS.map((time, timeIndex) => (
						<div
							key={time}
							className="border-border hover:bg-muted/25 grid grid-cols-7 border-b transition-colors"
						>
							{/* Time label */}
							<div className="text-muted-foreground bg-muted/25 p-3 text-sm font-medium">
								{time}
							</div>

							{/* Day columns */}
							{DAYS.map((day, dayIndex) => {
								const classes = matrix[timeIndex][dayIndex]
								const hasConflict = classes.length > 1

								return (
									<div
										key={`${day}-${timeIndex}`}
										className={cn(
											'tablet:min-h-[70px] flex min-h-[60px] flex-col items-center justify-center gap-1 p-2',
											hasConflict && 'bg-red-light border-red/20'
										)}
									>
										{classes.map((classInfo, index) => {
											const courseIndex = selectedCourses.findIndex(
												(c) => c === `${classInfo.courseId}-${classInfo.section}`
											)
											const colorVariant = COLOR_VARIANTS[courseIndex % COLOR_VARIANTS.length]

											return (
												<div
													key={`${classInfo.courseId}-${classInfo.section}-${index}`}
													className="w-full"
												>
													<Pill
														variant={colorVariant}
														size="xs"
														className="tablet:text-xs w-full min-w-0 justify-center px-1.5 py-0.5 text-[10px]"
													>
														<div className="text-center">
															<div className="font-medium">
																{classInfo.courseId}-{classInfo.section}
															</div>
															<div className="tablet:text-[10px] text-[9px] opacity-80">
																{getClassTypeLong(classInfo.type)}
															</div>
														</div>
													</Pill>
												</div>
											)
										})}
									</div>
								)
							})}
						</div>
					))}
				</div>
			</div>

			{/* Conflicts warning */}
			{hasConflicts && (
				<div className="bg-red-light/20 border-red/20 border-t p-4">
					<div className="flex items-center gap-2">
						<div className="bg-red h-2 w-2 rounded-full"></div>
						<span className="text-red text-sm font-medium">
							Conflictos detectados: {conflicts.length}
						</span>
					</div>
					<p className="text-red/80 mt-1 text-xs">
						Hay {conflicts.length} conflicto{conflicts.length > 1 ? 's' : ''} de horario en tu
						selección
					</p>
				</div>
			)}
		</div>
	)
}

// Main component
export default function ScheduleCreator() {
	const [locked, setLocked] = useState(false)
	const [selectedCourses, setSelectedCourses] = useState<string[]>(() => getSavedCourses())
	const hookResult = useCoursesSections()
	const courses = Array.isArray(hookResult[0]) ? hookResult[0] : []
	const isLoading = typeof hookResult[1] === 'boolean' ? hookResult[1] : false

	// Generate course options from fetched data
	const courseOptions = getCourseOptions(courses)

	// Save to localStorage whenever courses change
	useEffect(() => {
		saveCourses(selectedCourses)
	}, [selectedCourses])

	// Create schedule matrix from selected courses and fetched data
	// Use convertNDJSONToSections to get the correct structure
	const courseSectionsData = convertNDJSONToSections(courses)
	const scheduleMatrix = createScheduleMatrix(courseSectionsData, selectedCourses)

	const handleCourseSelect = (courseId: string) => {
		if (addCourseToSchedule(courseId)) {
			setSelectedCourses(getSavedCourses())
			toast.success(`${courseId} agregado a tu horario`)
		} else {
			toast.info(`${courseId} ya está en tu horario`)
		}
	}

	const handleCourseRemove = (courseId: string) => {
		if (removeCourseFromSchedule(courseId)) {
			setSelectedCourses(getSavedCourses())
			toast.success(`${courseId} eliminado de tu horario`)
		}
	}

	const getCourseColor = (courseId: string) => {
		const index = selectedCourses.indexOf(courseId)
		return index >= 0 ? COLOR_VARIANTS[index % COLOR_VARIANTS.length] : 'schedule_blue'
	}

	const getCourseInfo = (courseId: string) => {
		const option = courseOptions.find((opt) => opt.id === courseId)
		return option || { id: courseId, sigle: '', seccion: '', nombre: 'Curso no encontrado' }
	}

	return (
		<>
			<div className="mx-auto max-w-7xl px-4 py-8">
				{/* Course Search */}
				<div className="mb-8">
					<div className="border-border rounded-lg border p-6">
						<div className="mb-4 flex items-center gap-3">
							<div className="bg-blue-light text-blue border-blue/20 rounded-lg border p-2">
								<SearchIcon className="h-5 w-5 fill-current" />
							</div>
							<div>
								<h2 className="text-lg font-semibold">Buscar Cursos</h2>
								<p className="text-muted-foreground text-sm">
									Ingresa el código del curso o nombre para agregarlo a tu horario
								</p>
							</div>
						</div>

						<CourseSearch
							onCourseSelect={handleCourseSelect}
							selectedCourses={selectedCourses}
							courseOptions={courseOptions}
							isLoading={isLoading}
						/>
					</div>
				</div>

				{/* Selected Courses */}
				{selectedCourses.length > 0 && (
					<div className="mb-8">
						<div className="border-border rounded-lg border p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div className="flex items-center gap-3">
									<div className="bg-green-light text-green border-green/20 rounded-lg border p-2">
										<SelectionIcon className="h-5 w-5 fill-current" />
									</div>
									<div>
										<h2 className="text-lg font-semibold">Cursos Seleccionados</h2>
										<p className="text-muted-foreground text-sm">
											{selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''} en tu
											horario
										</p>
									</div>
								</div>
								<Button
									onClick={() => setLocked(!locked)}
									aria-label={locked ? 'Unlock courses' : 'Lock courses'}
									variant="ghost_border"
									size="icon"
								>
									{locked ? (
										<LockClosedIcon className="text-muted-foreground h-5 w-5" />
									) : (
										<LockOpenIcon className="text-muted-foreground h-5 w-5" />
									)}
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{selectedCourses.map((courseId) => {
									const courseInfo = getCourseInfo(courseId)
									const colorVariant = getCourseColor(courseId)
									return (
										<div
											key={courseId}
											className={cn(
												'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
												colorVariant === 'schedule_blue' &&
													'bg-blue-light text-blue border-blue/20',
												colorVariant === 'schedule_green' &&
													'bg-green-light text-green border-green/20',
												colorVariant === 'schedule_pink' &&
													'bg-pink-light text-pink border-pink/20',
												colorVariant === 'schedule_purple' &&
													'bg-purple-light text-purple border-purple/20',
												colorVariant === 'schedule_orange' &&
													'bg-orange-light text-orange border-orange/20',
												colorVariant === 'schedule_red' && 'bg-red-light text-red border-red/20'
											)}
										>
											<div className="flex min-w-0 flex-col">
												<span className="font-medium">
													{courseInfo.sigle} - {courseInfo.nombre}
												</span>
												<span className="text-xs opacity-80">Sección {courseInfo.seccion}</span>
											</div>
											{!locked && (
												<button
													onClick={() => handleCourseRemove(courseId)}
													className="bg-background/50 hover:bg-background/80 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs transition-colors"
													aria-label={`Eliminar ${courseId}`}
												>
													<CloseIcon className="h-3 w-3" />
												</button>
											)}
										</div>
									)
								})}
							</div>
						</div>
					</div>
				)}

				{/* Schedule Grid */}
				<div className="mb-8">
					<div className="border-border overflow-hidden rounded-lg border">
						<div className="bg-muted/50 border-border border-b px-6 py-4">
							<div className="flex items-center gap-3">
								<div className="bg-orange-light text-orange border-orange/20 rounded-lg border p-2">
									<CalendarIcon className="h-5 w-5 fill-current" />
								</div>
								<div>
									<h2 className="text-lg font-semibold">Tu Horario</h2>
									<p className="text-muted-foreground text-sm">
										Visualiza tu horario semanal con todos los cursos seleccionados
									</p>
								</div>
							</div>
						</div>

						<div className="p-6">
							{selectedCourses.length > 0 ? (
								<ScheduleGrid matrix={scheduleMatrix} selectedCourses={selectedCourses} />
							) : (
								<div className="py-12 text-center">
									<div className="mb-4">
										<CalendarIcon className="text-muted-foreground mx-auto h-12 w-12 opacity-50" />
									</div>
									<p className="text-muted-foreground mb-2 text-lg font-medium">
										No hay cursos seleccionados
									</p>
									<p className="text-muted-foreground mb-6 text-sm">
										Agrega cursos usando el buscador de arriba para ver tu horario
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
