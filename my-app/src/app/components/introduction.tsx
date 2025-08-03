"use client"
import { useEffect, useState, useCallback, memo } from "react"
import { motion } from "framer-motion"
import MusicPlayer from "./music-player"
import SpotifyPlayer from "./spotify"
import { Typewriter } from "react-simple-typewriter"
import { Music, Headphones } from "lucide-react"

interface Intro {
  name: string
  title: string
  bio: string
  image: string | undefined
}

const Introduction = memo(() => {
  const [intro, setIntro] = useState<Intro>({ name: "", title: "", bio: "", image: undefined })
  const [showSpotify, setShowSpotify] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/intro.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setIntro(data.intro)
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

  const handlePlayerToggle = useCallback((showSpotifyPlayer: boolean) => {
    setShowSpotify(showSpotifyPlayer)
  }, [])

  if (isLoading) {
    return (
      <div id="introduction" className="w-full max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div id="introduction" className="w-full max-w-7xl mx-auto px-4 mb-12">
        <div className="text-center text-red-400">
          <p>Error loading content: {error}</p>
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
    <div id="introduction" className="w-full max-w-7xl mx-auto px-4 mb-12">
      <motion.section
        initial={{ opacity: 0, y: 50 } as any}
        animate={{ opacity: 1, y: 0 } as any}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative overflow-visible z-0"
      >
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-visible shadow-[0_0_20px_rgba(34,211,238,0.5)]">

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 } as any}
                animate={{ opacity: 1, x: 0 } as any}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight pb-2">
                  Hi, I'm {intro.name}!
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto lg:mx-0"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 } as any}
                animate={{ opacity: 1, x: 0 } as any}
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
                initial={{ opacity: 0, y: 20 } as any}
                animate={{ opacity: 1, y: 0 } as any}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-8"
              >
                <div className="text-base sm:text-md md:text-lg text-gray-300 leading-relaxed backdrop-blur-sm bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 overflow-visible">
                  <div className="flex items-start min-h-[75px]">
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
                initial={{ opacity: 0, y: 20 } as any}
                animate={{ opacity: 1, y: 0 } as any}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="w-full relative z-30 space-y-6"
              >
                {/* Player Toggle */}
                <div className="flex justify-center">
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handlePlayerToggle(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          !showSpotify
                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.02 } as any}
                        whileTap={{ scale: 0.98 } as any}
                        aria-label="Switch to chill music player"
                      >
                        <Music className="w-4 h-4" />
                        Chill Music
                      </motion.button>
                      <motion.button
                        onClick={() => handlePlayerToggle(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          showSpotify
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.02 } as any}
                        whileTap={{ scale: 0.98 } as any}
                        aria-label="Switch to Spotify player"
                      >
                        <Headphones className="w-4 h-4" />
                        Spotify
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Player Display */}
                <motion.div
                  key={showSpotify ? "spotify" : "music"}
                  initial={{ opacity: 0, y: 20 } as any}
                  animate={{ opacity: 1, y: 0 } as any}
                  exit={{ opacity: 0, y: -20 } as any}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {showSpotify ? <SpotifyPlayer /> : <MusicPlayer />}
                </motion.div>
              </motion.div>
            </div>

            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -20 } as any}
              animate={{ scale: 1, opacity: 1, y: 0 } as any}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-64 h-64 sm:w-60 sm:h-60 lg:w-80 lg:h-80">
                {/* Animated rings */}
                <motion.div
                  animate={{ rotate: 360 } as any}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 } as any}
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
                    aria-label="Visit University of Toronto website"
                  >
                    <motion.img
                      src={intro.image}
                      alt="Profile"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.05 } as any}
                      loading="eager"
                    />
                  </a>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] } as any}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg"
                ></motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] } as any}
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
})

Introduction.displayName = 'Introduction'

export default Introduction
