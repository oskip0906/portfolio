"use client"
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
  const [screenArea, setScreenArea] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const colors = useMemo(() => [
    '#60a5fa',
    '#a78bfa',
    '#c084fc',
    '#e879f9',
    '#06b6d4',
    '#ffffff',
  ], [])

  useEffect(() => {
    const update = () => setScreenArea(window.innerWidth * window.innerHeight)
    update()
    setMounted(true)
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Scale particle counts linearly with screen area.
  // Reference: 1920×1080 (~2M px²) → orbs:10, stars:60, dots:50
  const particles = useMemo(() => {
    const newParticles: Particle[] = []
    const scale = Math.min(screenArea / 2_073_600, 1.5) // cap at 1.5× for very large screens
    const orbCount  = Math.round(scale * 10)
    const starCount = Math.round(scale * 60)
    const dotCount  = Math.round(scale * 50)

    // Create floating orbs
    for (let i = 0; i < orbCount; i++) {
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

    // Create twinkling stars
    for (let i = orbCount; i < orbCount + starCount; i++) {
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

    // Create glowing dots
    for (let i = orbCount + starCount; i < orbCount + starCount + dotCount; i++) {
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
  }, [colors, screenArea])

  if (!mounted) return null

  // Static particles for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {particles.slice(0, 10).map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.type === 'orb' ? 'transparent' : particle.color,
              background: particle.type === 'orb'
                ? `radial-gradient(circle, ${particle.color}20 0%, transparent 70%)`
                : undefined,
              opacity: particle.opacity * 0.5,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <style jsx>{`
        @keyframes pulse-orb {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
      {particles.map(particle => {
        if (particle.type === 'orb') {
          return (
            <div
              key={particle.id}
              className="absolute rounded-full blur-md"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${particle.color}30 0%, ${particle.color}10 70%, transparent 100%)`,
                animation: `pulse-orb ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              }}
            />
          )
        }

        if (particle.type === 'star') {
          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
                animation: `twinkle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              }}
            />
          )
        }

        if (particle.type === 'dot') {
          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 4px ${particle.color}40`,
                animation: `glow ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              }}
            />
          )
        }

        return null
      })}
    </div>
  )
}
