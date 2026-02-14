"use client"
import { useEffect, useState, useCallback, memo } from "react"
import { motion } from "framer-motion"
import { Typewriter } from "react-simple-typewriter"
import { type Intro as IntroType } from "../../../lib/database"
import Image from "next/image"
import SpotifyPlayer from "../spotify"
import Contact from "./contact"

const Introduction = memo(() => {
  const [intro, setIntro] = useState<IntroType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/intro')
      if (!response.ok) throw new Error('Failed to fetch intro')
      const data = await response.json()
      setIntro(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const IntroductionSkeleton = () => (
    <motion.div
      id="introduction"
      className="w-full max-w-7xl mx-auto px-2 sm:px-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <section className="relative overflow-visible z-0">
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl relative">
          {/* Profile Image Skeleton - Top Center on mobile, Top Right on md+ */}
          <div className="flex justify-center md:absolute md:top-3 md:right-3 lg:top-6 lg:right-6 mb-4 md:mb-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/10 rounded-full animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-12">
            <div className="flex-1 text-center lg:text-left w-full md:pr-32 lg:pr-0 space-y-6">
              <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
              <div className="h-8 bg-white/10 rounded-lg animate-pulse"></div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="h-32 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )

  if (isLoading) {
    return <IntroductionSkeleton />
  }

  if (error || !intro) {
    return (
      <div id="introduction" className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center text-red-400">
          <p>Error loading content: {error || "No data available"}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      id="introduction"
      className="w-full max-w-7xl mx-auto px-2 sm:px-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <section className="relative overflow-visible z-0">
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl relative">
          {/* Profile Image - Top Center on mobile, Top Right on md+ */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 } as any}
            animate={{ scale: 1, opacity: 1 } as any}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center md:absolute md:top-3 md:right-3 lg:top-6 lg:right-6 mb-4 md:mb-0"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <a
                href="https://www.utoronto.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative rounded-full overflow-hidden bg-white/5 border-2 border-cyan-400/50 shadow-lg hover:scale-110 transition-transform duration-300"
                style={{
                  boxShadow: "0 0 15px rgba(34, 211, 238, 0.3), 0 0 30px rgba(139, 92, 246, 0.2), 0 0 45px rgba(236, 72, 153, 0.15)"
                }}
                aria-label="Visit University of Toronto website"
              >
                <Image
                  src={intro.image}
                  alt="Profile"
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                  className="object-cover"
                  priority
                  quality={90}
                />
              </a>
            </div>
          </motion.div>

          <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left w-full md:pr-32 lg:pr-0">
              <motion.div
                initial={{ opacity: 0 } as any}
                animate={{ opacity: 1 } as any}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
                  Hi, I'm {intro.name}!
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto lg:mx-0"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 } as any}
                animate={{ opacity: 1 } as any}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-8"
              >
                <p className="text-2xl text-gray-200 font-light leading-relaxed">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    {intro.title}
                  </span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 } as any}
                animate={{ opacity: 1 } as any}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-8"
              >
                <div className="text-md sm:text-lg text-gray-300 leading-relaxed bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="min-h-[120px]">
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

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0 } as any}
                animate={{ opacity: 1 } as any}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Contact />
              </motion.div>
            </div>
          </div>

          {/* Spotify Player Section */}
          <motion.div
            initial={{ opacity: 0 } as any}
            animate={{ opacity: 1 } as any}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="pt-8 pb-8 md:mt-8 border-t border-white/10"
          >
            <SpotifyPlayer />
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
})

Introduction.displayName = 'Introduction'

export default Introduction