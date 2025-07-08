import { DocsIcon, ChevronDownIcon } from "@/components/icons/icons";
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
            <section className={`prerequisites-section ${className}`}>
                <div className="border border-border rounded-md p-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="p-2 bg-muted text-muted-foreground border border-border rounded-lg">
                            <DocsIcon className="h-5 w-5 fill-current" />
                        </div>
                        <div>
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
        <section className={`prerequisites-section ${className}`}>
            <div className="border border-border rounded-md overflow-hidden">
                <Collapsible>
                    <CollapsibleTrigger className="w-full px-6 py-4 text-left bg-background hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-light text-purple border border-purple/20 rounded-lg">
                                <DocsIcon className="h-5 w-5 fill-current" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Prerrequisitos
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Conoce los cursos que necesitas para tomar este ramo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                                Click para expandir
                            </span>
                            <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180" />
                        </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="border-t border-border px-6 py-4 bg-muted/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
                        <PrerequisitesDisplay prerequisites={prerequisites.structure} />
                        
                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                                    <span>Prerrequisito regular</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></div>
                                    <span>Prerrequisito corricular (c)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Debes pasar todos estos ramos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Debes pasar uno de estos ramos</span>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </section>
    );
}
