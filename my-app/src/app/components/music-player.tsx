"use client"
import type React from "react"
import { useState, useRef, useCallback, memo, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Music } from "lucide-react"

const MusicPlayer: React.FC = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLInputElement>(null)

  const updateProgress = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }, [])

  const controlSong = useCallback(() => {
    if (audioRef.current && progressRef.current) {
      const newTime = parseFloat(progressRef.current.value)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('timeupdate', updateProgress)
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('timeupdate', updateProgress)
      }
    }
  }, [handleLoadedMetadata, handleEnded, updateProgress])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="absolute top-4 right-4 opacity-20">
        <Music className="w-6 h-6 text-purple-300" />
      </div>

      <audio 
        ref={audioRef}
        src="music.mp3" 
        preload="metadata"
        className="hidden" 
      />

      <div className="space-y-4">
        {/* Player controls container */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.button
              onClick={togglePlayPause}
              className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-full p-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? "Pause music" : "Play music"}
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
                  ref={progressRef}
                  value={currentTime}
                  max={duration || 100}
                  onChange={controlSong}
                  style={{
                    background: "linear-gradient(to right, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                    outline: "none",
                  }}
                  aria-label="Music progress"
                />

                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm pointer-events-none" />
              </div>
              
              {/* Time display */}
              <div className="text-xs text-gray-400 min-w-[60px] text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

MusicPlayer.displayName = 'MusicPlayer'

export default MusicPlayer;