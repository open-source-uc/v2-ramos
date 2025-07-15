import { Pill } from '@/components/ui/pill'
import { ClockIcon } from '@/components/icons/icons'
import { createSlug } from '@/lib/utils'

interface ContentCardProps {
	title: string
	authorName: string
	type: 'blogs' | 'resource' | 'recommendations'
	organizationName: string
	description: string
	readtime: number
	tags: string[]
	period_time?: string
	faculty?: string
	code?: string
	qualification?: number
	// Recommendations extra fields
	organization_id?: number
	user_role?: string
	user_id?: number
	created_at?: string
	updated_at?: string
}

export default function ContentCard({
	title,
	authorName,
	type,
	organizationName,
	description,
	readtime,
	tags,
	period_time,
	faculty,
	code,
	qualification,
	organization_id,
	user_role,
	user_id,
	created_at,
	updated_at,
}: ContentCardProps) {
	// Para recommendations, la ruta es /recommendations/[organizacion]/[titulo]
	const Url =
		type === 'recommendations'
			? `/recommendations/${createSlug(organizationName)}/${createSlug(title)}`
			: `/${type}/${createSlug(organizationName)}/${createSlug(title)}`

	return (
		<a href={Url}>
			<article className="border-border focus:ring-ring bg-background flex h-full w-full cursor-pointer flex-col gap-4 rounded-lg border p-6 no-underline transition-shadow hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none">
				<header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
					<div className="flex-1">
						<h2 className="mb-1 text-2xl font-bold break-words">{title}</h2>
						<div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
							<span className="text-foreground font-medium">{organizationName}</span>
							<span aria-hidden="true">·</span>
							<span>{authorName}</span>
							{user_role && (
								<>
									<span aria-hidden="true">·</span>
									<span>Rol: {user_role}</span>
								</>
							)}
							{period_time && (
								<>
									<span aria-hidden="true">·</span>
									<span>Periodo: {period_time}</span>
								</>
							)}
						</div>
					</div>
					{type === 'recommendations' && qualification !== undefined && (
						<Pill size="sm" variant="orange" className="ml-auto">
							Calificación: {qualification} / 5
						</Pill>
					)}
				</header>
				{type === 'recommendations' && (
					<div className="mt-1 flex flex-wrap gap-2">
						{faculty && (
							<Pill size="sm" variant="ghost_green">
								Facultad: {faculty}
							</Pill>
						)}
						{code && (
							<Pill size="sm" variant="ghost_blue">
								Código: {code}
							</Pill>
						)}
					</div>
				)}
				{description && (
					<div>
						<p className="line-clamp-3 text-gray-600">{description}</p>
					</div>
				)}
				{type === 'blogs' && (
					<div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
						{user_role && <span>Rol: {user_role}</span>}
						{period_time && <span>Periodo: {period_time}</span>}
						{created_at && <span>Creado: {new Date(created_at).toLocaleDateString()}</span>}
					</div>
				)}
				{type === 'recommendations' && (created_at || updated_at) && (
					<div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
						{created_at && <span>Creado: {new Date(created_at).toLocaleDateString()}</span>}
						{updated_at && <span>Actualizado: {new Date(updated_at).toLocaleDateString()}</span>}
					</div>
				)}
				<footer className="mt-2 flex h-full flex-col justify-end">
					<div className="flex flex-wrap items-center gap-2">
						<Pill size="sm" variant="green" icon={ClockIcon}>
							{readtime} minutos de lectura
						</Pill>
						{tags &&
							tags.map((tag) => (
								<Pill key={tag} size="sm" variant="ghost_red">
									{tag}
								</Pill>
							))}
					</div>
				</footer>
			</article>
		</a>
	)
}
