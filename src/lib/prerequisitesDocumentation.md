# Documentación del Parser de Prerrequisitos

## Resumen

El parser de prerrequisitos es una función de TypeScript que convierte las cadenas de prerrequisitos de la base de datos de cursos en un formato estructurado que puede usarse para mostrar y entender los requisitos de los cursos.

```typescript
function parsePrerequisites(req: string): ParsedPrerequisites
```

## Tipos

### PrerequisiteCourse
```typescript
interface PrerequisiteCourse {
    sigle: string;          // Código del curso (ej: "MAT1124")
    name?: string;          // Nombre del curso (opcional, se puede agregar después)
    isCorricular: boolean;  // true si el curso tiene sufijo (c)
}
```

### PrerequisiteGroup
```typescript
interface PrerequisiteGroup {
    type: 'AND' | 'OR';                    // Tipo de relación
    courses: PrerequisiteCourse[];         // Cursos directos en este grupo
    groups?: PrerequisiteGroup[];          // Grupos anidados (opcional)
}
```

### ParsedPrerequisites
```typescript
interface ParsedPrerequisites {
    hasPrerequisites: boolean;       // false si es "No tiene" o vacío
    structure?: PrerequisiteGroup;   // Estructura del grupo raíz
}
```

## Ejemplos de Uso

### Uso Básico
```typescript
import { parsePrerequisites } from '@/lib/courseReq';

const req = "MAT1124 o MAT1126";
const parsed = parsePrerequisites(req);
```

### Con Nombres de Cursos
```typescript
import { getPrerequisitesWithNames } from '@/services/courses';

const reqWithNames = await getPrerequisitesWithNames(locals, req);
```

## Ejemplos de Formato de Entrada

### Casos Simples
- `"No tiene"` → Sin prerrequisitos
- `"MAT1124"` → Un solo prerrequisito
- `"MAT1124(c)"` → Un solo prerrequisito corricular

### Relaciones OR
- `"MAT1124 o MAT1126"` → Necesitas UNO de estos cursos
- `"MAT0004 o MAT0006 o MAT0007"` → Necesitas UNO de estos tres cursos

### Relaciones AND
- `"MAT1124 y MAT1126"` → Necesitas TODOS estos cursos

### Relaciones Complejas
- `"(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007)"` → Necesitas UNO del primer grupo Y UNO del segundo grupo
- `"(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007) o (IMT2220 o IMT2230)"` → Estructura anidada compleja

### Cursos Corriculares
- `"MAT1124(c) y (MAT0004 o MAT0006)"` → Curso corricular + prerrequisitos regulares
- `"(MAT1124(c) o MAT1126) y MAT0007"` → Mezclado corricular y regular en el mismo grupo

## Entendiendo el Output

### Explicación de la Estructura
El parser crea una estructura de árbol donde:
- `type: 'AND'` significa que TODOS los elementos del grupo son requeridos
- `type: 'OR'` significa que solo UN elemento del grupo es requerido
- `courses` contiene requisitos directos de cursos
- `groups` contiene grupos de requisitos anidados

### Ejemplo de Output
Input: `"(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007)"`

```json
{
  "hasPrerequisites": true,
  "structure": {
    "type": "AND",
    "courses": [],
    "groups": [
      {
        "type": "OR",
        "courses": [
          {"sigle": "MAT1124", "isCorricular": false},
          {"sigle": "MAT1126", "isCorricular": false}
        ]
      },
      {
        "type": "OR",
        "courses": [
          {"sigle": "MAT0004", "isCorricular": false},
          {"sigle": "MAT0006", "isCorricular": false},
          {"sigle": "MAT0007", "isCorricular": false}
        ]
      }
    ]
  }
}
```

Esto significa: "Necesitas (MAT1124 O MAT1126) Y (MAT0004 O MAT0006 O MAT0007)"

## Cursos Corriculares

Los cursos corriculares se marcan con `(c)` en la cadena original. Estos son cursos que pueden ser tomados junto con el curso objetivo.

En la estructura parseada, tienen `isCorricular: true`.

## Funciones

### parsePrerequisites(req: string)
- Función básica de parsing
- Retorna estructura sin nombres de cursos
- Usar para parsing del lado del cliente

### getPrerequisitesWithNames(locals, req)
- Función del lado del servidor
- Obtiene nombres de cursos de la base de datos
- Retorna estructura enriquecida con nombres de cursos

### getCourseNames(locals, sigles)
- Función auxiliar para obtener nombres de cursos
- Recibe array de siglas
- Retorna Map de sigla → nombre

## Manejo de Errores

El parser incluye manejo de errores para:
- Cadenas de prerrequisitos inválidas
- Expresiones malformadas
- Paréntesis faltantes
- Códigos de curso desconocidos

Si el parsing falla, retorna:
```json
{
  "hasPrerequisites": false
}
```