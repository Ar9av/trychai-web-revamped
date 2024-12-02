"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info, Loader2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateResearch } from "@/lib/api-service"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ResearchInputProps {
  onTopicSubmit: (topic: string) => void
  options?: {
    outline: string
    persona: string
  }
  email: string
  userId: string
  topic: string
  onTopicChange: (topic: string) => void
}

export function ResearchInput({ 
  onTopicSubmit, 
  options, 
  email,
  userId,
  topic,
  onTopicChange
}: ResearchInputProps) {
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
        email,
        userId
      )

      if (result?.error === 'Insufficient credits') {
        toast({
          title: "Insufficient Credits",
          description: `You need ${result.requiredCredits} credits to generate a report. Current balance: ${result.currentCredits} credits`,
          variant: "destructive",
        })
        return
      }

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
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 flex-1">
          <Input
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Enter a topic or market to research..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Generating a new report costs 50 credits</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}