"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { SignedIn } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import { SignedOut } from "@clerk/nextjs"
import { Brain, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { SelectedSourcesDropdown } from "./navbar/selected-sources-dropdown"
import { motion } from "framer-motion"

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
              alt="TrychAI Logo" 
              width={32} 
              height={32} 
              className={isDarkTheme ? 'invert' : undefined}
              priority
            />
            <span className="font-bold">
            <span className="relative inline-block">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 transition-transform duration-300 origin-bottom-left"></span>
                  <span className="relative text-shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">TrychAI</span>
                </motion.span>
              </span>
              </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <SignedIn>
            <SelectedSourcesDropdown />
          </SignedIn>
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