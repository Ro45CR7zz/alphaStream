"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Generate a deterministic "volatile" price chart for the simulation
const generateMockData = () => {
  let price = 100;
  const data = [];
  for (let i = 1; i <= 60; i++) {
    // Random walk with a slight upward drift
    price = price + (Math.sin(i / 3) * 4) + (Math.random() * 6 - 2.5);
    data.push({ day: i, price: Number(price.toFixed(2)) });
  }
  return data;
};

const MOCK_DATA = generateMockData();

export default function MovingAveragesModule() {
  const [period, setPeriod] = useState(10);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Dynamically calculate the Simple Moving Average (SMA) based on the slider
  const chartData = useMemo(() => {
    return MOCK_DATA.map((point, index, arr) => {
      if (index < period - 1) return { ...point, sma: null }; // Not enough data points yet
      
      // Get the last 'period' number of prices
      const slice = arr.slice(index - period + 1, index + 1);
      const sum = slice.reduce((acc, val) => acc + val.price, 0);
      return { ...point, sma: Number((sum / period).toFixed(2)) };
    });
  }, [period]);

  const submitQuiz = () => {
    // Index 0 is the correct answer
    if (quizAnswer === 0) {
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
          <h2 className="text-3xl font-semibold text-white mb-4">Level 2 Complete!</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-8">
            You have mastered Technical Analysis mechanics. You understand how to read price action and how to use mathematical indicators to filter out market noise.
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
      <div className="mb-8">
        <Link href="/dashboard/academy" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors mb-2 inline-block">
          ← Back to Academy
        </Link>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" /> Module 4: Moving Averages
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Goal: Understand how the "lookback period" affects signal speed and market noise.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* LEFT/TOP: THE INTERACTIVE SIMULATOR */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">The Smoothing Effect</h3>
                <p className="text-sm text-neutral-400 max-w-xl">
                  A Simple Moving Average (SMA) constantly calculates the average price over a specific number of past days. 
                  Drag the slider below to change the period.
                </p>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-1">
                    Lookback Period
                  </label>
                  <span className="text-2xl font-semibold text-white">{period} Days</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-400 font-medium bg-blue-400/10 px-2 py-1 rounded">
                    {period < 15 ? "Fast & Noisy" : period > 35 ? "Slow & Smooth" : "Balanced"}
                  </span>
                </div>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={period} 
                onChange={(e) => setPeriod(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-neutral-600 mt-2 font-mono">
                <span>5 (Fast)</span>
                <span>50 (Slow Lag)</span>
              </div>
            </div>

            {/* Dynamic Chart */}
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#737373', fontSize: 12 }} />
                  <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.2)" tick={{ fill: '#737373', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  {/* The Raw Volatile Price */}
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    name="Raw Price"
                    stroke="#525252" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  {/* The Smoothed Moving Average */}
                  <Line 
                    type="monotone" 
                    dataKey="sma" 
                    name={`${period}-Day SMA`}
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={false} 
                    connectNulls={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center gap-6 mt-4 justify-center text-xs text-neutral-400">
              <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-neutral-500"></div> Raw Stock Price</div>
              <div className="flex items-center gap-2"><div className="w-3 h-1 bg-blue-500"></div> Moving Average</div>
            </div>

          </div>
        </div>

        {/* RIGHT: THE SCENARIO QUIZ */}
        <div className="flex flex-col border border-white/10 rounded-xl bg-[#0a0a0a] p-6 h-fit">
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Knowledge Check</h3>
          <p className="text-sm text-neutral-400 mb-6">
            Move the slider left and right and observe how the blue line behaves relative to the gray price line.
          </p>
          
          <div className="flex-1">
            <h4 className="text-white font-medium mb-4 text-sm leading-relaxed">
              If a trader wants an indicator that reacts <span className="text-blue-400">extremely fast</span> to a sudden market crash, should they use a shorter period or a longer period?
            </h4>
            
            <div className="space-y-3">
              {[
                "A shorter period (e.g., 5-Day). It hugs the price closely and reacts faster, though it has more false alarms.",
                "A longer period (e.g., 50-Day). It is much smoother and ignores the crash completely.",
                "It doesn't matter. Both averages will react at the exact same time."
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

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 overflow-hidden"
                >
                  Incorrect. Drag the slider to 50. Notice how the blue line is far away from the recent price changes? That's called "Lag." Now drag it to 5.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={submitQuiz}
            disabled={quizAnswer === null}
            className="mt-8 w-full py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>

      </div>
    </div>
  );
}