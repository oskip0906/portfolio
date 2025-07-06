"use client"
import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Music } from "lucide-react"

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function controlSong() {
    const audio = document.getElementById("audio") as HTMLAudioElement | null
    const progressBar = document.getElementById("progressBar") as HTMLInputElement | null
    if (audio && progressBar) {
      audio.currentTime = Number.parseFloat(progressBar.value)
    }
  }

  function updateProgress() {
    const audio = document.getElementById("audio") as HTMLAudioElement | null
    const progressBar = document.getElementById("progressBar") as HTMLInputElement | null
    if (audio && progressBar && !isNaN(audio.duration)) {
      progressBar.max = audio.duration.toString()
      progressBar.value = audio.currentTime.toString()
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="absolute top-4 right-4 opacity-20">
        <Music className="w-6 h-6 text-purple-300" />
      </div>

      <audio id="audio" src="music.mp3" ref={audioRef} onTimeUpdate={updateProgress} className="hidden" />

      <div className="space-y-4">
        {/* Player controls container */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.button
              onClick={togglePlayPause}
              className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-full p-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </span>
            </motion.button>
          </div>

          {/* Progress bar container */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  className="w-full h-2 bg-gray-800/50 rounded-full appearance-none cursor-pointer slider relative z-10"
                  type="range"
                  id="progressBar"
                  defaultValue="0"
                  max="100"
                  onInput={controlSong}
                  style={{
                    background: "linear-gradient(to right, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                    outline: "none",
                  }}
                />

                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Now playing indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-gray-300 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
                animate={{
                  height: isPlaying ? [4, 12, 4] : 4,
                }}
                transition={{
                  duration: 0.8,
                  repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <span className="font-medium text-xs">{isPlaying ? "Now Playing" : "Ready to Play"}</span>
        </motion.div>
      </div>
    </div>
  )
}

export default MusicPlayer;