"use client"
 
import type { ColumnDef } from "@tanstack/react-table"
import { Pill } from "../ui/pill"
 
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
        cell: ({ row }) => {
            return <div>{row.original.sigle}</div>
        }
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => {
            return <div>{row.original.name}</div>
        }
    },
    {
        accessorKey: "credits",
        header: "Créditos",
        cell: ({ row }) => {
            return <div>{row.original.credits}</div>
        }
    },
    {
        accessorKey: "school",
        header: "Facultad",
        cell: ({ row }) => {
            return <Pill variant="blue">{row.original.school}</Pill>
        }
    },
    {
        accessorKey: "area",
        header: "Área",
        cell: ({ row }) => {
            return <Pill variant="green">{row.original.area}</Pill>
        }
    }
]