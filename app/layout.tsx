import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/toaster'
import { ClerkProvider } from '@clerk/nextjs'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "TrychAI",
  description: "Generate Market Report on the fly",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: "market research, ai, trychai, trychai.ai, ai market research, agentic research, agentic ai, ai agent, ai research, ai market report, ai market analysis, ai market intelligence, ai market insights, ai market research tool, ai market research platform, ai market research software, ai market research service, ai market research company, ai market research startup, ai market research tool, ai market research platform, ai market research software, ai market research service, ai market research company, ai market research startup, ai market research tool, ai market research platform, ai market research software, ai market research service, ai market research company, ai market research startup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta property="og:image" content="/favicon.ico" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
          <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        </head>
        <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </ClerkProvider>
        </body>
      </html>
  )
}