import { getUserDataByToken } from '@/lib/server/auth'
import { createSlug } from '@/lib/utils'
import { OsucPermissions } from '@/types/permissions'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
	contentType: 'blog' | 'recommendation' | 'resource'
	className?: string
	userData: any
}

export default function ConditionalEdit({ contentType, className, userData }: Props) {
	if (userData.permissions.includes(OsucPermissions.userCanCreateBlogs)) {
		const spanishContentType =
			contentType === 'blog'
				? 'blog'
				: contentType === 'recommendation'
					? 'recomendación'
					: 'recurso'
		const handleClick = () => {
			window.location.href = `/${contentType}s/new`
		}
		return (
			<div className={className}>
				<Button onClick={handleClick} variant="default" size="default" type="button">
					Crear {spanishContentType}
				</Button>
			</div>
		)
	}

	return null
}
