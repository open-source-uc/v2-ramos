import { getUserDataByToken } from '@/lib/server/auth'
import { createSlug } from '@/lib/utils'
import { OsucPermissions } from '@/types/permissions'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
	contentType: 'blog' | 'recommendation' | 'resource'
	className?: string
}

export default function ConditionalEdit({ contentType, className }: Props) {
	const [userData, setUserData] = useState<any>(null)
	const [cookie, setCookie] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			const cookiesString = document.cookie
			const cookieValue = cookiesString
				.split(';')
				.filter((cookie) => cookie.trim().startsWith('osucookie='))
				.map((cookie) => cookie.split('=')[1])[0]

			setCookie(cookieValue)
			if (cookieValue) {
				try {
					const data = await getUserDataByToken(cookieValue)
					setUserData(data)
				} catch {
					setUserData(null)
				}
			}
			setLoading(false)
		}
		fetchUser()
	}, [])

	if (loading) {
		return null // o un loader
	}

	if (!cookie) {
		return null // o un mensaje de error
	}

	if (!userData) {
		return null
	}

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
