"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden selection:bg-white/30">
      <Navbar />

      {/* New Full-Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/landingBG.png"
          alt="Pixel Art Cityscape"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Subtle dark overlay to ensure the white text remains readable against the bright sunset */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Main Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl text-5xl font-medium tracking-tighter text-white sm:text-7xl md:text-8xl drop-shadow-2xl"
        >
          Where your data <br className="hidden sm:block" />
          <span className="text-white-300">works as one.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mt-8 text-lg md:text-xl text-white font-light drop-shadow-md"
        >
          AlphaStream pairs you with a real-time institutional sentiment engine and a terminal that finally makes market depth clear. No jargon. Just alpha.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mt-12"
        >
          {/* Pointed to /login to match the Navbar Terminal Access routing */}
          <Link href="/login" className="px-8 py-4 text-sm font-medium text-black transition-colors bg-white rounded-full hover:bg-neutral-200 shadow-lg">
            Launch Terminal
          </Link>
          
        </motion.div>
      </main>

      {/* Bottom Fade to blend into the rest of the page if you scroll */}
      <div className="absolute bottom-0 z-10 w-full h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}