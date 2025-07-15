import { createSlug } from '@/lib/utils'

import React, { useEffect, useState } from 'react'

interface Props {
	blogUserId: number
	blogTitle: string
}

const ConditionalEdit: React.FC<Props> = (props) => {
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		const fetchUserData = async () => {
			const res = await fetch('/api/user')
			if (res.ok) {
				const user = await res.json()
				setUserId(String(user.id))
			}
		}
		fetchUserData()
	}, [])

	const blogUserId = String(props.blogUserId)
	const blogTitle = createSlug(props.blogTitle)
	const showButton = userId && blogUserId === userId

	return showButton ? <a href={`./${blogTitle}/edit`}>Edit Blog</a> : null
}

export default ConditionalEdit
