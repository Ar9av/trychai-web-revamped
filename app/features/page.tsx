import { Card } from "@/components/ui/card"
import { 
  Brain, 
  BarChart2, 
  Target, 
  Globe, 
  TrendingUp, 
  PieChart,
  Users,
  MessageSquare,
  FileText
} from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced machine learning algorithms analyze market trends and consumer behavior patterns."
    },
    {
      icon: BarChart2,
      title: "Real-time Insights",
      description: "Access live market data and competitive analysis updated in real-time."
    },
    {
      icon: Target,
      title: "Custom Reports",
      description: "Generate comprehensive reports tailored to your specific business needs."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access market data from multiple regions and countries worldwide."
    },
    {
      icon: TrendingUp,
      title: "Trend Prediction",
      description: "Predict future market trends using advanced forecasting models."
    },
    {
      icon: PieChart,
      title: "Data Visualization",
      description: "Interactive charts and graphs for better data understanding."
    },
    {
      icon: Users,
      title: "Competitor Analysis",
      description: "Track and analyze your competitors' market performance."
    },
    {
      icon: MessageSquare,
      title: "Sentiment Analysis",
      description: "Monitor brand sentiment and consumer feedback across platforms."
    },
    {
      icon: FileText,
      title: "Export Options",
      description: "Export reports in multiple formats including PDF, Excel, and CSV."
    }
  ]

  return (
    <div className="container py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Features</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Discover how Trychai can transform your market research with powerful AI-driven features
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <Icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}