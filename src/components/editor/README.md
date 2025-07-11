# Componentes del Editor MDX

Este directorio contiene los componentes modularizados para el editor MDX, permitiendo agregar fácilmente menús desplegables personalizados para insertar componentes.

## Arquitectura

### ComponentDropdownMenu

Componente base que maneja la lógica común de todos los menús desplegables:

- Posicionamiento automático
- Gestión de estado (abrir/cerrar)
- Portal para renderizado fuera del DOM del editor
- Estilos consistentes

### Contenido de Menús

Cada tipo de componente tiene su propio contenido de menú:

- `PillMenuContent`: Para insertar componentes Pill

## Cómo agregar un nuevo componente

### 1. Crear el contenido del menú

Crea un archivo `TuComponenteMenuContent.tsx`:

```tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface TuComponenteMenuContentProps {
  editorRef: React.RefObject<MDXEditorMethods>;
  onClose?: () => void;
}

export default function TuComponenteMenuContent({
  editorRef,
  onClose,
}: TuComponenteMenuContentProps) {
  const [tuPropiedad, setTuPropiedad] = React.useState<string>("");

  const insertTuComponente = (variant: string) => {
    const tuComponenteMarkdown = `<TuComponente variant="${variant}">${tuPropiedad}</TuComponente>`;
    editorRef.current?.insertMarkdown(tuComponenteMarkdown);
    onClose?.();
    setTuPropiedad("");
  };

  return (
    <div className="space-y-3">
      {/* Tus controles personalizados aquí */}
      <div>
        <label className="block text-xs font-medium mb-1 text-foreground">
          Tu Propiedad:
        </label>
        <Input
          inputSize="sm"
          placeholder="Valor de la propiedad"
          value={tuPropiedad}
          onChange={(e) => setTuPropiedad(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Botones para insertar variantes */}
      <div className="mt-3 space-y-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => insertTuComponente("variant1")}
        >
          🎯 Variante 1
        </Button>
        {/* Más botones según sea necesario */}
      </div>
    </div>
  );
}
```

### 2. Exportar el componente

Actualiza `index.ts`:

```typescript
export { default as ComponentDropdownMenu } from "./ComponentDropdownMenu";
export { default as PillMenuContent } from "./PillMenuContent";
export { default as TuComponenteMenuContent } from "./TuComponenteMenuContent";
```

### 3. Usar en EditorMDX

En `EditorMDX.tsx`, agrega:

```tsx
import { ComponentDropdownMenu, PillMenuContent, TuComponenteMenuContent } from "@/components/editor";

// Dentro del componente
const TuComponenteDropdownMenu = () => (
  <ComponentDropdownMenu icon="🎯" label="Tu Componente">
    <TuComponenteMenuContent editorRef={ref} />
  </ComponentDropdownMenu>
);

// En el toolbar
<TuComponenteDropdownMenu />
```

## Estructura de Props

### Props de ComponentDropdownMenu

- `icon`: Emoji o icono para el botón
- `label`: Texto del botón (visible en desktop)
- `children`: Contenido del menú

### Props del Contenido del Menú

- `editorRef`: Referencia al editor MDX
- `onClose`: Función para cerrar el menú (opcional)

## Características

- **Responsive**: Los menús se adaptan automáticamente a diferentes tamaños de pantalla
- **Posicionamiento inteligente**: Se ajustan automáticamente para evitar salir de la pantalla
- **Consistencia**: Todos los menús tienen el mismo estilo y comportamiento
- **Extensible**: Fácil agregar nuevos tipos de componentes

## Consideraciones de Accesibilidad

- Todos los controles son accesibles por teclado
- Las etiquetas están asociadas correctamente con los inputs
- El contraste y tamaños de fuente siguen las mejores prácticas

## Estructura Actual

```tree
src/components/editor/
├── ComponentDropdownMenu.tsx    # Componente base
├── PillMenuContent.tsx          # Contenido específico de Pills  
├── index.ts                     # Exportaciones
└── README.md                    # Esta documentación
```
