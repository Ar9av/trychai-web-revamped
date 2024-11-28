import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart2, Brain, Target } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                AI-Powered Market Research
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Unlock market insights with our advanced AI technology. Make data-driven decisions faster than ever before.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/demo">Try Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Brain className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Advanced AI algorithms analyze market trends and consumer behavior
              </p>
            </Card>
            <Card className="p-6">
              <BarChart2 className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Real-time Insights</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Get instant access to market data and competitive analysis
              </p>
            </Card>
            <Card className="p-6">
              <Target className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Custom Reports</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Generate detailed reports tailored to your specific needs
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}