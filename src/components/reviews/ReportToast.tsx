import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ReportToastProps {
	result?: {
		error?: {
			message?: string
		}
		data?: {
			message?: string
		}
	}
}

export function ReportToast({ result }: ReportToastProps) {
	const [hasShown, setHasShown] = useState(false)

	useEffect(() => {
		if (!result || hasShown) return

		// Small delay to ensure the toaster is ready
		const timer = setTimeout(() => {
			if (result.error) {
				setHasShown(true)

				// Handle specific error message
				if (result.error.message) {
					toast.error(result.error.message)
				} else {
					// Fallback error message for reports
					toast.error('Error al enviar el reporte. Por favor, inténtalo de nuevo.')
				}
			} else if (result.data?.message) {
				toast.success(result.data.message)
				setHasShown(true)
			}
		}, 100)

		return () => clearTimeout(timer)
	}, [result, hasShown])

	return null
}
