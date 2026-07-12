"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, TrendingUp, Wallet } from "lucide-react";

// The lesson content structured as an array of "slides"
const slides = [
  {
    title: "The Concept of Equity",
    icon: <Building2 className="w-12 h-12 text-blue-400 mb-6" />,
    content: "A stock (or share) represents fractional ownership in a corporation. When you buy a share of Apple, you are not just buying a ticker symbol; you are buying a legal, proportionate piece of Apple's business, its assets, and its future cash flows.",
  },
  {
    title: "Why Do Companies Issue Stock?",
    icon: <Wallet className="w-12 h-12 text-purple-400 mb-6" />,
    content: "Companies issue stock to raise capital. Instead of taking out a massive loan from a bank (which requires paying interest), a company sells pieces of itself to the public. They use this money to build new factories, hire engineers, or expand globally.",
  },
  {
    title: "How You Generate Returns",
    icon: <TrendingUp className="w-12 h-12 text-green-400 mb-6" />,
    content: "Investors make money in two ways: \n\n1. Capital Appreciation: If the company grows and becomes more valuable, other investors will be willing to pay you more for your share than you originally paid.\n2. Dividends: Mature companies often take a portion of their quarterly profits and distribute it directly to shareholders as cash.",
  }
];

export default function BasicsModule() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = slides.length + 1; // +1 for the quiz
  const progressPercentage = ((currentStep + (isCompleted ? 1 : 0)) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < slides.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    // Index 1 is the correct answer
    if (quizAnswer === 1) {
      setIsCompleted(true);
    } else {
      alert("Incorrect. Remember, a stock represents actual ownership, not a loan.");
      setQuizAnswer(null); // Reset so they can try again
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 min-h-[80vh] flex flex-col">
      
      {/* Top Navigation & Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard/academy" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors">
            ← Back to Academy
          </Link>
          <span className="text-xs font-mono text-neutral-500">
            {isCompleted ? "COMPLETED" : `STEP ${currentStep + 1} OF ${totalSteps}`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          
          {/* RENDER LESSON SLIDES */}
          {!isCompleted && currentStep < slides.length && (
            <motion.div
              key={`slide-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center max-w-2xl mx-auto"
            >
              {slides[currentStep].icon}
              <h2 className="text-3xl font-semibold text-white mb-6 tracking-tight">
                {slides[currentStep].title}
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed whitespace-pre-wrap">
                {slides[currentStep].content}
              </p>
            </motion.div>
          )}

          {/* RENDER QUIZ */}
          {!isCompleted && currentStep === slides.length && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mx-auto"
            >
              <h2 className="text-2xl font-semibold text-white mb-8 text-center">Knowledge Check</h2>
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <p className="text-white font-medium mb-6">When you purchase a share of stock in a public company, what are you fundamentally buying?</p>
                <div className="space-y-3">
                  {[
                    "A guaranteed, fixed-interest loan paid back by the company.",
                    "A fractional piece of ownership in the company and its future cash flows.",
                    "A physical product manufactured by the company.",
                    "A short-term contract that expires after 30 days."
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all text-sm ${
                        quizAnswer === idx 
                          ? "border-white bg-white/10 text-white" 
                          : "border-white/5 bg-transparent text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RENDER SUCCESS SCREEN */}
          {isCompleted && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4">Module Passed</h2>
              <p className="text-neutral-400 max-w-md mb-8">
                You now understand the fundamental concept of equities. You are ready to dive into the mechanics of how these shares are actively traded.
              </p>
              <Link href="/dashboard/academy">
                <button className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                  Return to Curriculum
                </button>
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      {!isCompleted && (
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors disabled:opacity-0 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          {currentStep < slides.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={quizAnswer === null}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}