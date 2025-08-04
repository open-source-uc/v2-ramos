import { createEvents } from 'ics'
import type { EventAttributes } from 'ics'
import { recurrenceRuleGenWeekly } from '@/lib/icsHorario'
import { TIME_SLOTS } from '@/lib/scheduleMatrix'
import { getExcludedDates } from '@/lib/academicCalendar'
import type { WeekDay } from '@/lib/icsHorario'

// Utilidad para descargar un archivo ICS en el navegador
function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Mapea el nombre del día a RFC5545 (ics)
const DAY_TO_ICS: Record<string, WeekDay> = {
  'L': 'MO',
  'M': 'TU',
  'W': 'WE',
  'J': 'TH',
  'V': 'FR',
  'S': 'SA',
  'D': 'SU',
}

// Mapea el string de hora a [hora, minuto]
function parseTimeSlot(time: string): [number, number] {
  // Ejemplo: '08:20' => [8, 20]
  const [h, m] = time.split(':').map(Number)
  return [h, m]
}

// Dada la matriz y los datos, genera eventos ICS
export default function generateICSFromSchedule({
  matrix,
  courseSectionsData,
  selectedCourses,
  semesterStart,
  semesterEnd,
  semesterCode,
  hiddenCourses = [],
  filterType,
}: {
  matrix: any // ScheduleMatrix
  courseSectionsData: any // CourseSections
  selectedCourses: string[]
  semesterStart: Date
  semesterEnd: Date
  semesterCode: string // e.g. '2025-1'
  hiddenCourses?: string[]
  filterType?: string
}) {
  const events: EventAttributes[] = [];
  
  // Construir array de tipos a excluir basado en las opciones
  const excludeTypes: string[] = [];
  excludeTypes.push('holiday');     // Siempre excluir feriados
  excludeTypes.push('final_exam');  // Siempre excluir exámenes finales
  excludeTypes.push('custom');      // Siempre excluir eventos personalizados (recesos, etc.)
  
  // Obtener fechas excluidas según las opciones
  const excludedDates = getExcludedDates(semesterCode, excludeTypes);
  
  console.log('=== CONFIGURACIÓN DE EXCLUSIONES ===');
  console.log('Semestre:', semesterCode);
  console.log('Tipos excluidos:', excludeTypes);
  console.log('Total de fechas excluidas:', excludedDates.length);
  
  // Verificación específica para el 15 de agosto
  const august15 = new Date('2025-08-15');
  const isAugust15Excluded = excludedDates.some(date => 
    date.getFullYear() === 2025 && 
    date.getMonth() === 7 && 
    date.getDate() === 15
  );
  console.log('¿15 de agosto está excluido?', isAugust15Excluded ? '✅ SÍ' : '❌ NO');
  
  console.log('Primeras 5 fechas excluidas:');
  excludedDates.slice(0, 5).forEach((date: Date) => {
    console.log(`  - ${date.toISOString().split('T')[0]} (${date.toLocaleDateString('es-CL', { weekday: 'long' })})`);
  });
  console.log('=====================================');

  // Días de la semana en orden (ajusta según tu config)
  const DAYS = ['L', 'M', 'W', 'J', 'V', 'S', 'D'];

  matrix.forEach((row: any[], timeIndex: number) => {
    row.forEach((classes: any[], dayIndex: number) => {
      classes.forEach((classInfo: any) => {
			if (filterType && classInfo.type !== filterType) return;
			
			// Construir el ID único para este bloque y verificar si está oculto
        const dayLetter = DAYS[dayIndex];
        const startTimeStr = TIME_SLOTS[timeIndex];
        const blockId = `${classInfo.courseId}-${classInfo.section}-${dayLetter}-${startTimeStr}`;
        if (hiddenCourses.includes(blockId)) return;
			
        const icsDay = DAY_TO_ICS[dayLetter];
        if (!icsDay) return;

        // Cada bloque en UC dura 1:10 (1 hora y 10 minutos)
        const [startHour, startMinute] = parseTimeSlot(startTimeStr);
        
        // Calcular hora de fin: agregar 1 hora y 10 minutos
        let endHour = startHour + 1;
        let endMinute = startMinute + 10;
        
        // Ajustar si los minutos pasan de 60
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }

        // Buscar el primer día de la semana correspondiente al día de la clase
        const firstDay = new Date(semesterStart);
        const jsDayIndex = ['D','L','M','W','J','V','S'].indexOf(dayLetter);
        let diff = jsDayIndex - firstDay.getDay();
        if (diff < 0) diff += 7;
        firstDay.setDate(firstDay.getDate() + diff);

        // Crear array de exclusiones con la misma hora que el evento
        const exdateArray = excludedDates.map((date: Date) => [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          startHour,    // Misma hora que el evento
          startMinute   // Mismos minutos que el evento
        ] as [number, number, number, number, number]);

        events.push({
          start: [firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate(), startHour, startMinute],
          end: [firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate(), endHour, endMinute],
          title: `${classInfo.courseId} - ${classInfo.type}`,
          description: `${classInfo.courseId} - ${classInfo.type}\n${classInfo.campus}\nSemestre: ${semesterCode}`,
          location: classInfo.campus,
          recurrenceRule: recurrenceRuleGenWeekly(
            icsDay,
            1,
            semesterEnd.getFullYear(),
            semesterEnd.getMonth() + 1,
            semesterEnd.getDate()
          ),
          exclusionDates: exdateArray.length > 0 ? exdateArray : undefined,
        });
        
        // Debug detallado
        console.log(`
=== EVENTO: ${classInfo.courseId} - ${dayLetter} ${startTimeStr} ===`);
        console.log('Primer día de clase:', firstDay.toISOString().split('T')[0]);
        console.log('Fin del semestre:', semesterEnd.toISOString().split('T')[0]);
        console.log('Fechas excluidas encontradas:', excludedDates.length);
        
        // Verificar específicamente si 15 de agosto está en las exclusiones de este evento
        const august15InExdates = exdateArray.find(exdate => 
          exdate[0] === 2025 && exdate[1] === 8 && exdate[2] === 15
        );
        console.log('¿15 de agosto en EXDATE de este evento?', august15InExdates ? '✅ SÍ' : '❌ NO');
        if (august15InExdates) {
          console.log('EXDATE para 15 agosto:', august15InExdates);
        }
        
        if (excludedDates.length > 0) {
          console.log('Primeras 3 exclusiones:');
          excludedDates.slice(0, 3).forEach((date: Date) => {
            console.log(`  - ${date.toISOString().split('T')[0]} (${date.toLocaleDateString('es-CL', { weekday: 'long' })})`);
          });
          console.log('EXDATE en ICS:', exdateArray.slice(0, 3));
        } else {
          console.log('❌ NO HAY EXCLUSIONES - Revisa configuración del calendario académico');
        }
      })
    })
  })

  createEvents(events, (error, value) => {
		if (!error && value) {
      // Enfoque específico para Google Calendar: manejar líneas EXDATE multilinea
      let correctedICS = value
      
      console.log('=== CORRECCIÓN PARA GOOGLE CALENDAR ===')
      
      // Google Calendar requiere que EXDATE tenga el mismo timezone que DTSTART
      // Manejar líneas EXDATE que pueden estar divididas en múltiples líneas
      correctedICS = correctedICS.replace(/EXDATE[^:]*:[^\r\n]*(?:\r?\n[ \t][^\r\n]*)*/g, (match) => {
        // Eliminar todas las Z para hacer las fechas "locales" como DTSTART
        const cleanExdate = match.replace(/Z/g, '')
        console.log('📅 EXDATE original:', match.substring(0, 50) + '...')
        console.log('📅 EXDATE corregido:', cleanExdate.substring(0, 50) + '...')
        return cleanExdate
      })
      
      // Verificar que las correcciones se aplicaron
      const exdateMatches = correctedICS.match(/EXDATE[^:]*:[^\r\n]*(?:\r?\n[ \t][^\r\n]*)*/g) || []
      console.log('✅ Total bloques EXDATE encontrados:', exdateMatches.length)
      console.log('✅ Formato aplicado: timezone local (sin Z)')
      
      // Verificar que no queden Z en las líneas EXDATE
      const hasRemainingZ = correctedICS.includes('EXDATE') && correctedICS.match(/EXDATE[^:]*:[^\r\n]*(?:\r?\n[ \t][^\r\n]*)*.*Z/g)
      if (hasRemainingZ) {
        console.log('⚠️ Aún quedan algunas Z sin eliminar')
      } else {
        console.log('✅ Todas las Z fueron eliminadas de EXDATE')
      }
      console.log('📄 Archivo listo para Google Calendar')

      const filename = filterType != undefined ? `horario-${filterType}-${semesterCode}.ics` : `horario-${semesterCode}.ics`
      downloadICS(filename, correctedICS)
    } else {
      console.error('Error generando ICS:', error)
    }
  })
}