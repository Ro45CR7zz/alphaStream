"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StreamData } from "@/src/hooks/use-market-stream";

interface SentimentFeedProps {
  latestData: StreamData | null;
}

export function SentimentFeed({ latestData }: SentimentFeedProps) {
  // We'll extract the data depending on whether it's our mock TICK or real SENTIMENT_TICK
  const isRealData = latestData?.type === "SENTIMENT_TICK";
  
  return (
    <div className="flex flex-col h-full p-5 border rounded-xl bg-[#0a0a0a] border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-300">Live ML Sentiment</h3>
        <span className="text-xs text-neutral-500">NLP Engine Active</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="popLayout">
          {!latestData ? (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-xs text-neutral-600"
            >
              Waiting for data stream...
            </motion.div>
          ) : isRealData ? (
            // Render Real Scraped Data
            <div className="space-y-3">
              {latestData.data?.slice(0, 4).map((item: any, i: number) => (
                <motion.div
                  key={`${item.headline}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-xs font-medium text-neutral-200 line-clamp-1">{item.headline}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${item.sentiment_score > 0 ? 'text-green-400' : item.sentiment_score < 0 ? 'text-red-400' : 'text-neutral-400'}`}>
                      Score: {item.sentiment_score.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Render Mock Tick Data
            <motion.div
              key={latestData.timestamp}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 rounded bg-white/5"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{latestData.ticker}</span>
                <span className="text-xs text-neutral-500">{new Date(latestData.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">${latestData.price?.toFixed(2)}</span>
                <span className={`text-xs ${latestData.sentiment_score! > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  AI: {latestData.sentiment_score?.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}