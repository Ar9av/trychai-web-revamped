"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { SignedIn } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import { SignedOut } from "@clerk/nextjs"
import { Brain } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 items-center justify-between">
        <div className="hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
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