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

  return (
    <main className="p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <ResearchInput onTopicSubmit={(topic) => handleTopicSubmit(topic)} options={options} email={user_email || ""} />
        <ResearchOptions onOptionsChange={setOptions} />
        <SuggestedReports onSelect={setTopic} />
        {topic && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Generating report for: {topic}</h2>
            {/* Research results will be displayed here */}
          </div>
        )}
      </div>
    </main>
  )
}