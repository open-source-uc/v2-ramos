'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchProps {
	onSearch: (searchTerm: string) => void
	placeholder?: string
	className?: string
	initialValue?: string
	normalizeText?: boolean // Option to enable/disable text normalization
}

// Function to normalize text for searching (handle special characters)
const normalizeSearchText = (text: string) => {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
}

export function Search({
	onSearch,
	placeholder = 'Buscar por nombre o sigla...',
	className = '',
	initialValue = '',
	normalizeText = true, // Default to true for better search experience
}: SearchProps) {
	const [searchTerm, setSearchTerm] = useState(initialValue)

	const handleSearch = (value: string) => {
		setSearchTerm(value)
		// Pass both original and normalized text to the parent component
		const searchValue = normalizeText ? normalizeSearchText(value) : value
		onSearch(searchValue)
	}

	const clearSearch = () => {
		setSearchTerm('')
		onSearch('')
	}

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<div className="relative flex-1">
				<Input
					variant="search"
					type="text"
					placeholder={placeholder}
					value={searchTerm}
					onChange={(e) => handleSearch(e.target.value)}
				/>
				{searchTerm && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={clearSearch}
						className="hover:bg-muted absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0"
					>
						✕
					</Button>
				)}
			</div>
		</div>
	)
}

// Export the normalize function for external use when needed
export { normalizeSearchText }
