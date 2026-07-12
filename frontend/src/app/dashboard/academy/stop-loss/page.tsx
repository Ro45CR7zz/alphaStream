"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, AlertTriangle, TrendingDown, RefreshCcw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function StopLossModule() {
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [stopLossPrice, setStopLossPrice] = useState(90);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [chartData, setChartData] = useState<{ time: number; price: number }[]>([
    { time: 0, price: 100 }
  ]);
  const [status, setStatus] = useState<"idle" | "running" | "triggered" | "liquidated">("idle");
  
  const entryPrice = 100;
  const liquidationPrice = 50; // Total account failure

  // Flash Crash Logic
  useEffect(() => {
    let interval: any;
    if (status === "running") {
      interval = setInterval(() => {
        setCurrentPrice((prev) => {
          // Accelerating drop logic
          const drop = Math.random() * 2 + (100 - prev) * 0.1; 
          const nextPrice = prev - drop;

          // Check for Stop Loss Trigger
          if (nextPrice <= stopLossPrice) {
            setStatus("triggered");
            clearInterval(interval);
            return stopLossPrice;
          }

          // Check for Account Liquidation
          if (nextPrice <= liquidationPrice) {
            setStatus("liquidated");
            clearInterval(interval);
            return liquidationPrice;
          }

          return nextPrice;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [status, stopLossPrice]);

  // Update Chart Data
  useEffect(() => {
    if (status !== "idle") {
      setChartData(prev => [...prev, { time: prev.length, price: currentPrice }]);
    }
  }, [currentPrice, status]);

  const startSimulation = () => {
    setChartData([{ time: 0, price: 100 }]);
    setCurrentPrice(100);
    setStatus("running");
  };

  const reset = () => {
    setStatus("idle");
    setCurrentPrice(100);
    setChartData([{ time: 0, price: 100 }]);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-[80vh] flex flex-col">
      <div className="mb-8">
        <Link href="/dashboard/academy" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors mb-2 inline-block">
          ← Back to Academy
        </Link>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-400" /> Module 5: The Stop Loss Simulator
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Goal: Survive the "Flash Crash" by setting a protective exit order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* LEFT: THE CHART VISUALIZER */}
        <div className="lg:col-span-2 flex flex-col border border-white/10 rounded-xl bg-[#0a0a0a] p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Live Price Action</span>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 border border-red-500/50 bg-red-500/10"></div>
                 <span className="text-[10px] text-neutral-500">STOP LOSS</span>
               </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={status === "liquidated" ? "#ef4444" : "#ffffff"} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[40, 110]} hide />
                <ReferenceLine y={stopLossPrice} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={entryPrice} stroke="#737373" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: '#737373', fontSize: 10 }} />
                <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={status === "liquidated" ? "#ef4444" : "#ffffff"} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {status === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 pointer-events-none">
                <p className="text-sm text-neutral-400">Adjust settings and click Start Simulation</p>
            </div>
          )}
        </div>

        {/* RIGHT: CONTROL PANEL */}
        <div className="flex flex-col gap-4">
          
          {/* Simulation Controls */}
          <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6">
            <h3 className="text-sm font-medium text-white mb-4">Risk Parameters</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-neutral-500 uppercase font-medium">Stop Loss Price</label>
                  <span className="text-sm font-bold text-red-400">${stopLossPrice}</span>
                </div>
                <input 
                    type="range" min="60" max="98" value={stopLossPrice} 
                    disabled={status !== "idle"}
                    onChange={(e) => setStopLossPrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-30"
                />
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg space-y-2">
                 <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Entry Price:</span>
                    <span className="text-white">$100.00</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Max Risk:</span>
                    <span className="text-red-400">-${(100 - stopLossPrice).toFixed(2)}</span>
                 </div>
              </div>

              {status === "idle" ? (
                <button 
                    onClick={startSimulation}
                    className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all"
                >
                    Start Flash Crash
                </button>
              ) : (
                <button 
                    onClick={reset}
                    className="w-full py-3 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCcw className="w-4 h-4" /> Reset Simulation
                </button>
              )}
            </div>
          </div>

          {/* Status Feedback */}
          <AnimatePresence mode="wait">
            {status === "triggered" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 border border-green-500/20 bg-green-500/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <h4 className="text-sm font-bold text-green-400">Capital Protected</h4>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                        Your Stop Loss triggered at ${stopLossPrice}. You lost ${(100 - stopLossPrice).toFixed(2)}% of your capital, but you avoided the total liquidation at $50.00. 
                    </p>
                    <Link href="/dashboard/academy">
                        <button className="mt-4 w-full py-2 bg-green-500 text-black text-xs font-bold rounded hover:bg-green-400">Complete Module</button>
                    </Link>
                </motion.div>
            )}

            {status === "liquidated" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 border border-red-500/20 bg-red-500/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h4 className="text-sm font-bold text-red-400">Account Liquidated</h4>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                        You had no protection. The market crashed through $50.00 and your account was wiped out. Institutional traders never trade without a Stop Loss.
                    </p>
                </motion.div>
            )}

            {status === "running" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col items-center py-10">
                    <TrendingDown className="w-8 h-8 text-red-500 animate-bounce mb-2" />
                    <span className="text-xs font-mono text-red-500">MARKET VOLATILITY HIGH</span>
                </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}