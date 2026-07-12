"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, BarChart2, ShieldAlert, BrainCircuit, PlayCircle, Lock } from "lucide-react";

// Curriculum Data Structure
const curriculum = [
  {
    level: 1,
    title: "Market Mechanics",
    description: "Understand the fundamental plumbing of the stock market.",
    icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    modules: [
      { id: "basics", title: "What is a Stock?", duration: "5 min", isAvailable: true, href: "/dashboard/academy/basics" },
      { id: "order-book", title: "The Order Book (Bid/Ask)", duration: "10 min", isAvailable: true, href: "/dashboard/academy/order-book" },
    ]
  },
  {
    level: 2,
    title: "Technical Analysis",
    description: "Learn to read price action and chart patterns.",
    icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
    modules: [
      { id: "candles", title: "Reading the Candles", duration: "8 min", isAvailable: true, href: "/dashboard/academy/candles" },
      { id: "moving-averages", title: "Moving Averages (SMA/EMA)", duration: "12 min", isAvailable: true, href: "/dashboard/academy/moving-averages" },
    ]
  },
  {
    level: 3,
    title: "Risk Management",
    description: "Protect your capital from market volatility.",
    icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
    modules: [
      { id: "stop-loss", title: "The Stop Loss Simulator", duration: "10 min", isAvailable: true, href: "/dashboard/academy/stop-loss" },
    ]
  },
  {
    level: 4,
    title: "Quantitative Analysis",
    description: "Trade using alternative data and AI sentiment.",
    icon: <BrainCircuit className="w-5 h-5 text-green-400" />,
    modules: [
      { id: "sentiment", title: "Trading the News (NLP)", duration: "15 min", isAvailable: true, href: "/dashboard/academy/sentiment" },
    ]
  }
];

export default function AcademyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">AlphaStream Academy</h1>
        <p className="mt-2 text-neutral-400">Master institutional trading concepts through interactive, data-driven simulations.</p>
      </header>

      {/* Curriculum Layout */}
      <div className="space-y-8">
        {curriculum.map((section, index) => (
          <motion.div 
            key={section.level}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                {section.icon}
              </div>
              <div>
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  Level {section.level}: {section.title}
                </h2>
                <p className="text-sm text-neutral-500">{section.description}</p>
              </div>
            </div>

            {/* Modules List */}
            <div className="divide-y divide-white/5">
              {section.modules.map((mod) => (
                <div key={mod.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    {mod.isAvailable ? (
                      <PlayCircle className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-neutral-600" />
                    )}
                    <div>
                      <h3 className={`text-sm font-medium ${mod.isAvailable ? 'text-neutral-200' : 'text-neutral-500'}`}>
                        {mod.title}
                      </h3>
                      <p className="text-xs text-neutral-600">{mod.duration}</p>
                    </div>
                  </div>
                  
                  {mod.isAvailable ? (
                    <Link href={mod.href}>
                      <button className="px-4 py-2 text-xs font-medium text-black bg-white rounded-md hover:bg-neutral-200 transition-colors">
                        Start Module
                      </button>
                    </Link>
                  ) : (
                    <button disabled className="px-4 py-2 text-xs font-medium text-neutral-500 bg-white/5 rounded-md cursor-not-allowed border border-white/5">
                      Locked
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}