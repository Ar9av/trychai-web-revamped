"use client"

import { useState } from "react"
import { ResearchInput } from "@/components/research-input"
import { ResearchOptions, type ResearchOptions as OptionsType } from "@/components/research-options"
import { SuggestedReports } from "@/components/suggested-reports"

export default function DemoPage() {
  const [topic, setTopic] = useState("")
  const [options, setOptions] = useState<OptionsType>({
    outline: "",
    persona: "",
  })

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic)
    // Here you would typically trigger the research process
    console.log("Research topic:", newTopic)
    console.log("Research options:", options)
  }

  return (
    <main className="p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <ResearchInput onTopicSubmit={handleTopicSubmit} />
        <ResearchOptions onOptionsChange={setOptions} />
        <SuggestedReports onSelect={setTopic} />
        {topic && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Research Results for: {topic}</h2>
            {/* Research results will be displayed here */}
          </div>
        )}
      </div>
    </main>
  )
}