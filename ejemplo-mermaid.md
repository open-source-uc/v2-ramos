# Ejemplo de uso de Mermaid en MarkdownTextView

Este documento demuestra cómo el componente `MarkdownTextView` ahora soporta diagramas Mermaid.

## Diagrama de flujo

```mermaid
graph TD
    A[Inicio] --> B{¿Es estudiante?}
    B -->|Sí| C[Acceder a cursos]
    B -->|No| D[Registro requerido]
    C --> E[Explorar materias]
    D --> E
    E --> F[Seleccionar curso]
    F --> G[Revisar horarios]
    G --> H[Confirmar inscripción]
    H --> I[Fin]
```

## Diagrama de secuencia

```mermaid
sequenceDiagram
    participant U as Usuario
    participant S as Sistema
    participant DB as Base de Datos

    U->>S: Buscar curso
    S->>DB: Consultar cursos
    DB-->>S: Resultados
    S-->>U: Mostrar resultados
    U->>S: Seleccionar curso
    S->>DB: Verificar disponibilidad
    DB-->>S: Disponibilidad confirmada
    S-->>U: Mostrar detalles del curso
```

## Diagrama de estado

```mermaid
stateDiagram-v2
    [*] --> NoRegistrado
    NoRegistrado --> Registrado: registro_exitoso
    Registrado --> Inscrito: inscripcion_curso
    Inscrito --> Cursando: inicio_semestre
    Cursando --> Completado: aprobar_curso
    Cursando --> Reprobado: reprobar_curso
    Completado --> [*]
    Reprobado --> Inscrito: reinscripcion
```

## Diagrama de clases

```mermaid
classDiagram
    class Usuario {
        +String nombre
        +String email
        +String id
        +login()
        +logout()
    }

    class Curso {
        +String codigo
        +String nombre
        +Int creditos
        +String horario
        +inscribir(usuario)
        +obtenerDetalles()
    }

    class Inscripcion {
        +Date fechaInscripcion
        +String estado
        +confirmar()
        +cancelar()
    }

    Usuario ||--o{ Inscripcion
    Curso ||--o{ Inscripcion
```

## Texto normal

Este es texto normal que aparece después de los diagramas Mermaid para verificar que el resto del contenido se renderiza correctamente.

- Lista de elementos
- Otro elemento
- Un tercer elemento

Y aquí hay un poco de código inline: `console.log('Hello World')`

```javascript
// Y un bloque de código normal
function saludar(nombre) {
	return `Hola, ${nombre}!`
}
```
