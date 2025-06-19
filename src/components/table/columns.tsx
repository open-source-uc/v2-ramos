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
        header: () => {
            return <div className="text-left font-semibold">Sigla</div>
        },
        cell: ({ row }) => {
            return <div>{row.original.sigle}</div>
        }
    },
    {
        accessorKey: "name",
        header: () => {
            return <div className="text-left font-semibold">Nombre</div>
        },
        cell: ({ row }) => {
            return <div className="font-medium">{row.original.name}</div>
        }
    },
    {
        accessorKey: "credits",
        header: () => {
            return <div className="text-left font-semibold">Créditos</div>
        },
        cell: ({ row }) => {
            return <div>{row.original.credits}</div>
        }
    },
    {
        accessorKey: "school",
        header: () => {
            return <div className="text-left font-semibold">Facultad</div>
        },
        cell: ({ row }) => {
            return <Pill variant="blue">{row.original.school}</Pill>
        }
    },
    {
        accessorKey: "area",
        header: () => {
            return <div className="text-left font-semibold">Área</div>
        },
        cell: ({ row }) => {
            return <Pill variant="green">{row.original.area}</Pill>
        }
    }
]