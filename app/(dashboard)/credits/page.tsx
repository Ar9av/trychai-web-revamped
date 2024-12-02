"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CreditCard, Gift } from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { fetchUserCredits } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { CreditHistory } from "@/components/credits/credit-history"

// Define a type for credits
type CreditsType = { totalCredits: number; history: any[] };

export default function CreditsPage() {
  const { session } = useClerk();
  const userId = session?.user.id;
  const [couponCode, setCouponCode] = useState("")
  const [credits, setCredits] = useState<CreditsType>({ totalCredits: 0, history: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    if (userId) {
      loadCredits()
    }
  }, [userId])

  const loadCredits = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUserCredits(userId || "")
      if (data) {
        setCredits(data as CreditsType)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim() || !userId) return
    setIsApplying(true)

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          couponCode: couponCode.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply coupon')
      }

      toast({
        title: "Success",
        description: "Coupon applied successfully",
      })
      setCouponCode("")
      loadCredits()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to apply coupon",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  const creditPackages = [
    {
      credits: 100,
      price: "$49",
      description: "Perfect for small research projects",
      popular: false
    },
    {
      credits: 500,
      price: "$199",
      description: "Most popular for medium-sized projects",
      popular: true
    },
    {
      credits: 1000,
      price: "$349",
      description: "Best value for large research needs",
      popular: false
    }
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Credits</h1>
        <p className="text-muted-foreground mt-1">
          Purchase credits to conduct market research
        </p>
        {!isLoading && (
          <p className="text-lg font-medium mt-2">
            Current Balance: {credits.totalCredits} credits
          </p>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        {creditPackages.map((pkg, index) => (
          <Card key={index} className={`p-6 ${pkg.popular ? 'border-primary' : ''}`}>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{pkg.credits}</div>
              <div className="text-2xl font-semibold mb-2">{pkg.price}</div>
              <p className="text-muted-foreground">{pkg.description}</p>
              {pkg.popular && (
                <div className="text-primary text-sm font-medium mt-2">
                  Most Popular
                </div>
              )}
            </div>
            <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
              <CreditCard className="mr-2 h-4 w-4" />
              Purchase Credits
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Have a Coupon Code?</h2>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="couponCode">Enter your coupon code</Label>
            <Input
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              disabled={isApplying}
            />
          </div>
          <Button 
            className="self-end" 
            variant="outline"
            onClick={applyCoupon}
            disabled={isApplying}
          >
            <Gift className="mr-2 h-4 w-4" />
            Apply Coupon
          </Button>
        </div>
      </Card>

      <CreditHistory history={credits.history} isLoading={isLoading} />
    </div>
  )
}