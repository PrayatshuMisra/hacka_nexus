"use client"

import { useEffect, useState, useCallback } from "react"

interface AnimatedBackgroundProps {
  type?: "leaves" | "particles" | "both"
  density?: "low" | "medium" | "high"
}

export function AnimatedBackground({ type = "both", density = "medium" }: AnimatedBackgroundProps) {
  const [elements, setElements] = useState<Array<{ id: number; delay: number; duration: number; left: number }>>([])

  const createElements = useCallback(() => {
    const densityMap = {
      low: 8,
      medium: 12,
      high: 18,
    }

    const count = densityMap[density]
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 8,
      left: Math.random() * 100,
    }))

    setElements(newElements)
  }, [density])

  useEffect(() => {
    createElements()

    // Reduce frequency of recreation to improve performance
    const interval = setInterval(createElements, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [createElements])

  return (
    <div className="animated-background">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-blue-50/20 to-purple-50/20 dark:from-emerald-900/5 dark:via-blue-900/5 dark:to-purple-900/5" />

      {/* Falling leaves */}
      {(type === "leaves" || type === "both") && (
        <div className="falling-leaves">
          {elements.map((element) => (
            <div
              key={`leaf-${element.id}`}
              className="leaf"
              style={{
                left: `${element.left}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${element.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating particles */}
      {(type === "particles" || type === "both") && (
        <div className="floating-particles">
          {elements.slice(0, Math.floor(elements.length / 3)).map((element) => (
            <div
              key={`particle-${element.id}`}
              className="particle"
              style={{
                left: `${element.left}%`,
                animationDelay: `${element.delay + 8}s`,
                animationDuration: `${element.duration + 10}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
