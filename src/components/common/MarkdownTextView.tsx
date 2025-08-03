import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import { Pill } from '@/components/ui/pill'

export function MarkdownTextView({ text }: { text: string }) {
	return (
		<article className="prose content-markdown max-w-none">
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
