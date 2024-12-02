"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Search, FileText, PieChart, RefreshCcw } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Enter Your Topic",
    description: "Simply input the market or topic you want to research.",
  },
  {
    icon: RefreshCcw,
    title: "AI Processing",
    description: "Our AI lets you choose the right sources and assists in generating the report.",
  },
  {
    icon: PieChart,
    title: "Data Analysis",
    description: "Get comprehensive analysis with trends and patterns.",
  },
  {
    icon: FileText,
    title: "Generate Report",
    description: "Receive a detailed report with actionable insights.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-10 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
            Get started with market research in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white dark:text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <step.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}