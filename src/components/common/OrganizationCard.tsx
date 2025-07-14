import { Pill } from "@/components/ui/pill";
import { BuildingIcon } from "@/components/icons/icons";

interface OrganizationCardProps {
  name: string;
  title: string;
  faculty: string;
  picture?: string;
  description?: string;
}

export default function OrganizationCard({
  name,
  title,
  faculty,
  picture,
  description,
}: OrganizationCardProps) {
  const organizationUrl = `/organizations/${name
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  return (
    <a href={organizationUrl}>
      <article className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 no-underline max-w-4xl flex flex-col gap-4 h-full">
        <header className="flex items-start gap-4">
          {picture && (
            <figure className="w-16 h-16 rounded-md overflow-hidden bg-white border border-border p-2 flex-shrink-0">
              <img
                src={picture}
                alt={`Logo de ${name}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </figure>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground mb-1 truncate">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <Pill size="sm" variant="blue" icon={BuildingIcon}>
              {faculty}
            </Pill>
          </div>
        </header>
        {description && (
          <div className="mt-auto">
            <p className="text-muted-foreground text-sm line-clamp-2">
              {description}
            </p>
          </div>
        )}
      </article>
    </a>
  );
}
