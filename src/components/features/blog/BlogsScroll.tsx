'use client'

import type { CollectionEntry } from 'astro:content'
import BlogCard from './BlogCard'

import type { Blogs } from '@/types'

export default function BlogsScroll({ blogs }: { blogs: Blogs[] }) {
	return (
		<div className="h-fit max-h-[50vh] overflow-x-hidden overflow-y-auto xl:max-h-[40vh]">
			{blogs.map((blog) => (
				<div className="flex justify-center py-3" key={blog.id}>
					<BlogCard
						title={blog.title}
						authorName={blog.display_name || 'Desconocido'}
						type="blogs"
						organizationName={blog.organization_name}
						description={blog.tags}
						readtime={blog.readtime}
						tags={blog.tags ? blog.tags.split(',').map((t) => t.trim()) : []}
						period_time={blog.period_time}
						user_role={blog.user_role}
						created_at={blog.created_at}
						updated_at={blog.updated_at}
					/>
				</div>
			))}
		</div>
	)
}
