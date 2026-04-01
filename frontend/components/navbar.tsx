"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4"
    >
      <nav className="flex items-center justify-between px-6 py-3 w-full max-w-4xl bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          <span className="text-white font-medium tracking-wide">AlphaStream</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
          <Link href="#product" className="hover:text-white transition-colors">Product</Link>
          <Link href="#data" className="hover:text-white transition-colors">Data Engine</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-neutral-300 hover:text-white transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link href="/dashboard" className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors">
            Terminal Access
          </Link>
        </div>
      </nav>
    </motion.div>
  );
}