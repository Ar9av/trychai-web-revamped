"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { useClerk } from "@clerk/nextjs"
import { fetchPrivateReports, fetchPublicReports } from "@/lib/api-service"
import { ReportTabs } from "@/components/dashboard/report-tabs"

interface Report {
  id: number
  title: string
  md5_hash: string
  created_at: string
}

export default function DashboardPage() {
  const { session } = useClerk();
  const userEmail = session?.user.emailAddresses[0].emailAddress;
  const [privateReports, setPrivateReports] = useState<Report[]>([])
  const [publicReports, setPublicReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userEmail) {
      loadReports()
    }
  }, [userEmail])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const [privateData, publicData] = await Promise.all([
        fetchPrivateReports(userEmail) as Promise<Report[]>,
        fetchPublicReports(userEmail) as Promise<Report[]>
      ])
      setPrivateReports(privateData)
      setPublicReports(publicData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <DashboardHeader />
      <ReportTabs 
        privateReports={privateReports}
        publicReports={publicReports}
        isLoading={isLoading}
      />
    </div>
  )
}