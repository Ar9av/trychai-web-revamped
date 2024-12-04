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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResearchOptionsProps {
  onOptionsChange: (options: ResearchOptions) => void
  category: string
  setCategory: (category: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export interface ResearchOptions {
  outline: string
  persona: string
  publishedDate?: Date
  category?: string
}

const categoryOptions = {
  "none": "All",
  // "tweet": "Twitter",
  "news": "News", 
  "pdf": "PDF",
  "research paper": "Research blog/papers"
};

export function ResearchOptions({ 
  onOptionsChange, 
  category, 
  setCategory,
  isOpen,
  setIsOpen 
}: ResearchOptionsProps) {
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
      <div className="flex flex-col gap-2 py-4">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          <div className="flex items-center space-x-2 mb-2">
            <Label>Published After</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter content published after this date</p>
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
            <Label htmlFor="persona">Persona</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Define your persona</p>
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

      </CollapsibleContent>
    </Collapsible>
  )
}