"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pill } from "@/components/ui/pill";
import { Button } from "../ui/button";
import { SwapVertIcon } from "../icons/icons";
import { Sentiment } from "../icons/sentiment";
import {
  calculateSentiment,
  calculatePositivePercentage
} from "@/lib/courseStats";
import TableCourseCampuses from "./TableCourseCampuses";

export type Course = {
  id: string;
  sigle: string;

  name: string;
  credits: number;
  req: string;
  conn: string;
  restr: string;
  equiv: string;
  format: Array<string>;
  campus: Array<string>;
  is_removable: Array<boolean>;
  is_special: Array<boolean>;
  is_english: Array<boolean>;

  school: string;
  area: string;
  category: string;

  last_semester: string; // Format: YYYY-S

  likes: number;
  superlikes: number;
  dislikes: number;

  votes_low_workload: number;
  votes_medium_workload: number;
  votes_high_workload: number;

  votes_mandatory_attendance: number;
  votes_optional_attendance: number;
  avg_weekly_hours: number;
  sort_index: number;
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "sigle",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sigla
          <SwapVertIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.sigle}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <SwapVertIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-wrap max-w-[200px]">
          {row.original.name}
        </div>
      );
    },
  },
  {
    accessorKey: "credits",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Créditos
          <SwapVertIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.credits}</div>;
    },
  },
  {
    accessorKey: "campus",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Campus
          <SwapVertIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <TableCourseCampuses 
          campus={row.original.campus || []} 
          lastSemester={row.original.last_semester} 
        />
      );
    },
  },
  {
    accessorKey: "area",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Área de Formación General
          <SwapVertIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.area !== "") {
        return <Pill variant="pink">{row.original.area}</Pill>;
      }
    },
  },
  {
    accessorKey: "reviews",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reseñas
          <SwapVertIcon />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original;
      const b = rowB.original;
      
      // Calculate positivity percentage for both rows
      const positivityA = calculatePositivePercentage(a.likes, a.superlikes, a.dislikes);
      const positivityB = calculatePositivePercentage(b.likes, b.superlikes, b.dislikes);
      
      // Primary sort: by positivity percentage
      if (positivityA !== positivityB) {
        return positivityA - positivityB;
      }
      
      // Secondary sort: by total review count (more reviews = higher rank)
      const totalA = a.likes + a.superlikes + a.dislikes;
      const totalB = b.likes + b.superlikes + b.dislikes;
      
      return totalA - totalB;
    },
    cell: ({ row }) => {
      const { superlikes, likes, dislikes } = row.original;
      const totalReviews = likes + superlikes + dislikes; // Count each review once, like in [sigle]/index

      if (totalReviews === 0) {
        return <Sentiment sentiment="question" size="sm" />;
      }

      const sentimentType = calculateSentiment(likes, superlikes, dislikes);
      const positivePercentage = calculatePositivePercentage(likes, superlikes, dislikes);

      return (
        <Sentiment
          sentiment={sentimentType}
          size="sm"
          percentage={positivePercentage}
          reviewCount={totalReviews}
          ariaLabel={`${positivePercentage}% de reseñas positivas de ${totalReviews} total`}
        />
      );
    },
  },
];
