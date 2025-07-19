import { Pill } from '@/components/ui/pill'
import { ClockIcon } from '@/components/icons/icons'

interface resourceCardProps {
	title: string
	readtime: number
	description: string
	resourceURL: string
	authorName?: string
	authorTitle?: string
	authorPicture?: string
}

export default function ResourceCard({
	title,
	readtime,
	description,
	resourceURL,
	authorName,
	authorTitle,
	authorPicture,
}: resourceCardProps) {
	return (
		<a
			href={resourceURL}
			className="border-border bg-card flex h-full w-full cursor-pointer flex-col rounded-lg border p-6 no-underline transition-shadow hover:shadow-md"
			aria-label={`Ver recurso: ${title}`}
		>
			<header className="tablet:flex-row tablet:items-center tablet:gap-3 flex flex-col gap-2">
				<div className="flex-1">
					<h2 className="mb-1 text-xl font-bold break-words">{title}</h2>
					<div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
						{authorPicture ? (
							<img
								src={authorPicture}
								alt={`Foto de ${authorName}`}
								className="border-border h-7 w-7 rounded-full border-2 object-cover transition-colors"
							/>
						) : (
							<div className="bg-muted border-border flex h-7 w-7 items-center justify-center rounded-full border-2">
								<span className="text-muted-foreground text-xs font-medium">
									{authorName?.charAt(0).toUpperCase()}
								</span>
							</div>
						)}
						<div className="flex min-w-0 flex-col">
							<span className="text-foreground truncate font-medium">{authorName}</span>
							{authorTitle && (
								<span className="text-muted-foreground truncate text-xs">{authorTitle}</span>
							)}
						</div>
					</div>
					<Pill size="sm" variant="green" icon={ClockIcon} className="mt-2">
						{readtime} minutos de lectura
					</Pill>
				</div>
			</header>
			{description && (
				<div>
					<p className="text-card-foreground line-clamp-3">{description}</p>
				</div>
			)}
			<footer className="mt-2 flex h-full flex-col justify-end"></footer>
		</a>
	)
}
