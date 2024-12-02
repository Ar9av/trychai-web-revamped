import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { SearchResult } from "@/lib/api-service"
import { Loader2, Wand2, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
interface InstructionInputProps {
  selectedResults: SearchResult[]
  topic: string
  onSubmit: (instruction: string) => void
  isLoading: boolean
}

export function InstructionInput({ 
  selectedResults, 
  topic, 
  onSubmit,
  isLoading 
}: InstructionInputProps) {
  const [instruction, setInstruction] = useState("")

  const handleSubmit = () => {
    if (!instruction.trim()) return
    onSubmit(instruction.trim())
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        Research Instructions
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="ml-2 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Provide instructions for generating the research report based on selected sources, including focus areas and insights.</p>
          </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      {/* <p className="text-sm text-muted-foreground mb-4">
        Provide specific instructions for generating the research report based on the selected sources.
        Consider aspects like focus areas, analysis depth, and specific insights you&apos;re looking for.
      </p> */}
      <Textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder={`Example: Generate a comprehensive market research report about ${topic} focusing on market size, key players, growth trends, and future outlook. Analyze the competitive landscape and highlight emerging opportunities.`}
        className="min-h-[200px] mb-4"
        disabled={isLoading}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!instruction.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}