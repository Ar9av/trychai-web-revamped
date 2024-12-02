"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchResult {
  title: string
  url: string
  content: string
  domain: string
}

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
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
    <ScrollArea className="mt-4 h-[400px]">
      <div className="space-y-4 pr-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4">
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
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}