"use client";

import { useState, useEffect } from "react";
import { CandlestickChart } from "@/src/components/candlestick-chart";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2, Plus, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock Performance Data for the 1Y Chart
const performanceData = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  balance: 100000 + (Math.random() * 50000 + i * 5000), // Upward trending mock data
}));

// Premium Dark Theme Chart Colors
const PIE_COLORS = ["#ffffff", "#a3a3a3", "#525252", "#262626", "#171717"];

export default function PortfoliosPage() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChartTicker, setActiveChartTicker] = useState<string>("SPY");

  // Fetch the user's watchlist from MongoDB and generate mock positions
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("alpha_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/portfolio/watchlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const savedTickers = data.watchlists || [];
          
          // Generate realistic simulated positions for their saved tickers
          const simulatedHoldings = savedTickers.map((ticker: string) => {
            const shares = Math.floor(Math.random() * 500) + 10;
            const avgCost = Math.random() * 300 + 50;
            const currentPrice = avgCost * (1 + (Math.random() * 0.4 - 0.1)); // Bias towards profit
            const totalValue = shares * currentPrice;
            const returnPct = ((currentPrice - avgCost) / avgCost) * 100;
            
            return {
              ticker,
              shares,
              avgCost,
              currentPrice,
              totalValue,
              returnPct,
            };
          }).sort((a: any, b: any) => b.totalValue - a.totalValue); // Sort by highest value

          setHoldings(simulatedHoldings);
          if (savedTickers.length > 0) setActiveChartTicker(savedTickers[0]);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const totalPortfolioValue = holdings.reduce((acc, curr) => acc + curr.totalValue, 0);
  const totalReturnPct = holdings.length > 0 ? (Math.random() * 15 + 5).toFixed(2) : "0.00"; // Mock overall return

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Portfolio Management
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Track and analyze your active positions.</p>
        </div>
        
      </header>

      {/* Top Metrics Row */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        {/* Total Value Card */}
        <div className="p-6 border rounded-xl bg-[#0a0a0a] border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Net Liquidation</span>
            <Wallet className="w-4 h-4 text-neutral-500" />
          </div>
          <span className="text-4xl font-semibold text-white tracking-tight">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-2 mt-4">
            <span className="flex items-center text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {totalReturnPct}% All Time
            </span>
          </div>
        </div>


        {/* Dynamic Candlestick Chart */}
        <div className="flex flex-col p-6 border rounded-xl bg-[#0a0a0a] border-white/5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium tracking-wider uppercase text-neutral-500">Price Action (3M)</span>

              {/* Ticker Selector Dropdown */}
              <select 
                value={activeChartTicker}
                onChange={(e) => setActiveChartTicker(e.target.value)}
                className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded border border-white/10 focus:outline-none"
              >
                {holdings.length === 0 ? (
                  <option value="SPY" className="bg-[#0a0a0a] text-white">SPY</option> 
                ) : null}
                
                {holdings.map(h => (
                  <option 
                    key={h.ticker} 
                    value={h.ticker} 
                    className="bg-[#0a0a0a] text-white"
                  >
                    {h.ticker}
                  </option>
                ))}
              </select>
            </div>
            <TrendingUp className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="flex-1 w-full mt-2">
              {/* Render the TradingView Component */}
              <CandlestickChart ticker={activeChartTicker} />
          </div>
        </div>

      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Positions Table */}
        <div className="lg:col-span-2 flex flex-col border rounded-xl bg-[#0a0a0a] border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-medium text-neutral-300">Active Positions</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-neutral-500">Asset</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 text-right">Shares</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 text-right">Avg Cost</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 text-right">Last Price</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 text-right">Total Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-48 text-center">
                      <Loader2 className="w-6 h-6 mx-auto animate-spin text-neutral-500" />
                    </TableCell>
                  </TableRow>
                ) : holdings.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No assets found.</p>
                        <p className="text-xs mt-1">Add tickers to your Watchlist on the Dashboard to populate your portfolio.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  holdings.map((item, index) => (
                    <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="text-sm font-bold text-white">
                        {item.ticker}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-300 text-right">
                        {item.shares.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-300 text-right font-mono">
                        ${item.avgCost.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-300 text-right font-mono">
                        ${item.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`inline-flex items-center justify-end gap-1 font-medium text-xs ${
                          item.returnPct >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {item.returnPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(item.returnPct).toFixed(2)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="flex flex-col border rounded-xl bg-[#0a0a0a] border-white/5 p-6 h-[400px]">
          <h3 className="text-sm font-medium text-neutral-300 mb-6">Allocation</h3>
          
          {holdings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-neutral-600">
              No data available
            </div>
          ) : (
            <div className="flex-1 relative min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 300, height: 300 }}>
                <PieChart>
                  {/* @ts-ignore - Recharts strict typing issue */}
                  <Pie
                    data={holdings}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="totalValue"
                    stroke="none"
                  >
                    {holdings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any, name: any, props: any) => [
                      `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
                      props.payload.ticker
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Allocation Legend */}
          <div className="mt-4 space-y-2">
            {holdings.slice(0, 4).map((item, i) => (
              <div key={item.ticker} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-neutral-400">{item.ticker}</span>
                </div>
                <span className="font-medium text-white">
                  {((item.totalValue / totalPortfolioValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}