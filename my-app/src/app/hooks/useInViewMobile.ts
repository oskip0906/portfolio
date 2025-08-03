"use client"
import { useInView } from "framer-motion"
import { useEffect, useState } from "react"

export function useInViewMobile(ref: React.RefObject<Element | null>) {
  const [isMobile, setIsMobile] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Standard intersection observer for desktop
  const inViewDesktop = useInView(ref, {
    once: true,
    amount: 0.05,
    margin: "0px 0px -20% 0px"
  })

  // More aggressive settings for mobile
  const inViewMobile = useInView(ref, {
    once: true,
    amount: 0.01,
    margin: "0px 0px -10% 0px"
  })

  // Fallback: if we're on mobile and nothing has triggered after a delay, show anyway
  useEffect(() => {
    if (isMobile && !hasAnimated) {
      const timer = setTimeout(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0
          if (isVisible) {
            setHasAnimated(true)
          }
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isMobile, hasAnimated, ref])

  const inView = isMobile ? (inViewMobile || hasAnimated) : inViewDesktop

  useEffect(() => {
    if (inView) {
      setHasAnimated(true)
    }
  }, [inView])

  return inView
}