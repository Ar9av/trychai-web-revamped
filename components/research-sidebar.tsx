"use client"

import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  PlusCircle, 
  Newspaper, 
  CreditCard,
  ChevronLeft,
  Coins,
  Menu
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { fetchUserCredits } from "@/lib/api-service"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function ResearchSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const [credits, setCredits] = useState(0)
  const { session } = useClerk()
  const userId = session?.user.id
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchCredits = async () => {
    try {
      if (userId) {
        const data = await fetchUserCredits(userId)
        if (data) {
          setCredits(data.totalCredits)
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCredits()
    }
  }, [userId])

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: PlusCircle, label: "New Report", href: "/demo" },
    { icon: Newspaper, label: "News Feed", href: "/news" },
    { icon: CreditCard, label: "Credits", href: "/credits" },
  ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className={cn(
          "font-bold transition-all duration-300",
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          TrychAI
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-all",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      <nav className="space-y-2 p-2 flex-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={index}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed ? "px-2" : "px-4"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5 mr-2" />
                <span className={cn(
                  "transition-all duration-300",
                  collapsed ? "opacity-0 w-0" : "opacity-100"
                )}>
                  {item.label}
                </span>
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Coins className="h-4 w-4" />
            <span className={cn("text-sm", collapsed && "opacity-0 w-0")}>
              {credits} credits remaining
            </span>
          </div>
          <Link 
            href="/credits"
            className={cn(
              "p-1 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors",
              collapsed && "opacity-0 w-0"
            )}
          >
            <PlusCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="w-0 md:w-64 flex-shrink-0" />
      </>
    )
  }

  return (
    <>
      <div className={cn(
        "fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-card border-r transition-all duration-300 hidden md:block",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </div>
      <div className={cn(
        "hidden md:block flex-shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )} />
    </>
  )
}