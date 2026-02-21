"use client"
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface BackgroundContextType {
  baseColor: string
  setBaseColor: (color: string) => void
  resetColor: () => void
  gradientStyle: string
}

const DEFAULT_COLOR = '#581c87'
const STORAGE_KEY = 'portfolio-background-color'

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

// Convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

// Generate gradient from a single color
function generateGradient(hex: string): string {
  const { h, s } = hexToHsl(hex)
  // Dark top, vibrant middle (user color), dark bottom
  const darkColor = `hsl(${h}, ${Math.min(s, 30)}%, 8%)`
  const midColor = `hsl(${h}, ${s}%, 25%)`
  const bottomColor = `hsl(${h}, ${Math.min(s, 20)}%, 6%)`

  return `linear-gradient(to bottom right, ${darkColor}, ${midColor}, ${bottomColor})`
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

  const gradientStyle = generateGradient(baseColor)

  return (
    <BackgroundContext.Provider value={{ baseColor, setBaseColor, resetColor, gradientStyle }}>
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
