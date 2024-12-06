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
  const [gptAnalysis, setGptAnalysis] = useState<string>("")
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
    setGptAnalysis("") // Reset GPT analysis when new search starts
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

      // After getting search results, send to GPT for analysis
      const gptResponse = await fetch('/api/ai-search/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: query, 
          data: data.map((result: SearchResult, index: number) => 
            `Index: ${index}\nTitle: ${result.title}\nContent: ${result.text}`
          ).join('\n\n')
        }),
      })

      if (gptResponse.ok) {
        const { analysis } = await gptResponse.json()
        setGptAnalysis(analysis)
      }
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
      
      <div className="space-y-4 mt-2">
        {/* Search Results */}
        <div className="space-y-1">
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

        {/* GPT Analysis */}
        {gptAnalysis && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">AI Analysis</h2>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {gptAnalysis}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 