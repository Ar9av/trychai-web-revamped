"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Brain,
  BarChart2,
  Target,
  Globe,
  TrendingUp,
  PieChart,
  Users,
  MessageSquare,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Advanced machine learning algorithms analyze market trends and consumer behavior patterns.",
  },
  {
    icon: BarChart2,
    title: "Real-time Insights",
    description: "Access live market data and competitive analysis updated in real-time.",
  },
  {
    icon: Target,
    title: "Custom Reports",
    description: "Generate comprehensive reports tailored to your specific business needs.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access market data from multiple regions and countries worldwide.",
  },
  {
    icon: TrendingUp,
    title: "Trend Prediction",
    description: "Predict future market trends using advanced forecasting models.",
  },
  {
    icon: PieChart,
    title: "Data Visualization",
    description: "Interactive charts and graphs for better data understanding.",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "Track and analyze your competitors' market performance.",
  },
  {
    icon: MessageSquare,
    title: "Sentiment Analysis",
    description: "Monitor brand sentiment and consumer feedback across platforms.",
  },
  {
    icon: FileText,
    title: "Export Options",
    description: "Export reports in multiple formats including PDF, Excel, and CSV.",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
            Everything you need to conduct comprehensive market research and stay ahead of the competition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}