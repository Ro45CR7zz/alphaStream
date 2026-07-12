"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, BarChart2 } from "lucide-react";

export default function CandlesModule() {
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const submitQuiz = () => {
    // Index 1 is the correct answer
    if (quizAnswer === 1) {
      setIsCompleted(true);
    } else {
      setShowHint(true);
      setQuizAnswer(null);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto p-8 min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">Module Passed</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-8">
            You successfully decoded the OHLC data! You can now look at any candlestick chart and instantly understand the exact price action that occurred during that timeframe.
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
    <div className="max-w-5xl mx-auto p-8 min-h-[80vh] flex flex-col">
      <div className="mb-8">
        <Link href="/dashboard/academy" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors mb-2 inline-block">
          ← Back to Academy
        </Link>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-purple-400" /> Module 3: Reading the Candles
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Goal: Understand OHLC (Open, High, Low, Close) to pass the market scenario.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* LEFT COLUMN: THE ANATOMY LESSON */}
        <div className="flex flex-col gap-6">
          <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex-1">
            <h3 className="text-lg font-medium text-white mb-4">The Anatomy of a Candlestick</h3>
            <p className="text-sm text-neutral-400 mb-8">
              A single candlestick tells you everything that happened during a specific timeframe (like 1 Day or 1 Hour). It consists of the <strong>Body</strong> (the thick part) and the <strong>Wicks</strong> (the thin lines).
            </p>

            {/* Visualizer */}
            <div className="flex items-center justify-center gap-16 py-8">
              
              {/* Bullish Candle */}
              <div className="flex flex-col items-center relative w-32">
                <span className="text-xs text-neutral-500 absolute -top-6">High</span>
                <div className="w-1 h-8 bg-green-400 rounded-t" /> {/* Upper Wick */}
                <div className="w-12 h-24 bg-green-400 rounded-sm relative flex items-center justify-center group">
                   <div className="absolute -right-16 top-0 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">← Close</div>
                   <div className="absolute -right-16 bottom-0 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">← Open</div>
                </div> {/* Body */}
                <div className="w-1 h-12 bg-green-400 rounded-b" /> {/* Lower Wick */}
                <span className="text-xs text-neutral-500 absolute -bottom-6">Low</span>
                <span className="mt-8 text-sm font-medium text-green-400">Bullish (Price Went Up)</span>
              </div>

              {/* Bearish Candle */}
              <div className="flex flex-col items-center relative w-32">
                <span className="text-xs text-neutral-500 absolute -top-6">High</span>
                <div className="w-1 h-12 bg-red-400 rounded-t" /> {/* Upper Wick */}
                <div className="w-12 h-24 bg-red-400 rounded-sm relative flex items-center justify-center group">
                   <div className="absolute -left-16 top-0 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">Open →</div>
                   <div className="absolute -left-16 bottom-0 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Close →</div>
                </div> {/* Body */}
                <div className="w-1 h-8 bg-red-400 rounded-b" /> {/* Lower Wick */}
                <span className="text-xs text-neutral-500 absolute -bottom-6">Low</span>
                <span className="mt-8 text-sm font-medium text-red-400">Bearish (Price Went Down)</span>
              </div>

            </div>
            
            <div className="mt-4 p-4 bg-white/[0.02] border border-white/5 rounded-lg">
              <p className="text-xs text-neutral-400 text-center">
                <span className="text-white font-medium">Hover over the thick bodies</span> above to see where the price Opened and Closed!
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE SCENARIO QUIZ */}
        <div className="flex flex-col border border-white/10 rounded-xl bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-medium text-white mb-2">Market Scenario</h3>
          <p className="text-sm text-neutral-400 mb-6">Read the raw market data below and determine what the resulting candlestick would look like.</p>
          
          {/* Market Data Terminal */}
          <div className="bg-black border border-white/10 rounded-lg p-4 font-mono text-sm mb-8 space-y-2">
            <div className="text-neutral-500">{"// 1-Day Trading Session for Ticker: NVDA"}</div>
            <div className="flex justify-between"><span className="text-neutral-400">Market Open (09:30 AM):</span> <span className="text-white">$100.00</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Intraday Low (11:15 AM):</span> <span className="text-red-400">$95.00</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Intraday High (02:45 PM):</span> <span className="text-green-400">$115.00</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Market Close (04:00 PM):</span> <span className="text-white">$105.00</span></div>
          </div>

          <div className="flex-1">
            <h4 className="text-white font-medium mb-4">Based on this data, which statement is true?</h4>
            
            <div className="space-y-3">
              {[
                "The candle is RED. The thick body spans from $95 to $115.",
                "The candle is GREEN. The thick body spans from $100 to $105. The wicks stretch down to $95 and up to $115.",
                "The candle is GREEN. There is no lower wick because the price closed higher than it opened.",
                "The candle is RED. The thick body spans from $100 to $105. The upper wick touches $115."
              ].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuizAnswer(idx)}
                  className={`w-full text-left p-4 rounded-lg border transition-all text-sm leading-relaxed ${
                    quizAnswer === idx 
                      ? "border-white bg-white/10 text-white" 
                      : "border-white/5 bg-transparent text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showHint && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                Incorrect. Hint: Did the price Close higher or lower than it Opened? That determines the color. The Body only connects the Open and Close.
              </motion.div>
            )}
          </div>

          <button
            onClick={submitQuiz}
            disabled={quizAnswer === null}
            className="mt-6 w-full py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Analysis
          </button>
        </div>

      </div>
    </div>
  );
}