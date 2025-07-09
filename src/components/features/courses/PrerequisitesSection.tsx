import { DocsIcon, ChevronDownIcon, TextureIcon, DeceasedIcon } from "@/components/icons/icons";
import { PrerequisitesDisplay } from "./PrerequisitesDisplay";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import type { ParsedPrerequisites } from "@/types";

interface Props {
    prerequisites: ParsedPrerequisites;
    className?: string;
}

export default function PrerequisitesSection({ prerequisites, className = "" }: Props) {
    // Debug: Log prerequisites.structure to console
    console.log("Prerequisites structure:", prerequisites.structure);
    
    if (!prerequisites.hasPrerequisites || !prerequisites.structure) {
        return (
            <section className={`prerequisites-section w-full ${className}`}>
                <div className="border border-border rounded-md p-6 w-full overflow-hidden">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="p-2 bg-muted text-muted-foreground border border-border rounded-lg flex-shrink-0">
                            <DocsIcon className="h-5 w-5 fill-current" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-semibold">
                                Prerrequisitos
                            </h2>
                            <p className="text-sm">
                                Este curso no tiene prerrequisitos
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`prerequisites-section w-full ${className}`}>
            <div className="border border-border rounded-md overflow-hidden w-full">
                <Collapsible>
                    <CollapsibleTrigger className="w-full px-6 py-4 text-left bg-background hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-pink-light text-pink border border-purple/20 rounded-lg flex-shrink-0">
                                <DocsIcon className="h-5 w-5 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Prerrequisitos
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Conoce los cursos que necesitas para tomar este ramo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <span className="text-sm text-muted-foreground hidden tablet:inline">
                                Click para expandir
                            </span>
                            <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180" />
                        </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="w-full border-t border-border px-2 tablet:px-6 py-4 bg-muted/20 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
                        <div className="w-full overflow-hidden">
                            <PrerequisitesDisplay prerequisites={prerequisites.structure} />
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border w-full">
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue border border-blue-light rounded flex-shrink-0"></div>
                                    <span>Prerrequisito regular</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange border border-orange-light rounded flex items-center justify-center flex-shrink-0">
                                        <TextureIcon className="w-3 h-3 text-background" />
                                    </div>
                                    <span>Co-requisito (puedes inscribir el curso al mismo tiempo)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-muted-foreground border border-muted rounded flex items-center justify-center flex-shrink-0">
                                        <DeceasedIcon className="w-3 h-3 text-muted" />
                                    </div>
                                    <span>Curso no ofrecido desde el primer semestre de 2024</span>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </section>
    );
}
