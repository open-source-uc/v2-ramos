# Organización de Componentes

Este documento describe la nueva estructura de organización para los componentes de BuscaRamos.

## Estructura

```
src/components/
├── common/           # Componentes reutilizables utilizados en toda la aplicación
│   ├── ContentPage.astro
│   ├── Contributors.tsx
│   ├── DarkThemeToggle.tsx
│   ├── HighContrastToggle.tsx
│   ├── InitiativeCard.tsx
│   ├── RecommendationDetail.astro
│   ├── RenderMarkdown.astro
│   └── index.ts
├── features/         # Componentes específicos de funcionalidades agrupados por funcionalidad
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogsScroll.tsx
│   │   └── index.ts
│   ├── catalog/
│   │   ├── SearchableRecommendationsDisplay.tsx
│   │   ├── SearchableTableDisplay.tsx
│   │   └── index.ts
│   ├── landing/
│   │   ├── LandingSearch.tsx
│   │   └── index.ts
│   └── search/
│       ├── SearchInput.tsx (renombrado de Search.tsx)
│       └── index.ts
├── icons/            # Componentes de iconos
│   ├── icons.tsx
│   ├── sentiment.tsx
│   └── index.ts
├── layout/           # Componentes de layout (Header, Footer, etc.)
│   ├── Footer.astro
│   ├── Header.tsx
│   ├── MobileHeader.tsx
│   ├── Seo.astro
│   └── index.ts
├── reviews/          # Componentes relacionados con reseñas
│   ├── MarkdownReviewView.tsx
│   ├── RedirectLogin.tsx
│   └── index.ts
├── table/            # Componentes de tablas
│   ├── columns.tsx
│   ├── data-table.tsx
│   └── index.ts
├── ui/               # Componentes base de UI (botones, inputs, etc.)
│   ├── alert.tsx
│   ├── banner.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── navigation-menu.tsx
│   ├── pill.tsx
│   ├── select.tsx
│   ├── table.tsx
│   └── index.ts
└── index.ts          # Archivo principal de exportación para todos los componentes
```

## Convenciones de Nomenclatura

### Nomenclatura de Archivos

- **PascalCase** para archivos de componentes (ej., `BlogCard.tsx`, `SearchInput.tsx`)
- **camelCase** para archivos de utilidades (ej., `data-table.tsx`, `button-navbar.tsx`)
- **Nombres descriptivos** que indiquen claramente el propósito del componente

### Nombres de Componentes

- Usar nombres descriptivos que indiquen la función del componente
- Evitar abreviaciones cuando sea posible
- Agrupar componentes relacionados en la misma carpeta

## Guías de Importación

### Importando desde Componentes

```tsx
// Importar desde el índice principal de componentes (preferido)
import { SearchInput, BlogCard } from '@/components'

// O importar directamente desde carpetas de funcionalidades
import { SearchInput } from '@/components/features/search'
import { BlogCard } from '@/components/features/blog'

// O importar desde archivos específicos
import { SearchInput } from '@/components/features/search/SearchInput'
```

### Exportando Componentes

Cada carpeta contiene un archivo `index.ts` que exporta todos los componentes de esa carpeta:

```tsx
// Ejemplo: features/search/index.ts
export { Search as SearchInput } from './SearchInput'
```

## Descripción de Carpetas

### `/common`

Contiene componentes reutilizables que se utilizan en múltiples funcionalidades o páginas. Estos son componentes de utilidad que no pertenecen a una funcionalidad específica.

### `/features`

Contiene componentes específicos de funcionalidades organizados por funcionalidad:

- **blog/**: Componentes relacionados con blogs
- **catalog/**: Componentes de catálogo de cursos y búsqueda
- **landing/**: Componentes específicos de la página de inicio
- **search/**: Componentes de funcionalidad de búsqueda

### `/layout`

Contiene componentes de layout que definen la estructura general de las páginas.

### `/ui`

Contiene componentes base de UI que se utilizan como bloques de construcción en toda la aplicación.

### `/icons`

Contiene componentes de iconos y utilidades relacionadas con iconos.

### `/reviews`

Contiene componentes específicos del sistema de reseñas.

### `/table`

Contiene componentes relacionados con tablas y configuraciones.

## Notas de Migración

Los siguientes archivos fueron renombrados durante la reorganización:

- `Search.tsx` → `SearchInput.tsx` (movido a `features/search/`)
- `Contribuidores.tsx` → `Contributors.tsx` (movido a `common/`)

Todas las declaraciones de importación han sido actualizadas para reflejar la nueva estructura.

## Beneficios de Esta Organización

1. **Mejor Descubribilidad**: Los componentes están organizados por propósito y funcionalidad
2. **Reducción de Acoplamiento**: Los componentes relacionados están agrupados juntos
3. **Mantenimiento Más Fácil**: Clara separación de responsabilidades
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades y componentes
5. **Consistencia**: Convenciones de nomenclatura y estructura claras
6. **Experiencia del Desarrollador**: Más fácil encontrar e importar componentes

## Consideraciones de Accesibilidad

Todos los componentes mantienen los mismos estándares de accesibilidad que antes:

- Atributos ARIA apropiados
- Soporte de navegación por teclado
- Compatibilidad con lectores de pantalla
- Soporte de modo de alto contraste
- Preferencias de movimiento reducido
