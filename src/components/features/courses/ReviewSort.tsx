import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReviewSortProps {
  currentSort: string;
  onSortChange: (sortBy: string) => void;
}

export function ReviewSort({ currentSort, onSortChange }: ReviewSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Ordenar por:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger size="sm" className="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Más recientes</SelectItem>
          <SelectItem value="positivity">Más positivas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}