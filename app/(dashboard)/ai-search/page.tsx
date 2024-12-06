'use client'

import { SearchInput } from "@/components/search/search-input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface SearchResult {
  title: string;
  url: string;
  text: string;
}

export default function AISearchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const { toast } = useToast()

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return '/favicon.ico' // fallback
    }
  }

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">AI Search</h1>
      <SearchInput onSearch={handleSearch} isLoading={isLoading} />
      
      <div className="space-y-1 mt-2">
        {results.map((result, index) => (
          <div key={index} className="p-1">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 flex-shrink-0">
                <Image
                  src={getFaviconUrl(result.url)}
                  alt="Site favicon"
                  width={24}
                  height={24}
                  className="rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-light text-sm text-blue-500 hover:underline"
                >
                  {result.title}
                </a>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {result.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 