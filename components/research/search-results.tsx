"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import React from "react"

interface SearchResult {
  title: string
  url: string
  content: string
  domain: string
}

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  onProcessSelected: (selected: SearchResult[]) => void
}

export function SearchResults({ results, isLoading, onProcessSelected }: SearchResultsProps) {
  const [selectedResults, setSelectedResults] = React.useState<Set<number>>(new Set())

  const handleSelect = (index: number) => {
    const newSelected = new Set(selectedResults)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedResults(newSelected)
  }

  const handleProcessSelected = () => {
    if (selectedResults.size === 0) {
      toast({
        title: "No results selected",
        description: "Please select at least one result to process",
        variant: "destructive",
      })
      return
    }

    const selected = Array.from(selectedResults).map(index => results[index])
    onProcessSelected(selected)
  }

  if (isLoading) {
    return (
      <div className="mt-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (!results.length) {
    return null
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {selectedResults.size} results selected
        </div>
        <Button
          onClick={handleProcessSelected}
          disabled={selectedResults.size === 0}
        >
          <FileText className="mr-2 h-4 w-4" />
          Process for Report
        </Button>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedResults.has(index)}
                onCheckedChange={() => handleSelect(index)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${result.domain}`}
                    alt={result.domain}
                    className="w-4 h-4"
                  />
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {result.domain}
                  </a>
                </div>
                <h3 className="font-medium mb-2">{result.title}</h3>
                <p className="text-sm text-muted-foreground">{result.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}