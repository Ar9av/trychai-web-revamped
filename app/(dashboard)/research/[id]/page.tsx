"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useClerk } from "@clerk/nextjs"
interface Report {
  id: number
  title: string
  output: string
  created_at: string
}

export default function ResearchReportPage() {
  const { session } = useClerk();
  const userEmail = session?.user.emailAddresses[0].emailAddress;
  const params = useParams()
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${params.id}`)
        const data = await response.json()
        setReport(data)
      } catch (error) {
        console.error("Failed to fetch report:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchReport()
    }
  }, [params.id])

  const handleResearchClick = async () => {
    try {
      // Existing research API call...
      
      // Add this after starting the research
      toast({
        title: "Research Started",
        description: "Your report is being processed...",
        duration: null, // Makes the toast persist
        variant: "processing",
      })
      
      // After research completes
      toast({
        title: "Research Complete",
        description: "Your report is ready",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process research",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Card className="p-6">
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-3/4" />
        </Card>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
        <p className="text-muted-foreground">
          The requested research report could not be found.
        </p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
      <p className="text-muted-foreground mb-8">
        Generated on {new Date(report.created_at).toLocaleDateString()}
      </p>
      <Card className="p-6 prose dark:prose-invert max-w-none">
        <ReactMarkdown>{report.output}</ReactMarkdown>
      </Card>
    </div>
  )
}