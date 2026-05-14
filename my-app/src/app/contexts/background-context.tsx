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
    roomFloorColor: string
    roomFloorDarkColor: string
    roomPillarColor: string
    roomPillarAccentColor: string
  }
  // Room surface overrides
  wallColor: string
  setWallColor: (color: string) => void
  resetWallColor: () => void
  ceilingColor: string
  setCeilingColor: (color: string) => void
  resetCeilingColor: () => void
  floorColor: string
  setFloorColor: (color: string) => void
  resetFloorColor: () => void
  isLoaded: boolean
}

const DEFAULT_COLOR = '#2d6a2d'
const STORAGE_KEY = 'portfolio-background-color'

// Room surface defaults (matching hardcoded values in room-scene.tsx)
const DEFAULT_WALL_COLOR    = '#F0E8DA'
const DEFAULT_CEILING_COLOR = '#F0E8DA'
const DEFAULT_FLOOR_COLOR   = '#D4C0A4'
const STORAGE_WALL_KEY    = 'portfolio-room-wall-color'
const STORAGE_CEILING_KEY = 'portfolio-room-ceiling-color'
const STORAGE_FLOOR_KEY   = 'portfolio-room-floor-color'

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
  const roomFloorColor = `hsl(${h}, ${Math.min(55, Math.max(30, s * 0.75))}%, 38%)`
  const roomFloorDarkColor = `hsl(${h}, ${Math.min(50, Math.max(25, s * 0.7))}%, 28%)`
  const roomPillarColor = `hsl(${h}, ${Math.min(45, Math.max(20, s * 0.6))}%, 62%)`
  const roomPillarAccentColor = `hsl(${h}, ${Math.min(55, Math.max(28, s * 0.68))}%, 46%)`

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
      roomFloorColor,
      roomFloorDarkColor,
      roomPillarColor,
      roomPillarAccentColor,
    }
  }
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [baseColor, setBaseColorState] = useState(DEFAULT_COLOR)
  const [wallColor, setWallColorState] = useState(DEFAULT_WALL_COLOR)
  const [ceilingColor, setCeilingColorState] = useState(DEFAULT_CEILING_COLOR)
  const [floorColor, setFloorColorState] = useState(DEFAULT_FLOOR_COLOR)
  const [mounted, setMounted] = useState(false)

  // Load saved colors from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setBaseColorState(saved)
    const savedWall = localStorage.getItem(STORAGE_WALL_KEY)
    if (savedWall) setWallColorState(savedWall)
    const savedCeiling = localStorage.getItem(STORAGE_CEILING_KEY)
    if (savedCeiling) setCeilingColorState(savedCeiling)
    const savedFloor = localStorage.getItem(STORAGE_FLOOR_KEY)
    if (savedFloor) setFloorColorState(savedFloor)
  }, [])

  // Persist colors to localStorage
  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, baseColor)
  }, [baseColor, mounted])
  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_WALL_KEY, wallColor)
  }, [wallColor, mounted])
  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_CEILING_KEY, ceilingColor)
  }, [ceilingColor, mounted])
  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_FLOOR_KEY, floorColor)
  }, [floorColor, mounted])

  const setBaseColor = useCallback((color: string) => { setBaseColorState(color) }, [])
  const resetColor = useCallback(() => { setBaseColorState(DEFAULT_COLOR) }, [])

  const setWallColor = useCallback((color: string) => { setWallColorState(color) }, [])
  const resetWallColor = useCallback(() => { setWallColorState(DEFAULT_WALL_COLOR) }, [])

  const setCeilingColor = useCallback((color: string) => { setCeilingColorState(color) }, [])
  const resetCeilingColor = useCallback(() => { setCeilingColorState(DEFAULT_CEILING_COLOR) }, [])

  const setFloorColor = useCallback((color: string) => { setFloorColorState(color) }, [])
  const resetFloorColor = useCallback(() => { setFloorColorState(DEFAULT_FLOOR_COLOR) }, [])

  const { gradientStyle, bottomColor, roomTheme } = generateBackgroundStyles(baseColor)

  return (
    <BackgroundContext.Provider value={{
      baseColor, setBaseColor, resetColor,
      gradientStyle, bottomColor, roomTheme,
      wallColor, setWallColor, resetWallColor,
      ceilingColor, setCeilingColor, resetCeilingColor,
      floorColor, setFloorColor, resetFloorColor,
      isLoaded: mounted,
    }}>
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
