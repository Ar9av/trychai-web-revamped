import { ResearchSidebar } from "@/components/research-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <ResearchSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <Toaster position="right" />
    </div>
  )
}