import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small businesses",
      features: [
        "Basic AI market analysis",
        "5 reports per month",
        "Email support",
        "Basic data visualization",
        "1 user"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      description: "Ideal for growing companies",
      features: [
        "Advanced AI analysis",
        "20 reports per month",
        "Priority support",
        "Advanced visualizations",
        "5 users",
        "Custom report builder",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Full AI capabilities",
        "Unlimited reports",
        "24/7 dedicated support",
        "Custom integrations",
        "Unlimited users",
        "White labeling",
        "Advanced API access",
        "Custom features"
      ]
    }
  ]

  return (
    <div className="container py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Pricing Plans</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-4xl font-bold mb-2">{plan.price}</div>
              <p className="text-gray-500 dark:text-gray-400">{plan.description}</p>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">
              {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}