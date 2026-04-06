"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Experience } from "../../../lib/database"
import Image from "next/image"
import { Card, CardContent } from "../ui/card"

interface ExperienceCardProps {
  experience: Experience
  index: number
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, index }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="cursor-pointer"
      onClick={() => setShowDetails((prev) => !prev)}
    >
      <Card className="relative min-h-[33vh] group hover:border-white/30 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <CardContent className="p-8 h-full">
          <AnimatePresence mode="wait">
            {!showDetails ? (
              <motion.div
                key="front"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {experience.company}
                    </h3>
                    <p className="text-base md:text-lg text-gray-200 font-medium mb-2">{experience.title}</p>
                    <p className="text-sm text-gray-400 font-medium">{experience.date}</p>
                  </div>

                  <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 ml-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg"
                    >
                      <Image
                        src={experience.image || "/placeholder.svg"}
                        alt={experience.company}
                        fill
                        sizes="56px"
                        className="object-cover"
                        quality={60}
                        loading="lazy"
                      />
                    </motion.div>
                  </a>
                </div>

                <div className="flex items-center mt-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm text-gray-200">
                    <span>👀</span>
                    View details
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-2xl" />
                <div className="relative z-10 overflow-y-auto">
                  <p className="text-gray-200 leading-relaxed">{experience.description}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/experiences")
        if (!response.ok) throw new Error("Failed to fetch experiences")
        const data = await response.json()
        setExperiences(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <section id="experiences" className="w-full mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </div>
    </section>
  )
}
