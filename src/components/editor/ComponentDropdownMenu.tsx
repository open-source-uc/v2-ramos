'use client'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ComponentDropdownMenuProps {
	icon: string
	label: string
	children: React.ReactNode
}

export default function ComponentDropdownMenu({
	icon,
	label,
	children,
}: ComponentDropdownMenuProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const buttonRef = React.useRef<HTMLButtonElement>(null)
	const [menuPos, setMenuPos] = React.useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	})

	React.useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight
			const menuWidth = 200 // Ancho aproximado del menú
			const menuHeight = 300 // Alto aproximado del menú

			let left = rect.left + window.scrollX
			let top = rect.bottom + window.scrollY

			// Ajustar horizontalmente si se sale de la pantalla
			if (left + menuWidth > viewportWidth) {
				left = viewportWidth - menuWidth - 16 // 16px de margen
			}
			if (left < 16) {
				left = 16 // Margen mínimo
			}

			// Ajustar verticalmente si se sale de la pantalla
			if (top + menuHeight > viewportHeight + window.scrollY) {
				top = rect.top + window.scrollY - menuHeight - 8 // Mostrar arriba del botón
			}

			setMenuPos({ top, left })
		}
	}, [isOpen])

	const handleCloseMenu = () => {
		setIsOpen(false)
	}

	return (
		<>
			<Button
				ref={buttonRef}
				type="button"
				variant="outline"
				size="sm"
				onClick={() => setIsOpen(!isOpen)}
				className="flex min-w-0 flex-shrink-0 items-center gap-1 text-xs font-medium"
			>
				<span className="hidden sm:inline">
					{icon} {label} ▼
				</span>
				<span className="sm:hidden">{icon}</span>
			</Button>
			{isOpen &&
				ReactDOM.createPortal(
					<>
						<div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={handleCloseMenu} />
						<div
							style={{
								zIndex: 9999,
								position: 'absolute',
								top: menuPos.top,
								left: menuPos.left,
								boxShadow:
									'0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
							}}
						>
							<Card className="mx-2 w-full max-w-xs min-w-40 p-3">
								{React.cloneElement(children as React.ReactElement, {
									onClose: handleCloseMenu,
								})}
							</Card>
						</div>
					</>,
					document.body
				)}
		</>
	)
}
