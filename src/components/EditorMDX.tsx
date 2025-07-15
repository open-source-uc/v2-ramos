'use client'
import * as React from 'react'
import {
	MDXEditor,
	UndoRedo,
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	InsertTable,
	tablePlugin,
	linkPlugin,
	linkDialogPlugin,
	CreateLink,
	InsertImage,
	imagePlugin,
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	toolbarPlugin,
	diffSourcePlugin,
	DiffSourceToggleWrapper,
	type MDXEditorMethods,
	// Para componentes personalizados
	directivesPlugin,
	AdmonitionDirectiveDescriptor,
	// Para JSX components
	jsxPlugin,
	type JsxComponentDescriptor,
	// Para botones de inserción personalizados
	useCellValues,
	usePublisher,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

// Importar tus componentes UI existentes
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@radix-ui/react-select'

// Importar componentes del editor
import { ComponentDropdownMenu, PillMenuContent } from '@/components/editor'

interface EditorMDXProps {
	// Contenido inicial del editor
	initialContent?: string
	// Texto del botón de envío
	submitText?: string
	// Función que se ejecuta cuando cambia el contenido
	onContentChange?: (content: string) => void
}

export default function EditorMDX({
	initialContent,
	submitText = 'Guardar Contenido',
	onContentChange,
}: EditorMDXProps = {}) {
	// Create a ref to the editor component
	const ref = React.useRef<MDXEditorMethods>(null)

	// Contenido inicial del editor
	const defaultInitialMarkdown = `

import { Pill } from "@/components/ui/pill";

# Editor MDX con Componentes UI

¡Bienvenido al editor MDX completo! Aquí puedes usar todos los elementos de la toolbar.

## Formato de Texto

Puedes usar **texto en negrita**, *texto en cursiva*, y ***texto en negrita y cursiva***.

También puedes usar ~~texto tachado~~ y __texto subrayado__.

## Encabezados

# Encabezado 1
## Encabezado 2  
### Encabezado 3
#### Encabezado 4
##### Encabezado 5
###### Encabezado 6

## Listas

### Lista con viñetas
- Elemento 1
- Elemento 2
  - Sub-elemento 2.1
  - Sub-elemento 2.2
- Elemento 3

### Lista numerada
1. Primer elemento
2. Segundo elemento
   1. Sub-elemento 2.1
   2. Sub-elemento 2.2
3. Tercer elemento

## Citas

> Esta es una cita de ejemplo.
> 
> Las citas pueden tener múltiples líneas y son muy útiles para destacar información importante.

## Enlaces

Puedes crear [enlaces a sitios web](https://www.example.com) o [enlaces internos](#encabezados).

## Imágenes

![Imagen de ejemplo](https://placedog.net/500?r)

## Tablas

| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Celda 1   | Celda 2   | Celda 3   |
| Celda 4   | Celda 5   | Celda 6   |
| Celda 7   | Celda 8   | Celda 9   |

## Componentes UI Personalizados

### Ejemplos de Pills
<Pill variant="blue" size="sm">Etiqueta Azul</Pill>
<Pill variant="green" size="md">Etiqueta Verde</Pill>
<Pill variant="red" size="lg">Etiqueta Roja</Pill>
<Pill variant="purple" size="xl">Etiqueta Morada</Pill>

### Combinaciones

Aquí tienes un <Pill variant="orange" size="sm">pill naranja</Pill> en medio del texto.

También puedes combinar **texto en negrita** con <Pill variant="pink" size="md">pills rosas</Pill> para crear contenido más dinámico.

`

	// Estado para mantener el contenido actualizado del editor
	const [editorContent, setEditorContent] = React.useState<string>(
		initialContent || defaultInitialMarkdown
	)

	// Handle markdown changes
	const handleMarkdownChange = React.useCallback(
		(markdown: string) => {
			setEditorContent(markdown)
			onContentChange?.(markdown)
		},
		[onContentChange]
	)

	// Función para limpiar el editor
	const clearEditor = React.useCallback(() => {
		const emptyContent = ''
		ref.current?.setMarkdown(emptyContent)
		setEditorContent(emptyContent)
		onContentChange?.(emptyContent)
	}, [onContentChange])

	// Funciones para insertar componentes - ahora se manejan en los componentes específicos
	// (mantenido por compatibilidad, pero se puede remover)

	// Componentes de menú desplegable para insertar componentes
	const PillDropdownMenu = () => (
		<ComponentDropdownMenu icon="💊" label="Pills">
			<PillMenuContent editorRef={ref} />
		</ComponentDropdownMenu>
	)

	// Usar tus componentes UI existentes
	const jsxComponentDescriptors: JsxComponentDescriptor[] = [
		{
			name: 'Pill',
			kind: 'text',
			source: '',
			props: [
				{ name: 'variant', type: 'string' },
				{ name: 'size', type: 'string' },
				{ name: 'children', type: 'string' },
			],
			hasChildren: true,
			Editor: ({ mdastNode }: { mdastNode: any }) => {
				// Obtener las props del componente
				const variant =
					(mdastNode.attributes?.find((attr: any) => 'name' in attr && attr.name === 'variant')
						?.value as string) || 'blue'

				const size =
					(mdastNode.attributes?.find((attr: any) => 'name' in attr && attr.name === 'size')
						?.value as string) || 'sm'

				// Obtener el contenido hijo
				const children =
					mdastNode.children?.[0] && 'value' in mdastNode.children[0]
						? mdastNode.children[0].value
						: 'Pill'

				return (
					<Pill variant={variant as any} size={size as any}>
						{children}
					</Pill>
				)
			},
		},
	]

	return (
		<div>
			<div className="flex flex-wrap items-center justify-center gap-2 pb-4">
				<Button type="button" variant="outline" size="sm" onClick={clearEditor}>
					<span className="hidden sm:inline">Limpiar</span>
					<span className="sm:hidden">🗑️</span>
				</Button>

				<Button type="submit" variant="default" size="sm">
					<span className="hidden sm:inline">{submitText}</span>
					<span className="sm:hidden">💾</span>
				</Button>
			</div>

			{/* MDX Editor */}
			<div className="border-border relative rounded-lg border">
				<MDXEditor
					ref={ref}
					markdown={initialContent || defaultInitialMarkdown}
					className="mdxeditor-theme"
					onChange={handleMarkdownChange}
					plugins={[
						headingsPlugin(),
						listsPlugin(),
						quotePlugin(),
						tablePlugin(),
						linkPlugin(),
						linkDialogPlugin(),
						imagePlugin(),
						// Plugin JSX para usar tus componentes UI
						jsxPlugin({ jsxComponentDescriptors }),
						// Plugin para directivas
						directivesPlugin({
							directiveDescriptors: [AdmonitionDirectiveDescriptor],
						}),
						diffSourcePlugin({
							diffMarkdown: 'Versión anterior del contenido',
							viewMode: 'rich-text',
						}),
						toolbarPlugin({
							toolbarContents: () => (
								<>
									<UndoRedo />
									<BoldItalicUnderlineToggles />
									<BlockTypeSelect />

									<Separator />

									<InsertTable />
									<CreateLink />
									<InsertImage />

									<Separator />

									{/* Menús desplegables para componentes */}
									<PillDropdownMenu />
								</>
							),
						}),
					]}
				/>
			</div>

			{/* Textarea oculto para formularios */}
			<textarea
				name="content"
				value={editorContent}
				onChange={() => {}} // Solo lectura, se actualiza desde el editor
				hidden
				readOnly
			/>
		</div>
	)
}
