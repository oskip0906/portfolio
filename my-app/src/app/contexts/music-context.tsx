"use client"
import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react"

interface MusicContextType {
  // Audio state
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  currentSong: string | null

  // Audio controls
  togglePlayPause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  changeSong: (songPath: string) => void

  // Audio ref (for direct access if needed)
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [currentSong, setCurrentSong] = useState<string | null>(null)

  // Audio event handlers with useCallback for stability
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleDurationChange = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  const handleError = useCallback((e: Event) => {
    const audio = e.target as HTMLAudioElement
    if (audio.error) {
      // MEDIA_ERR_ABORTED = 1 - Ignore abort errors, they're expected when changing songs quickly
      if (audio.error.code === 1) {
        // Silently handle abort - this is normal when switching songs
        return
      }
      // Log other errors for debugging
      console.warn('Audio error:', audio.error.code, audio.error.message)
    }
  }, [])

  // Control functions
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch((error) => {
          // Ignore abort errors - they're expected when changing songs
          if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error('Error playing audio:', error)
          }
        })
        setIsPlaying(true)
      }
    }
  }, [isPlaying])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol
      setVolumeState(vol)
    }
  }, [])

  const changeSong = useCallback((songPath: string) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying
      
      // Pause and reset current playback to prevent abort errors
      audioRef.current.pause()
      setIsPlaying(false)
      setCurrentTime(0)
      
      // Change source and load new song
      audioRef.current.src = songPath
      setCurrentSong(songPath)
      
      // Use a small delay to ensure previous load is aborted before starting new one
      // This prevents the abort error from being thrown
      setTimeout(() => {
        if (audioRef.current && audioRef.current.src === songPath) {
          audioRef.current.load()
          if (wasPlaying) {
            audioRef.current.play().catch((error) => {
              // Ignore abort errors when playing
              if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.error('Error playing audio:', error)
              }
            })
            setIsPlaying(true)
          }
        }
      }, 0)
    }
  }, [isPlaying])

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('durationchange', handleDurationChange)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      // Force load metadata if already loaded
      if (audio.readyState >= 1 && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      } else {
        audio.load()
      }

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('durationchange', handleDurationChange)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleDurationChange, handleEnded, handleError])

  const value: MusicContextType = {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentSong,
    togglePlayPause,
    seek,
    setVolume,
    changeSong,
    audioRef
  }

  return (
    <MusicContext.Provider value={value}>
      {/* CRITICAL: Audio element lives here in the root, never unmounts */}
      <audio
        ref={audioRef}
        src={currentSong ?? undefined}
        preload="metadata"
        className="hidden"
      />
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}
