"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { type Memory } from "@/lib/database"

export default function TimelinePage() {
  const [mounted, setMounted] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchTimeline()
  }, [])

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/timeline')
      const data = await response.json()
      setMemories(data)
    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const colors = [
    "rgba(34, 211, 238, 0.6)",   // cyan
    "rgba(139, 92, 246, 0.6)",   // purple
    "rgba(236, 72, 153, 0.6)",   // pink
  ]

  const colorsSolid = [
    "#22d3ee",   // cyan
    "#8b5cf6",   // purple
    "#ec4899",   // pink
  ]

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading timeline...</div>
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">No timeline entries found.</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-12 text-center">
        Timeline
      </h1>

      <div className="relative">
        {/* Vertical connecting line */}
        <motion.div
          className="absolute left-2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{
            background: "linear-gradient(to bottom, rgba(34, 211, 238, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />

        {/* Timeline entries */}
        <div className="space-y-12">
          {memories.map((memory, i) => {
            const color = colors[i % colors.length]
            const colorSolid = colorsSolid[i % colorsSolid.length]

            return (
              <motion.div
                key={i}
                className="relative flex items-start gap-8"
                initial={{ opacity: 0, x: i === 0 || i === memories.length - 1 ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="relative w-4 h-4 rounded-full z-10 cursor-pointer"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                    }}
                    whileHover={{ scale: 1.3 }}
                  >
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `1px solid ${color}`,
                      }}
                      animate={{
                        scale: [1, 2.5, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Content card */}
                <motion.div
                  className="flex-1 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
                  style={{
                    background: "rgba(20, 20, 30, 0.95)",
                    border: `1px solid ${color}`,
                    boxShadow: `0 0 20px ${color}, 0 8px 32px rgba(0, 0, 0, 0.3)`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Date badge */}
                  <div
                    className="inline-block px-3 py-1 rounded-md text-sm font-semibold mb-3"
                    style={{
                      backgroundColor: `${colorSolid}20`,
                      color: colorSolid,
                      border: `1px solid ${colorSolid}40`,
                    }}
                  >
                    {memory.date}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: colorSolid }}
                  >
                    {memory.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-gray-300 leading-relaxed">
                    {memory.description}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
