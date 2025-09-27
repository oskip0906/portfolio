"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function LoadingSpinner() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm">

      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            className="w-20 h-20 border-2 border-transparent rounded-full"
            style={{
              borderImage: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899) 1",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Inner ring */}
          <motion.div
            className="w-14 h-14 border-2 border-white/20 rounded-full absolute top-3 left-3"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Center dot with subtle glow */}
          <motion.div
            className="w-4 h-4 bg-white rounded-full absolute top-8 left-8"
            style={{
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        <div className="text-center">
          <motion.h2
            className="text-xl font-medium text-white mb-3"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Loading...
          </motion.h2>

          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
