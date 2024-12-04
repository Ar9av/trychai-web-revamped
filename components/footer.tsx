import Link from "next/link"
import { Coffee } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
          <div className="space-y-4 md:w-1/3">
            <div className="flex items-center space-x-2">
              <Coffee className="h-6 w-6" />
              <span className="text-xl font-bold">TrychAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered research platform generating comprehensive reports in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Contact</h4>
              <a href="mailto:support@trychai.io" className="text-sm text-muted-foreground hover:text-foreground block">
                support@trychai.io
              </a>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <Link href="/legal" className="hover:text-foreground">
                  Legal
                </Link>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Use
                </Link>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrychAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}