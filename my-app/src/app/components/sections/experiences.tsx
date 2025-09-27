"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { getExperiences, type Experience } from "../../../lib/database"
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
      initial={{ opacity: 0, y: 100, scale: 0.8 } as any}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.8 } as any}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: "easeOut",
        opacity: { duration: 0.5 },
        y: { duration: 0.6 },
        scale: { duration: 0.6 }
      }}
      className="group relative cursor-pointer"
      onClick={() => setShowDetails(prev => !prev)}
    >
      <div className="relative w-full">
        <div className="relative w-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-12 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 flex flex-col">
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

            <div className="flex items-center justify-start">
              <motion.div
                whileHover={{ scale: 1.03 } as any}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-white/20 text-sm text-gray-200"
              >
                <span className="mr-1">👀</span>
                View details
              </motion.div>
            </div>

            <motion.div
              initial={false}
              animate={showDetails ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 } as any}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden mt-4"
            >
              <p className="text-gray-200 leading-relaxed">
                {experience.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
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
        const data = await getExperiences()
        setExperiences(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <section ref={ref} id="experiences" className="w-full max-w-7xl mx-auto px-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 50 } as any}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 } as any}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 mt-6">
          Experiences
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          My professional journey and the companies I've worked with
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} isInView={inView} />
        ))}
      </div>
    </section>
  )
}