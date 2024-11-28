"use client"

import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  PlusCircle, 
  Newspaper, 
  CreditCard,
  ChevronLeft
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ResearchSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

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

      <div className="absolute bottom-4 left-0 right-0 p-4">
        <div className={cn(
          "text-sm text-muted-foreground transition-all duration-300",
          collapsed ? "opacity-0" : "opacity-100"
        )}>
          138 credits remaining
        </div>
      </div>
    </div>
  )
}