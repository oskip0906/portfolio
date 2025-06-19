"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Experience {
  title: string
  company: string
  date: string
  description: string
  image: string
  link: string
}

interface ExperienceCardProps {
  experience: Experience
  index: number
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, index }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative h-80 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <div className="relative w-full h-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
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
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg"
                  >
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.company}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </a>
              </div>

              <div className="flex-1 flex items-end">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-white/20 text-sm text-gray-300"
                >
                  <span className="mr-2">✨</span>
                  Click to flip!
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(0)",
          }}
        >
          <div className="relative w-full h-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-2xl"></div>
            <div className="relative z-10 h-full flex items-center">
              <p className="text-gray-200 leading-relaxed text-center max-h-full overflow-y-auto">
                {experience.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/experiences.json")
        const data = await response.json()
        setExperiences(data.experiences)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <section ref={ref} id="experiences" className="w-full max-w-7xl mx-auto px-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
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
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </div>
    </section>
  )
}
