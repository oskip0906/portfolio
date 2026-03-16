"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const ORBIT_DOTS = [
  { color: "#22d3ee", glow: "rgba(34,211,238,0.9)", duration: 2.2, radius: 58 },
  { color: "#8b5cf6", glow: "rgba(139,92,246,0.9)", duration: 3.1, radius: 44 },
  { color: "#ec4899", glow: "rgba(236,72,153,0.9)", duration: 1.8, radius: 30 },
]

export default function LoadingSpinner() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Spinner stack */}
        <div className="relative w-36 h-36 flex items-center justify-center">

          {/* Ring 1 — outermost, clockwise, slow: cyan + purple arc */}
          <motion.div
            className="absolute inset-0 rounded-full border-[3px]"
            style={{
              borderColor: "transparent",
              borderTopColor: "#22d3ee",
              borderRightColor: "#8b5cf6",
              borderBottomColor: "rgba(139,92,246,0.3)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Ring 2 — counter-clockwise, medium: pink + amber arc */}
          <motion.div
            className="absolute inset-[10px] rounded-full border-[3px]"
            style={{
              borderColor: "transparent",
              borderTopColor: "#ec4899",
              borderLeftColor: "#f59e0b",
              borderBottomColor: "rgba(236,72,153,0.25)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />

          {/* Ring 3 — clockwise, fast: green + cyan arc */}
          <motion.div
            className="absolute inset-[20px] rounded-full border-[2px]"
            style={{
              borderColor: "transparent",
              borderTopColor: "#4ade80",
              borderRightColor: "#22d3ee",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Ring 4 — counter-clockwise, very fast: purple + pink */}
          <motion.div
            className="absolute inset-[30px] rounded-full border-[2px]"
            style={{
              borderColor: "transparent",
              borderTopColor: "#8b5cf6",
              borderLeftColor: "#ec4899",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />

          {/* Orbiting dots */}
          {ORBIT_DOTS.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: dot.duration, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            >
              <div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: dot.color,
                  boxShadow: `0 0 8px ${dot.glow}, 0 0 16px ${dot.glow}`,
                  top: `calc(50% - ${dot.radius}px - 5px)`,
                  left: "calc(50% - 5px)",
                }}
              />
            </motion.div>
          ))}

          {/* Inner pulsing core glow */}
          <motion.div
            className="absolute inset-[38px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(34,211,238,0.25) 50%, transparent 100%)",
            }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center dot */}
          <motion.div
            className="w-3 h-3 rounded-full bg-white z-20"
            style={{
              boxShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 28px rgba(139,92,246,0.7), 0 0 48px rgba(34,211,238,0.4)",
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Label */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            className="text-xs font-semibold tracking-[0.4em] uppercase"
            style={{ color: "rgba(255,255,255,0.6)" }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading
          </motion.p>

          <div className="flex gap-1.5">
            {[
              { color: "#22d3ee", delay: 0 },
              { color: "#8b5cf6", delay: 0.18 },
              { color: "#ec4899", delay: 0.36 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: dot.color }}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
