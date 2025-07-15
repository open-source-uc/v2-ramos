import { useState, useEffect } from 'react'
import { CalendarIcon, ChevronDownIcon, SwapIcon, CheckIcon } from '@/components/icons/icons'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { CourseSections } from '@/types'
import {
	createScheduleMatrix,
	TIME_SLOTS,
	DAYS,
	detectScheduleConflicts,
	getAvailableSections,
} from '@/lib/scheduleMatrix'
import { getClassTypeColor, getClassTypeShort } from './ScheduleLegend'
import { cn } from '@/lib/utils'

interface ScheduleCombinationsProps {
	selectedCourses: string[]
	courseSections: CourseSections
	onApplyCombination: (newCourses: string[]) => void
	className?: string
}

interface CombinationInfo {
	courses: string[]
	conflicts: number
	id: string
}

// Generate all possible combinations of sections for selected courses
function generateAllCombinations(
	selectedCourses: string[],
	courseSections: CourseSections,
	maxToReturn: number = 12
): CombinationInfo[] {
	if (selectedCourses.length === 0) return []

	// Get available sections for each course
	const courseOptionsMap: Record<string, string[]> = {}
	selectedCourses.forEach((courseSelection) => {
		const [courseId] = courseSelection.split('-')
		const availableSections = getAvailableSections(courseId, courseSections)
		courseOptionsMap[courseId] = availableSections
	})

	// Generate ALL combinations first (no early termination)
	const combinations: string[][] = []

	function generateRecursive(currentCombination: string[], courseIndex: number) {
		if (courseIndex >= selectedCourses.length) {
			combinations.push([...currentCombination])
			return
		}

		const [courseId] = selectedCourses[courseIndex].split('-')
		const availableSections = courseOptionsMap[courseId] || []

		for (const section of availableSections) {
			currentCombination[courseIndex] = `${courseId}-${section}`
			generateRecursive(currentCombination, courseIndex + 1)
		}
	}

	generateRecursive(new Array(selectedCourses.length), 0)

	// Calculate conflicts for each combination
	const combinationsWithInfo: CombinationInfo[] = combinations.map((combination, index) => {
		const matrix = createScheduleMatrix(courseSections, combination)
		const conflicts = detectScheduleConflicts(matrix)

		return {
			courses: combination,
			conflicts: conflicts.length,
			id: `combo-${index}`,
		}
	})

	// Sort by conflicts (best first), then by course order, and take only the best ones
	return combinationsWithInfo
		.sort((a, b) => {
			if (a.conflicts !== b.conflicts) {
				return a.conflicts - b.conflicts
			}
			return a.courses.join('').localeCompare(b.courses.join(''))
		})
		.slice(0, maxToReturn)
}

