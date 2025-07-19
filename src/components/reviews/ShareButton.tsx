import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShareIcon } from '../icons/icons'

interface ShareButtonProps {
	url: string
	className?: string
	title?: string
	description?: string
}

export function ShareButton({
	url,
	className = '',
	title = '',
	description = '',
}: ShareButtonProps) {
	const [isSharing, setIsSharing] = useState(false)

	const handleShare = async () => {
		setIsSharing(true)

		try {
			const shareData = {
				url: url,
				text: description,
				title: title,
			}

			if (navigator.share && navigator.canShare?.(shareData)) {
				await navigator.share(shareData)
			} else {
				await navigator.clipboard.writeText(shareData.url)
			}
		} catch (error) {
			console.error('Error sharing review:', error)
		}
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			icon={ShareIcon}
			className={`text-muted-foreground hover:bg-blue-50 hover:text-blue-600 ${className}`}
			aria-label="Compartir reseña"
			onClick={handleShare}
			disabled={isSharing}
		>
			{isSharing ? 'Compartiendo...' : 'Compartir'}
		</Button>
	)
}
