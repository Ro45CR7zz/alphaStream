"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden selection:bg-white/30">
      <Navbar />

      {/* Abstract Animated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-30 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral-800 to-neutral-500 blur-[120px]"
        />
      </div>

      {/* Main Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border rounded-full border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium tracking-wide text-neutral-300 uppercase">
            HFT Engine Online • v1.0.0
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl text-5xl font-medium tracking-tighter text-white sm:text-7xl md:text-8xl"
        >
          Where your data <br className="hidden sm:block" />
          <span className="text-neutral-500">works as one.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mt-8 text-lg md:text-xl text-neutral-400 font-light"
        >
          AlphaStream pairs you with a real-time institutional sentiment engine and a terminal that finally makes market depth clear. No jargon. Just alpha.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mt-12"
        >
          <a href="/dashboard" className="px-8 py-4 text-sm font-medium text-black transition-colors bg-white rounded-full hover:bg-neutral-200">
            Launch Terminal
          </a>
          <a href="#architecture" className="px-8 py-4 text-sm font-medium text-white transition-colors border rounded-full border-white/20 hover:bg-white/10">
            View Architecture
          </a>
        </motion.div>
      </main>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}