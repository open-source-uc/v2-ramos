import React, { useState, useEffect } from 'react'

interface MermaidComponentProps {
	chart: string
	className?: string
}

export function MermaidComponent({ chart, className = '' }: MermaidComponentProps) {
	const [imageUrl, setImageUrl] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isDark, setIsDark] = useState(false)

	// Detect theme changes
	useEffect(() => {
		const checkTheme = () => {
			setIsDark(document.documentElement.classList.contains('dark'))
		}

		// Initial check
		checkTheme()

		// Listen for theme changes
		const observer = new MutationObserver(checkTheme)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		})

		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		const generateDiagram = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// Clean and prepare the chart
				const cleanChart = chart.trim()

				// Encode using base64 like the working example
				const encodedChart = btoa(unescape(encodeURIComponent(cleanChart)))

				// Configure theme parameters based on current theme
				const theme = isDark ? 'dark' : 'neutral'
				const bgColor = isDark ? '1e1e1e' : 'transparent'

				// Use Mermaid.ink service with theme parameters
				const mermaidUrl = `https://mermaid.ink/img/${encodedChart}?theme=${theme}&bgColor=${bgColor}`

				// Verify the image loads correctly
				const img = new Image()
				img.onload = () => {
					setImageUrl(mermaidUrl)
					setIsLoading(false)
				}
				img.onerror = () => {
					setError('Failed to render diagram')
					setIsLoading(false)
				}
				img.src = mermaidUrl
			} catch (err) {
				setError('Error generating diagram')
				setIsLoading(false)
			}
		}

		if (chart.trim()) {
			generateDiagram()
		}
	}, [chart, isDark])

	if (isLoading) {
		return (
			<div className={`mermaid-container ${className}`} style={{ textAlign: 'center' }}>
				<div className="text-muted-foreground py-8">
					<div className="animate-pulse">Generando diagrama...</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={`mermaid-container ${className}`} style={{ textAlign: 'center' }}>
				<div className="rounded border border-red-200 bg-red-50 py-4 text-red-500 dark:border-red-800 dark:bg-red-900/20">
					<p className="font-medium">Error al renderizar diagrama</p>
					<p className="mt-1 text-sm">Los servicios externos de Mermaid no están disponibles</p>
				</div>
			</div>
		)
	}

	if (!imageUrl) {
		return null
	}

	return (
		<div className={`mermaid-container ${className}`} style={{ textAlign: 'center' }}>
			<img
				src={imageUrl}
				alt="Mermaid diagram"
				className="mx-auto h-auto max-w-full"
				style={{ maxWidth: '100%', height: 'auto' }}
			/>
		</div>
	)
}
