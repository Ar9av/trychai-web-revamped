"use client"

import { useState, useEffect } from "react"
import { format } from 'date-fns'  // Import date-fns for date formatting
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { SelectedResultsPanel } from "./selected-results-panel"
import { getStoredResults, storeResults } from "@/lib/storage-service"
import { SearchResult } from "@/lib/api-service"

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  onProcessSelected: (selected: SearchResult[]) => void
  topic: string
  showSearchResults?: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), 'MMMM dd, yyyy') // Format the date
}

export function SearchResults({ 
  results, 
  isLoading, 
  onProcessSelected, 
  topic,
  showSearchResults = true 
}: SearchResultsProps) {
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Load stored results on mount only
  useEffect(() => {
    setSelectedResults(getStoredResults())
  }, [])

  const handleSelect = (result: SearchResult) => {
    const isSelected = selectedResults.some(r => r.url === result.url)
    const newResults = isSelected
      ? selectedResults.filter(r => r.url !== result.url)
      : [...selectedResults, result]

    setSelectedResults(newResults)
    storeResults(newResults)
    // Dispatch event after storing
    window.dispatchEvent(new Event('sourcesUpdated'))
  }

  const handleRemove = (result: SearchResult) => {
    const newResults = selectedResults.filter(r => r.url !== result.url)
    setSelectedResults(newResults)
    storeResults(newResults)
    // Dispatch event after storing
    window.dispatchEvent(new Event('sourcesUpdated'))
  }

  const handleProcessSelected = async () => {
    if (selectedResults.length === 0) {
      toast({
        title: "No results selected",
        description: "Please select at least one result to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await onProcessSelected(selectedResults)
    } finally {
      setIsProcessing(false)
    }
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

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {selectedResults.length} results selected
        </div>
        <Button
          onClick={handleProcessSelected}
          disabled={selectedResults.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Proceed
            </>
          )}
        </Button>
      </div>

      <SelectedResultsPanel
        selectedResults={selectedResults}
        onRemove={handleRemove}
      />

      {showSearchResults && results.length > 0 && (
        <div className="space-y-4 mt-4">
          {results.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedResults.some(r => r.url === result.url)}
                  onCheckedChange={() => handleSelect(result)}
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
                  <div className="text-xs text-muted-foreground text-right">
                    {result.published_date && formatDate(result.published_date)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}