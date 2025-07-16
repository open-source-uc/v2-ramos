import { Pill } from '@/components/ui/pill'
import { BuildingIcon } from '@/components/icons/icons'

interface InitiativeCardProps {
	name: string
	title: string
	faculty: string
	picture?: string
	description?: string
}

export default function InitiativeCard({
	name,
	title,
	faculty,
	picture,
	description,
}: InitiativeCardProps) {
	const initiativeUrl = `/initiatives/${name.toLowerCase().replace(/\s+/g, '-')}`

	return (
		<a href={initiativeUrl}>
			<article className="border-border focus:ring-ring flex h-full max-w-4xl cursor-pointer flex-col gap-4 rounded-lg border p-6 no-underline transition-shadow hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none">
				<header className="flex items-start gap-4">
					{picture && (
						<figure className="border-border h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-white p-2">
							<img
								src={picture}
								alt={`Logo de ${name}`}
								className="h-full w-full object-contain"
								loading="lazy"
							/>
						</figure>
					)}
					<div className="min-w-0 flex-1">
						<h2 className="text-foreground mb-1 truncate text-xl font-bold">{name}</h2>
						<p className="text-muted-foreground mb-2 text-sm">{title}</p>
						<Pill size="sm" variant="blue" icon={BuildingIcon}>
							{faculty}
						</Pill>
					</div>
				</header>
				{description && (
					<div className="mt-auto">
						<p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
					</div>
				)}
			</article>
		</a>
	)
}
