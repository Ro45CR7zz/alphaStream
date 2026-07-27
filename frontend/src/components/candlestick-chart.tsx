"use client";

import React, { useEffect, useRef, useState } from 'react';
// Notice we now explicitly import CandlestickSeries here
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';

export function CandlestickChart({ ticker }: { ticker: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize the TradingView Chart
    const chart = createChart(chartContainerRef.current, {
      layout: { 
        background: { type: ColorType.Solid, color: 'transparent' }, 
        textColor: '#737373' 
      },
      grid: { 
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' }, 
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' } 
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    // 2. VERSION 5 FIX: Use addSeries(CandlestickSeries)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80',       
      downColor: '#f87171',     
      borderVisible: false,
      wickUpColor: '#4ade80',
      wickDownColor: '#f87171',
    });

    // Flag to prevent state updates if the component unmounts mid-fetch
    let isMounted = true;

    // 3. Fetch the data from FastAPI
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("alpha_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/market/history/${ticker}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok && isMounted) {
          const json = await res.json();
          candlestickSeries.setData(json.data);
          chart.timeScale().fitContent(); 
        }
      } catch (error) {
        console.error("Failed to load chart data", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // 4. Handle Window Resizing
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    // 5. Cleanup
    return () => {
      isMounted = false; // Prevent async operations from updating an unmounted component
      window.removeEventListener('resize', handleResize);
      
      // Wrap the remove call to prevent race conditions during React's Strict Mode rapid unmounting
      try {
        chart.remove(); 
      } catch (error) {
        console.warn("Chart already disposed");
      }
    };
  }, [ticker]); 

  return (
    <div className="relative w-full h-[300px]">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]/50 backdrop-blur-sm">
          <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}