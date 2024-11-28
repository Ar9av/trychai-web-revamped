import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all your market research reports
        </p>
      </div>
      <Button asChild>
        <Link href="/demo">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Report
        </Link>
      </Button>
    </div>
  )
}