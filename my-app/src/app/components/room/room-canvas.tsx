"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import RoomScene from "./room-scene"
import type { RoomHomePayload, RoomObjectId } from "./room-manifest"

const ORBIT_CENTER_Y = 1.0
const ORBIT_LOOKAT = new THREE.Vector3(0, 3.0, 0)
const RADIUS_MIN = 3
const RADIUS_MAX = 18

export default function RoomCanvas({
  payload,
  focusedId,
  hoveredId,
  onFocusChange,
  onHoverChange,
}: {
  payload: RoomHomePayload
  focusedId: RoomObjectId | null
  hoveredId: RoomObjectId | null
  onFocusChange: (id: RoomObjectId | null) => void
  onHoverChange: (id: RoomObjectId | null) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  // theta = horizontal azimuth, phi = vertical elevation, radius = distance from centre
  const orbitRef = useRef({ theta: 0, phi: 0.15, radius: 18 })
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 })

  const primaryIds = useMemo(
    () => payload.objects.map((o) => o.id),
    [payload.objects]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = (event.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (event.key === "Escape") { onFocusChange(null); return }
      if (/^[1-8]$/.test(event.key)) {
        const dest = primaryIds[Number(event.key) - 1]
        if (dest) onFocusChange(dest)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onFocusChange, primaryIds])

  // Scroll-wheel zoom (non-passive so we can preventDefault)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (focusedId) return
      orbitRef.current.radius = THREE.MathUtils.clamp(
        orbitRef.current.radius + e.deltaY * 0.012,
        RADIUS_MIN,
        RADIUS_MAX
      )
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [focusedId])

  // Pinch-to-zoom for touch devices
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let lastDist = 0

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        lastDist = Math.sqrt(dx * dx + dy * dy)
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      orbitRef.current.radius = THREE.MathUtils.clamp(
        orbitRef.current.radius - (dist - lastDist) * 0.04,
        RADIUS_MIN,
        RADIUS_MAX
      )
      lastDist = dist
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-screen w-full select-none touch-none cursor-grab"
      onPointerDown={(e) => {
        if (focusedId) return
        dragRef.current.active = true
        dragRef.current.lastX = e.clientX
        dragRef.current.lastY = e.clientY
        if (containerRef.current) containerRef.current.style.cursor = "grabbing"
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.active || focusedId) return
        const deltaX = e.clientX - dragRef.current.lastX
        const deltaY = e.clientY - dragRef.current.lastY
        dragRef.current.lastX = e.clientX
        dragRef.current.lastY = e.clientY
        orbitRef.current.theta += deltaX * 0.004
        orbitRef.current.phi = THREE.MathUtils.clamp(
          orbitRef.current.phi - deltaY * 0.003,
          -0.15,
          1.35
        )
      }}
      onPointerUp={() => {
        dragRef.current.active = false
        if (containerRef.current) containerRef.current.style.cursor = "grab"
      }}
      onPointerLeave={() => {
        dragRef.current.active = false
        if (containerRef.current) containerRef.current.style.cursor = "grab"
      }}
    >
      <Canvas
        dpr={1}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [12.2, 6.0, 12.2], fov: 62, near: 0.1, far: 60 }}
        onPointerMissed={() => onHoverChange(null)}
      >
        <Suspense fallback={null}>
          <CameraController
            payload={payload}
            focusedId={focusedId}
            orbitRef={orbitRef}
          />
          <RoomScene
            payload={payload}
            focusedId={focusedId}
            hoveredId={hoveredId}
            onFocusChange={onFocusChange}
            onHoverChange={onHoverChange}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function CameraController({
  payload,
  focusedId,
  orbitRef,
}: {
  payload: RoomHomePayload
  focusedId: RoomObjectId | null
  orbitRef: React.MutableRefObject<{ theta: number; phi: number; radius: number }>
}) {
  const { camera } = useThree()
  const lookTargetRef = useRef(ORBIT_LOOKAT.clone())
  const focusLookup = useMemo(
    () => Object.fromEntries(payload.objects.map((o) => [o.id, o])),
    [payload.objects]
  )
  const desiredPos = useRef(new THREE.Vector3())
  const desiredLook = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    if (focusedId) {
      const obj = focusLookup[focusedId]
      desiredPos.current.fromArray(obj.cameraPosition)
      desiredLook.current.fromArray(obj.target)
    } else {
      const { theta, phi, radius } = orbitRef.current
      const cosPhi = Math.cos(phi)
      desiredPos.current.set(
        Math.sin(theta) * cosPhi * radius,
        Math.sin(phi) * radius + ORBIT_CENTER_Y,
        Math.cos(theta) * cosPhi * radius
      )
      desiredLook.current.copy(ORBIT_LOOKAT)
    }

    const easing = 1 - Math.exp(-delta * 3.2)
    camera.position.lerp(desiredPos.current, easing)
    lookTargetRef.current.lerp(desiredLook.current, easing)
    camera.lookAt(lookTargetRef.current)
  })

  return null
}
