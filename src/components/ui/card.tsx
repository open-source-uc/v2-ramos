import React from 'react'

type CardProps = {
	className?: string
	children: React.ReactNode
}

export function Card({
	className = '',
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<div
			className={`rounded-2xl border border-zinc-200 bg-white p-4 text-black shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white ${className}`}
		>
			{children}
		</div>
	)
}
