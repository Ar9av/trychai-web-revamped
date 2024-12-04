"use client"

import { useState } from "react"
import { ResearchInput } from "@/components/research-input"
import { type ResearchOptions as OptionsType } from "@/components/research-options"
import { SuggestedReports } from "@/components/suggested-reports"
import { useClerk } from "@clerk/nextjs"

export default function DemoPage() {
  const { session } = useClerk()
  const user_email = session?.user?.emailAddresses[0].emailAddress
  const userId = session?.user?.id
  const [topic, setTopic] = useState("")

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
          email={user_email || ""} 
          userId={userId || ""}
          topic={topic}
          onTopicChange={setTopic}
        />
        {/* <SuggestedReports onSelect={handleSuggestedTopicSelect} /> */}
      </div>
    </main>
  )
}