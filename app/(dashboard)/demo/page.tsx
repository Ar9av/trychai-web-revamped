"use client"

import { useState } from "react"
import { ResearchInput } from "@/components/research-input"
import { ResearchOptions, type ResearchOptions as OptionsType } from "@/components/research-options"
import { SuggestedReports } from "@/components/suggested-reports"
import { useClerk } from "@clerk/nextjs"

export default function DemoPage() {
  const { session } = useClerk()
  const user_email = session?.user?.emailAddresses[0].emailAddress
  const [topic, setTopic] = useState("")
  const [options, setOptions] = useState<OptionsType>({
    outline: "",
    persona: "",
  })

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic)
  }

  const handleSuggestedTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic)
  }

  return (
    <main className="p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <ResearchInput 
          onTopicSubmit={handleTopicSubmit} 
          options={options} 
          email={user_email || ""} 
          topic={topic}
          onTopicChange={setTopic}
        />
        <ResearchOptions onOptionsChange={setOptions} />
        <SuggestedReports onSelect={handleSuggestedTopicSelect} />
      </div>
    </main>
  )
}