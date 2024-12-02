"use client"

import Exa from "exa-js"

const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY)

export interface SearchResult {
  title: string
  url: string
  content: string
  domain: string
}

export async function searchTopic(topic: string, startDate?: string): Promise<SearchResult[]> {
  try {
    const result = await exa.searchAndContents(
      topic,
      {
        type: "neural",
        useAutoprompt: true,
        numResults: 20,
        summary: true,
        ...(startDate && { startPublishedDate: startDate })
      }
    )

    return result.results.map(item => ({
      title: item.title || "",
      url: item.url || "",
      content: item.summary || "",
      domain: new URL(item.url).hostname.replace('www.', '')
    }))
  } catch (error) {
    console.error('Error searching topic:', error)
    return []
  }
}