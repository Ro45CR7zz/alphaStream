"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4"
    >
      {/* Reduced max-w to 3xl to pull the edges in and remove the dead space */}
      <nav className="flex items-center justify-between px-6 py-3 w-full max-w-3xl bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-3">
          {/* Increased logo size from w-6 h-6 to w-8 h-8 */}
          <div className="relative w-8 h-8 overflow-hidden rounded-[10px]">
            <Image 
              src="/logo.svg" 
              alt="AlphaStream Logo" 
              fill 
              className="object-contain"
              priority 
            />
          </div>
          {/* Increased brand font size to text-xl */}
          <span className="text-white font-semibold tracking-wide text-xl">AlphaStream</span>
        </Link>

        {/* CTA */}
        <div className="flex items-center">
          {/* Slightly increased padding to balance out the larger logo */}
          <Link href="/login" className="px-7 py-3 text-sm font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-all shadow-lg">
            Terminal Access
          </Link>
        </div>

      </nav>
    </motion.div>
  );
}