"use client"

import { useState, useEffect } from "react"
import { FileText, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SearchResult } from "@/lib/api-service"
import { getStoredResults, storeResults } from "@/lib/storage-service"
import { Badge } from "@/components/ui/badge"

export function SelectedSourcesDropdown() {
  const [selectedSources, setSelectedSources] = useState<SearchResult[]>([])

  useEffect(() => {
    setSelectedSources(getStoredResults())

    const handleSourcesUpdate = () => {
      setSelectedSources(getStoredResults())
    }

    window.addEventListener('sourcesUpdated', handleSourcesUpdate)

    return () => {
      window.removeEventListener('sourcesUpdated', handleSourcesUpdate)
    }
  }, [])

  const handleRemove = (url: string) => {
    const updatedSources = selectedSources.filter(source => source.url !== url)
    setSelectedSources(updatedSources)
    storeResults(updatedSources)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <FileText className="h-5 w-5" />
          {selectedSources.length > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {selectedSources.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>Selected Sources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {selectedSources.length === 0 ? (
          <DropdownMenuItem disabled>
            No sources selected
          </DropdownMenuItem>
        ) : (
          selectedSources.map((source) => (
            <DropdownMenuItem key={source.url} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <img
                  src={`https://www.google.com/s2/favicons?sz=32&domain=${source.domain}`}
                  alt={source.domain}
                  className="w-4 h-4"
                />
                <span className="truncate">{source.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2 flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove(source.url)
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}