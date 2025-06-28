"use client";
import React from "react";
import ReactDOM from "react-dom";
import {
  MDXEditor,
  UndoRedo,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
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
import { Separator } from "@radix-ui/react-select";

export default function EditorMDX() {
  // Create a ref to the editor component
  const ref = React.useRef<MDXEditorMethods>(null);

  // Handle markdown changes
  const handleMarkdownChange = (markdown: string) => {
    console.log("Markdown changed:", markdown);
  };

  // Funciones para insertar componentes
  const insertPill = (
    variant: string = "blue",
    size: string = "sm",
    text: string = "Pill"
  ) => {
    const pillMarkdown = `<Pill variant="${variant}" size="${size}">${text}</Pill>`;
    ref.current?.insertMarkdown(pillMarkdown);
  };

  const insertButton = (variant: string = "default", size: string = "sm") => {
    const buttonMarkdown = `<Button variant="${variant}" size="${size}">Botón</Button>`;
    ref.current?.insertMarkdown(buttonMarkdown);
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
        setMenuPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }, [isOpen]);

    return (
      <>
        <button
          ref={buttonRef}
          type="button"
          className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-blue-700 font-medium flex items-center gap-1"
          onClick={() => setIsOpen(!isOpen)}
          title="Insertar Pill"
        >
          💊 Pills ▼
        </button>
        {isOpen &&
          ReactDOM.createPortal(
            <>
              <div
                className="fixed inset-0"
                style={{ zIndex: 9998 }}
                onClick={() => setIsOpen(false)}
              />
              <div
                className="bg-white border border-gray-300 rounded shadow-xl min-w-40 p-2"
                style={{
                  zIndex: 9999,
                  position: "absolute",
                  top: menuPos.top,
                  left: menuPos.left,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Tamaño:
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2"
                    value={pillSize}
                    onChange={(e) => setPillSize(e.target.value)}
                  >
                    {pillSizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Texto:
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    type="text"
                    placeholder="Texto de la pill"
                    value={pillText}
                    onChange={(e) => setPillText(e.target.value)}
                  />
                </div>
                <div className="divide-y divide-gray-100">
                  {pillVariants.map((pill) => (
                    <button
                      key={pill.variant}
                      type="button"
                      className="block w-full px-3 py-2 text-xs text-left hover:bg-gray-50 first:rounded-t last:rounded-b"
                      onClick={() => {
                        insertPill(pill.variant, pillSize, pillText || "Pill");
                        setIsOpen(false);
                        setPillText("");
                      }}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>
            </>,
            document.body
          )}
      </>
    );
  };

  // Componente de menú desplegable para Buttons

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
      Editor: ({ mdastNode }) => {
        // Obtener las props del componente
        const variant =
          (mdastNode.attributes?.find(
            (attr) => "name" in attr && attr.name === "variant"
          )?.value as string) || "blue";

        const size =
          (mdastNode.attributes?.find(
            (attr) => "name" in attr && attr.name === "size"
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
    <div className="relative w-full h-full space-y-4">
      {/* MDX Editor */}
      <div className="border border-gray-300 rounded">
        <MDXEditor
          ref={ref}
          className="content-markdown"
          markdown={`# Editor MDX con Componentes UI

¡Usa tus componentes UI existentes!

## Ejemplos de Pills

<Pill variant="blue" size="sm">Etiqueta Azul</Pill>
<Pill variant="green" size="md">Etiqueta Verde</Pill>
<Pill variant="red" size="lg">Etiqueta Roja</Pill>

## Ejemplos de Botones

<Button variant="default" size="sm">Botón Default</Button>
<Button variant="outline" size="md">Botón Outline</Button>
<Button variant="ghost" href="/catalog">Link Ghost</Button>

## Texto normal

También puedes escribir texto normal en **negrita** y *cursiva*.

- Lista item 1
- Lista item 2  
- Lista item 3

### Combinaciones

Aquí tienes un <Pill variant="purple" size="sm">pill morado</Pill> en medio del texto y un <Button variant="outline" size="sm">botón pequeño</Button> también.
`}
          onChange={handleMarkdownChange}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
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
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />

                    <Separator />

                    {/* Menús desplegables para componentes */}
                    <PillDropdownMenu />

                    <Separator />

                    <InsertAdmonition />
                  </DiffSourceToggleWrapper>
                </>
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
}
