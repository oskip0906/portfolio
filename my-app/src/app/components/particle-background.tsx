"use client"
import { motion } from "framer-motion"
import { useEffect, useState, useMemo, useCallback, useRef } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  type: 'orb' | 'star' | 'dot'
  color: string
  delay: number
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  const colors = useMemo(() => [
    '#60a5fa', // blue-400
    '#a78bfa', // violet-400
    '#c084fc', // purple-400
    '#e879f9', // fuchsia-400
    '#06b6d4', // cyan-500
    '#ffffff', // white
  ], [])

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize particles
  useEffect(() => {
    if (!mounted) return

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    const newParticles: Particle[] = []

    // Create floating orbs
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 50 + 30,
        opacity: Math.random() * 0.15 + 0.05,
        type: 'orb',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3
      })
    }

    // Create twinkling stars
    for (let i = 6; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        type: 'star',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2
      })
    }

    // Create glowing dots
    for (let i = 50; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        type: 'dot',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 4
      })
    }

    setParticles(newParticles)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [colors, mounted])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">

      {/* Static Flashing Particles */}
      {particles.map(particle => {
        if (particle.type === 'orb') {
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full blur-md"
              style={{
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${particle.color}30 0%, ${particle.color}10 70%, transparent 100%)`,
                zIndex: 1,
              }}
              animate={{
                opacity: [particle.opacity * 0.3, particle.opacity * 1.2, particle.opacity * 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          )
        }

        if (particle.type === 'star') {
          return (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: particle.x,
                top: particle.y,
                zIndex: 2,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 8px ${particle.color}`,
                }}
              />
            </motion.div>
          )
        }

        if (particle.type === 'dot') {
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                zIndex: 2,
                boxShadow: `0 0 4px ${particle.color}40`,
              }}
              animate={{
                opacity: [particle.opacity * 0.4, particle.opacity * 1.3, particle.opacity * 0.4],
                scale: [0.6, 1.4, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          )
        }

        return null
      })}
    </div>
  )
}