"use client"
import { motion } from "framer-motion"
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver"
import { ReactNode } from "react"

interface FadeInSectionProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  className?: string
  threshold?: number
  rootMargin?: string
}

export default function FadeInSection({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -200px 0px'
}: FadeInSectionProps) {
  const { elementRef, isInView } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      scale: direction === 'scale' ? 0.8 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }

  return (
    <motion.div
      ref={elementRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
} 