function CombinationGrid({
	combination,
	courseSections,
	onApply,
	isCurrentCombination,
	index,
}: {
	combination: CombinationInfo
	courseSections: CourseSections
	onApply: (courses: string[]) => void
	isCurrentCombination: boolean
	index: number
}) {
	const matrix = createScheduleMatrix(courseSections, combination.courses)

	// Check if there are Saturday classes
	const hasSaturdayClasses = TIME_SLOTS.some(
		(_, timeIndex) => matrix[timeIndex] && matrix[timeIndex][5] && matrix[timeIndex][5].length > 0
	)

	const displayDays = hasSaturdayClasses ? DAYS : DAYS.slice(0, 5)

	const handleApply = () => {
		onApply(combination.courses)
		toast.success(`Combinación ${index + 1} aplicada a tu horario`)
	}

	return (
		<div className="border-border tablet:p-4 rounded-lg border p-3">
			<div className="tablet:mb-3 mb-2 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h4 className="tablet:text-base text-sm font-medium">Opción {index + 1}</h4>
					{combination.conflicts === 0 ? (
						<Pill variant="green" size="xs">
							Sin conflictos
						</Pill>
					) : (
						<Pill variant="red" size="xs">
							{combination.conflicts} conflicto{combination.conflicts > 1 ? 's' : ''}
						</Pill>
					)}
				</div>

				<Button
					variant={isCurrentCombination ? 'outline' : 'ghost_blue'}
					size="xs"
					onClick={handleApply}
					disabled={isCurrentCombination}
					icon={isCurrentCombination ? CheckIcon : SwapIcon}
				>
					{isCurrentCombination ? 'Actual' : 'Aplicar'}
				</Button>
			</div>

			{/* Course sections info */}
			<div className="mb-3 space-y-1">
				{combination.courses.map((courseSelection, idx) => {
					const [courseId, sectionId] = courseSelection.split('-')
					return (
						<div key={idx} className="text-muted-foreground text-xs">
							<span className="font-medium">{courseId}</span> - Sección {sectionId}
						</div>
					)
				})}
			</div>

			{/* Minimalist Schedule Grid */}
			<div className="overflow-x-auto">
				<div className="min-w-[280px]">
					{/* Header with days */}
					<div
						className={`tablet:gap-1 tablet:mb-2 mb-1 grid gap-0.5`}
						style={{ gridTemplateColumns: `32px repeat(${displayDays.length}, 1fr)` }}
					>
						<div className="tablet:w-12 w-8"></div>
						{displayDays.map((day) => (
							<div
								key={day}
								className="tablet:text-xs text-muted-foreground tablet:px-1 px-0.5 py-1 text-center text-[10px] font-medium"
							>
								{day}
							</div>
						))}
					</div>

					{/* Time slots */}
					{TIME_SLOTS.map((time, timeIndex) => {
						const hasClassFromThisTimeOnwards = TIME_SLOTS.slice(timeIndex).some((_, futureIndex) =>
							displayDays.some((day) => {
								const dayIndex = DAYS.indexOf(day)
								return (
									matrix[timeIndex + futureIndex] &&
									matrix[timeIndex + futureIndex][dayIndex] &&
									matrix[timeIndex + futureIndex][dayIndex].length > 0
								)
							})
						)

						if (timeIndex === 0 || hasClassFromThisTimeOnwards) {
							return (
								<div
									key={time}
									className={`tablet:gap-1 tablet:mb-1 mb-0.5 grid gap-0.5`}
									style={{ gridTemplateColumns: `40px repeat(${displayDays.length}, 1fr)` }}
								>
									{/* Time label */}
									<div className="tablet:text-xs text-muted-foreground tablet:px-1 w-4 px-0.5 py-1 text-right text-[10px]">
										{time}
									</div>

									{/* Day columns */}
									{displayDays.map((day) => {
										const dayIndex = DAYS.indexOf(day)
										const classes = matrix[timeIndex][dayIndex]
										const hasConflict = classes.length > 1

										return (
											<div
												key={`${day}-${timeIndex}`}
												className={cn(
													'tablet:min-h-[32px] tablet:px-1 flex min-h-[24px] flex-col items-center justify-center gap-0.5 px-0.5 py-1',
													hasConflict && 'bg-red-light/30 border-red/20 rounded border'
												)}
											>
												{classes.map((classInfo, classIndex) => (
													<Pill
														key={classIndex}
														variant={getClassTypeColor(classInfo.type)}
														size="xs"
														className="tablet:text-[8px] min-w-0 px-1 py-0.5 text-[8px] leading-none"
													>
														{getClassTypeShort(classInfo.type)}
													</Pill>
												))}
											</div>
										)
									})}
								</div>
							)
						}
						return null
					})}
				</div>
			</div>
		</div>
	)
}

