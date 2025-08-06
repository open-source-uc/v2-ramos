import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import { Pill } from '@/components/ui/pill'
import { MermaidComponent } from './MermaidComponent'

export function MarkdownTextView({ text }: { text: string }) {
	return (
		<article className="prose content-markdown max-w-none">
			<ReactMarkdown
				rehypePlugins={[rehypeRaw]}
				remarkPlugins={[remarkGfm, remarkBreaks]}
				components={
					{
						code: ({ className, children, ...props }: any) => {
							const match = /language-(\w+)/.exec(className || '')
							const language = match ? match[1] : ''

							// Check if it's a code block (not inline) and if it's mermaid
							if (className && language === 'mermaid') {
								console.log('Detected Mermaid code block:', String(children))
								return <MermaidComponent chart={String(children).replace(/\n$/, '')} />
							}

							return (
								<code className={className} {...props}>
									{children}
								</code>
							)
						},
						pill: ({ node, children }: any) => {
							const props = node?.properties ?? {}
							return (
								<Pill variant={props.variant} size={props.size}>
									{children}
								</Pill>
							)
						},
					} as any
				}
			>
				{text}
			</ReactMarkdown>
		</article>
	)
}
