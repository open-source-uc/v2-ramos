import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonInputVariants = cva(
	'relative cursor-pointer group block focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all',
	{
		variants: {
			variant: {
				default:
					'border border-border rounded-md hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary-foreground has-[:checked]:text-primary',
				blue: 'border border-border rounded-md hover:border-blue has-[:checked]:border-blue has-[:checked]:bg-blue-light has-[:checked]:text-blue',
				green:
					'border border-border rounded-md hover:border-green has-[:checked]:border-green has-[:checked]:bg-green-light has-[:checked]:text-green',
				red: 'border border-border rounded-md hover:border-red has-[:checked]:border-red has-[:checked]:bg-red-light has-[:checked]:text-red',
				orange:
					'border border-border rounded-md hover:border-orange has-[:checked]:border-orange has-[:checked]:bg-orange-light has-[:checked]:text-orange',
				purple:
					'border border-border rounded-md hover:border-purple has-[:checked]:border-purple has-[:checked]:bg-purple-light has-[:checked]:text-purple',
			},
			size: {
				default: 'p-4',
				sm: 'p-3',
				lg: 'p-6',
				xl: 'p-8',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

const iconContainerVariants = cva('rounded-lg flex items-center justify-center border shrink-0', {
	variants: {
		variant: {
			default:
				'bg-transparent text-primary border-primary/20 group-has-[:checked]:bg-primary group-has-[:checked]:text-primary-foreground',
			blue: 'bg-transparent text-blue-600 border-blue/20 group-has-[:checked]:bg-blue group-has-[:checked]:text-white',
			green:
				'bg-transparent text-green-600 border-green/20 group-has-[:checked]:bg-green group-has-[:checked]:text-white',
			red: 'bg-transparent text-red-600 border-red/20 group-has-[:checked]:bg-red group-has-[:checked]:text-white',
			orange:
				'bg-transparent text-orange-600 border-orange/20 group-has-[:checked]:bg-orange group-has-[:checked]:text-white',
			purple:
				'bg-transparent text-purple-600 border-purple/20 group-has-[:checked]:bg-purple group-has-[:checked]:text-white',
		},
		size: {
			default: 'p-2',
			sm: 'p-1.5',
			lg: 'p-2.5',
			xl: 'p-3',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

const iconVariants = cva('fill-current', {
	variants: {
		size: {
			default: 'h-5 w-5',
			sm: 'h-4 w-4',
			lg: 'h-6 w-6',
			xl: 'h-8 w-8',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

export interface ButtonInputProps
	extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>,
		VariantProps<typeof buttonInputVariants> {
	icon?: React.ComponentType<{ className?: string }>
	title: string
	subtitle?: string
	inputProps: React.InputHTMLAttributes<HTMLInputElement>
	disabled?: boolean
	'aria-describedby'?: string
}

const ButtonInput = React.forwardRef<HTMLLabelElement, ButtonInputProps>(
	(
		{
			className,
			variant,
			size,
			icon: Icon,
			title,
			subtitle,
			inputProps,
			disabled = false,
			'aria-describedby': ariaDescribedby,
			children,
			...props
		},
		ref
	) => {
		// Generate unique IDs for accessibility
		const titleId = React.useId()
		const subtitleId = React.useId()
		const inputId = inputProps.id || React.useId()

		// Build aria-describedby string
		const describedBy =
			[subtitle ? subtitleId : null, ariaDescribedby].filter(Boolean).join(' ') || undefined

		const isDisabled = disabled || inputProps.disabled

		return (
			<label
				ref={ref}
				htmlFor={inputId}
				className={cn(
					buttonInputVariants({ variant, size, className }),
					isDisabled && 'pointer-events-none cursor-not-allowed opacity-50'
				)}
				aria-describedby={describedBy}
				{...props}
			>
				{/* Hidden input */}
				<input
					{...inputProps}
					id={inputId}
					disabled={isDisabled}
					className="sr-only"
					aria-describedby={describedBy}
				/>

				{/* Visible content */}
				<div className="relative flex items-center gap-3">
					{Icon && (
						<div className={cn(iconContainerVariants({ variant, size }))} aria-hidden="true">
							<Icon className={cn(iconVariants({ size }))} />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<div
							id={titleId}
							className="text-foreground group-has-[:checked]:text-foreground font-medium"
						>
							{title}
						</div>
						{subtitle && (
							<div
								id={subtitleId}
								className="text-muted-foreground group-has-[:checked]:text-muted-foreground text-sm"
							>
								{subtitle}
							</div>
						)}
					</div>
				</div>

				{children}
			</label>
		)
	}
)
ButtonInput.displayName = 'ButtonInput'

export { ButtonInput, buttonInputVariants, iconContainerVariants, iconVariants }
