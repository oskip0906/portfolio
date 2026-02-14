"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import type { Experience } from "../../../lib/database"
import Image from "next/image"

interface ExperienceCardProps {
  experience: Experience
  index: number
  isInView: boolean
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, index, isInView }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 } as any}
      animate={isInView ? { opacity: 1, scale: 1 } : ({ opacity: 0, scale: 0.95 } as any)}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative cursor-pointer"
      onClick={() => setShowDetails((prev) => !prev)}
      style={{
        perspective: "1000px",
        WebkitPerspective: "1000px",
      } as React.CSSProperties}
    >
      <motion.div
        animate={{ rotateY: showDetails ? 180 : 0 } as any}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          position: "relative",
        } as React.CSSProperties}
        className="w-full"
      >
        {/* Front side */}
        <div
          className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-12 shadow-2xl overflow-hidden min-h-[330px] flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            position: "relative",
          } as React.CSSProperties}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="w-full flex flex-col">
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
                  whileHover={{ scale: 1.06 } as any}
                  className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg"
                >
                  <Image
                    src={experience.image || "/placeholder.svg"}
                    alt={experience.company}
                    fill
                    sizes="64px"
                    className="object-cover"
                    quality={80}
                  />
                </motion.div>
              </a>
            </div>

            <div className="flex items-center justify-start mt-auto">
              <motion.div
                whileHover={{ scale: 1.03 } as any}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm text-gray-200"
              >
                <span>👀</span>
                View details
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back side */}
        <div
          className="absolute inset-0 top-0 left-0 w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden min-h-[330px] flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            WebkitTransform: "rotateY(180deg)",
          } as React.CSSProperties}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"></div>

          <div className="overflow-y-auto max-h-full w-full px-2 relative z-10">
            <p className="text-gray-200 leading-relaxed text-left">{experience.description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const ref = useRef(null)
  const inView = true

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
    <section ref={ref} id="experiences" className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} isInView={inView} />
        ))}
      </div>
    </section>
  )
}
