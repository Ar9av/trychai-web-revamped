"use client"

import { useEffect, useState } from "react"
import { ReportList } from "@/components/dashboard/report-list"
import { DashboardHeader } from "@/components/dashboard/header"
import { ReportSearch } from "@/components/dashboard/report-search"
import { useClerk } from "@clerk/nextjs"

export default function DashboardPage() {
  const { session } = useClerk();
  const userEmail = session?.user.emailAddresses[0].emailAddress;
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
      const data = await response.json()
      setReports(data)
      setFilteredReports(data)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchTerm: string) => {
    const filtered = reports.filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredReports(filtered)
  }

  return (
    <div className="container py-8">
      <DashboardHeader />
      <ReportSearch onSearch={handleSearch} />
      <ReportList reports={filteredReports} isLoading={isLoading} />
    </div>
  )
}