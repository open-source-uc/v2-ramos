"use client"
 
import type { ColumnDef } from "@tanstack/react-table"
 
export type Course = {
  id: number,
  sigle: string,
  name: string,
  credits: number,
  school: string,
  area: string,
  category: string
}

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "sigle",
        header: "Sigla",
    },
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "credits",
        header: "Créditos",
    },
    {
        accessorKey: "school",
        header: "Facultad",
    },
    {
        accessorKey: "area",
        header: "Área",
    },
    {
        accessorKey: "category",
        header: "Categoría"
    },
]