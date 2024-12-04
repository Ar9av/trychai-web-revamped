"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getStoredResults, storeResults } from "@/lib/storage-service"
import { SearchResult } from "@/lib/api-service"

interface NewsItem {
  id: number
  hashtag: string
  date: string
  title: string
  content: string
  source?: string
  url?: string
  summary?: string
  publishedDate?: string
}

interface NewsListProps {
  news: NewsItem[]
  isLoading: boolean
}

export function NewsList({ news, isLoading }: NewsListProps) {
  const handleAddToSources = (item: NewsItem) => {
    if (!item.url) return

    const newSource: SearchResult = {
      title: item.title,
      url: item.url,
      content: item.summary || item.content,
      domain: getDomainFromUrl(item.url) || ""
    }

    const currentSources = getStoredResults()
    
    // Check if source already exists
    if (currentSources.some(source => source.url === newSource.url)) {
      toast({
        title: "Already added",
        description: "This source is already in your selected sources",
      })
      return
    }

    // Add new source
    const updatedSources = [...currentSources, newSource]
    storeResults(updatedSources)

    toast({
      title: "Source added",
      description: "The source has been added to your selected sources",
    })
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      return domain
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            {item.url && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddToSources(item)}
                title="Add to selected sources"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : null}
          </div>
          <p className="text-muted-foreground mb-4">{item.content}</p>
          {item.summary && (
            <p className="text-muted-foreground mb-4">
              <strong>Summary:</strong> {item.summary}
            </p>
          )}
          <div className="flex justify-between items-center text-sm">
            {item.url && (
              <div className="flex items-center gap-2">
                <img
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${getDomainFromUrl(item.url)}`}
                  alt=""
                  className="w-4 h-4"
                />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:underline"
                >
                  {getDomainFromUrl(item.url)}
                </a>
              </div>
            )}
            <span className="text-primary font-medium">{item.hashtag}</span>
          </div>
          <div>
            {item.publishedDate && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Published Date:</strong> {new Date(item.publishedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </Card>
      ))}
      {news.length === 0 && !isLoading && (
        <Card className="p-8 text-center text-muted-foreground">
          No news items found
        </Card>
      )}
    </div>
  )
}