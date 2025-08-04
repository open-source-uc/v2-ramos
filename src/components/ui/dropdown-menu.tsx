import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from '@/components/icons/icons'

interface DropdownMenuProps {
	children: React.ReactNode
	trigger: React.ReactNode
	className?: string
}

interface DropdownMenuItemProps {
	children: React.ReactNode
	onClick: () => void
	className?: string
}

export function DropdownMenu({ children, trigger, className }: DropdownMenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className={cn('relative', className)} ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'inline-flex items-center justify-center gap-2 rounded-md',
					'bg-background hover:bg-accent hover:text-accent-foreground',
					'border border-border px-4 py-2 text-sm font-medium',
					'transition-colors focus-visible:outline-none focus-visible:ring-2',
					'focus-visible:ring-ring focus-visible:ring-offset-2',
					'disabled:pointer-events-none disabled:opacity-50'
				)}
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				{trigger}
				<ChevronDownIcon
					className={cn(
						'h-4 w-4 transition-transform duration-200',
						isOpen && 'rotate-180'
					)}
				/>
			</button>

			{isOpen && (
				<div
					className={cn(
						'absolute right-0 z-50 mt-1 min-w-[180px] rounded-md border',
						'bg-popover text-popover-foreground shadow-md',
						'animate-in fade-in-0 zoom-in-95'
					)}
				>
					<div className="p-1">
						{children}
					</div>
				</div>
			)}
		</div>
	)
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'relative flex w-full cursor-default select-none items-center rounded-sm',
				'px-2 py-1.5 text-sm outline-none transition-colors',
				'hover:bg-blue-600 hover:text-background',
				'focus:bg-accent focus:text-accent-foreground',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				className
			)}
		>
			{children}
		</button>
	)
}
