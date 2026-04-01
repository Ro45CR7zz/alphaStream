"use client";

import { motion } from "framer-motion";
import { Watchlist } from "@/src/components/watchlist";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useMarketStream } from "@/src/hooks/use-market-stream";
import { SentimentFeed } from "@/src/components/sentiment-feed";
import { SentimentChart } from "@/src/components/sentiment-chart";
import { OrderBook3D } from "@/src/components/order-book-3d";
import { MarketBreadth } from "@/src/components/market-breadth";

export default function DashboardPage() {
  // Connect to WS with a mock client ID. In production, this comes from user auth session.
  const { streamData, isConnected } = useMarketStream();
  const [username, setUsername] = useState<string>("Trader");

  useEffect(() => {
    const token = localStorage.getItem("alpha_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Our FastAPI backend stores the username in the 'sub' (subject) field
        if (decoded.sub) {
          // Capitalize the first letter for a cleaner look
          const formattedName = decoded.sub.charAt(0).toUpperCase() + decoded.sub.slice(1);
          setUsername(formattedName);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Welcome back, {username}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Real-time market overview and sentiment analysis.</p>
        </div>
        
        {/* Dynamic Connection Status */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
            isConnected 
              ? "text-green-400 bg-green-400/10 border-green-400/20" 
              : "text-red-400 bg-red-400/10 border-red-400/20"
          }`}>
            <span className="relative flex w-2 h-2">
              {isConnected && <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>}
              <span className={`relative inline-flex w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            {isConnected ? 'WS Connected' : 'Disconnected'}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="flex flex-col overflow-hidden border h-80 rounded-xl bg-[#0a0a0a] border-white/5 lg:col-span-2">
          <SentimentChart latestData={streamData} />
        </div>
        
        {/* Injecting our Live Component */}
        <div className="h-80">
          <SentimentFeed latestData={streamData} />
        </div>

        {/* Replace the Portfolio Metrics box with this: */}
        <div className="overflow-hidden relative h-64 text-sm border rounded-xl bg-[#0a0a0a] border-white/5">
          <OrderBook3D />
        </div>

        <div className="overflow-hidden h-64 border rounded-xl bg-[#0a0a0a] border-white/5">
          <MarketBreadth />
        </div>

        <div className="overflow-hidden h-64 border rounded-xl bg-[#0a0a0a] border-white/5">
          <Watchlist />
        </div>

      </motion.div>
    </div>
  );
}