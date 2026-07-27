"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";

interface SectorData {
  name: string;
  value: number;
}

export default function SectorPerformance() {
  const [data, setData] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSectors() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/market/sectors`);
        if (!res.ok) throw new Error("Failed to fetch live sector benchmarks.");
        const sectorJson = await res.json();
        // Limit to top 6 sectors so it doesn't crowd our h-64 container view
        setData(sectorJson.slice(0, 6));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSectors();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full p-6 flex items-center justify-center text-[11px] text-red-400 bg-[#0a0a0a]">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col justify-between h-full w-full bg-[#0a0a0a]">
      <div>
        <h3 className="text-xs font-semibold text-white">Macro Sector Performance</h3>
        <p className="text-[10px] text-neutral-500">Daily baseline returns via SPDR Sector benchmarks</p>
      </div>

      <div className="h-[160px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 300, height: 160 }}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#171717" horizontal={false} />
            <XAxis type="number" stroke="#525252" fontSize={9} tickFormatter={(tick) => `${tick}%`} />
            <YAxis dataKey="name" type="category" stroke="#8a8a8a" fontSize={9} width={75} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
              contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#262626", borderRadius: "6px" }}
              itemStyle={{ fontSize: "10px", padding: 0 }}
              labelStyle={{ fontSize: "10px", fontWeight: "bold", color: "#fff" }}
              formatter={(value: any) => [`${value}%`, "Change"]}
            />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={12}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value >= 0 ? "rgba(34, 197, 94, 0.85)" : "rgba(239, 68, 68, 0.85)"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}