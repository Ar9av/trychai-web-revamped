"use client"

import { useEffect, useState } from "react"
import { NewsList } from "@/components/news/news-list"
import { NewsHeader } from "@/components/news/news-header"
import { TagFilters } from "@/components/news/tag-filters"
import { useClerk } from "@clerk/nextjs"
import { fetchNews, fetchUserTags } from "@/lib/api-service"
import { Card } from "@/components/ui/card"

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { session } = useClerk()
  const userId = session?.user.id

  useEffect(() => {
    if (userId) {
      loadTags()
    }
  }, [userId])

  useEffect(() => {
    if (selectedTags.length > 0) {
      loadNews()
    } else {
      setNews([])
    }
  }, [selectedTags])

  const loadTags = async () => {
    if (!userId) return
    const userTags = await fetchUserTags(userId)
    if (Array.isArray(userTags)) {
      const tagList = userTags.map(t => t.tag)
      setTags(tagList)
      // Auto-select all tags if they exist
      if (tagList.length > 0) {
        setSelectedTags(tagList)
      }
    }
    setIsLoading(false)
  }

  const loadNews = async () => {
    setIsLoading(true)
    try {
      const allNews = await Promise.all(
        selectedTags.map(tag => 
          fetchNews(tag, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        )
      )
      
      const mergedNews = allNews.flat().sort((a, b) => 
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      )
      
      setNews(mergedNews)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => [...prev, tag])
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  const handleTagAdd = (tag: string) => {
    setTags(prev => [...prev, tag])
    // Auto-select newly added tag
    setSelectedTags(prev => [...prev, tag])
  }

  if (!isLoading && tags.length === 0) {
    return (
      <div className="container py-8">
        <NewsHeader />
        <Card className="p-6 text-center">
          <p className="text-lg text-muted-foreground mb-4">Please add a tag to begin with</p>
          <TagFilters
            tags={tags}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
            onTagAdd={handleTagAdd}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <NewsHeader />
      <TagFilters
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        onTagAdd={handleTagAdd}
      />
      <NewsList news={news} isLoading={isLoading} />
    </div>
  )
}