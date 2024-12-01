"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportList } from "./report-list"
import { ReportSearch } from "./report-search"
import { useState } from "react"

interface Report {
  id: number
  title: string
  md5_hash: string
  created_at: string
}

interface ReportTabsProps {
  privateReports: Report[]
  publicReports: Report[]
  isLoading: boolean
}

export function ReportTabs({ privateReports, publicReports, isLoading }: ReportTabsProps) {
  const [filteredPrivate, setFilteredPrivate] = useState(privateReports)
  const [filteredPublic, setFilteredPublic] = useState(publicReports)

  const handlePrivateSearch = (searchTerm: string) => {
    const filtered = privateReports.filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPrivate(filtered)
  }

  const handlePublicSearch = (searchTerm: string) => {
    const filtered = publicReports.filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPublic(filtered)
  }

  return (
    <Tabs defaultValue="private" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="private">Private Reports</TabsTrigger>
        <TabsTrigger value="public">Public Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="private">
        <ReportSearch onSearch={handlePrivateSearch} />
        <ReportList reports={filteredPrivate} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="public">
        <ReportSearch onSearch={handlePublicSearch} />
        <ReportList reports={filteredPublic} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  )
}