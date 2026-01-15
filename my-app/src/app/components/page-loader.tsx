"use client"
import { useEffect, useState } from "react"
import LoadingSpinner from "./loading-spinner"

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for page to be fully loaded
    const handleLoad = () => {
      // Add a small delay for smooth transition
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}
