"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";

export function Watchlist() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's saved tickers on mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem("alpha_token");
      const res = await fetch("http://localhost:8000/api/v1/portfolio/watchlist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickers(data.watchlists);
      }
    } catch (error) {
      console.error("Failed to fetch watchlist", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;

    try {
      const token = localStorage.getItem("alpha_token");
      const res = await fetch("http://localhost:8000/api/v1/portfolio/watchlist", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ticker: newTicker.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        setTickers(prev => [...prev, data.ticker]);
        setNewTicker(""); // Clear input
      }
    } catch (error) {
      console.error("Failed to add ticker", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-300">My Watchlist</h3>
          <p className="text-xs text-neutral-500">Tracked assets</p>
        </div>
      </div>

      {/* Ticker Input Form */}
      <form onSubmit={handleAddTicker} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
          placeholder="e.g. MSFT"
          className="flex-1 px-3 py-1.5 text-xs text-white transition-colors bg-white/5 border rounded-md border-white/10 focus:outline-none focus:border-white/30"
        />
        <button 
          type="submit" 
          className="p-1.5 text-black bg-white rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Render the saved tickers */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-neutral-500" /></div>
        ) : tickers.length === 0 ? (
          <div className="text-xs text-center text-neutral-600 py-4">No assets tracked.</div>
        ) : (
          tickers.map((ticker, i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded-md bg-white/5 border-white/5 group hover:border-white/10 transition-colors">
              <span className="text-xs font-bold text-white tracking-wider">{ticker}</span>
              {/* Mock active market data indicator */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">Tracking</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}