export default function ScheduleCombinations({
	selectedCourses,
	courseSections,
	onApplyCombination,
	className = '',
}: ScheduleCombinationsProps) {
	const [combinations, setCombinations] = useState<CombinationInfo[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (selectedCourses.length === 0) {
			setCombinations([])
			return
		}

		setIsLoading(true)

		// Add a small delay to show loading state
		const timer = setTimeout(() => {
			const allCombinations = generateAllCombinations(selectedCourses, courseSections, 12)
			setCombinations(allCombinations)
			setIsLoading(false)
		}, 100)

		return () => clearTimeout(timer)
	}, [selectedCourses, courseSections])

	const handleApplyCombination = (newCourses: string[]) => {
		onApplyCombination(newCourses)
	}

	// Check if current selection matches any combination
	const getCurrentCombinationIndex = () => {
		const currentSorted = [...selectedCourses].sort()
		return combinations.findIndex(
			(combo) =>
				combo.courses.length === currentSorted.length &&
				combo.courses.every((course, index) => course === currentSorted[index])
		)
	}

	const currentCombinationIndex = getCurrentCombinationIndex()

	// Don't show if no courses selected
	if (selectedCourses.length === 0) {
		return null
	}

	// Check if there are multiple sections available
	const hasMultipleSections = selectedCourses.some((courseSelection) => {
		const [courseId] = courseSelection.split('-')
		const availableSections = getAvailableSections(courseId, courseSections)
		return availableSections.length > 1
	})

	if (!hasMultipleSections) {
		return (
			<section className={className}>
				<div className="border-border overflow-hidden rounded-md border p-6">
					<div className="text-muted-foreground flex items-center gap-3">
						<div className="bg-muted text-muted-foreground border-border flex-shrink-0 rounded-lg border p-2">
							<CalendarIcon className="h-5 w-5 fill-current" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className="text-lg font-semibold">Combinaciones de Horario</h2>
							<p className="text-sm">Todos tus cursos tienen una sola sección disponible</p>
						</div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className={className}>
			<div className="border-border overflow-hidden rounded-md border">
				<Collapsible>
					<CollapsibleTrigger className="bg-background hover:bg-muted/50 group focus:ring-primary flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none">
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<div className="bg-purple-light text-purple border-purple/20 flex-shrink-0 rounded-lg border p-2">
								<CalendarIcon className="h-5 w-5 fill-current" />
							</div>
							<div className="min-w-0 flex-1">
								<h2 className="text-foreground text-lg font-semibold">Combinaciones de Horario</h2>
								<p className="text-muted-foreground text-sm">
									Explora todas las posibles combinaciones de secciones de tus cursos
								</p>
							</div>
						</div>
						<div className="ml-4 flex flex-shrink-0 items-center gap-2">
							{combinations.length > 0 && (
								<span className="text-muted-foreground tablet:inline hidden text-sm">
									{combinations.length} combinaciones
								</span>
							)}
							<span className="text-muted-foreground tablet:inline hidden text-sm">Expandir</span>
							<ChevronDownIcon className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent className="border-border bg-muted/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1 w-full overflow-hidden border-t px-6 py-4">
						{isLoading ? (
							<div className="py-8 text-center">
								<div className="border-purple mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
								<p className="text-muted-foreground text-sm">Generando combinaciones...</p>
							</div>
						) : combinations.length > 0 ? (
							<>
								<div className="text-muted-foreground mb-4 text-sm">
									Se encontraron <strong>{combinations.length}</strong> combinaciones posibles.
									{combinations.filter((c) => c.conflicts === 0).length > 0 && (
										<span className="text-green">
											{' '}
											{combinations.filter((c) => c.conflicts === 0).length} sin conflictos.
										</span>
									)}
								</div>

								<div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
									{combinations.map((combination, index) => (
										<CombinationGrid
											key={combination.id}
											combination={combination}
											courseSections={courseSections}
											onApply={handleApplyCombination}
											isCurrentCombination={index === currentCombinationIndex}
											index={index}
										/>
									))}
								</div>
							</>
						) : (
							<div className="py-8 text-center">
								<p className="text-muted-foreground text-sm">
									No se pudieron generar combinaciones de horario.
								</p>
							</div>
						)}
					</CollapsibleContent>
				</Collapsible>
			</div>
		</section>
	)
}
