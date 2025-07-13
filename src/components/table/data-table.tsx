"use client";

import { useState, useEffect, useMemo } from "react";
import { columns, type Course } from "./columns";
import Fuse from "fuse.js";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TableCourseCampuses from "./TableCourseCampuses";

import {
  AreaIcon,
  OpenInFullIcon
} from "@/components/icons/icons";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Sentiment } from "@/components/icons/sentiment";
import {
  calculateSentiment,
  calculatePositivePercentage,
} from "@/lib/courseStats";

interface DataTableProps {
  data: Course[];
  externalSearchValue?: string;
}

export function DataTable({ data, externalSearchValue = "" }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(externalSearchValue);

  // Create Fuse instance with configuration for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: ['name', 'sigle'],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [data]);

  // Filter data using Fuse.js before passing to table
  const filteredData = useMemo(() => {
    if (!globalFilter || globalFilter.trim() === '') {
      return data;
    }
    
    const searchResults = fuse.search(globalFilter);
    return searchResults.map(result => result.item);
  }, [data, globalFilter, fuse]);

  // Update internal filter when external search value changes
  useEffect(() => {
    setGlobalFilter(externalSearchValue);
  }, [externalSearchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="hidden pt-4 tablet:block">
        <div className="flex items-center gap-4">
          <div className="space-x-2"></div>
        </div>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted/50 transition-colors focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => {
                      window.location.href = `/${row.original.sigle}`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        window.location.href = `/${row.original.sigle}`;
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver detalles del curso ${row.original.sigle} - ${row.original.name}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-foreground-muted-dark">
            {table.getFilteredRowModel().rows.length} cursos encontrados
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
      <div className="tablet:hidden flex flex-col space-y-4 pt-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const course = row.original;
            const totalReviews =
              course.likes + course.superlikes + course.dislikes;
            const sentimentType = calculateSentiment(
              course.likes,
              course.superlikes,
              course.dislikes
            );
            const positivePercentage = calculatePositivePercentage(
              course.likes,
              course.superlikes,
              course.dislikes
            );

            return (
              /* Versión para móvil */
              <div
                key={row.id}
                className="border border-border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => {
                  window.location.href = `/${course.sigle}`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    window.location.href = `/${course.sigle}`;
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalles del curso ${course.sigle} - ${course.name}`}
              >
                {/* Header con sigla y créditos */}
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-xs text-foreground">
                    {course.sigle}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {course.credits} créditos
                  </div>
                </div>

                {/* Nombre del curso */}
                <h3 className="text-lg font-semibold text-foreground mb-3 leading-tight">
                  {course.name}
                </h3>

                <div className="flex flex-col gap-2">
                  {/* Campus */}
                  <div className="flex items-center">
                    <TableCourseCampuses
                      variant="with-icon"
                      campus={course.campus || []}
                      lastSemester={course.last_semester}
                    />
                  </div>

                  {/* Área de Formación General */}
                  {course.area && (
                    <div className="flex items-center">

                      <Pill variant="pink" size="sm" icon={AreaIcon}>{course.area}</Pill>
                    </div>
                  )}
                  {/* Reseñas con componente Sentiment */}
                  <div className="flex items-center justify-between">
                    {totalReviews === 0 ? (
                      <Sentiment sentiment="question" size="xs" />
                    ) : (
                      <Sentiment
                        sentiment={sentimentType}
                        size="xs"
                        percentage={positivePercentage}
                        reviewCount={totalReviews}
                        ariaLabel={`${positivePercentage}% de reseñas positivas de ${totalReviews} total`}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-row-reverse mt-4 text-xs text-muted-foreground items-center gap-1">
                  <OpenInFullIcon className="inline-block h-4 w-4" /> Presiona para ver detalles
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron cursos.
          </div>
        )}

        {/* Paginación móvil */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} cursos encontrados
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
