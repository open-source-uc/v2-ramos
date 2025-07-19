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
		<div className={`bg-background text-foreground rounded-2xl border ${className}`}>
			{children}
		</div>
	)
}
