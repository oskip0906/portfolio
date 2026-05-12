"use client"
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { hexToHsl } from "@/lib/utils"

interface BackgroundContextType {
  baseColor: string
  setBaseColor: (color: string) => void
  resetColor: () => void
  gradientStyle: string
  bottomColor: string
  roomTheme: {
    wallTint: string
    floorTint: string
    emissiveAccent: string
    fogColor: string
    uiAccent: string
    uiAccentSoft: string
    metalTint: string
    shadowColor: string
  }
  isLoaded: boolean
}

const DEFAULT_COLOR = '#eee9f1ff'
const STORAGE_KEY = 'portfolio-background-color'

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

// Generate gradient and colors from a single color
function generateBackgroundStyles(hex: string): {
  gradientStyle: string
  bottomColor: string
  roomTheme: BackgroundContextType["roomTheme"]
} {
  const { h, s, l } = hexToHsl(hex)
  // Dark top, vibrant middle (user color), dark bottom
  const darkColor = `hsl(${h}, ${Math.min(s, 30)}%, 8%)`
  const midColor = `hsl(${h}, ${s}%, 25%)`
  const bottomColor = `hsl(${h}, ${Math.min(s, 20)}%, 6%)`
  const wallTint = `hsl(${h}, ${Math.max(14, Math.min(s * 0.55, 28))}%, 17%)`
  const floorTint = `hsl(${h}, ${Math.max(10, Math.min(s * 0.45, 22))}%, 10%)`
  const emissiveAccent = `hsl(${h}, ${Math.min(90, s + 14)}%, ${Math.max(58, l * 0.92)}%)`
  const fogColor = `hsl(${h}, ${Math.max(12, Math.min(s * 0.4, 22))}%, 11%)`
  const uiAccent = `hsl(${h}, ${Math.min(90, s + 12)}%, 72%)`
  const uiAccentSoft = `hsla(${h}, ${Math.min(84, s + 6)}%, 72%, 0.18)`
  const metalTint = `hsl(${h}, ${Math.max(8, Math.min(s * 0.35, 18))}%, 56%)`
  const shadowColor = `hsla(${h}, ${Math.max(10, Math.min(s * 0.55, 26))}%, 6%, 0.55)`

  return {
    gradientStyle: `linear-gradient(to bottom right, ${darkColor}, ${midColor}, ${bottomColor})`,
    bottomColor,
    roomTheme: {
      wallTint,
      floorTint,
      emissiveAccent,
      fogColor,
      uiAccent,
      uiAccentSoft,
      metalTint,
      shadowColor,
    }
  }
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [baseColor, setBaseColorState] = useState(DEFAULT_COLOR)
  const [mounted, setMounted] = useState(false)

  // Load saved color from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setBaseColorState(saved)
    }
  }, [])

  // Save color to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, baseColor)
    }
  }, [baseColor, mounted])

  const setBaseColor = useCallback((color: string) => {
    setBaseColorState(color)
  }, [])

  const resetColor = useCallback(() => {
    setBaseColorState(DEFAULT_COLOR)
  }, [])

  const { gradientStyle, bottomColor, roomTheme } = generateBackgroundStyles(baseColor)

  return (
    <BackgroundContext.Provider value={{ baseColor, setBaseColor, resetColor, gradientStyle, bottomColor, roomTheme, isLoaded: mounted }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}
