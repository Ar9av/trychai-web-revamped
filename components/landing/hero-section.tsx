"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Search, Coffee } from "lucide-react";
import Link from "next/link";
import { WavyBackground } from "../ui/wavy-background";
import { FlipWords } from "../ui/flip-words";

export function HeroSection() {
  const words = [
    "AI",
    "How AI is Transforming Healthcare",
    "Sustainable Energy Solutions",
    "Blockchain",
    "Latest Blockchain Developments",
    "Remote Work Trends",
    "Cybersecurity",
    "Electric Vehicles Are the Future",
    "5G Communication Impact",
    "Fintech Startups Growth",
    "Social Media Influence",
    "Climate Change Tech Solutions",
    "Stock Markets",
    "Economic Supply Chain Disruptions",
    "Renewable Energy",
    "Advancements in Renewable Energy",
    "Mental Health Awareness and Technology",
    "Pop Culture and Technology",
    "Environmental Conservation Initiatives",
    "Cultural Heritage Preservation",
    "Ethical and Philosophical Debates",
    "Medical Research Breakthroughs",
    "Financial Literacy",
    "Importance of Financial Literacy",
    "Music and Emotions",
    "Space Exploration",
    "Universal Basic Income Opinions",
    "Autonomous Vehicles",
    "Cybersecurity Importance",
    "AI Startups: OpenAI, DeepMind",
    "Companies Similar to Tesla: Rivian, Lucid Motors",
    "Healthcare Startups",
    "Companies Like Amazon: Alibaba, Shopify",
    "AI in Daily Life",
    "Companies Similar to SpaceX: Blue Origin, Rocket Lab",
    "Language Learning Evolution",
    "Virtual Reality Future",
    "Green Tech Startups",
    "Similar to PayPal: Stripe, Square",
    "AI and Job Market",
    "Investing in Cryptocurrencies",
    "Climate Technology Innovations",
    "Digital Marketing",
    "Companies Like Netflix: Hulu, Disney+",
    "Future of Remote Work",
    "AI in Creative Fields",
    "Net Neutrality",
    "Smart Homes",
    "Biotech Startups",
    "Companies Similar to Google: Microsoft, Apple",
    "AI Ethics",
    "E-commerce Evolution"
  ];
  return (
    <section className="w-full md:py-12 lg:py-12 xl:py-48 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
      <WavyBackground className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none glow-border">
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
               - AI Research Assistant
              <span className="text-primary ml-2">
                <Coffee className="inline-block w-8 h-8 md:w-12 md:h-12" />
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-400 glow-text">
              Start researching around: <FlipWords words={words} />
            </p>
            
            <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-400">
              Transform your research with AI. Get instant insights, stay updated with news,
              and make data-driven decisions faster than ever.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-x-4"
          >
            <Button asChild size="lg">
              <Link href="/demo">
                Try Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left py-20"
          >
            <div className="flex items-start space-x-4">
              <Brain className="w-12 h-12 text-primary" />
              <div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Advanced algorithms analyze market trends and consumer behavior
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Search className="w-12 h-12 text-primary" />
              <div>
                <h3 className="font-semibold mb-2">Real-time Insights</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get instant access to market data and competitive analysis
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Coffee className="w-12 h-12 text-primary" />
              <div>
                <h3 className="font-semibold mb-2">Custom Reports</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate detailed reports tailored to your specific needs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </WavyBackground>
      </div>
    </section>
  );
}