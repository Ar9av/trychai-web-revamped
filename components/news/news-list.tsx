"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import { Button } from "@/components/ui/button"
import { Plus, Bookmark, BookmarkCheck } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getStoredResults, storeResults } from "@/lib/storage-service"
import { SearchResult } from "@/lib/api-service"
import { useClerk } from "@clerk/nextjs"
import { useState, useEffect } from "react"

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
  const { session } = useClerk()
  const userId = session?.user.id
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadSavedArticles()
  }, [userId])

  const loadSavedArticles = async () => {
    if (!userId) return
    try {
      const response = await fetch(`/api/saved-articles?userId=${userId}`)
      const data = await response.json()
      setSavedArticles(new Set(data.articles.map((article: any) => article.url)))
    } catch (error) {
      console.error('Error loading saved articles:', error)
    }
  }

  const handleAddToSources = (item: NewsItem) => {
    if (!item.url) return

    const newSource: SearchResult = {
      title: item.title,
      url: item.url,
      content: item.summary || item.content,
      domain: getDomainFromUrl(item.url) || "",
      published_date: item.publishedDate || ""
    }

    const currentSources = getStoredResults()
    
    if (currentSources.some(source => source.url === newSource.url)) {
      toast({
        title: "Already added",
        description: "This source is already in your selected sources",
      })
      return
    }

    const updatedSources = [...currentSources, newSource]
    storeResults(updatedSources)

    toast({
      title: "Source added",
      description: "The source has been added to your selected sources",
    })
  }

  const handleSaveArticle = async (item: NewsItem) => {
    if (!userId || !item.url) return

    try {
      const response = await fetch('/api/saved-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: item.title,
          url: item.url,
          content: item.summary || item.content,
          domain: getDomainFromUrl(item.url),
          sourceType: 'news'
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      setSavedArticles(prev => new Set([...Array.from(prev), item.url!]))
      toast({
        title: "Success",
        description: "Article saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive",
      })
    }
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSaveArticle(item)}
                disabled={!item.url || savedArticles.has(item.url)}
                title={savedArticles.has(item.url!) ? "Already saved" : "Save article"}
              >
                {savedArticles.has(item.url!) ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
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