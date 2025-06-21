"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchProps {
  onSearch: (searchTerm: string) => void
  placeholder?: string
  className?: string
  initialValue?: string
}

export function Search({ 
  onSearch, 
  placeholder = "Buscar por nombre o sigla...",
  className = "",
  initialValue = ""
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          variant="search"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}
