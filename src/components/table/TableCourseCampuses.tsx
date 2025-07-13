import { Pill } from "@/components/ui/pill";
import { getCampusPrefix, isCurrentSemester } from "@/lib/currentSemester";

interface TableCourseCampusesProps {
    campus: string[];
    lastSemester: string;
}

export default function TableCourseCampuses({ campus, lastSemester }: TableCourseCampusesProps) {
    // Filter out empty strings and null/undefined values
    const validCampus = campus?.filter(campusItem => campusItem && campusItem.trim() !== "") || [];
    
    if (validCampus.length === 0) {
        return <div></div>;
    }

    const prefixText = getCampusPrefix(lastSemester);
    const campusText = validCampus.join(", ");
    const pillVariant = isCurrentSemester(lastSemester) ? "blue" : "red";

    return (
        <Pill variant={pillVariant}>
            <div className="flex flex-col">
                <span className="text-xs font-medium opacity-80">{prefixText}</span>
                <span>{campusText}</span>
            </div>
        </Pill>
    );
}