'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MDXEditorMethods } from '@mdxeditor/editor'

interface PillMenuContentProps {
	editorRef: React.RefObject<MDXEditorMethods>
	onClose?: () => void
}

export default function PillMenuContent({ editorRef, onClose }: PillMenuContentProps) {
	const [pillSize, setPillSize] = React.useState<string>('sm')
	const [pillText, setPillText] = React.useState<string>('')

	const pillVariants = [
		{ variant: 'blue', label: '🔵 Azul' },
		{ variant: 'green', label: '🟢 Verde' },
		{ variant: 'red', label: '🔴 Rojo' },
		{ variant: 'purple', label: '🟣 Morado' },
		{ variant: 'orange', label: '🟠 Naranja' },
		{ variant: 'pink', label: '🩷 Rosa' },
	]

	const pillSizes = [
		{ value: 'sm', label: 'Pequeño (sm)' },
		{ value: 'md', label: 'Mediano (md)' },
		{ value: 'lg', label: 'Grande (lg)' },
		{ value: 'xl', label: 'Extra grande (xl)' },
	]

	const insertPill = (variant: string) => {
		const text = pillText || 'Pill'
		const pillMarkdown = `<Pill variant="${variant}" size="${pillSize}">${text}</Pill>`
		editorRef.current?.insertMarkdown(pillMarkdown)
		onClose?.()
		setPillText('')
	}

	return (
		<div className="space-y-3">
			<div>
				<label className="text-foreground mb-1 block text-xs font-medium">Tamaño:</label>
				<select
					className="border-border bg-background w-full rounded border px-2 py-1 text-xs"
					value={pillSize}
					onChange={(e) => setPillSize(e.target.value)}
				>
					{pillSizes.map((size) => (
						<option key={size.value} value={size.value}>
							{size.label}
						</option>
					))}
				</select>
			</div>
			<div>
				<label className="text-foreground mb-1 block text-xs font-medium">Texto:</label>
				<Input
					inputSize="sm"
					placeholder="Texto de la pill"
					value={pillText}
					onChange={(e) => setPillText(e.target.value)}
					className="w-full"
				/>
			</div>
			<div className="mt-3 max-h-48 space-y-1 overflow-y-auto">
				{pillVariants.map((pill) => (
					<Button
						key={pill.variant}
						type="button"
						variant="ghost"
						size="sm"
						className="w-full justify-start text-xs"
						onClick={() => insertPill(pill.variant)}
					>
						{pill.label}
					</Button>
				))}
			</div>
		</div>
	)
}
