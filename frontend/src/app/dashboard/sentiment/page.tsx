"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, ArrowUpRight, ArrowDownRight, Minus, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SentimentRecord {
  headline: string;
  sentiment_score: number;
  published_at: string;
  scraped_at: string;
}

export default function SentimentEnginePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<SentimentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the real data from our new FastAPI endpoint
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("alpha_token");
        const res = await fetch("http://localhost:8000/api/v1/sentiment/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch sentiment history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredData = data.filter(item => 
    item.headline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">ML Sentiment Engine</h1>
          <p className="mt-1 text-sm text-neutral-500">Query historical NLP analysis and predictive scoring.</p>
        </div>
        
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col overflow-hidden border rounded-xl bg-[#0a0a0a] border-white/5"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search headlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm text-white transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 placeholder:text-neutral-600"
            />
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-neutral-500">
            <span>Showing {filteredData.length} results</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-neutral-500 w-[180px]">Scraped Time</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Extracted Headline</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500 text-right w-[120px]">Polarity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 mx-auto animate-spin text-neutral-500" />
                  </TableCell>
                </TableRow>
              ) : filteredData.map((item, index) => {
                const timeString = new Date(item.scraped_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                
                return (
                  <TableRow key={index} className="transition-colors border-white/5 hover:bg-white/5">
                    <TableCell className="text-xs text-neutral-400 whitespace-nowrap">
                      {timeString}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-300">
                      {item.headline}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`inline-flex items-center justify-end gap-1 px-2 py-1 rounded text-xs font-medium ${
                        item.sentiment_score > 0.1 ? "text-green-400 bg-green-400/10" : 
                        item.sentiment_score < -0.1 ? "text-red-400 bg-red-400/10" : 
                        "text-neutral-400 bg-neutral-400/10"
                      }`}>
                        {item.sentiment_score > 0.1 ? <ArrowUpRight className="w-3 h-3" /> : 
                         item.sentiment_score < -0.1 ? <ArrowDownRight className="w-3 h-3" /> : 
                         <Minus className="w-3 h-3" />}
                        {item.sentiment_score.toFixed(2)}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!isLoading && filteredData.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="h-32 text-sm text-center text-neutral-500">
                    No historical data found. Make sure you have tickers in your watchlist and wait 15 seconds!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}