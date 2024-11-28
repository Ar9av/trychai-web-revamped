"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ReportSearchProps {
  onSearch: (searchTerm: string) => void
}

export function ReportSearch({ onSearch }: ReportSearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search reports..."
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}