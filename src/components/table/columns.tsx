"use client"
 
import type { ColumnDef } from "@tanstack/react-table"
import { Pill } from "../ui/pill"
import { Button } from "../ui/button"
import { SwapVertIcon } from "../icons/icons"
import { Sentiment } from "../icons/sentiment"
 
export type Course = {
  id: number,
  sigle: string,
  name: string,
  credits: number,
  school: string,
  area: string,
  category: string,
  superlikes: number,
  likes: number,
  dislikes: number
}

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "sigle",
        header: ({column}) => {
            return (
            <Button 
                className="font-semibold flex gap-2 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sigla
                    <SwapVertIcon />
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
                className="font-semibold flex gap-2 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <SwapVertIcon />
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
                className="font-semibold flex gap-2 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Facultad
                    <SwapVertIcon />
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
                className="font-semibold flex gap-2 items-center my-2" 
                variant="ghost" 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Área de Formación General
                    <SwapVertIcon />
            </Button>
            )
        },
        cell: ({ row }) => {
            if (row.original.area !== "Ninguna") {
                return <Pill variant="pink">{row.original.area}</Pill>
            }
        }
    },
    {
        accessorKey: "reviews",
        header: () => {
            return <div className="text-left font-semibold">Reseñas</div>
        },
        cell: ({ row }) => {
            const { superlikes, likes, dislikes } = row.original
            const totalReviews = 2*superlikes + likes + dislikes
            
            if (totalReviews === 0) {
                return (
                    <Sentiment sentiment="question" size="sm" />
                )
            }
            
            const positiveReviews = 2*superlikes + likes
            const positivePercentage = (positiveReviews / totalReviews) * 100
            
            let sentimentType: "veryHappy" | "happy" | "neutral" | "sad" | "verySad"
            
            if (positivePercentage >= 80) {
                sentimentType = "veryHappy"
            } else if (positivePercentage >= 60) {
                sentimentType = "happy"
            } else if (positivePercentage >= 40) {
                sentimentType = "neutral"
            } else if (positivePercentage >= 20) {
                sentimentType = "sad"
            } else {
                sentimentType = "verySad"
            }
            
            return (
                <Sentiment 
                    sentiment={sentimentType} 
                    size="sm"
                    ariaLabel={`${Math.round(positivePercentage)}% de reseñas positivas de ${totalReviews} total`}
                />
            )
        }
    }
]