import { ResearchSidebar } from "@/components/research-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen">
        <ResearchSidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <Toaster position="right" />
      </div>
    </ClerkProvider>
  )
}