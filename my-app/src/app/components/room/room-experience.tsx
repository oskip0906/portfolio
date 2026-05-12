"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import RoomFallback from "./room-fallback"
import RoomOverlay from "./room-overlay"
import type { RoomHomePayload, RoomObjectId } from "./room-manifest"

const RoomCanvas = dynamic(() => import("./room-canvas"), {
  ssr: false,
})

export default function RoomExperience({ payload }: { payload: RoomHomePayload }) {
  const [fallback, setFallback] = useState(false)
  const [focusedId, setFocusedId] = useState<RoomObjectId | null>(null)
  const [hoveredId, setHoveredId] = useState<RoomObjectId | null>(null)

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

  if (fallback) {
    return <RoomFallback payload={payload} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <RoomCanvas
        payload={payload}
        focusedId={focusedId}
        hoveredId={hoveredId}
        onFocusChange={setFocusedId}
        onHoverChange={setHoveredId}
      />
      <RoomOverlay
        payload={payload}
        focusedId={focusedId}
        hoveredId={hoveredId}
        onFocusChange={setFocusedId}
        onReset={() => setFocusedId(null)}
      />
    </div>
  )
}
