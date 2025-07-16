'use client'

import * as React from 'react'
import { SearchIcon, LoadingIcon } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { useCommand } from '@/components/providers/CommandProvider'

export default function CommandSearchTrigger() {
	const { setIsOpen } = useCommand()
	const [isSearching, setIsSearching] = React.useState(false)

	const handleClick = () => {
		// Dispatch custom event to communicate across hydration boundaries
		window.dispatchEvent(new CustomEvent('openCommandSearch'))
		setIsOpen(true)
	}

	return (
		<button
			className={cn(
				'border-border bg-background inline-flex w-full max-w-sm items-center gap-3 rounded-lg border px-3 py-1 text-sm',
				'text-muted-foreground/70 hover:bg-muted/50 transition-colors',
				'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none'
			)}
			onClick={handleClick}
			aria-label="Buscar cursos y comandos"
		>
			{isSearching ? (
				<LoadingIcon className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
			) : (
				<SearchIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
			)}
			<span className="grow text-left text-sm font-normal">Buscar...</span>
			<kbd className="border-border bg-muted text-muted-foreground hidden inline-flex h-5 items-center rounded border px-1.5 text-[10px] font-medium">
				⌘K
			</kbd>
		</button>
	)
}
