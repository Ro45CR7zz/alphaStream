"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      // Send credentials to our custom FastAPI endpoint
      const response = await fetch("http://localhost:8000/api/v1/auth/token", {
        method: "POST",
        body: formData, 
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      
      // 1. Keep localStorage for client-side state if needed later
      localStorage.setItem("alpha_token", data.access_token);
      
      // 2. NEW: Set the cookie so the Next.js proxy lets us through!
      // This sets it for the entire site ('path=/'), expires in 1 hour (3600s), and allows redirects
      document.cookie = `alpha_session=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
      
      // 3. Redirect to the terminal
      router.push("/dashboard");
    } catch (err) {
      setError("Authentication failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#050505] selection:bg-white/30 p-4 md:p-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral-800 to-neutral-600 blur-[120px]" />
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* Left Column: Image Box */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md md:w-1/2 h-[300px] md:h-[550px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden sm:block"
        >
          <Image 
            src="/opera.png" 
            alt="Sydney Opera House Pixel Art" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Right Column: Login Box */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 border rounded-2xl bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              {/*<div className="w-5 h-5 bg-white rounded animate-pulse" />*/}
              <div className="relative w-8 h-8 overflow-hidden rounded-[10px]">
                <Image 
                  src="/logo.svg" 
                  alt="AlphaStream Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="text-lg font-semibold tracking-widest text-white ">AlphaStream</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white">Terminal Access</h1>
            <p className="mt-2 text-sm text-neutral-400">Enter your credentials to connect.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Username</label>
              <input 
                name="username"
                type="text" 
                defaultValue="admin"
                required
                className="w-full px-4 py-3 text-sm text-white transition-colors bg-white/5 border rounded-lg border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Password</label>
              <input 
                name="password"
                type="password" 
                defaultValue="admin"
                required
                className="w-full px-4 py-3 text-sm text-white transition-colors bg-white/5 border rounded-lg border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10"
              />
            </div>

            {error && (
              <div className="p-3 text-xs font-medium text-red-400 border rounded-lg bg-red-400/10 border-red-400/20">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 mt-6 text-sm font-medium text-black transition-all bg-white rounded-lg hover:bg-neutral-200 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  Initialize Connection <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2 flex flex-col">
            <p className="text-xs text-neutral-500">
              Need an instance?{" "}
              <Link href="/register" className="text-white hover:underline transition-colors">
                Create Account
              </Link>
            </p>
            <Link href="/" className="text-xs text-neutral-600 hover:text-white transition-colors mt-2">
              Return to Homepage
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}