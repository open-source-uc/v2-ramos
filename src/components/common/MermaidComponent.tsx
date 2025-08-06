import React, { useEffect, useRef, useState } from 'react'

interface MermaidComponentProps {
	chart: string
	className?: string
}

export function MermaidComponent({ chart, className = '' }: MermaidComponentProps) {
	const chartRef = useRef<HTMLDivElement>(null)
	const [isClient, setIsClient] = useState(false)
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		setIsClient(true)
		// Check initial theme
		setIsDark(document.documentElement.classList.contains('dark'))
	}, [])

	useEffect(() => {
		if (!isClient) return

		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					setIsDark(document.documentElement.classList.contains('dark'))
				}
			})
		})

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		})

		return () => observer.disconnect()
	}, [isClient])

	useEffect(() => {
		if (!isClient || !chartRef.current) return

		const renderMermaid = async () => {
			try {
				// Dynamic import to ensure mermaid only loads on client
				const mermaid = (await import('mermaid')).default

				// Initialize mermaid with theme based on current mode
				const theme = isDark ? 'dark' : 'neutral'

				mermaid.initialize({
					startOnLoad: false,
					theme: theme,
					securityLevel: 'loose',
					flowchart: {
						useMaxWidth: true,
						htmlLabels: true,
					},
					sequence: {
						useMaxWidth: true,
					},
					gantt: {
						useMaxWidth: true,
					},
				})

				// Generate unique ID for the chart
				const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

				// Render the chart
				const { svg } = await mermaid.render(id, chart)
				if (chartRef.current) {
					chartRef.current.innerHTML = svg
				}
			} catch (error) {
				console.error('Mermaid rendering error:', error)
				if (chartRef.current) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error'
					chartRef.current.innerHTML = `<p class="text-red-500">Error rendering diagram: ${errorMessage}</p>`
				}
			}
		}

		renderMermaid()
	}, [chart, isClient, isDark])

	if (!isClient) {
		return (
			<div className={`mermaid-container ${className}`} style={{ textAlign: 'center' }}>
				<div className="text-muted-foreground">Loading diagram...</div>
			</div>
		)
	}

	return (
		<div
			ref={chartRef}
			className={`mermaid-container ${className}`}
			style={{ textAlign: 'center' }}
		/>
	)
}
