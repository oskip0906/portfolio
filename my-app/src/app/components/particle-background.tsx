"use client"
import { motion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  type: 'orb' | 'star' | 'dot'
  color: string
  delay: number
  duration: number
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false)

  const colors = useMemo(() => [
    '#60a5fa', // blue-400
    '#a78bfa', // violet-400
    '#c084fc', // purple-400
    '#e879f9', // fuchsia-400
    '#06b6d4', // cyan-500
    '#ffffff', // white
  ], [])

  // Generate particles only once, using percentages for responsive positioning
  const particles = useMemo(() => {
    const newParticles: Particle[] = []

    // Create floating orbs (reduced from 6 to 4)
    for (let i = 0; i < 4; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 30,
        opacity: Math.random() * 0.15 + 0.05,
        type: 'orb',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 3
      })
    }

    // Create twinkling stars (reduced from 44 to 20)
    for (let i = 4; i < 24; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        type: 'star',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2
      })
    }

    // Create glowing dots (reduced from 50 to 20)
    for (let i = 24; i < 44; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        type: 'dot',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 4,
        duration: 3.5 + Math.random() * 2
      })
    }

    return newParticles
  }, [colors])

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map(particle => {
        if (particle.type === 'orb') {
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full blur-md"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${particle.color}30 0%, ${particle.color}10 70%, transparent 100%)`,
                willChange: 'transform, opacity',
              }}
              animate={{
                opacity: [particle.opacity * 0.3, particle.opacity * 1.2, particle.opacity * 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: particle.duration,
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
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                willChange: 'transform, opacity',
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: particle.duration,
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
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 4px ${particle.color}40`,
                willChange: 'transform, opacity',
              }}
              animate={{
                opacity: [particle.opacity * 0.4, particle.opacity * 1.3, particle.opacity * 0.4],
                scale: [0.6, 1.4, 0.6],
              }}
              transition={{
                duration: particle.duration,
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
