"use client"

import { useEffect, useState } from "react"
import { NewsList } from "@/components/news/news-list"
import { NewsHeader } from "@/components/news/news-header"
import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
export default function NewsPage() {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [page])

  const fetchNews = async () => {
    const { session } = useClerk();
    const userEmail = session?.user.emailAddresses[0].emailAddress;

    try {
      const response = await fetch(`/api/news?page=${page}`, { method: 'GET' })
      const data = await response.json()
      
      if (data.length < 10) {
        setHasMore(false)
      }
      
      if (page === 1) {
        setNews(data)
      } else {
        setNews(prev => [...prev, ...data])
      }
    } catch (error) {
      console.error("Failed to fetch news:", error)
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