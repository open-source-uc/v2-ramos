"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, LoadingIcon } from "@/components/icons/icons"

interface SearchProps {
  onSearch: (searchTerm: string) => void
  placeholder?: string
  className?: string
  initialValue?: string
  normalizeText?: boolean // Option to enable/disable text normalization
  isSearching?: boolean // New prop to indicate loading state
}

// Function to normalize text for searching (handle special characters)
const normalizeSearchText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
}

export function Search({ 
  onSearch, 
  placeholder = "Buscar por nombre o sigla...",
  className = "",
  initialValue = "",
  normalizeText = true, // Default to true for better search experience
  isSearching = false // Default to false
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Pass both original and normalized text to the parent component
    const searchValue = normalizeText ? normalizeSearchText(value) : value
    onSearch(searchValue)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isSearching ? (
            <LoadingIcon className="h-4 w-4 fill-input animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4 fill-input" />
          )}
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}

// Export the normalize function for external use when needed
export { normalizeSearchText }
