"use client"

import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  PlusCircle, 
  Newspaper, 
  CreditCard,
  ChevronLeft,
  Coins
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@clerk/nextjs"

export function ResearchSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const session = useSession()
  const [credits, setCredits] = useState(0)

  const fetchCredits = async () => {
    try {
        const response = await fetch(`/api/credits?userId=${session.user.id}`)
        const data = await response.json()
        if (response.ok) {
            setCredits(data.totalCredits)
        }
    } catch (error) {
        console.error('Error fetching credits:', error)
    }
}

  // Fetch credits when the component mounts
  useEffect(() => {
    if (session.user) {
      fetchCredits()
    }
  }, [session.user]) // Dependency array to re-fetch if session.user changes

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: PlusCircle, label: "New Report", href: "/demo" },
    { icon: Newspaper, label: "News Feed", href: "/news" },
    { icon: CreditCard, label: "Credits", href: "/credits" },
  ]

  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
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
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-all",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      <nav className="space-y-2 p-2">
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

      <nav className="space-y-2 space-x-2 p-4 absolute bottom-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Coins className="h-4 w-4" />
            <span className={cn("text-sm", collapsed && "opacity-0 w-0")}>
              {credits} credits remaining
            </span>
          </div>
          <Link 
            href="/credits"
            className="p-1 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
          >
            <PlusCircle className={cn("h-4 w-4", collapsed && "opacity-0 w-0")} />
          </Link>
        </div>
      </nav>
    </div>
  )
}