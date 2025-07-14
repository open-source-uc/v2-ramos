import { Pill } from "@/components/ui/pill";
import { ClockIcon } from "@/components/icons/icons";
import { createSlug } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  authorName: string;
  organizationName: string;
  description: string;
  readtime: number;
  tags: string[];
}

export default function BlogCard({
  title,
  authorName,
  organizationName,
  description,
  readtime,
  tags,
}: BlogCardProps) {
  const blogUrl = `/blogs/${createSlug(organizationName)}/${createSlug(title)}`;

  return (
    <a href={blogUrl}>
      <article className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 no-underline w-full flex flex-col gap-4 h-full">
        <header className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="flex flex-col items-end flex-1">
            <p className="text-sm text-gray-500">{organizationName}</p>
            <p className="text-sm text-gray-500">{authorName}</p>
          </div>
        </header>
        <div>
          <p className="text-gray-600">{description}</p>
        </div>
        <footer className="h-full flex flex-col justify-end">
          <div>
            <Pill size="sm" variant="green" icon={ClockIcon}>
              {readtime} minutos de lectura
            </Pill>
            {tags.map((tag) => (
              <Pill key={tag} size="sm" variant="ghost_blue">
                {tag}
              </Pill>
            ))}
          </div>
        </footer>
      </article>
    </a>
  );
}
