"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StreamData } from "@/src/hooks/use-market-stream";

interface SentimentChartProps {
  latestData: StreamData | null;
}

export function SentimentChart({ latestData }: SentimentChartProps) {
  const [data, setData] = useState<any[]>([]);

  // Initialize with a flat baseline so the chart isn't completely empty on load
  useEffect(() => {
    const initialData = Array.from({ length: 15 }).map((_, i) => ({
      time: "",
      score: 0,
    }));
    setData(initialData);
  }, []);

  // Listen for new WebSocket data and update the chart
  useEffect(() => {
    if (latestData?.type === "SENTIMENT_TICK" && latestData.data && latestData.data.length > 0) {
      // Calculate the average sentiment of the newly scraped batch
      const avgScore = latestData.data.reduce((acc: number, curr: any) => acc + curr.sentiment_score, 0) / latestData.data.length;
      
      const timeString = new Date(latestData.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      setData(prev => {
        const newData = [...prev, { time: timeString, score: avgScore }];
        // Keep only the last 15 data points to create a flowing/scrolling effect
        return newData.slice(-15);
      });
    }
  }, [latestData]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-white">Aggregated Market Sentiment</h2>
        <p className="text-xs text-neutral-500">Real-time rolling average of NLP processed headlines</p>
      </div>
      
      <div className="flex-1 w-full h-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 300 }}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                {/* Clean, stark white gradient for the dark theme */}
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#525252" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#525252" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[-0.5, 0.5]} // Sentiment scores range from -0.5 to 0.5
              tickFormatter={(val) => val.toFixed(1)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#ffffff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}