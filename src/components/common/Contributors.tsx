'use client'

import { Card } from '@/components/ui/card'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

type Props = {
	items: {
		nombre: string
		rol: string
		carrera: string
		linkedin: string
		github: string
		imagen: string
	}[]
}

export default function ContribuidoresSection({ items }: Props) {
	return (
		<div className="mx-auto my-16 max-w-6xl px-4">
			<h1 className="mb-10 text-center text-4xl font-semibold">Contribuidores del Proyecto</h1>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{items.map((person, idx) => (
					<Card
						key={idx}
						className="flex flex-col items-center gap-6 rounded-2xl p-6 text-left shadow-md md:flex-row"
					>
						<div className="flex-1">
							<h2 className="text-xl font-medium">{person.nombre}</h2>
							<p className="mt-1 text-sm">{person.rol}</p>
							<p className="mt-1 text-sm">{person.carrera}</p>
							<div className="mt-4 flex gap-3">
								<a
									href={person.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="LinkedIn"
								>
									<FaLinkedin className="h-6 w-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
								</a>
								<a
									href={person.github}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub"
								>
									<FaGithub className="h-6 w-6 text-zinc-800 hover:text-black dark:text-zinc-200 dark:hover:text-white" />
								</a>
							</div>
						</div>
						<img
							src={person.imagen}
							alt={`Foto de ${person.nombre}`}
							className="h-auto w-32 rounded-xl object-cover"
						/>
					</Card>
				))}
			</div>
		</div>
	)
}
