"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, DollarSign, Activity, ShoppingCart } from "lucide-react";

// Initial Market State
const INITIAL_ASKS = [
  { id: 3, price: 150.50, size: 100 },
  { id: 2, price: 150.25, size: 50 },
  { id: 1, price: 150.10, size: 10 },
];

const INITIAL_BIDS = [
  { id: 4, price: 149.90, size: 20 },
  { id: 5, price: 149.75, size: 150 },
  { id: 6, price: 149.50, size: 300 },
];

export default function OrderBookModule() {
  const [cash, setCash] = useState(1000.00);
  const [shares, setShares] = useState(0);
  const [asks, setAsks] = useState(INITIAL_ASKS);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [logs, setLogs] = useState<string[]>(["Simulation started. Market is open."]);
  const [limitPrice, setLimitPrice] = useState("149.95");
  
  // Module completion tracking
  const [hasMarketBought, setHasMarketBought] = useState(false);
  const [hasLimitBid, setHasLimitBid] = useState(false);
  const isCompleted = hasMarketBought && hasLimitBid;

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleMarketBuy = () => {
    if (asks.length === 0) return addLog("ERROR: No sellers left in the market!");
    
    // Get the cheapest ask (last item in our reversed array)
    const cheapestAsk = asks[asks.length - 1];
    const cost = cheapestAsk.price * 10; // Buying 10 shares

    if (cash < cost) return addLog(`ERROR: Insufficient funds. You need $${cost.toFixed(2)}`);

    setCash(prev => prev - cost);
    setShares(prev => prev + 10);
    
    // Update the order book
    setAsks(prev => {
      const newAsks = [...prev];
      if (newAsks[newAsks.length - 1].size > 10) {
        newAsks[newAsks.length - 1].size -= 10;
      } else {
        newAsks.pop(); // Remove the ask level if fully depleted
      }
      return newAsks;
    });

    addLog(`SUCCESS: Market Buy executed. Bought 10 shares at $${cheapestAsk.price.toFixed(2)}.`);
    setHasMarketBought(true);
  };

  const handleLimitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(limitPrice);
    
    if (isNaN(price) || price <= 0) return addLog("ERROR: Invalid price entered.");
    if (price >= asks[asks.length - 1]?.price) return addLog("ERROR: Limit price is higher than lowest ask. Use a Market Buy instead.");
    
    const cost = price * 10;
    if (cash < cost) return addLog(`ERROR: Insufficient funds to place a $${cost.toFixed(2)} limit order.`);

    setCash(prev => prev - cost); // Lock the cash
    
    // Add new bid and sort descending
    setBids(prev => {
      const newBids = [...prev, { id: Date.now(), price: price, size: 10 }];
      return newBids.sort((a, b) => b.price - a.price);
    });

    addLog(`PLACED: Limit Order added to the book. Bidding $${price.toFixed(2)} for 10 shares.`);
    setHasLimitBid(true);
  };

  const resetSimulation = () => {
    setCash(1000.00);
    setShares(0);
    setAsks(INITIAL_ASKS);
    setBids(INITIAL_BIDS);
    setLogs(["Simulation reset."]);
    setHasMarketBought(false);
    setHasLimitBid(false);
  };

  const spread = asks.length > 0 && bids.length > 0 
    ? (asks[asks.length - 1].price - bids[0].price).toFixed(2) 
    : "0.00";

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto p-8 min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">Module Passed</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-8">
            You successfully navigated the spread! You executed a Market Order to buy instantly, and placed a Limit Order to dictate your own price. 
          </p>
          <Link href="/dashboard/academy">
            <button className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors">
              Return to Curriculum
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/academy" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors mb-2 inline-block">
            ← Back to Academy
          </Link>
          <h1 className="text-2xl font-semibold text-white">Module 2: The Order Book</h1>
          <p className="text-sm text-neutral-400 mt-1">Goal: Execute 1 Market Buy and 1 Limit Order to pass.</p>
        </div>
        <button onClick={resetSimulation} className="text-xs text-neutral-500 hover:text-white underline">
          Reset Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* LEFT COLUMN: THE ORDER BOOK */}
        <div className="flex flex-col border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden col-span-1">
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Live Tape
            </h3>
          </div>
          
          <div className="p-4 flex-1 flex flex-col text-sm font-mono">
            {/* ASKS (Sellers) */}
            <div className="flex justify-between text-xs text-neutral-500 mb-2 px-2">
              <span>SIZE</span><span>ASK PRICE</span>
            </div>
            <div className="space-y-1 mb-4">
              {asks.map((ask) => (
                <motion.div layout key={ask.id} className="flex justify-between px-2 py-1 bg-red-500/10 text-red-400 rounded">
                  <span>{ask.size}</span><span>${ask.price.toFixed(2)}</span>
                </motion.div>
              ))}
            </div>

            {/* SPREAD */}
            <div className="flex items-center justify-center py-2 my-2 border-y border-white/5 text-xs text-neutral-500 bg-white/[0.01]">
              Spread: ${spread}
            </div>

            {/* BIDS (Buyers) */}
            <div className="space-y-1 mt-4">
              {bids.map((bid) => (
                <motion.div layout key={bid.id} className="flex justify-between px-2 py-1 bg-green-500/10 text-green-400 rounded">
                  <span>{bid.size}</span><span>${bid.price.toFixed(2)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRADING DESK */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          {/* Portfolio Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 border border-white/10 rounded-xl bg-[#0a0a0a]">
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Purchasing Power</span>
              <span className="text-3xl font-semibold text-white">${cash.toFixed(2)}</span>
            </div>
            <div className="p-5 border border-white/10 rounded-xl bg-[#0a0a0a]">
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Shares Owned</span>
              <span className="text-3xl font-semibold text-white">{shares}</span>
            </div>
          </div>

          {/* Action Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Market Order */}
            <div className="p-5 border border-white/10 rounded-xl bg-[#0a0a0a] flex flex-col">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-400" /> Market Order
              </h4>
              <p className="text-xs text-neutral-400 mb-6 flex-1">
                Instantly buy 10 shares from the cheapest available seller (Ask) on the book. Prioritizes speed over price.
              </p>
              <button 
                onClick={handleMarketBuy}
                className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                  hasMarketBought ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {hasMarketBought ? "✓ Market Buy Executed" : "Buy 10 Shares at Market"}
              </button>
            </div>

            {/* Limit Order */}
            <div className="p-5 border border-white/10 rounded-xl bg-[#0a0a0a] flex flex-col">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" /> Limit Order
              </h4>
              <p className="text-xs text-neutral-400 mb-4 flex-1">
                Set the exact price you are willing to pay for 10 shares. You will be added to the Buyer (Bid) book until a seller agrees.
              </p>
              <form onSubmit={handleLimitOrder} className="mt-auto">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                    <input 
                      type="number" step="0.01" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-7 pr-3 text-white text-sm focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <button type="submit" className={`px-4 rounded-lg text-sm font-medium transition-colors ${
                    hasLimitBid ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 text-white hover:bg-white/20"
                  }`}>
                    {hasLimitBid ? "✓" : "Place Bid"}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Activity Log */}
          <div className="border border-white/10 rounded-xl bg-[#0a0a0a] flex-1 min-h-[150px] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction Log</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={`${
                  log.includes("ERROR") ? "text-red-400" : 
                  log.includes("SUCCESS") || log.includes("PLACED") ? "text-green-400" : 
                  "text-neutral-400"
                }`}>
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}