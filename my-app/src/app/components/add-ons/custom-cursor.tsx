"use client"
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOverNavbar, setIsOverNavbar] = useState(false)

  useEffect(() => {
    // Check if device supports hover (desktop) or is touch-only (mobile)
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const hasHover = window.matchMedia('(hover: hover)').matches
      setIsMobile(isTouchDevice && !hasHover)
    }

    checkIfMobile()

    // Only set up mouse events if not on mobile
    if (!isMobile) {
      const updateCursor = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY })
      }

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        
        // Check if we're over the navbar/draggable elements
        const isDraggableElement = target.closest('.react-draggable')
        setIsOverNavbar(!!isDraggableElement)
        
        if (!isDraggableElement && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('cursor-pointer'))) {
          setIsHovering(true)
        } else {
          setIsHovering(false)
        }
      }

      document.addEventListener('mousemove', updateCursor)
      document.addEventListener('mouseover', handleMouseOver)

      return () => {
        document.removeEventListener('mousemove', updateCursor)
        document.removeEventListener('mouseover', handleMouseOver)
      }
    }
  }, [isMobile])

  // Don't render custom cursor on mobile devices or when over navbar
  if (isMobile || isOverNavbar) {
    return null
  }

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{
        left: `${position.x - 10}px`,
        top: `${position.y - 10}px`,
      }}
    />
  )
}