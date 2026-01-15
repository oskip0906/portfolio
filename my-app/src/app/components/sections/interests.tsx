"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { type Interest } from "../../../lib/database"

export default function Interests() {
  const [interests, setInterests] = useState<Interest[]>([])
  const ref = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/interests')
        if (!response.ok) throw new Error('Failed to fetch interests')
        const data = await response.json()
        setInterests(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <section ref={ref} id="interests" className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100, scale: 0.8 } as any}
            animate={{ opacity: 1, y: 0, scale: 1 } as any}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
              ease: "easeOut",
              opacity: { duration: 0.5 },
              y: { duration: 0.6 },
              scale: { duration: 0.6 }
            }}
            className="group relative"
          >
            <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <Sparkles size={24} className="text-cyan-400" />
              </div>

              <div className="relative z-10">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {interest.emote}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {interest.name}
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  {interest.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}