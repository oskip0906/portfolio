"use client"
import { useBackground } from "../contexts/background-context"

export default function DynamicBackground() {
  const { gradientStyle } = useBackground()

  return (
    <div
      className="fixed inset-0 -z-20 transition-all duration-500"
      style={{ background: gradientStyle }}
    />
  )
}
