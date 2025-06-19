"use client"
 
import type { ColumnDef } from "@tanstack/react-table"
import { Pill } from "../ui/pill"
import { Button } from "../ui/button"
import { SwapVert } from "../icons/icons"
 
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
        header: ({column}) => {
            return (
            <Button 
                className="font-semibold flex gap-1 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sigla
                    <SwapVert />
            </Button>
            )
        },
        cell: ({ row }) => {
            return <div>{row.original.sigle}</div>
        }
    },
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
            <Button 
                className="font-semibold flex gap-1 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <SwapVert />
            </Button>
            )
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
        header: ({column}) => {
           return (
            <Button 
                className="font-semibold flex gap-1 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Facultad
                    <SwapVert />
            </Button>
            )
        },
        cell: ({ row }) => {
            return <Pill variant="blue">{row.original.school}</Pill>
        }
    },
    {
        accessorKey: "area",
        header: ({column}) => {
           return (
            <Button 
                className="font-semibold flex gap-1 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Área de Formación General
                    <SwapVert />
            </Button>
            )
        },
        cell: ({ row }) => {
            if (row.original.area !== "Ninguna") {
                return <Pill variant="green">{row.original.area}</Pill>
            }
        }
    }
]