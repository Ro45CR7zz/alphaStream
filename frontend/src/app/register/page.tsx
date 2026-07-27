"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Convert FormData to a standard JSON object for our FastAPI Pydantic model
    const payload = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: password,
    };
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }
      
      // Auto-Login: Set the token and the cookie to bypass the Next.js proxy
      localStorage.setItem("alpha_token", data.access_token);
      document.cookie = `alpha_session=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
      
      // Redirect to the terminal
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
          className="relative w-full max-w-md md:w-1/2 h-[300px] md:h-[650px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden sm:block"
        >
          <Image 
            src="/tower.png" 
            alt="Sydney Opera House Pixel Art" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Right Column: Register Box */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 border rounded-2xl bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-8 h-8 overflow-hidden rounded-[10px]">
                <Image 
                  src="/logo.svg" 
                  alt="AlphaStream Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="text-lg font-semibold tracking-widest text-white">AlphaStream</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white">Create Account</h1>
            <p className="mt-2 text-sm text-neutral-400">Initialize your trading terminal.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wider uppercase text-neutral-400">Username</label>
              <input 
                name="username" type="text" required minLength={3}
                className="w-full px-4 py-3 text-sm text-white transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wider uppercase text-neutral-400">Email</label>
              <input 
                name="email" type="email" required
                className="w-full px-4 py-3 text-sm text-white transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wider uppercase text-neutral-400">Password</label>
              <input 
                name="password" type="password" required minLength={6}
                className="w-full px-4 py-3 text-sm text-white transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wider uppercase text-neutral-400">Confirm Password</label>
              <input 
                name="confirmPassword" type="password" required minLength={6}
                className="w-full px-4 py-3 text-sm text-white transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10"
              />
            </div>

            {error && (
              <div className="p-3 text-xs font-medium text-red-400 border rounded-lg bg-red-400/10 border-red-400/20">
                {error}
              </div>
            )}

            <button 
              type="submit" disabled={isLoading}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 mt-6 text-sm font-medium text-black transition-all bg-white rounded-lg hover:bg-neutral-200 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>Deploy Instance <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="text-white transition-colors hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}