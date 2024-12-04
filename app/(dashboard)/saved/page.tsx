"use client"

import { useEffect, useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { SavedArticlesTable } from "@/components/saved/saved-articles-table"
import { useDebounce } from "@/hooks/use-debounce"

export default function SavedArticlesPage() {
  const { session } = useClerk()
  const userId = session?.user.id
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (userId) {
      loadArticles()
    }
  }, [userId, page, debouncedSearch])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/saved-articles?userId=${userId}&page=${page}&search=${debouncedSearch}`
      )
      const data = await response.json()
      setArticles(data.articles)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error loading saved articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (url: string) => {
    try {
      await fetch(`/api/saved-articles?userId=${userId}&url=${url}`, {
        method: "DELETE",
      })
      loadArticles()
    } catch (error) {
      console.error("Error deleting article:", error)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Saved Articles</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your saved articles
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <SavedArticlesTable
        articles={articles}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={handleDelete}
      />
    </div>
  )
}