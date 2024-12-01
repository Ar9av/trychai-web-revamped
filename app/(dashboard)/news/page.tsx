"use client"

import { useEffect, useState } from "react"
import { NewsList } from "@/components/news/news-list"
import { NewsHeader } from "@/components/news/news-header"
import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import { fetchNews } from "@/lib/api-service"

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { session } = useClerk()

  useEffect(() => {
    loadNews()
  }, [page])

  const loadNews = async () => {
    setIsLoading(true)
    try {
      console.log("fetching news")
      const data = await fetchNews('market_research', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      
      if (Array.isArray(data) && data.length < 10) {
        setHasMore(false)
      }
      
      if (page === 1) {
        setNews(data)
      } else {
        setNews(prev => [...prev, ...data])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <NewsHeader />
      <NewsList news={news} isLoading={isLoading} />
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => setPage(prev => prev + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}