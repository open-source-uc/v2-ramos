import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export function MarkdownReviewView({ path }: { path: string }) {
	const [text, setText] = useState('Cargando...')
	const [error, setError] = useState(false)

	useEffect(() => {
		if (!path) {
			setError(true)
			return
		}

		fetch(`/api/reviews?path=${encodeURIComponent(path)}`)
			.then(async (res) => {
				if (!res.ok) throw new Error('Error al cargar markdown')
				const content = await res.text()
				setText(content)
			})
			.catch((err) => {
				console.error('Error cargando Markdown:', err)
				setError(true)
			})
	}, [path])

	if (error) {
		return <blockquote>Error cargando contenido.</blockquote>
	}

	return (
		<article className="prose content-markdown max-w-none">
			<ReactMarkdown>{text}</ReactMarkdown>
		</article>
	)
}
