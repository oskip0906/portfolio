"use client"
import { useEffect, useState, useCallback, memo } from "react"
import { motion } from "framer-motion"
import MusicPlayer from "../music-player"
import SpotifyPlayer from "../spotify"
import { Typewriter } from "react-simple-typewriter"
import { Music, Headphones } from "lucide-react"
import { getIntro, type Intro as IntroType } from "../../../lib/database"
import Image from "next/image"

const Introduction = memo(() => {
  const [intro, setIntro] = useState<IntroType | null>(null)
  const [showSpotify, setShowSpotify] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getIntro()
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

  const handlePlayerToggle = useCallback((showSpotifyPlayer: boolean) => {
    setShowSpotify(showSpotifyPlayer)
  }, [])

  const IntroductionSkeleton = () => (
    <motion.div
      id="introduction"
      className="w-full max-w-7xl mx-auto px-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <section className="relative overflow-visible z-0">
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-visible shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[600px]">
            <div className="flex-1 text-center lg:text-left w-full">
              <div className="mb-6">
                <div className="h-12 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto lg:mx-0"></div>
              </div>
              <div className="mb-8">
                <div className="h-8 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
              <div className="mb-8">
                <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10">
                  <div className="h-32 bg-white/10 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-12 bg-white/10 rounded-2xl animate-pulse"></div>
                <div className="h-24 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <div className="relative w-64 h-64 sm:w-60 sm:h-60 lg:w-80 lg:h-80">
                <div className="absolute inset-8 rounded-full bg-white/10 animate-pulse"></div>
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
      <div id="introduction" className="w-full max-w-7xl mx-auto px-4 mb-6">
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
      className="w-full max-w-7xl mx-auto px-4 mb-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <section className="relative overflow-visible z-0">
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-visible shadow-[0_0_20px_rgba(34,211,238,0.5)]">

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left w-full">
              <motion.div
                initial={{ opacity: 0 } as any}
                animate={{ opacity: 1 } as any}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
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
                initial={{ opacity: 0, y: 20 } as any}
                animate={{ opacity: 1, y: 0 } as any}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-8"
              >
                <div className="text-base sm:text-md md:text-lg text-gray-300 leading-relaxed backdrop-blur-sm bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 overflow-visible">
                  <div className="flex items-start min-h-[140px] h-[140px] overflow-hidden">
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
                  className="min-h-[200px]"
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
                    className="block w-full h-full relative"
                    aria-label="Visit University of Toronto website"
                  >
                    <Image
                      src={intro.image}
                      alt="Profile"
                      fill
                      sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 320px"
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      priority
                      quality={90}
                      style={{ aspectRatio: '1/1' }}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
})

Introduction.displayName = 'Introduction'

export default Introduction