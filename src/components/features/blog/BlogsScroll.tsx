'use client'

import type { CollectionEntry } from 'astro:content'
import BlogCard from './BlogCard'

interface blogType {
	blogs: CollectionEntry<'blogs'>[]
}

export default function BlogsScroll({ blogs }: { blogs: blogType['blogs'] }) {
	return (
		<div className="h-fit max-h-[50vh] overflow-x-hidden overflow-y-auto xl:max-h-[40vh]">
			{blogs.map((blog) => {
				const { title, author, description, readtime, tags } = blog['data']
				return (
					<div className="flex justify-center py-3">
						<BlogCard
							title={title}
							authorName={author?.name || 'Desconocido'}
							description={description}
							readtime={readtime}
							tags={tags}
						/>
					</div>
				)
			})}
		</div>
	)
}
