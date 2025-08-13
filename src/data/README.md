# Calendario Académico - Configuración

Este archivo JSON (`academicCalendar.json`) contiene la configuración de fechas académicas, feriados y excepciones para cada semestre.

## Estructura del archivo

```json
{
  "CODIGO_SEMESTRE": {
    "semesterStart": "YYYY-MM-DD",
    "semesterEnd": "YYYY-MM-DD", 
    "excludedDates": [
      {
        "date": "YYYY-MM-DD",
        "name": "Descripción de la fecha",
        "type": "holiday|exam_week|final_exam|custom"
      }
    ]
  }
}
```

## Tipos de fechas excluidas

- **`holiday`**: Feriados nacionales o institucionales
- **`exam_week`**: Semanas de exámenes (primera ronda)
- **`final_exam`**: Exámenes finales (segunda ronda)
- **`custom`**: Fechas personalizadas (eventos especiales, etc.)

## Cómo editar

### Agregar un nuevo semestre

```json
"2026-1": {
  "semesterStart": "2026-03-09",
  "semesterEnd": "2026-07-03",
  "excludedDates": [
    // ... fechas excluidas
  ]
}
```

### Agregar un feriado

```json
{
  "date": "2025-12-25",
  "name": "Navidad",
  "type": "holiday"
}
```

### Agregar semana de exámenes

```json
{
  "date": "2025-11-17",
  "name": "Semana de exámenes - Lunes", 
  "type": "exam_week"
}
```

### Agregar evento personalizado

```json
{
  "date": "2025-09-11",
  "name": "Día del Alumno UC",
  "type": "custom"
}
```

## Opciones de exportación ICS

Al exportar el calendario a ICS, puedes elegir qué tipos de fechas excluir:

### Opciones disponibles en la interfaz:

1. **"Exportar todo (solo clases)"**
   - Excluye: `holiday`, `exam_week`, `final_exam`
   - Ideal para: Ver solo las clases regulares

2. **"Exportar todo (con exámenes)"**
   - Excluye: `holiday`
   - Incluye: `exam_week`, `final_exam`
   - Ideal para: Incluir todas las actividades académicas

3. **"Exportar todo (incluir todo)"**
   - Incluye: Todo (incluso feriados)
   - Ideal para: Calendario completo sin exclusiones

## Consejos para modificar

1. **Fechas en formato ISO**: Siempre usa el formato `YYYY-MM-DD`
2. **Orden cronológico**: Mantén las fechas ordenadas por fecha
3. **Nombres descriptivos**: Usa nombres claros para identificar las fechas
4. **Consistencia de tipos**: Usa los tipos correctos para cada categoría
5. **Validación**: Verifica que las fechas sean válidas antes de guardar

## Ejemplo de modificación común

Para cambiar las fechas de exámenes del semestre 2025-2:

```json
{
  "date": "2025-11-17",
  "name": "Semana de exámenes - Lunes",
  "type": "exam_week"
},
{
  "date": "2025-11-18", 
  "name": "Semana de exámenes - Martes",
  "type": "exam_week"
}
```

Los cambios se reflejarán automáticamente en la próxima exportación ICS.
