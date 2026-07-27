import { useState, useEffect, useRef } from "react";

export interface StreamData {
  type: string;
  timestamp: string;
  data?: any[];
  ticker?: string;
  price?: number;
  sentiment_score?: number;
}

// We no longer need to pass a hardcoded clientId
export function useMarketStream() {
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Grab the token from local storage
    const token = localStorage.getItem("alpha_token");
    
    // If there is no token, don't attempt to connect
    if (!token) return;

    // 2. Append the token to the URL as a query parameter
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000"}/api/v1/streams/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Secure WebSocket Connected");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const parsed: StreamData = JSON.parse(event.data);
        setStreamData(parsed);
      } catch (error) {
        console.error("Failed to parse WS message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return { streamData, isConnected };
}