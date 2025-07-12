import { Pill } from "@/components/ui/pill";
import { LocationIcon } from "@/components/icons/icons";
import { getCampusPrefix } from "@/lib/currentSemester";

interface CourseCampusesProps {
    courseSigle: string;
    campus: string[];
    lastSemester: string;
}

export default function CourseCampuses({ courseSigle, campus, lastSemester }: CourseCampusesProps) {
    if (!campus || campus.length === 0) {
        return null;
    }

    const prefixText = getCampusPrefix(lastSemester);

    return (
        <>
            {campus.map((campusName) => (
                <Pill key={campusName} variant="blue" icon={LocationIcon}>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium opacity-80">{prefixText}</span>
                        <span>{campusName}</span>
                    </div>
                </Pill>
            ))}
        </>
    );
}