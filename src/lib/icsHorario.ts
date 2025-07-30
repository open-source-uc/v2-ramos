import { createEvents, type EventAttributes } from "ics";

// Días de la semana en formato RFC5545
export type WeekDay = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

// Genera la regla de recurrencia semanal
export function recurrenceRuleGenWeekly(
  day: WeekDay,
  everyWeeks: number,
  yearEnd: number,
  monthEnd: number,
  dayEnd: number
): string {
  const dayEndString = dayEnd < 10 ? `0${dayEnd}` : `${dayEnd}`;
  const monthEndString = monthEnd < 10 ? `0${monthEnd}` : `${monthEnd}`;
  return `FREQ=WEEKLY;INTERVAL=${everyWeeks};BYDAY=${day};UNTIL=${yearEnd}${monthEndString}${dayEndString}T000000Z`;
}

// Agrupa los eventos por tipo y genera un VCALENDAR por cada tipo