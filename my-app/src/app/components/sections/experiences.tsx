"use client"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Experience } from "../../../lib/database"
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
      className="h-full cursor-pointer"
      onClick={() => setShowDetails((prev) => !prev)}
    >
      <Card className="relative min-h-[33vh] h-full flex flex-col group hover:border-white/30 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <CardContent className="p-8 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {!showDetails ? (
              <motion.div
                key="front"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex flex-col items-center justify-center h-full text-center gap-4"
              >
                <a
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg mx-auto"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.company}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </a>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    {experience.company}
                  </h3>
                  <p className="text-base md:text-lg text-gray-200 font-medium mb-1">{experience.title}</p>
                  <p className="text-sm text-gray-400 font-medium">{experience.date}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm text-gray-200">
                  <span>👀</span>
                  View details
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-2xl" />
                <p className="relative z-10 text-gray-200 leading-relaxed text-center">{experience.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Experiences({ experiences }: { experiences: Experience[] }) {

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
