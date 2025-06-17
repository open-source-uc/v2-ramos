"use client"
 
import type { ColumnDef } from "@tanstack/react-table"
 
export type Course = {
  id: number,
  sigle: string,
  school_id: number,
  area_id: number,
  category_id: number,
  superlikes: number,
  likes: number,
  dislikes: number,
  votes_low_workload: number,
  votes_medium_workload: number,
  votes_high_workload: number,
  avg_weekly_hours: number,
  sort_index: number,
  school?: string,
  area?: string,
  category?: string
}

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "sigle",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Sigla
                    {column.getIsSorted() === "asc" ? " 🔼" : column.getIsSorted() === "desc" ? " 🔽" : ""}
                </button>
            )
        },
        cell: ({ row }) => {
            return (
                <a href={`/${row.getValue("sigle")}`} className="text-blue-600 hover:underline font-medium">
                    {row.getValue("sigle")}
                </a>
            )
        }
    },
    {
        accessorKey: "school",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Escuela
                    {column.getIsSorted() === "asc" ? " 🔼" : column.getIsSorted() === "desc" ? " 🔽" : ""}
                </button>
            )
        },
    },
    {
        accessorKey: "area",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Área
                    {column.getIsSorted() === "asc" ? " 🔼" : column.getIsSorted() === "desc" ? " 🔽" : ""}
                </button>
            )
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Categoría
                    {column.getIsSorted() === "asc" ? " 🔼" : column.getIsSorted() === "desc" ? " 🔽" : ""}
                </button>
            )
        },
    },
    {
        accessorKey: "avg_weekly_hours",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Horas/Semana
                    {column.getIsSorted() === "asc" ? " 🔼" : column.getIsSorted() === "desc" ? " 🔽" : ""}
                </button>
            )
        },
        cell: ({ row }) => {
            return (
                <span>{(row.getValue("avg_weekly_hours") as number).toFixed(1)}h</span>
            )
        }
    },
    {
        id: "valoraciones",
        header: "Valoraciones",
        cell: ({ row }) => {
            const superlikes = row.original.superlikes
            const likes = row.original.likes
            const dislikes = row.original.dislikes
            
            return (
                <div className="flex space-x-2">
                    <span className="bg-green-50 px-2 py-1 rounded text-xs">
                        <span className="text-green-600">❤️</span> {superlikes}
                    </span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-xs">
                        <span className="text-blue-600">👍</span> {likes}
                    </span>
                    <span className="bg-red-50 px-2 py-1 rounded text-xs">
                        <span className="text-red-600">👎</span> {dislikes}
                    </span>
                </div>
            )
        }
    },
    {
        id: "cargaTrabajo",
        header: "Carga de Trabajo",
        cell: ({ row }) => {
            const low = row.original.votes_low_workload
            const medium = row.original.votes_medium_workload
            const high = row.original.votes_high_workload
            
            return (
                <div className="flex flex-col space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-green-600">Baja:</span>
                        <span className="font-semibold">{low}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-yellow-600">Media:</span>
                        <span className="font-semibold">{medium}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-red-600">Alta:</span>
                        <span className="font-semibold">{high}</span>
                    </div>
                </div>
            )
        }
    },
]