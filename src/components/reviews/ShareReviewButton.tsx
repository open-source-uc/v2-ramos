import React, { useState } from 'react'
import { toPng } from 'html-to-image'
import { Button } from '@/components/ui/button'
import { ShareIcon } from '../icons/icons' // Asegúrate de tener un ícono de descarga
import { DownloadIcon } from 'lucide-react'

interface ShareReviewButtonProps {
	targetElementId: string
	path: string
	title?: string
	description?: string
	className?: string
}

export function ShareReviewButton({
	targetElementId,
	path,
	title = '',
	description = '',
	className = '',
}: ShareReviewButtonProps) {
	const [isProcessing, setIsProcessing] = useState(false)

	const getImageDataUrl = async () => {
		const element = document.getElementById(targetElementId)
		if (!element) {
			throw new Error(`Elemento con ID "${targetElementId}" no encontrado`)
		}

		return await toPng(element, {
			cacheBust: true,
			backgroundColor: '#ffffff',
			pixelRatio: 5,
		})
	}

	const downloadImage = async () => {
		setIsProcessing(true)
		try {
			const dataUrl = await getImageDataUrl()
			const link = document.createElement('a')

			link.download = `review-${targetElementId}.png`
			link.href = dataUrl
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			console.error('Error al descargar imagen:', error)
			alert('No se pudo generar la imagen para descargar.')
		} finally {
			setIsProcessing(false)
		}
	}

	const shareUrl = async () => {
		setIsProcessing(true)

		try {
			if (navigator.share) {
				await navigator.share({
					title,
					url: `${window.location.origin}${path}`,
				})
			} else {
				await navigator.clipboard.writeText(url)
				alert('Enlace copiado al portapapeles.')
			}
		} catch (error) {
			console.error('Error al compartir:', error)
			alert(`No se pudo compartir automáticamente. URL: ${url}`)
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<div className={`flex gap-2 ${className}`}>
			<Button
				variant="ghost"
				size="sm"
				icon={DownloadIcon}
				onClick={downloadImage}
				disabled={isProcessing}
				className="text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
				aria-label="Descargar imagen de la reseña"
			>
				{isProcessing ? 'Procesando...' : 'Descargar'}
			</Button>
			<Button
				variant="ghost"
				size="sm"
				icon={ShareIcon}
				onClick={shareUrl}
				disabled={isProcessing}
				className="text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
				aria-label="Compartir enlace de la reseña"
			>
				{isProcessing ? 'Procesando...' : 'Compartir'}
			</Button>
		</div>
	)
}
