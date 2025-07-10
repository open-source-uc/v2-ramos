"use client";
import * as React from "react";
import * as ReactDOM from "react-dom";
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
  InsertAdmonition,
  // Para JSX components
  jsxPlugin,
  type JsxComponentDescriptor,
  // Para botones de inserción personalizados
  useCellValues,
  usePublisher,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

// Importar tus componentes UI existentes
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-select";

interface EditorMDXProps {
  // Contenido inicial del editor
  initialContent?: string;
  // Texto del botón de envío
  submitText?: string;
  // Función que se ejecuta cuando cambia el contenido
  onContentChange?: (content: string) => void;
}

export default function EditorMDX({
  initialContent,
  submitText = "Guardar Contenido",
  onContentChange,
}: EditorMDXProps = {}) {
  // Create a ref to the editor component
  const ref = React.useRef<MDXEditorMethods>(null);

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

## Admoniciones

:::note
Esta es una nota informativa. Usa admoniciones para destacar información importante.
:::

:::tip
¡Consejo útil! Las admoniciones son perfectas para dar consejos o sugerencias.
:::

:::danger
¡Peligro! Esta información requiere atención especial.
:::

`;

  // Estado para mantener el contenido actualizado del editor
  const [editorContent, setEditorContent] = React.useState<string>(
    initialContent || defaultInitialMarkdown
  );

  // Handle markdown changes
  const handleMarkdownChange = React.useCallback(
    (markdown: string) => {
      setEditorContent(markdown);
      onContentChange?.(markdown);
    },
    [onContentChange]
  );

  // Función para limpiar el editor
  const clearEditor = React.useCallback(() => {
    const emptyContent = "";
    ref.current?.setMarkdown(emptyContent);
    setEditorContent(emptyContent);
    onContentChange?.(emptyContent);
  }, [onContentChange]);

  // Funciones para insertar componentes
  const insertPill = (
    variant: string = "blue",
    size: string = "sm",
    text: string = "Pill"
  ) => {
    const pillMarkdown = `<Pill variant="${variant}" size="${size}">${text}</Pill>`;
    ref.current?.insertMarkdown(pillMarkdown);
  };

  // Componente de menú desplegable para Pills
  const PillDropdownMenu = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [menuPos, setMenuPos] = React.useState<{ top: number; left: number }>(
      {
        top: 0,
        left: 0,
      }
    );
    const [pillSize, setPillSize] = React.useState<string>("sm");
    const [pillText, setPillText] = React.useState<string>("");

    const pillVariants = [
      { variant: "blue", label: "🔵 Azul" },
      { variant: "green", label: "🟢 Verde" },
      { variant: "red", label: "🔴 Rojo" },
      { variant: "purple", label: "🟣 Morado" },
      { variant: "orange", label: "🟠 Naranja" },
      { variant: "pink", label: "🩷 Rosa" },
    ];
    const pillSizes = [
      { value: "sm", label: "Pequeño (sm)" },
      { value: "md", label: "Mediano (md)" },
      { value: "lg", label: "Grande (lg)" },
      { value: "xl", label: "Extra grande (xl)" },
    ];

    React.useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 200; // Ancho aproximado del menú
        const menuHeight = 300; // Alto aproximado del menú

        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY;

        // Ajustar horizontalmente si se sale de la pantalla
        if (left + menuWidth > viewportWidth) {
          left = viewportWidth - menuWidth - 16; // 16px de margen
        }
        if (left < 16) {
          left = 16; // Margen mínimo
        }

        // Ajustar verticalmente si se sale de la pantalla
        if (top + menuHeight > viewportHeight + window.scrollY) {
          top = rect.top + window.scrollY - menuHeight - 8; // Mostrar arriba del botón
        }

        setMenuPos({ top, left });
      }
    }, [isOpen]);

    const handleCloseMenu = () => {
      setIsOpen(false);
    };

    const handleInsertPill = (variant: string) => {
      insertPill(variant, pillSize, pillText || "Pill");
      setIsOpen(false);
      setPillText("");
    };

    return (
      <>
        <Button
          ref={buttonRef}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-medium flex items-center gap-1 min-w-0 flex-shrink-0"
        >
          <span className="hidden sm:inline">💊 Pills ▼</span>
          <span className="sm:hidden">💊</span>
        </Button>
        {isOpen &&
          ReactDOM.createPortal(
            <>
              <div
                className="fixed inset-0"
                style={{ zIndex: 9998 }}
                onClick={handleCloseMenu}
              />
              <div
                style={{
                  zIndex: 9999,
                  position: "absolute",
                  top: menuPos.top,
                  left: menuPos.left,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Card className="min-w-40 max-w-xs w-full p-3 mx-2">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-foreground">
                        Tamaño:
                      </label>
                      <select
                        className="w-full border border-border rounded px-2 py-1 text-xs bg-background"
                        value={pillSize}
                        onChange={(e) => setPillSize(e.target.value)}
                      >
                        {pillSizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-foreground">
                        Texto:
                      </label>
                      <Input
                        inputSize="sm"
                        placeholder="Texto de la pill"
                        value={pillText}
                        onChange={(e) => setPillText(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
                    {pillVariants.map((pill) => (
                      <Button
                        key={pill.variant}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => handleInsertPill(pill.variant)}
                      >
                        {pill.label}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>
            </>,
            document.body
          )}
      </>
    );
  };

  // Usar tus componentes UI existentes
  const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
      name: "Pill",
      kind: "text",
      source: "",
      props: [
        { name: "variant", type: "string" },
        { name: "size", type: "string" },
        { name: "children", type: "string" },
      ],
      hasChildren: true,
      Editor: ({ mdastNode }: { mdastNode: any }) => {
        // Obtener las props del componente
        const variant =
          (mdastNode.attributes?.find(
            (attr: any) => "name" in attr && attr.name === "variant"
          )?.value as string) || "blue";

        const size =
          (mdastNode.attributes?.find(
            (attr: any) => "name" in attr && attr.name === "size"
          )?.value as string) || "sm";

        // Obtener el contenido hijo
        const children =
          mdastNode.children?.[0] && "value" in mdastNode.children[0]
            ? mdastNode.children[0].value
            : "Pill";

        return (
          <Pill variant={variant as any} size={size as any}>
            {children}
          </Pill>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center pb-4 items-center">
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
      <div className="border border-border rounded-lg relative">
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
              diffMarkdown: "Versión anterior del contenido",
              viewMode: "rich-text",
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

                  <Separator />

                  <InsertAdmonition />
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
        style={{ display: "none" }}
        readOnly
      />
    </div>
  );
}
