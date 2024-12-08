"use client"

import { useEffect, useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { SavedArticlesTable } from "@/components/saved/saved-articles-table"
import { SavedPeopleGrid } from "@/components/saved/saved-people-grid"
import { useDebounce } from "@/hooks/use-debounce"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function SavedArticlesPage() {
  const { session } = useClerk()
  const userId = session?.user.id
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState([])
  const [people, setPeople] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (userId) {
      loadArticles()
      loadPeople()
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

  const loadPeople = async () => {
    if (!userId) return
    try {
      const response = await fetch(`/api/saved-people?userId=${userId}`)
      const data = await response.json()
      const filteredPeople = debouncedSearch
        ? data.filter((person: any) => 
            (person.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
             person.author?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
             person.summary?.toLowerCase().includes(debouncedSearch.toLowerCase())))
        : data
      setPeople(filteredPeople)
    } catch (error) {
      console.error("Error loading saved people:", error)
    }
  }

  const handleDeleteArticle = async (url: string) => {
    try {
      await fetch(`/api/saved-articles?userId=${userId}&url=${url}`, {
        method: "DELETE",
      })
      loadArticles()
      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  const handleDeletePerson = async (url: string) => {
    try {
      await fetch(`/api/saved-people?userId=${userId}&url=${url}`, {
        method: "DELETE",
      })
      loadPeople()
      toast({
        title: "Success",
        description: "Profile deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting profile:", error)
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your saved articles and profiles
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search saved items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="mb-4">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <SavedArticlesTable
            articles={articles}
            isLoading={isLoading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onDelete={handleDeleteArticle}
          />
        </TabsContent>

        <TabsContent value="people">
          <SavedPeopleGrid
            people={people}
            isLoading={isLoading}
            onDelete={handleDeletePerson}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}