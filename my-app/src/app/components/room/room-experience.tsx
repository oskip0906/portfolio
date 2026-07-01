"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import RoomFallback from "./room-fallback"
import RoomOverlay from "./room-overlay"
import type { RoomHomePayload, RoomObjectId } from "./room-manifest"

const RoomCanvas = dynamic(() => import("./room-canvas"), {
  ssr: false,
})

function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a1a] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}
    >
      {/* Boba cup silhouette */}
      <div className="mb-8 flex flex-col items-center gap-0">
        {/* Straw */}
        <div className="w-1.5 h-10 rounded-full bg-[#d4aa70]/60 mb-[-4px]" />
        {/* Lid */}
        <div className="w-16 h-3 rounded-t-full bg-[#d4aa70]/50" />
        {/* Cup body */}
        <div className="w-14 h-20 rounded-b-2xl bg-[#d4aa70]/30 border border-[#d4aa70]/40 flex items-end justify-center pb-3">
          {/* Pearls */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7a4a20]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#7a4a20]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#7a4a20]/70" />
          </div>
        </div>
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#d4aa70]/70"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <p className="text-[#d4aa70]/60 text-sm tracking-widest uppercase">
        Opening the teahouse…
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default function RoomExperience({ payload }: { payload: RoomHomePayload }) {
  const [fallback, setFallback] = useState(false)
  const [focusedId, setFocusedId] = useState<RoomObjectId | null>(null)
  const [hoveredId, setHoveredId] = useState<RoomObjectId | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const canvas = document.createElement("canvas")
    const supportsWebgl = Boolean(
      canvas.getContext("webgl")
      || canvas.getContext("experimental-webgl")
      || canvas.getContext("webgl2")
    )
    if (!supportsWebgl || prefersReducedMotion) {
      setFallback(true)
    }
  }, [])

  const handleReady = useCallback(() => setVisible(true), [])

  if (fallback) {
    return <RoomFallback payload={payload} />
  }

  return (
    <>
      <LoadingScreen visible={!visible} />
      <div
        className="relative min-h-screen overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1.2s ease" }}
      >
        <RoomCanvas
          payload={payload}
          focusedId={focusedId}
          hoveredId={hoveredId}
          onFocusChange={setFocusedId}
          onHoverChange={setHoveredId}
          onReady={handleReady}
        />
        <RoomOverlay
          payload={payload}
          focusedId={focusedId}
          hoveredId={hoveredId}
          onFocusChange={setFocusedId}
          onReset={() => setFocusedId(null)}
        />
      </div>
    </>
  )
}
