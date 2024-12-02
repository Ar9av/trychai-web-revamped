"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              AI-Powered Market Research
              <span className="text-primary ml-2">
                <Sparkles className="inline-block w-8 h-8 md:w-12 md:h-12" />
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Transform your market research with AI. Get instant insights, stay updated with news,
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
              <Sparkles className="w-12 h-12 text-primary" />
              <div>
                <h3 className="font-semibold mb-2">Custom Reports</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate detailed reports tailored to your specific needs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}