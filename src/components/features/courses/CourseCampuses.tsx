import { useCoursesSections } from "@/components/hooks/useCoursesSections";
import { Pill } from "@/components/ui/pill";
import { LocationIcon } from "@/components/icons/icons";

interface CourseCampusesProps {
    courseSigle: string;
}

export default function CourseCampuses({ courseSigle }: CourseCampusesProps) {
    const [courses, isLoading] = useCoursesSections();

    if (isLoading) {
        return null;
    }

    // Find the course data for the given sigle
    const courseData = courses.find(course => course.sigle === courseSigle);

    if (!courseData || !courseData.sections) {
        return null;
    }

    // Extract unique campuses from all sections
    const campuses = new Set<string>();
    
    Object.values(courseData.sections).forEach((section: any) => {
        if (section.campus) {
            campuses.add(section.campus);
        }
    });

    const actualCampuses = Array.from(campuses);

    if (actualCampuses.length === 0) {
        return null;
    }

    return (
        <>
            {actualCampuses.map((campus) => (
                <Pill key={campus} variant="blue" icon={LocationIcon}>
                    {campus}
                </Pill>
            ))}
        </>
    );
}