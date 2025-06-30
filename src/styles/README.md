# Arquitectura CSS

Este proyecto utiliza una arquitectura CSS modular para mejorar la mantenibilidad y organización. Todos los estilos están organizados en componentes lógicos e importados a través del archivo principal `global.css`.

## Estructura de Archivos

```
src/styles/
├── global.css              # Punto de entrada principal - importa todos los otros archivos CSS
├── variables.css           # Propiedades personalizadas CSS y variables de tema
├── base.css               # Estilos base, resets y reglas de accesibilidad
├── utilities.css          # Clases utilitarias
├── themes/
│   ├── dark.css              # Variables y estilos específicos del tema oscuro
│   ├── high-contrast.css     # Tema de alto contraste para modo claro
│   └── high-contrast-dark.css # Tema de alto contraste para modo oscuro (automático)
└── components/
    └── markdown.css      # Estilos para renderizado de contenido markdown
```

## Desglose de Componentes

### `global.css`
- Punto de entrada principal que importa todos los otros archivos CSS
- Importa dependencias externas (Tailwind, fuentes, etc.)
- Solo debe contener importaciones, no estilos reales

### `variables.css`
- Propiedades personalizadas CSS y tokens de diseño
- Definiciones de colores para tema claro (`:root`)
- Valores de radio y breakpoints
- Variables base del tema utilizadas en toda la aplicación

### `base.css`
- Reset CSS y estilos de elementos base
- Mejoras de accesibilidad (estilos de foco, soporte para movimiento reducido)
- Reglas de tipografía y layout por defecto
- Utilidades para lectores de pantalla

### `themes/dark.css`
- Sobreescrituras de colores del tema oscuro
- Filtros de imagen específicos para modo oscuro
- Optimizaciones para legibilidad en modo oscuro

### `themes/high-contrast.css`
- Tema de alto contraste para modo claro
- Bordes mejorados y ratios de contraste
- Combinaciones de colores compatibles con WCAG

### `themes/high-contrast-dark.css`
- Tema de alto contraste específico para modo oscuro
- Se activa automáticamente cuando `.dark` y `.high-contrast` están presentes
- Máximo contraste con fondo negro y texto blanco
- Optimizado para accesibilidad en entornos oscuros

## Comportamiento de Temas

El sistema de temas funciona de la siguiente manera:

- **Modo normal**: Tema claro por defecto
- **Alto contraste activado**: Tema de alto contraste claro
- **Modo oscuro activado**: Tema oscuro
- **Modo oscuro + Alto contraste**: Tema de alto contraste oscuro (automático)

Los usuarios pueden combinar libremente modo oscuro y alto contraste, y el sistema aplicará automáticamente la combinación correcta.

### `components/markdown.css`
- Estilos específicamente para contenido markdown renderizado
- Jerarquía tipográfica para elementos markdown
- Manejo responsivo de tablas
- Estilos para bloques de código

### `utilities.css`
- Clases utilitarias como line-clamp
- Clases helper que pueden reutilizarse entre componentes

## Beneficios de Esta Arquitectura

1. **Mantenibilidad**: Cada archivo tiene una responsabilidad única
2. **Escalabilidad**: Fácil agregar nuevos temas o componentes
3. **Rendimiento**: Solo cargar lo que necesitas
4. **Colaboración**: Los miembros del equipo pueden trabajar en diferentes partes sin conflictos
5. **Depuración**: Más fácil localizar y corregir problemas específicos de estilo

## Agregar Nuevos Estilos

### Para nuevos temas:
Crea un nuevo archivo en `themes/` e impórtalo en `global.css`

### Para nuevos componentes:
Crea un nuevo archivo en `components/` e impórtalo en `global.css`

### Para utilidades:
Agrégalas a `utilities.css`

### Para variables:
Agrégalas a `variables.css`

## Consejos de Desarrollo

- Siempre agrega nuevas importaciones a `global.css` para mantener el orden de importación
- Usa nombres de componentes significativos que reflejen su propósito
- Mantén los estilos específicos de tema en sus respectivos archivos de tema
- Usa propiedades personalizadas CSS para valores que puedan cambiar entre temas
