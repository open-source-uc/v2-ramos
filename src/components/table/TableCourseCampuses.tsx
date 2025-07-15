import { Pill } from '@/components/ui/pill'
import { getCampusPrefix, isCurrentSemester } from '@/lib/currentSemester'
import { LocationIcon } from '@/components/icons/icons'

interface TableCourseCampusesProps {
	campus: string[]
	lastSemester: string
	variant?: 'default' | 'with-icon'
}

export default function TableCourseCampuses({
	campus,
	lastSemester,
	variant = 'default',
}: TableCourseCampusesProps) {
	// Filter out empty strings and null/undefined values
	const validCampus = campus?.filter((campusItem) => campusItem && campusItem.trim() !== '') || []

	if (validCampus.length === 0) {
		return <div></div>
	}

	const prefixText = getCampusPrefix(lastSemester)
	const campusText = validCampus.join(', ')
	const pillVariant = isCurrentSemester(lastSemester) ? 'blue' : 'red'

	return (
		<Pill variant={pillVariant}>
			<div className="flex flex-col">
				<span className="text-xs font-medium opacity-80">{prefixText}</span>
				<div className="flex items-center gap-1">
					{variant === 'with-icon' && <LocationIcon className="h-3 w-3" />}
					<span>{campusText}</span>
				</div>
			</div>
		</Pill>
	)
}
