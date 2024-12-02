"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateResearch } from "@/lib/api-service"

interface ResearchInputProps {
  onTopicSubmit: (topic: string) => void
  options?: {
    outline: string
    persona: string
  }
  email: string
}

export function ResearchInput({ onTopicSubmit, options, email }: ResearchInputProps) {
  
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsLoading(true)
    onTopicSubmit(topic.trim())

    try {
      const result = await generateResearch(
        topic.trim(),
        options?.outline,
        options?.persona,
        email
      )

      if (!result?.reportId) {
        throw new Error('No report ID returned');
      }

      router.push(`/research/${result.reportId}`)
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate research report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        What would you like to research?
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic or market to research..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Research
            </>
          )}
        </Button>
      </form>
    </div>
  )
}