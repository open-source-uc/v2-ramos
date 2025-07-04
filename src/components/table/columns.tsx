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

export type Course = {
  id: string;
  sigle: string;

  name: string;
  credits: number;

  school: string;
  area: string;
  category: string;

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
    accessorKey: "school",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold flex gap-2 items-center my-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Facultad
          <SwapVertIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Pill variant="blue">{row.original.school}</Pill>;
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
    header: () => {
      return <div className="text-left font-semibold">Reseñas</div>;
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
