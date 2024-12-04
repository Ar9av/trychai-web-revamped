"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info, Loader2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateResearch, searchTopic, type SearchResult } from "@/lib/api-service"
import { AssistedToggle } from "./research/assisted-toggle"
import { SearchResults } from "./research/search-results"
import { InstructionInput } from "./research/instruction-input"
import { type ResearchOptions as OptionsType } from "@/components/research-options"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { ResearchOptions } from "./research-options"

interface ResearchInputProps {
  onTopicSubmit: (topic: string) => void
  options?: {
    outline: string
    persona: string
    publishedDate?: Date
  }
  email: string
  userId: string
  topic: string
  onTopicChange: (topic: string) => void
  onHideOptions?: () => void
}

// Define a type for the expected result
interface GenerateResearchResult {
  reportId?: string;
  error?: string;
  requiredCredits?: number;
  currentCredits?: number;
}


export function ResearchInput({ 
  onTopicSubmit, 
  email,
  userId,
  topic,
  onTopicChange
}: ResearchInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAssisted, setIsAssisted] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [hasStartedResearch, setHasStartedResearch] = useState(false)
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(true)
  const [options, setOptions] = useState<OptionsType>({
    outline: "",
    persona: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsLoading(true)
    onTopicSubmit(topic.trim())
    setHasStartedResearch(true)

    if (isAssisted) {
      setIsSearching(true)
      try {
        const results = await searchTopic(
          topic.trim(), 
          options?.publishedDate?.toISOString()
        )
        setSearchResults(results)
      } catch (error) {
        console.error("Error searching topic:", error)
        toast({
          title: "Error",
          description: "Failed to search for related content",
          variant: "destructive",
        })
      } finally {
        setIsSearching(false)
      }
      setIsLoading(false)
      return
    }

    try {
      const result = await generateResearch(
        topic.trim(),
        options?.outline,
        options?.persona,
        email,
        userId
      ) as GenerateResearchResult; // Ensure the result is typed correctly

      if (result?.error === 'Insufficient credits') {
        toast({
          title: "Insufficient Credits",
          description: `You need ${result.requiredCredits} credits to generate a report. Current balance: ${result.currentCredits} credits`,
          variant: "destructive",
        })
        return
      }

      if (!result.reportId) {
        throw new Error('No report ID returned')
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

  const handleProcessSelected = async (selected: SearchResult[]) => {
    setSelectedResults(selected)
    setShowSearchResults(false)
  }

  const handleInstructionSubmit = async (instruction: string) => {
    setIsLoading(true)
    try {
      const payload = {
        topic,
        instruction,
        sources: selectedResults,
        persona: options?.persona
      }

      const result = await generateResearch(
        topic.trim(),
        JSON.stringify(payload),
        options?.persona,
        email,
        userId
      ) as GenerateResearchResult; // Ensure the result is typed correctly

      if (!result.reportId) {
        throw new Error('No report ID returned')
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
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-center mb-8">
            {hasStartedResearch ? `Research: ${topic}` : "What would you like to research?"}
          </h1>
          
          {hasStartedResearch && isAssisted && (
            <p className="text-center text-sm text-muted-foreground mb-4">
              Search for more sources
            </p>
          )}

          <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                placeholder="Enter a topic or market to research..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
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

            {!hasStartedResearch && (
              <AssistedToggle
                enabled={isAssisted}
                onToggle={setIsAssisted}
              />
            )}
          </div>
        </div>

        <ResearchOptions onOptionsChange={setOptions} />

        <div className="flex flex-col space-y-2">
          <Label>Selected Sources</Label>
          {selectedResults.length > 0 && (
            <div className="mt-8">
              <InstructionInput
                selectedResults={selectedResults}
                topic={topic}
                onSubmit={handleInstructionSubmit}
                isLoading={isLoading}
              />
            </div>
          )}
          <SearchResults
            results={searchResults}
            isLoading={isSearching}
            onProcessSelected={handleProcessSelected}
            topic={topic}
            showSearchResults={showSearchResults}
          />
        </div>
      </div>
    </div>
  )
}