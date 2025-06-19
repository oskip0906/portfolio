"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MusicPlayer from "./music"
import { Typewriter } from "react-simple-typewriter"

interface Intro {
  name: string
  title: string
  bio: string
  image: string | undefined
}

export default function Introduction() {
  const [intro, setIntro] = useState<Intro>({ name: "", title: "", bio: "", image: undefined })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/intro.json")
        const data = await response.json()
        setIntro(data.intro)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div id="introduction" className="w-full max-w-7xl mx-auto px-4 mb-12">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative overflow-visible z-0"
      >
        {/* Glassmorphism container */}
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl overflow-visible">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight pb-2">
                  Hello, I'm {intro.name}!
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto lg:mx-0"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-8"
              >
                <p className="text-2xl text-gray-200 font-light leading-relaxed">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    {intro.title}
                  </span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-8"
              >
                <div className="text-base sm:text-md md:text-lg text-gray-300 leading-relaxed backdrop-blur-sm bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 overflow-visible">
                  <div className="flex items-start min-h-[90px]">
                    <Typewriter
                      words={intro.bio.split(";")}
                      loop={false}
                      cursor
                      cursorStyle="|"
                      typeSpeed={70}
                      deleteSpeed={50}
                      delaySpeed={1000}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="w-full relative z-30"
              >
                <MusicPlayer />
              </motion.div>
            </div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-64 h-64 sm:w-60 sm:h-60 lg:w-80 lg:h-80">
                {/* Animated rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-purple-400/20"
                ></motion.div>

                {/* Profile image container */}
                <div className="absolute inset-8 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-400/20 backdrop-blur-sm border border-white/20 shadow-2xl">
                  <a
                    href="https://www.utoronto.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <motion.img
                      src={intro.image}
                      alt="Profile"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.05 }}
                    />
                  </a>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg"
                ></motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-lg"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
