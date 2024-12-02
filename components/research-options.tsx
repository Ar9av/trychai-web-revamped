"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon, Wand2, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ResearchOptionsProps {
  onOptionsChange: (options: ResearchOptions) => void
}

export interface ResearchOptions {
  outline: string
  persona: string
  publishedDate?: Date
}

export function ResearchOptions({ onOptionsChange }: ResearchOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ResearchOptions>({
    outline: "",
    persona: "",
  })

  const handleOptionChange = (key: keyof ResearchOptions, value: string | Date | undefined) => {
    const newOptions = {
      ...options,
      [key]: value,
    }
    setOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const generateOutline = () => {
    const sampleOutline = `1. Market Overview
2. Industry Analysis
3. Competitive Landscape
4. Market Segmentation
5. Growth Drivers
6. Challenges and Opportunities
7. Future Outlook`
    handleOptionChange("outline", sampleOutline)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-8 space-y-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Advanced Options</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`} />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="outline">Report Outline</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define the structure of your research report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateOutline}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Outline
            </Button>
          </div>
          <Textarea
            id="outline"
            value={options.outline}
            onChange={(e) => handleOptionChange("outline", e.target.value)}
            placeholder="Enter your report outline or click Generate"
            className="min-h-[200px]"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="persona">Buyer Persona</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Define target audience characteristics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="persona"
            value={options.persona}
            onChange={(e) => handleOptionChange("persona", e.target.value)}
            placeholder="Describe your target audience persona..."
            className="min-h-[150px]"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Label>Published Date</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter content by published date</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !options.publishedDate && "text-muted-foreground"
                )}
              >
                {options.publishedDate ? (
                  format(options.publishedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={options.publishedDate}
                onSelect={(date) => handleOptionChange("publishedDate", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("2000-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}