"use client"
import { useBackground } from "../contexts/background-context"
import NavBar from "./navbar"
import ParticleBackground from "./particle-background"
import DynamicBackground from "./dynamic-background"
import Timeline from "./timeline"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { bottomColor, isLoaded } = useBackground()

  return (
    <>
      {/* Shared background across all pages */}
      <DynamicBackground />
      <ParticleBackground />

      {/* Vertical decorative patterns */}
      <div className="decorative-pattern-left" aria-hidden="true" />
      <div className="decorative-pattern-right" aria-hidden="true" />

      {/* Fixed Navigation - Always at top */}
      <NavBar />

      {/* Scrollable Page Content with padding for fixed navbar */}
      <main className="relative z-10 pt-20 min-h-screen flex justify-center overflow-y-auto">
        <div className="w-full px-4" style={{ maxWidth: "75vw" }}>
          {children}
        </div>
      </main>

      {/* Gradient fade at bottom to smooth transition with timeline */}
      {isLoaded && (
        <div
          className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-40"
          style={{
            background: `linear-gradient(to top, ${bottomColor} 0%, transparent 100%)`
          }}
        />
      )}

      {/* Fixed timeline */}
      <Timeline />
    </>
  )
}
