"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Filter, ArrowUpRight, ArrowDownRight, Zap, ShieldAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Realistic mock data for the Order Flow Tape
const flowData = [
  { id: 1, time: "12:45:02", ticker: "NVDA", type: "Sweep", side: "Bullish", size: "2,500", price: "$875.50", premium: "$2.1M", expiry: "04/19/26" },
  { id: 2, time: "12:44:15", ticker: "AAPL", type: "Block", side: "Bearish", size: "15,000", price: "$169.20", premium: "$2.5M", expiry: "-" },
  { id: 3, time: "12:42:55", ticker: "TSLA", type: "Sweep", side: "Bearish", size: "4,200", price: "$171.80", premium: "$720K", expiry: "05/15/26" },
  { id: 4, time: "12:40:10", ticker: "AMD",  type: "Sweep", side: "Bullish", size: "3,100", price: "$180.25", premium: "$1.4M", expiry: "04/26/26" },
  { id: 5, time: "12:35:44", ticker: "MSFT", type: "Block", side: "Bullish", size: "25,000", price: "$420.15", premium: "$10.5M", expiry: "-" },
  { id: 6, time: "12:30:12", ticker: "META", type: "Sweep", side: "Bullish", size: "1,800", price: "$505.30", premium: "$909K", expiry: "06/20/26" },
  { id: 7, time: "12:28:05", ticker: "AMZN", type: "Block", side: "Bearish", size: "50,000", price: "$185.60", premium: "$9.2M", expiry: "-" },
  { id: 8, time: "12:25:33", ticker: "SMCI", type: "Sweep", side: "Bullish", size: "850", price: "$1050.00", premium: "$892K", expiry: "04/12/26" },
];

export default function OrderFlowPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Sweeps" | "Blocks">("All");

  const filteredData = flowData.filter(item => {
    if (activeFilter === "Sweeps") return item.type === "Sweep";
    if (activeFilter === "Blocks") return item.type === "Block";
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Institutional Order Flow
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Live tape of block trades and aggressive options sweeps.</p>
        </div>
      </header>

      {/* Top Metrics Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="p-5 border rounded-xl bg-[#0a0a0a] border-white/5 flex flex-col justify-center">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Total Premium (1H)</span>
          <span className="text-2xl font-semibold text-white">$45.2M</span>
        </div>
        <div className="p-5 border rounded-xl bg-[#0a0a0a] border-white/5 flex flex-col justify-center">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Call / Put Ratio</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-green-400">1.4</span>
            <span className="text-sm text-neutral-500">Bullish Lean</span>
          </div>
        </div>
        <div className="p-5 border rounded-xl bg-[#0a0a0a] border-white/5 flex flex-col justify-center">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Largest Block</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-white">MSFT</span>
            <span className="text-sm text-neutral-400">$10.5M</span>
          </div>
        </div>
      </motion.div>

      {/* The Tape */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col border rounded-xl bg-[#0a0a0a] border-white/5 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveFilter("All")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${activeFilter === "All" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"}`}
            >
              All Flow
            </button>
            <button 
              onClick={() => setActiveFilter("Sweeps")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md flex items-center gap-1 ${activeFilter === "Sweeps" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"}`}
            >
              <Zap className="w-3 h-3" /> Sweeps
            </button>
            <button 
              onClick={() => setActiveFilter("Blocks")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md flex items-center gap-1 ${activeFilter === "Blocks" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"}`}
            >
              <ShieldAlert className="w-3 h-3" /> Blocks
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-neutral-500 w-[100px]">Time</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Ticker</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Type</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500 text-right">Size</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500 text-right">Price</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500 text-right">Premium</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500 text-right">Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors font-mono">
                  <TableCell className="text-xs text-neutral-500">
                    {item.time}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-white">
                    {item.ticker}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase tracking-wider ${
                        item.type === "Sweep" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-300 text-right">
                    {item.size}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-300 text-right">
                    {item.price}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`inline-flex items-center justify-end gap-1 font-sans font-medium text-xs ${
                      item.side === "Bullish" ? "text-green-400" : "text-red-400"
                    }`}>
                      {item.side === "Bullish" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {item.premium}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500 text-right">
                    {item.expiry}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}