"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

// --- Mock Data Generator ---
// In production, this would be fed by your WebSocket hook
const generateBook = (type: "bid" | "ask", count: number, startPrice: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    price: type === "bid" ? startPrice - i * 0.5 : startPrice + i * 0.5,
    volume: Math.random() * 100 + 10, // Random volume height
    type,
  }));
};

const BIDS = generateBook("bid", 20, 150);
const ASKS = generateBook("ask", 20, 150.5);
const ORDER_BOOK = [...BIDS, ...ASKS];

// --- Single 3D Bar Component ---
function OrderBar({ position, volume, type }: { position: [number, number, number]; volume: number; type: "bid" | "ask" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Dynamic color based on bid (green) or ask (red)
  const color = type === "bid" ? "#22c55e" : "#ef4444";
  
  // Scale the height down so it fits nicely in the camera view
  const height = volume / 20; 

  useFrame((state) => {
    if (meshRef.current) {
      // Add a tiny, subtle breathing animation to the bars to make the terminal feel "alive"
      const time = state.clock.elapsedTime;
      meshRef.current.scale.y = 1 + Math.sin(time * 2 + position[0]) * 0.05;
    }
  });

  return (
    <mesh position={[position[0], height / 2, position[2]]} ref={meshRef}>
      {/* Width, Height, Depth */}
      <boxGeometry args={[0.4, height, 0.4]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// --- The Main Canvas Wrapper ---
export function OrderBook3D() {
  return (
    <div className="flex flex-col h-full p-5 relative">
      <div className="flex items-center justify-between mb-2 z-10">
        <h3 className="text-sm font-medium text-neutral-300">3D Market Depth</h3>
        <span className="text-xs text-neutral-500 hover:text-white cursor-pointer transition-colors">
          [ Drag to Rotate ]
        </span>
      </div>
      
      {/* The Canvas creates an isolated WebGL context. 
        We use a transparent background so it blends seamlessly into your dark UI. 
      */}
      <div className="flex-1 w-full h-full absolute inset-0 pt-12">
        <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
          {/* Lighting is crucial for 3D to look premium */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          
          {/* Map our data to 3D bars */}
          <group position={[0, -2, 0]}>
            {ORDER_BOOK.map((order, i) => {
              // Center the spread around X = 0
              const xPos = order.type === "bid" 
                ? -(150 - order.price) * 1.5 - 0.5 
                : (order.price - 150.5) * 1.5 + 0.5;
              
              return (
                <OrderBar 
                  key={i} 
                  position={[xPos, 0, 0]} 
                  volume={order.volume} 
                  type={order.type} 
                />
              );
            })}
          </group>

          {/* Controls to let the user interact with the topology */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2.2} // Prevent looking directly from the bottom
          />
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
}