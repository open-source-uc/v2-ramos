'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'

interface NotificationProps {
	message: string
	type: 'success' | 'error' | 'info'
	duration?: number
	onClose?: () => void
}

export default function Notification({
	message,
	type,
	duration = 5000,
	onClose,
}: NotificationProps) {
	const [isVisible, setIsVisible] = useState(true)
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		setIsAnimating(true)

		const timer = setTimeout(() => {
			handleClose()
		}, duration)

		return () => clearTimeout(timer)
	}, [duration])

	const handleClose = () => {
		setIsAnimating(false)
		setTimeout(() => {
			setIsVisible(false)
			onClose?.()
		}, 300)
	}

	if (!isVisible) return null

	const getNotificationStyles = () => {
		const baseStyles =
			'fixed top-4 right-4 z-50 max-w-md w-full mx-auto p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out'

		switch (type) {
			case 'success':
				return `${baseStyles} bg-green-50 border-green-200 text-green-800`
			case 'error':
				return `${baseStyles} bg-red-50 border-red-200 text-red-800`
			case 'info':
				return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`
			default:
				return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`
		}
	}

	const getIconForType = () => {
		switch (type) {
			case 'success':
				return '✅'
			case 'error':
				return '❌'
			case 'info':
				return 'ℹ️'
			default:
				return '📢'
		}
	}

	return (
		<div
			className={`${getNotificationStyles()} ${
				isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
			}`}
		>
			<div className="flex items-start">
				<div className="mr-3 flex-shrink-0">
					<span className="text-lg">{getIconForType()}</span>
				</div>
				<div className="flex-1">
					<p className="text-sm font-medium">{message}</p>
				</div>
				<button
					onClick={handleClose}
					className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
				>
					<span className="sr-only">Cerrar</span>
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}
