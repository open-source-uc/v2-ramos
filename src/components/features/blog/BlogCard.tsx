
import { Pill } from "@/components/ui/pill";
import { ClockIcon } from "@/components/icons/icons";
import { createSlug } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  authorName: string;
  type: "blogs" | "resource" | "recommendations";
  organizationName: string;
  description: string;
  readtime: number;
  tags: string[];
  period_time?: string;
  faculty?: string;
  code?: string;
  qualification?: number;
  // Recommendations extra fields
  organization_id?: number;
  user_role?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
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
    type === "recommendations"
      ? `/recommendations/${createSlug(organizationName)}/${createSlug(title)}`
      : `/${type}/${createSlug(organizationName)}/${createSlug(title)}`;

  return (
    <a href={Url}>
      <article className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 no-underline w-full flex flex-col gap-4 h-full bg-background">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex-1">
            <h2 className="text-2xl font-bold break-words mb-1">{title}</h2>
            <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{organizationName}</span>
              <span aria-hidden="true">·</span>
              <span>{authorName}</span>
              {user_role && <><span aria-hidden="true">·</span><span>Rol: {user_role}</span></>}
              {period_time && <><span aria-hidden="true">·</span><span>Periodo: {period_time}</span></>}
            </div>
          </div>
          {type === "recommendations" && qualification !== undefined && (
            <Pill size="sm" variant="orange" className="ml-auto">
              Calificación: {qualification} / 5
            </Pill>
          )}
        </header>
        {type === "recommendations" && (
          <div className="flex flex-wrap gap-2 mt-1">
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
            <p className="text-gray-600 line-clamp-3">{description}</p>
          </div>
        )}
        {type === "blogs" && (
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
            {user_role && <span>Rol: {user_role}</span>}
            {period_time && <span>Periodo: {period_time}</span>}
            {created_at && <span>Creado: {new Date(created_at).toLocaleDateString()}</span>}
          </div>
        )}
        {type === "recommendations" && (created_at || updated_at) && (
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
            {created_at && <span>Creado: {new Date(created_at).toLocaleDateString()}</span>}
            {updated_at && <span>Actualizado: {new Date(updated_at).toLocaleDateString()}</span>}
          </div>
        )}
        <footer className="h-full flex flex-col justify-end mt-2">
          <div className="flex flex-wrap gap-2 items-center">
            <Pill size="sm" variant="green" icon={ClockIcon}>
              {readtime} minutos de lectura
            </Pill>
            {tags && tags.map((tag) => (
              <Pill key={tag} size="sm" variant="ghost_red">
                {tag}
              </Pill>
            ))}
          </div>
        </footer>
      </article>
    </a>
  );
}
