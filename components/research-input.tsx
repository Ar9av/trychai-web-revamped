"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info, Loader2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateResearch, searchTopic, type SearchResult, fetchUserCredits } from "@/lib/api-service"
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

const SEARCH_COST = 10;

interface ResearchInputProps {
  onTopicSubmit: (topic: string) => void
  options?: {
    outline: string
    persona: string
    publishedDate?: Date
    category?: string
  }
  email: string
  userId: string
  topic: string
  onTopicChange: (topic: string) => void
  onHideOptions?: () => void
}

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
  const [title, setTitle] = useState(topic)
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(true)
  const [credits, setCredits] = useState(0)
  const [options, setOptions] = useState<OptionsType>({
    outline: "",
    persona: "",
  })
  const router = useRouter()
  const { toast } = useToast()
  const [optionsOpen, setOptionsOpen] = useState(false)

  useEffect(() => {
    if (userId) {
      loadCredits()
    }
  }, [userId])

  const loadCredits = async () => {
    try {
      const data = await fetchUserCredits(userId)
      if (data) {
        setCredits(data.totalCredits)
      }
    } catch (error) {
      console.error('Error loading credits:', error)
    }
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (credits < SEARCH_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${SEARCH_COST} credits to perform a search. Current balance: ${credits} credits`,
        variant: "destructive",
      })
      return
    }

    let searchTopic = topic.trim()
    if (!searchTopic && selectedResults.length > 0) {
      searchTopic = selectedResults[0].title
      onTopicChange(searchTopic)
    }

    if (!searchTopic) return

    if (!title) {
      handleTitleChange(searchTopic);
    }

    setOptionsOpen(false)
    setIsLoading(true)
    onTopicSubmit(searchTopic)
    setHasStartedResearch(true)

    if (isAssisted) {
      setIsSearching(true)
      try {
        const results = await searchTopic(
          searchTopic, 
          options?.publishedDate?.toISOString(),
          options?.category
        )
        setSearchResults(results)
        await loadCredits() // Refresh credits after search
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
        searchTopic,
        options?.outline,
        options?.persona,
        email,
        userId
      ) as GenerateResearchResult;

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
    if (!topic && selectedResults.length > 0) {
      onTopicChange(selectedResults[0].title)
    }
    
    setIsLoading(true)
    try {
      const payload = {
        topic: topic || selectedResults[0].title,
        instruction,
        sources: selectedResults,
        persona: options?.persona
      }

      const result = await generateResearch(
        topic || selectedResults[0].title,
        JSON.stringify(payload),
        options?.persona,
        email,
        userId
      ) as GenerateResearchResult;

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
          {hasStartedResearch ? (
            <Input
              value={title || topic}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-3xl font-bold text-center mb-8 underline"
            />
          ) : (
            <h1 className="text-3xl font-bold text-center mb-8">
              What would you like to research?
            </h1>
          )}
          
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        type="submit" 
                        disabled={isLoading || credits < SEARCH_COST}
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
                            Research ({SEARCH_COST} credits)
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current balance: {credits} credits</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>

            {!hasStartedResearch && (
              <AssistedToggle
                enabled={isAssisted}
                onToggle={setIsAssisted}
              />
            )}
          </div>
        </div>

        <ResearchOptions 
          onOptionsChange={setOptions} 
          category={options?.category || ""}
          setCategory={(category) => setOptions({ ...options, category })}
          isOpen={optionsOpen}
          setIsOpen={setOptionsOpen}
        />

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