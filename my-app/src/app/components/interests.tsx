"use client"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Sparkles } from "lucide-react"

interface Interest {
  name: string
  description: string
  emote: string
}

export default function Interests() {
  const [interests, setInterests] = useState<Interest[]>([])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/interests.json")
        const data = await response.json()
        setInterests(data.interests)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <section ref={ref} id="interests" className="w-full max-w-7xl mx-auto px-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 mt-6">
          Interests
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          The passions and hobbies that fuel my creativity and drive
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
            }}
            className="group relative"
          >

            <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-cyan-400/60 rounded-2xl p-6 shadow-2xl overflow-hidden transition-all duration-500 shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_0_0_2px_rgba(168,85,247,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <Sparkles size={24} className="text-cyan-400" />
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{
                    delay: 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 150,
                    damping: 10,
                  }}
                  className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300"
                >
                  {interest.emote}
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
                >
                  {interest.name}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-gray-300 leading-relaxed"
                >
                  {interest.description}
                </motion.p>
              </div>

              <div
                className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34,211,238,0.3), rgba(168,85,247,0.3), rgba(236,72,153,0.3))",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  padding: "1px",
                }}
              ></div>
            </div>

            <motion.div
              animate={{
                y: [-5, 5, -5],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4 + index * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px</div>_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.8)]"
            />

            <div className="absolute inset-0 rounded-2xl opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
