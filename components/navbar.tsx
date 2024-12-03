"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { SignedIn } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import { SignedOut } from "@clerk/nextjs"
import { Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

export function Navbar() {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 items-center justify-between">
        <div className="hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/favicon.ico" 
              alt="Trychai Logo" 
              width={32} 
              height={32} 
              className={`${isDarkTheme ? 'filter invert' : undefined}`}
              onError={(e) => { e.currentTarget.src = '/favicon.ico'; }} // Fallback image
            />
            <span className="font-bold">Trychai</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          {/* <Button variant="ghost" asChild>
            <Link href="/features">Features</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button> */}
          <ModeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </nav>
    </header>
  )
}