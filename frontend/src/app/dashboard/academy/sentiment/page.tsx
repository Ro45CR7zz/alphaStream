"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, ArrowUpRight, ArrowDownRight, ArrowRight, Cpu } from "lucide-react";

const headlines = [
  {
    text: "Federal Reserve announces unexpected interest rate cut, citing stabilizing inflation.",
    actual: "Bullish",
    score: "+0.85",
    explanation: "Interest rate cuts make borrowing cheaper for companies, generally leading to higher stock prices as growth accelerates."
  },
  {
    text: "Major tech conglomerate slashes Q4 revenue guidance due to severe supply chain bottlenecks.",
    actual: "Bearish",
    score: "-0.72",
    explanation: "Lowering revenue guidance is a massive red flag for Wall Street. The AI detects 'slashes' and 'bottlenecks' as highly negative keywords."
  },
  {
    text: "Acme Corp successfully secures critical patent for next-generation solid-state battery technology.",
    actual: "Bullish",
    score: "+0.91",
    explanation: "Patents create a 'moat' against competitors. The AI recognizes 'successfully secures' and 'next-generation' as strong positive indicators of future revenue."
  }
];

export default function SentimentModule() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<"Bullish" | "Bearish" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleGuess = (guess: "Bullish" | "Bearish") => {
    setUserGuess(guess);
    setShowResult(true);
    if (guess === headlines[currentIndex].actual) {
      setScore(prev => prev + 1);
    }
  };

  const nextHeadline = () => {
    if (currentIndex === headlines.length - 1) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setUserGuess(null);
      setShowResult(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto p-8 min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">Curriculum Completed!</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-8">
            You scored {score} out of {headlines.length}. You now understand how Natural Language Processing (NLP) models read the news faster than humans to find trading edges.
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

  const current = headlines[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-[80vh] flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard/academy" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors mb-2 inline-block">
            ← Back to Academy
          </Link>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-green-400" /> Module 6: Trading the News
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Goal: Act as the AI. Classify the sentiment of the incoming data stream.</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-500 uppercase font-medium">Accuracy Score</span>
          <div className="text-2xl font-bold text-white">{score} / {headlines.length}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        
        <div className="mb-8 text-center">
          <span className="text-xs font-mono text-neutral-500 bg-white/5 px-3 py-1 rounded-full border border-white/10 mb-4 inline-block">
            HEADLINE {currentIndex + 1} OF {headlines.length}
          </span>
          <h2 className="text-2xl font-medium text-white leading-relaxed">
            "{current.text}"
          </h2>
        </div>

        {!showResult ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <button 
              onClick={() => handleGuess("Bullish")}
              className="p-6 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group"
            >
              <ArrowUpRight className="w-8 h-8 text-green-400 group-hover:-translate-y-1 transition-transform" />
              <span className="font-semibold text-green-400">Bullish (Positive)</span>
            </button>
            <button 
              onClick={() => handleGuess("Bearish")}
              className="p-6 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group"
            >
              <ArrowDownRight className="w-8 h-8 text-red-400 group-hover:translate-y-1 transition-transform" />
              <span className="font-semibold text-red-400">Bearish (Negative)</span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <div className={`p-6 border rounded-xl flex items-start gap-4 ${
              userGuess === current.actual 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-red-500/10 border-red-500/20"
            }`}>
              {userGuess === current.actual ? (
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
              ) : (
                <ArrowDownRight className="w-6 h-6 text-red-400 shrink-0 mt-1" />
              )}
              <div>
                <h3 className={`font-semibold mb-1 ${userGuess === current.actual ? "text-green-400" : "text-red-400"}`}>
                  {userGuess === current.actual ? "Correct Assessment" : "Incorrect Assessment"}
                </h3>
                <p className="text-sm text-neutral-300">
                  You guessed <span className="font-bold">{userGuess}</span>. The actual sentiment is <span className="font-bold">{current.actual}</span>.
                </p>
              </div>
            </div>

            <div className="p-6 border border-white/10 bg-[#0a0a0a] rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AlphaStream AI Output</span>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className={`text-3xl font-mono font-bold ${current.actual === "Bullish" ? "text-green-400" : "text-red-400"}`}>
                  {current.score}
                </span>
                <span className="text-sm text-neutral-500">Confidence Score</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {current.explanation}
              </p>
            </div>

            <button 
              onClick={nextHeadline}
              className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              Next Headline <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}