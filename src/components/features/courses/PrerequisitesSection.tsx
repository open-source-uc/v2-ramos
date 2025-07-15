import { DocsIcon, ChevronDownIcon, TextureIcon, DeceasedIcon } from '@/components/icons/icons'
import { PrerequisitesDisplay } from './PrerequisitesDisplay'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { ParsedPrerequisites } from '@/types'

interface Props {
	prerequisites: ParsedPrerequisites
	className?: string
}

export default function PrerequisitesSection({ prerequisites, className = '' }: Props) {
	// Debug: Log prerequisites.structure to console
	console.log('Prerequisites structure:', prerequisites.structure)

	if (!prerequisites.hasPrerequisites || !prerequisites.structure) {
		return (
			<section className={`prerequisites-section w-full ${className}`}>
				<div className="border-border w-full overflow-hidden rounded-md border p-6">
					<div className="text-muted-foreground flex items-center gap-3">
						<div className="bg-muted text-muted-foreground border-border flex-shrink-0 rounded-lg border p-2">
							<DocsIcon className="h-5 w-5 fill-current" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className="text-lg font-semibold">Prerrequisitos</h2>
							<p className="text-sm">Este curso no tiene prerrequisitos</p>
						</div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className={`prerequisites-section w-full ${className}`}>
			<div className="border-border w-full overflow-hidden rounded-md border">
				<Collapsible>
					<CollapsibleTrigger className="bg-background hover:bg-muted/50 group focus:ring-primary flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none">
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<div className="bg-pink-light text-pink border-purple/20 flex-shrink-0 rounded-lg border p-2">
								<DocsIcon className="h-5 w-5 fill-current" />
							</div>
							<div className="min-w-0 flex-1">
								<h2 className="text-foreground text-lg font-semibold">Prerrequisitos</h2>
								<p className="text-muted-foreground text-sm">
									Conoce los cursos que necesitas para tomar este ramo
								</p>
							</div>
						</div>
						<div className="ml-4 flex flex-shrink-0 items-center gap-2">
							<span className="text-muted-foreground tablet:inline hidden text-sm">Expandir</span>
							<ChevronDownIcon className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent className="border-border bg-muted/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1 w-full overflow-hidden border-t px-6 py-4">
						<div className="w-full overflow-hidden">
							<PrerequisitesDisplay prerequisites={prerequisites.structure} />
						</div>

						<div className="border-border mt-4 w-full border-t pt-4">
							<div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
								<div className="flex items-center gap-2">
									<div className="bg-blue border-blue-light h-4 w-4 flex-shrink-0 rounded border"></div>
									<span>Prerrequisito regular</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="bg-orange border-orange-light flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border">
										<TextureIcon className="text-background h-3 w-3" />
									</div>
									<span>Co-requisito (puedes inscribir el curso al mismo tiempo)</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="bg-muted-foreground border-muted flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border">
										<DeceasedIcon className="text-muted h-3 w-3" />
									</div>
									<span>Curso no ofrecido desde el primer semestre de 2024</span>
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</section>
	)
}
