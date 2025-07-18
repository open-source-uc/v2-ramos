'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search } from '../search/SearchInput'
import type { Course } from '../../table/columns'
import { DataTable } from '../../table/data-table'
import { Skeleton } from '../../ui/skeleton'
import { CourseFilters } from './CourseFilters'

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


	// Filter data based on all filter criteria
	const filteredData = useMemo(() => {
		let filtered = courses

		if (selectedArea === 'formacion-general') {
			filtered = filtered.filter((course) => course.area && course.area !== 'Ninguna')
		} else if (selectedArea !== 'all') {
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

	const handleClearFilters = () => {
		setSelectedArea('all')
		setSelectedCampus('all')
		setSelectedSchool('all')
		setSelectedFormat('all')
		setSelectedSemester('all')
		setShowRetirableOnly(false)
		setShowEnglishOnly(false)
	}

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

					{/* Course Filters */}
					<CourseFilters
						courses={courses}
						selectedArea={selectedArea}
						selectedSchool={selectedSchool}
						selectedCampus={selectedCampus}
						selectedFormat={selectedFormat}
						selectedSemester={selectedSemester}
						showRetirableOnly={showRetirableOnly}
						showEnglishOnly={showEnglishOnly}
						filtersOpen={filtersOpen}
						onAreaChange={setSelectedArea}
						onSchoolChange={setSelectedSchool}
						onCampusChange={setSelectedCampus}
						onFormatChange={setSelectedFormat}
						onSemesterChange={setSelectedSemester}
						onRetirableToggle={setShowRetirableOnly}
						onEnglishToggle={setShowEnglishOnly}
						onFiltersOpenChange={setFiltersOpen}
						onClearFilters={handleClearFilters}
					/>

					{/* Data Table */}
					<DataTable data={filteredData} externalSearchValue={searchValue} />
				</>
			)}
		</div>
	)
}
