"use client"
import { useMemo, useEffect, useState } from "react"

export default function SnowEffect() {
  const [isClient, setIsClient] = useState(false)
  
  const snowflakes = useMemo(() => {
    if (!isClient) return []
    
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
    }))
  }, [isClient])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((snowflake) => (
        <div
          key={`snow-${snowflake.id}`}
          className="snow"
          style={{
            left: snowflake.left,
            animationDelay: snowflake.animationDelay,
            animationDuration: snowflake.animationDuration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
} 