import { SearchResult } from "./exa-service"

const STORAGE_KEY = "selectedResearchResults"

export function getStoredResults(): SearchResult[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function storeResults(results: SearchResult[]) {
  if (typeof window === "undefined") return
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
}

export function clearStoredResults() {
  if (typeof window === "undefined") return
  
  localStorage.removeItem(STORAGE_KEY)
}