import { useEffect, useState, useRef } from 'react'

type Course = {
	sigle: string
	[key: string]: any
}

const CACHE_KEY = 'coursesSectionsCache'

export function useCoursesSections(): [Course[], boolean] {
	const [courses, setCourses] = useState<Course[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			const cache = sessionStorage.getItem(CACHE_KEY)
			if (cache) {
				setCourses(JSON.parse(cache))
				return
			}

			try {
				setIsLoading(true)
				const response = await fetch(
					'https://public.osuc.dev/courses-sections.ndjson?' + Date.now(),
					{
						cache: 'no-store',
					}
				)

				if (!response.ok) throw new Error('Network response was not ok')
				if (!response.body) throw new Error('ReadableStream not supported')

				const reader = response.body.getReader()
				const decoder = new TextDecoder()
				let buffer = ''
				const parsedCourses: Course[] = []
				let firstDataLoaded = false

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					buffer += decoder.decode(value, { stream: true })
					const lines = buffer.split('\n')
					buffer = lines.pop() || ''

					for (const line of lines) {
						if (line.trim()) {
							const item = JSON.parse(line)
							parsedCourses.push(item)

							// Set loading to false as soon as the first data loads
							if (!firstDataLoaded) {
								setIsLoading(false)
								firstDataLoaded = true
							}
						}
					}
				}

				// Último fragmento
				if (buffer.trim()) {
					const item = JSON.parse(buffer)
					parsedCourses.push(item)

					// Set loading to false if this is the first (and only) item
					if (!firstDataLoaded) {
						setIsLoading(false)
					}
				}

				setCourses(parsedCourses)
				sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsedCourses))
			} catch (error) {
				console.error('Failed to fetch courses as stream:', error)
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	return [courses, isLoading]
}
