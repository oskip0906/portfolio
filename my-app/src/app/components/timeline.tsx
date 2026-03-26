"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface Memory {
  title: string
  date: string
  description: string
}

export default function Timeline() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    setMounted(true)
    fetchTimeline()

    // Track screen width
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.timeline-container')) {
        setActiveIndex(null)
      }
    }

    if (activeIndex !== null) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activeIndex])

  const handleDotClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null)
    } else {
      setActiveIndex(index)
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

  const nodeCount = memories.length

  if (!mounted || isLoading) {
    return null
  }

  if (nodeCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-2">
      <div className="timeline-container relative flex justify-between items-center pointer-events-none w-full max-w-[75vw]">
        {/* Connecting line - horizontal */}
        <motion.div
          className="absolute left-0 right-0 h-px top-1/2 -translate-y-1/2"
          style={{
            background: "linear-gradient(to right, rgba(34, 211, 238, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3), rgba(34, 211, 238, 0.3))",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />

        {Array.from({ length: nodeCount }).map((_, i) => {
          const color = colors[i % colors.length]
          const colorSolid = colorsSolid[i % colorsSolid.length]
          const isActive = activeIndex === i || hoveredIndex === i

          // Calculate bubble position to keep it on screen
          const bubbleWidth = 210
          const defaultOffset = -105 // Centers the bubble by default

          // Calculate timeline container width (75vw with padding)
          const timelineMaxWidth = Math.min(screenWidth * 0.75, screenWidth - 32) // 32px for padding

          // Calculate dot position within timeline
          const dotPosition = (i / (nodeCount - 1)) * timelineMaxWidth
          const timelineLeftEdge = (screenWidth - timelineMaxWidth) / 2
          const dotAbsolutePosition = timelineLeftEdge + dotPosition

          // Calculate bubble edges with default centering
          const bubbleLeftEdge = dotAbsolutePosition - 105
          const bubbleRightEdge = dotAbsolutePosition + 105

          // Adjust margin to keep bubble on screen
          let bubbleMargin = defaultOffset

          if (bubbleLeftEdge < 10) {
            // Bubble would overflow on left - shift right
            bubbleMargin = -dotAbsolutePosition + 10
          } else if (bubbleRightEdge > screenWidth - 10) {
            // Bubble would overflow on right - shift left
            bubbleMargin = -(bubbleWidth - (screenWidth - dotAbsolutePosition - 10))
          }

          return (
            <div
              key={i}
              className="relative flex-shrink-0 pointer-events-auto"
            >
              {/* Memory bubble */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute bottom-6 left-1/2 mb-2 z-[200] w-[210px] max-w-[90vw]"
                    style={{
                      marginLeft: `${bubbleMargin}px`
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {/* Bubble container */}
                    <div
                      className="relative backdrop-blur-xl rounded-2xl p-4 shadow-2xl pointer-events-auto"
                      style={{
                        background: "rgba(20, 20, 30, 0.95)",
                        border: `1px solid ${color}`,
                        boxShadow: `0 0 20px ${color}, 0 8px 32px rgba(0, 0, 0, 0.3)`,
                        minHeight: "150px",
                      }}
                    >
                      {/* Date badge */}
                      <div
                        className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold mb-2"
                        style={{
                          backgroundColor: `${colorSolid}20`,
                          color: colorSolid,
                          border: `1px solid ${colorSolid}40`,
                        }}
                      >
                        {memories[i].date}
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base font-bold mb-2"
                        style={{ color: colorSolid }}
                      >
                        {memories[i].title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {memories[i].description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot */}
              <motion.button
                className="relative w-3 h-3 rounded-full z-10 cursor-pointer border-0 p-0"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                }}
                onClick={() => handleDotClick(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isActive ? 1.5 : 1,
                  opacity: isActive ? 1 : 0.8,
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ scale: isActive ? 1.5 : 1.3 }}
                aria-label={`Memory ${i + 1}`}
              >
                {/* Pulsing ring - only when not active */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
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
                )}
              </motion.button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
