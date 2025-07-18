import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { VeryHappyIcon, HappyIcon, NeutralIcon, SadIcon, VerySadIcon, QuestionIcon } from './icons'

const sentimentVariants = cva('inline-flex items-center gap-3 rounded-lg transition-colors', {
	variants: {
		sentiment: {
			veryHappy: 'bg-green-light text-green border border-green/20',
			happy: 'bg-green-light text-green border border-green/20',
			neutral: 'bg-orange-light text-orange border border-orange/20',
			sad: 'bg-red-light text-red border border-red/20',
			verySad: 'bg-red-light text-red border border-red/20',
			question: 'bg-muted text-muted-foreground border border-muted-foreground/20',
		},
		size: {
			xs: 'p-1.5',
			sm: 'p-2',
			default: 'p-2',
			lg: 'p-3',
		},
	},
	defaultVariants: {
		sentiment: 'neutral',
		size: 'default',
	},
})

export interface SentimentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof sentimentVariants> {
	sentiment: 'veryHappy' | 'happy' | 'neutral' | 'sad' | 'verySad' | 'question'
	ariaLabel?: string
	showTooltip?: boolean
	percentage?: number
	reviewCount?: number
}

const Sentiment = React.forwardRef<HTMLDivElement, SentimentProps>(
	(
		{
			className,
			sentiment,
			size,
			ariaLabel,
			showTooltip = true,
			percentage,
			reviewCount,
			...props
		},
		ref
	) => {
		const IconComponent = {
			veryHappy: VeryHappyIcon,
			happy: HappyIcon,
			neutral: NeutralIcon,
			sad: SadIcon,
			verySad: VerySadIcon,
			question: QuestionIcon,
		}[sentiment]

		const sentimentLabels = {
			veryHappy: 'Sumamente positivas',
			happy: 'Positivas',
			neutral: 'Mixed',
			sad: 'Negativas',
			verySad: 'Sumamente negativas',
			question: 'Sin reseñas',
		}

		const defaultAriaLabel = ariaLabel || `Reseñas ${sentimentLabels[sentiment]}`

		return (
			<div
				className={cn(sentimentVariants({ sentiment, size, className }))}
				ref={ref}
				role="img"
				aria-label={defaultAriaLabel}
				title={showTooltip ? sentimentLabels[sentiment] : undefined}
				{...props}
			>
				<IconComponent
					className={cn(
						size === 'xs'
							? 'h-3 w-3'
							: size === 'sm'
								? 'h-4 w-4'
								: size === 'lg'
									? 'h-6 w-6'
									: 'h-5 w-5',
						'flex-shrink-0 fill-current' // Make the fill color match the text color and prevent shrinking
					)}
					aria-hidden="true"
				/>
				{percentage !== undefined && reviewCount !== undefined && (
					<div className="flex min-w-0 flex-col">
						<div className="text-xs leading-tight font-semibold">
							{Math.round(percentage)}% Positivas
						</div>
						<div className="text-xs leading-tight font-light opacity-80">
							Basado en {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
						</div>
					</div>
				)}
			</div>
		)
	}
)
Sentiment.displayName = 'Sentiment'

export { Sentiment, sentimentVariants }
