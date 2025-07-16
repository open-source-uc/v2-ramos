import React, { useEffect, useRef, useState } from 'react'

export interface TagSelectorProps {
	name?: string
	label?: string
	description?: string
	tags: string[]
	selectedTags?: string[]
	placeholder?: string
	required?: boolean
	className?: string
}

const TagSelector: React.FC<TagSelectorProps> = ({
	name = 'tags',
	label = 'Tags',
	description,
	tags,
	selectedTags = [],
	placeholder = 'Selecciona las etiquetas...',
	required = false,
	className = '',
}) => {
	const [currentSelectedTags, setCurrentSelectedTags] = useState<string[]>(selectedTags)
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Eliminar sincronización automática con selectedTags para evitar sobrescribir el estado local

	// Close dropdown on outside click (use 'click' instead of 'mousedown' to avoid premature closing)
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setDropdownOpen(false)
			}
		}
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	function handleTagClick(tag: string) {
		if (currentSelectedTags.includes(tag)) {
			setCurrentSelectedTags(currentSelectedTags.filter((t) => t !== tag))
		} else {
			setCurrentSelectedTags([...currentSelectedTags, tag])
		}
	}

	function handleRemoveTag(tag: string) {
		setCurrentSelectedTags(currentSelectedTags.filter((t) => t !== tag))
	}

	function handleInputKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			setDropdownOpen((open) => !open)
		}
		if (e.key === 'Escape') {
			setDropdownOpen(false)
		}
	}

	return (
		<div className={`min-w-0 space-y-2 ${className}`} ref={containerRef}>
			{label && (
				<label className="text-foreground block text-sm font-medium">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			{description && <p className="text-muted-foreground mb-3 text-xs">{description}</p>}
			<div className="relative">
				{/* Input principal que muestra las tags seleccionadas */}
				<div
					className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring flex min-h-[44px] w-full min-w-0 cursor-pointer flex-wrap items-center gap-1 rounded-lg border px-3 py-2 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none sm:px-4 sm:py-3"
					tabIndex={0}
					onClick={() => setDropdownOpen((open) => !open)}
					onKeyDown={handleInputKeyDown}
					aria-haspopup="listbox"
					aria-expanded={dropdownOpen}
					role="combobox"
				>
					{currentSelectedTags.length === 0 && (
						<span className="text-muted-foreground select-none">{placeholder}</span>
					)}
					<div className="flex flex-wrap gap-1">
						{currentSelectedTags.map((tag) => (
							<span
								key={tag}
								className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm"
							>
								{tag}
								<button
									type="button"
									className="text-primary/70 hover:text-primary remove-tag ml-1"
									aria-label={`Quitar etiqueta ${tag}`}
									onClick={(e) => {
										e.stopPropagation()
										handleRemoveTag(tag)
									}}
								>
									×
								</button>
							</span>
						))}
					</div>
					{/* Hidden input for form submission */}
					<input
						type="hidden"
						name={name}
						value={currentSelectedTags.join(',')}
						data-testid="hidden-input"
					/>
				</div>
				{/* Dropdown con las opciones */}
				<div
					className={`bg-background border-border absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border shadow-lg transition-all duration-200 ${
						dropdownOpen ? '' : 'hidden'
					}`}
					role="listbox"
				>
					<div className="space-y-1 p-2">
						{tags.map((tag) => (
							<div
								key={tag}
								className={`hover:bg-muted tag-option cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
									currentSelectedTags.includes(tag) ? 'bg-primary/10 text-primary' : ''
								}`}
								data-tag={tag}
								onMouseDown={(e) => {
									e.preventDefault()
									e.stopPropagation()
									handleTagClick(tag)
								}}
								role="option"
								aria-selected={currentSelectedTags.includes(tag)}
								tabIndex={-1}
							>
								{tag}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TagSelector
