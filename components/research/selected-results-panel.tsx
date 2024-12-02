"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SearchResult {
  title: string
  url: string
  content: string
  domain: string
}

interface SelectedResultsPanelProps {
  selectedResults: SearchResult[]
  onRemove: (result: SearchResult) => void
}

export function SelectedResultsPanel({ selectedResults, onRemove }: SelectedResultsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (selectedResults.length === 0) return null

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center"
      >
        <span>Selected Sources ({selectedResults.length})</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <ScrollArea className="h-full max-h-96 mt-2">
          <div className="space-y-2">
            {selectedResults.map((result, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={`https://www.google.com/s2/favicons?sz=64&domain=${result.domain}`}
                        alt={result.domain}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">
                        {result.domain}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-1">{result.title}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onRemove(result)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}