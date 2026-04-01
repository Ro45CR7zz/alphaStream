"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// Mock data: In Phase 2, this will be populated by your FastAPI backend
const breadthData = [
  { ticker: "NVDA", price: 875.24, change: 4.25, volume: "45.2M", trend: "up" },
  { ticker: "AMD", price: 180.15, change: 2.15, volume: "22.1M", trend: "up" },
  { ticker: "SMCI", price: 1050.00, change: 1.85, volume: "5.4M", trend: "up" },
  { ticker: "TSLA", price: 172.10, change: -3.45, volume: "68.9M", trend: "down" },
  { ticker: "AAPL", price: 169.30, change: -1.20, volume: "35.8M", trend: "down" },
];

export function MarketBreadth() {
  return (
    <div className="flex flex-col h-full p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-300">Market Breadth</h3>
          <p className="text-xs text-neutral-500">Top Movers by Volume</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-neutral-500 w-[80px]">Ticker</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 text-right">Price</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 text-right">24h (%)</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 text-right hidden sm:table-cell">Vol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breadthData.map((item) => (
              <TableRow key={item.ticker} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell className="font-medium text-white text-xs">
                  {item.ticker}
                </TableCell>
                <TableCell className="text-right text-neutral-300 text-xs font-mono">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-xs">
                  <div className={`flex items-center justify-end gap-1 ${item.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {item.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(item.change)}%
                  </div>
                </TableCell>
                <TableCell className="text-right text-neutral-500 text-xs hidden sm:table-cell">
                  {item.volume}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}