import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Pill } from '@/components/ui/pill'
import remarkGfm from 'remark-gfm'

import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'

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
		<article className="prose max-w-none">
			<ReactMarkdown
				rehypePlugins={[rehypeRaw]}
				remarkPlugins={[remarkGfm, remarkBreaks]}
				components={{
					pill: ({ node, children }) => {
						const props = node?.properties ?? {}
						return (
							<Pill variant={props.variant as string} size={props.size as string}>
								{children}
							</Pill>
						)
					},
				}}
			>
				{text}
			</ReactMarkdown>
		</article>
	)
}
