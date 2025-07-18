import { getUserDataByToken } from '@/lib/server/auth'
import { createSlug } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface Props {
	articleId: number
	articleUserId: number
	userData?: any // Optional user data prop for testing purposes
	contentType: 'blog' | 'recommendation' | 'resource'
}

export default function ConditionalEdit({
	articleId,
	articleUserId,
	userData,
	contentType,
}: Props) {
	const [canEdit, setCanEdit] = useState(false)

	useEffect(() => {
		if (userData) {
			setCanEdit(userData.id === articleUserId)
		}
	}, [userData, articleUserId])

	if (!canEdit) return null

	return (
		<a href={`/${contentType}s/edit?id=${articleId}`} className="btn btn-primary">
			Editar
		</a>
	)
}
