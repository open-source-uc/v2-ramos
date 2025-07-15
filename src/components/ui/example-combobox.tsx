import * as React from 'react'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'

// Example usage of the Combobox component
const frameworks: ComboboxOption[] = [
	{
		value: 'next.js',
		label: 'Next.js',
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit',
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js',
	},
	{
		value: 'remix',
		label: 'Remix',
	},
	{
		value: 'astro',
		label: 'Astro',
	},
]

export function ExampleCombobox() {
	const [value, setValue] = React.useState('')

	return (
		<div className="w-[300px]">
			<Combobox
				options={frameworks}
				value={value}
				onValueChange={setValue}
				placeholder="Select framework..."
				searchPlaceholder="Search framework..."
				emptyMessage="No framework found."
				aria-label="Select a framework"
			/>
		</div>
	)
}
