import { Card } from "@/components/ui/card"
import { Brain, Users, Target, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">About Trychai</h1>
        <p className="text-gray-500 dark:text-gray-400">
          We&apos;re revolutionizing market research with artificial intelligence, making it faster and more accurate than ever before.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-500 dark:text-gray-400">
            To democratize access to high-quality market research by leveraging the power of artificial intelligence, making it accessible to businesses of all sizes.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-500 dark:text-gray-400">
            To become the global leader in AI-powered market research, helping businesses make better decisions through data-driven insights.
          </p>
        </Card>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Why Choose Trychai?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <Brain className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Advanced algorithms provide deeper insights
              </p>
            </Card>
            <Card className="p-6">
              <Users className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Expert Team</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Experienced professionals at your service
              </p>
            </Card>
            <Card className="p-6">
              <Target className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Accurate Results</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Precise and reliable market insights
              </p>
            </Card>
            <Card className="p-6">
              <Globe className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Global Reach</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Market data from around the world
              </p>
            </Card>
          </div>
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Story</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Founded in 2023, Trychai emerged from a simple idea: make market research more accessible and accurate through AI. 
            Today, we&apos;re proud to serve thousands of businesses worldwide, helping them make better decisions with data-driven insights.
          </p>
        </section>
      </div>
    </div>
  )
}