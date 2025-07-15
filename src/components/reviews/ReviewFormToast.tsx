import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ReviewFormToastProps {
	result?: {
		error?: {
			message?: string
			fields?: Record<string, string>
		}
		data?: {
			message?: string
		}
	}
}

export function ReviewFormToast({ result }: ReviewFormToastProps) {
	const [hasShown, setHasShown] = useState(false)

	useEffect(() => {
		// Prevent showing the same toast multiple times
		if (!result || hasShown) return

		// Small delay to ensure the toaster is ready
		const timer = setTimeout(() => {
			if (result.error) {
				setHasShown(true)

				// Handle field validation errors first
				if (result.error.fields) {
					const fieldErrors = Object.values(result.error.fields).filter(Boolean)
					if (fieldErrors.length > 0) {
						toast.error(`Error en el formulario: ${fieldErrors[0]}`)
						return
					}
				}

				// Handle general error message
				if (result.error.message) {
					toast.error(result.error.message)
					return
				}

				// Fallback error message if no specific error is provided
				toast.error('Ocurrió un error al procesar tu reseña. Por favor, inténtalo de nuevo.')
			} else if (result.data?.message) {
				toast.success(result.data.message)
				setHasShown(true)
			}
		}, 100)

		return () => clearTimeout(timer)
	}, [result, hasShown])

	return null
}
