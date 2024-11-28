"use client"

import { Button } from "@/components/ui/button"

interface SuggestedReportsProps {
  onSelect: (topic: string) => void
}

export function SuggestedReports({ onSelect }: SuggestedReportsProps) {
  const suggestions = [
    "2024 Smart Home IOT devices market in US",
    "Germany's Beer Industry",
    "Augmented Reality Market Trends",
    "Electric Vehicle Battery Technology",
    "Cloud Gaming Services",
    "Sustainable Fashion Industry"
  ]

  return (
    <div className="mt-8">
      <h3 className="text-sm font-medium mb-4">Suggested Topics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {suggestions.map((topic, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 px-4 text-left justify-start truncate"
            onClick={() => onSelect(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  )
}