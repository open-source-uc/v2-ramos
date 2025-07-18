'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon, LoadingIcon } from '@/components/icons/icons'

interface SearchProps {
	onSearch: (searchTerm: string) => void
	placeholder?: string
	className?: string
	initialValue?: string
	isSearching?: boolean // New prop to indicate loading state
	useFuzzySearch?: boolean // Option to use Fuse.js for normalization
}

export function Search({
	onSearch,
	placeholder = 'Buscar por nombre o sigla...',
	className = '',
	initialValue = '',
	isSearching = false, // Default to false
	useFuzzySearch = false, // Default to false to maintain backward compatibility
}: SearchProps) {
	const [searchTerm, setSearchTerm] = useState(initialValue)

	const handleSearch = (value: string) => {
		setSearchTerm(value)

		// If using fuzzy search, pass the original value (Fuse.js handles normalization)
		if (useFuzzySearch) {
			onSearch(value)
		}
	}

	const clearSearch = () => {
		setSearchTerm('')
		onSearch('')
	}

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<div className="relative flex-1">
				<div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transform">
					{isSearching ? (
						<LoadingIcon className="fill-border h-4 w-4 animate-spin" />
					) : (
						<SearchIcon className="fill-border h-4 w-4" />
					)}
				</div>
				<Input
					type="text"
					placeholder={placeholder}
					value={searchTerm}
					onChange={(e) => handleSearch(e.target.value)}
					className="pl-10"
				/>
				{searchTerm && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={clearSearch}
						className={`${searchTerm ? 'visible' : 'invisible'} hover:bg-muted absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0`}
					>
						✕
					</Button>
				)}
			</div>
		</div>
	)
}
