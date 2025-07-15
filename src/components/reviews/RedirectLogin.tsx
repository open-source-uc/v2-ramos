import { useEffect } from 'react'

export default function RedirectLogin({ userIsNull }: { userIsNull: boolean }) {
	useEffect(() => {
		if (userIsNull) {
			window.location.href = 'https://auth.osuc.dev?ref=' + window.location.href
		}
	}, [userIsNull])

	return null
}
