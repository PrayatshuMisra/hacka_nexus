"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Leaf } from "lucide-react";

const NUMBER_OF_LEAVES = 70;

interface LeafData {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export default function FallingLeavesBackground() {
  const [leaves, setLeaves] = useState<LeafData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return

    const gen = Array.from({ length: NUMBER_OF_LEAVES }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 20 + Math.random() * 20,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
    setLeaves(gen);

    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {leaves.map((leaf) => {
        // Calculate push away from cursor
        const distX = typeof window !== 'undefined' ? ((leaf.x / 100) * window.innerWidth - mouse.x) / 50 : 0;

        return (
          <motion.div
            key={leaf.id}
            className="absolute top-0"
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: "110vh",
              x: `${leaf.x + distX}%`,
              opacity: [0, 1, 0.8, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: `${leaf.x}%` }}
          >
            <Leaf
              className="text-green-500 opacity-60"
              style={{ width: leaf.size, height: leaf.size }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
