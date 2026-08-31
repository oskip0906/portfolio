"use client"

import { memo, useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Billboard, Text } from "@react-three/drei"
import * as THREE from "three"
import { useBackground } from "@/app/contexts/background-context"
import { labelScale } from "@/lib/utils"
import type { Group } from "three"
import type { RoomHomePayload, RoomObjectId, RoomObjectManifest } from "./room-manifest"

interface RoomSceneProps {
  payload: RoomHomePayload
  focusedId: RoomObjectId | null
  hoveredId: RoomObjectId | null
  onFocusChange: (id: RoomObjectId | null) => void
  onHoverChange: (id: RoomObjectId | null) => void
}

export default function RoomScene({
  payload,
  focusedId,
  hoveredId,
  onFocusChange,
  onHoverChange,
}: RoomSceneProps) {
  const handleObjectClick = (object: RoomObjectManifest) => {
    onFocusChange(object.id)
  }

  return (
    <>
      {/* ── Warm tea-shop lighting — few lights = cheap fragment shading ── */}
      <ambientLight intensity={0.9} color="#FFF4E0" />
      <hemisphereLight intensity={0.65} color="#FFE8C0" groundColor="#5A3820" />
      <pointLight position={[0, 5.4, 1]} intensity={22} color="#FFD898" distance={26} />
      <pointLight position={[0, 4.2, -4.5]} intensity={9} color="#FFDCA0" distance={18} />

      <TeaShopRoom />

      {payload.objects.map((object) => {
        const isFocused = object.id === focusedId
        const isHovered = object.id === hoveredId
        const isActive = isFocused || isHovered

        return (
          <CupShell
            key={object.id}
            object={object}
            active={isActive}
            hovered={isHovered}
            onFocus={() => handleObjectClick(object)}
            onHoverChange={onHoverChange}
          >
            <BobaCup
              liquidColor={object.color}
              pearlColor={object.pearlColor}
              active={isActive}
            />
          </CupShell>
        )
      })}
    </>
  )
}

/* ─── Tea Shop Room ──────────────────────────────────────────── */

const TeaShopRoom = memo(function TeaShopRoom() {
  const { wallColor, ceilingColor, floorColor } = useBackground()
  const { gl } = useThree()

  // Procedural wood-plank texture — generated on a canvas from the theme's
  // floor colour, so there is nothing to download and theme switches still work.
  const floorTexture = useMemo(() => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const base = new THREE.Color(floorColor)
    const plankH = size / 8
    for (let i = 0; i < 8; i++) {
      // Deterministic per-plank shade variation
      const shade = 0.82 + ((i * 37) % 5) * 0.055
      ctx.fillStyle = `#${base.clone().multiplyScalar(shade).getHexString()}`
      ctx.fillRect(0, i * plankH, size, plankH)

      // Subtle grain streaks
      ctx.strokeStyle = "rgba(0,0,0,0.07)"
      ctx.lineWidth = 1
      for (let g = 0; g < 6; g++) {
        const y = i * plankH + ((g * 53 + i * 17) % plankH)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(size * 0.3, y + 2, size * 0.6, y - 2, size, y + 1)
        ctx.stroke()
      }

      // Plank seam + staggered end joint
      ctx.fillStyle = "rgba(0,0,0,0.22)"
      ctx.fillRect(0, i * plankH, size, 2)
      ctx.fillRect((i * 149) % size, i * plankH, 2, plankH)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 3)
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [floorColor, gl])

  // Procedural plaster-panel texture for the ceiling, tinted by the theme's
  // ceiling colour — subtle speckle grain plus faint panel seams.
  const ceilingTexture = useMemo(() => {
    const size = 256
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const fract = (v: number) => v - Math.floor(v)
    ctx.fillStyle = `#${new THREE.Color(ceilingColor).getHexString()}`
    ctx.fillRect(0, 0, size, size)

    // Deterministic speckle grain
    for (let i = 0; i < 500; i++) {
      const x = fract(Math.sin(i * 12.9898) * 43758.5453) * size
      const y = fract(Math.sin(i * 78.233) * 12543.123) * size
      const light = fract(Math.sin(i * 3.7) * 937.31) > 0.5
      ctx.fillStyle = light ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
      ctx.fillRect(x, y, 2, 2)
    }

    // Panel seams along the tile edges — tiling turns these into a grid
    ctx.strokeStyle = "rgba(0,0,0,0.09)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 1)
    ctx.lineTo(size, 1)
    ctx.moveTo(1, 0)
    ctx.lineTo(1, size)
    ctx.stroke()

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(6, 6)
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [ceilingColor, gl])

  useEffect(() => () => { floorTexture?.dispose() }, [floorTexture])
  useEffect(() => () => { ceilingTexture?.dispose() }, [ceilingTexture])

  // Refined wood palette
  const COUNTER_DARK = "#2A1608"
  const COUNTER_WOOD = "#3A220E"
  const COUNTER_TOP = "#5A3418"
  const TABLE_WOOD = "#8A5C28"
  const TABLE_TOP = "#A07040"
  const WALL_UPPER = wallColor
  const CEILING_COLOR = ceilingColor
  const PLANK_A = floorColor
  const PENDANT_BRASS = "#B8944C"
  const CHALKBOARD_FRAME = "#5A3C1E"
  const CHALKBOARD = "#1A2E18"
  const CHALKBOARD_INNER = "#142210"

  return (
    <group>
      {/* ═══════════════════════════════════════════════
          FLOOR — single slab with a procedural plank texture
         ═══════════════════════════════════════════════ */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[22, 0.08, 20]} />
        <meshStandardMaterial
          map={floorTexture ?? undefined}
          color={floorTexture ? "#FFFFFF" : PLANK_A}
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* ═══════════════════════════════════════════════
          CEILING — textured plaster panels, no beams
         ═══════════════════════════════════════════════ */}
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[22, 0.15, 20]} />
        <meshStandardMaterial
          map={ceilingTexture ?? undefined}
          color={ceilingTexture ? "#FFFFFF" : CEILING_COLOR}
          roughness={0.92}
        />
      </mesh>

      {/* ═══════════════════════════════════════════════
          WALLS — bare plaster, nothing mounted on them
         ═══════════════════════════════════════════════ */}
      <mesh position={[0, 3.0, -9.8]}>
        <boxGeometry args={[21.6, 6.0, 0.3]} />
        <meshStandardMaterial color={WALL_UPPER} roughness={0.88} />
      </mesh>
      <mesh position={[0, 3.0, 9.8]}>
        <boxGeometry args={[21.6, 6.0, 0.3]} />
        <meshStandardMaterial color={WALL_UPPER} roughness={0.88} />
      </mesh>
      <mesh position={[-10.5, 3.0, 0]}>
        <boxGeometry args={[0.3, 6.0, 19.9]} />
        <meshStandardMaterial color={WALL_UPPER} roughness={0.88} />
      </mesh>
      <mesh position={[10.5, 3.0, 0]}>
        <boxGeometry args={[0.3, 6.0, 19.9]} />
        <meshStandardMaterial color={WALL_UPPER} roughness={0.88} />
      </mesh>

      {/* ═══════════════════════════════════════════════
          FAKE WINDOWS — one 4-tile window per wall
         ═══════════════════════════════════════════════ */}
      <FakeWindow position={[0, 3.6, -9.62]} rotationY={0} />
      <FakeWindow position={[0, 3.6, 9.62]} rotationY={Math.PI} />
      <FakeWindow position={[-10.32, 3.6, 0]} rotationY={Math.PI / 2} />
      <FakeWindow position={[10.32, 3.6, 0]} rotationY={-Math.PI / 2} />

      {/* ═══════════════════════════════════════════════
          BACK COUNTER — enhanced with shelving
         ═══════════════════════════════════════════════ */}
      {/* Counter body */}
      <mesh position={[0, 0.48, -5.2]}>
        <boxGeometry args={[10.5, 0.96, 1.4]} />
        <meshStandardMaterial color={COUNTER_WOOD} roughness={0.72} metalness={0.06} />
      </mesh>
      {/* Counter top surface */}
      <mesh position={[0, 0.97, -5.2]}>
        <boxGeometry args={[10.8, 0.06, 1.5]} />
        <meshStandardMaterial color={COUNTER_TOP} roughness={0.45} metalness={0.12} />
      </mesh>
      {/* Counter front trim — raised lip */}
      <mesh position={[0, 1.02, -4.46]}>
        <boxGeometry args={[10.8, 0.04, 0.06]} />
        <meshStandardMaterial color={COUNTER_DARK} roughness={0.6} />
      </mesh>
      {/* Counter front panel detail strips */}
      {([-3.5, -1.2, 1.2, 3.5] as number[]).map((x) => (
        <mesh key={`cpanel-${x}`} position={[x, 0.48, -4.48]}>
          <boxGeometry args={[0.04, 0.76, 0.02]} />
          <meshStandardMaterial color={COUNTER_DARK} roughness={0.7} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════
          FRONT DISPLAY SHELF — refined
         ═══════════════════════════════════════════════ */}
      <mesh position={[0, 0.44, 4.6]}>
        <boxGeometry args={[8, 0.88, 0.9]} />
        <meshStandardMaterial color={TABLE_WOOD} roughness={0.74} />
      </mesh>
      <mesh position={[0, 0.9, 4.6]}>
        <boxGeometry args={[8.1, 0.06, 0.95]} />
        <meshStandardMaterial color={TABLE_TOP} roughness={0.48} metalness={0.08} />
      </mesh>
      {/* Front shelf lip */}
      <mesh position={[0, 0.94, 5.08]}>
        <boxGeometry args={[8.1, 0.04, 0.04]} />
        <meshStandardMaterial color={COUNTER_DARK} roughness={0.6} />
      </mesh>
      {/* Shelf vertical dividers */}
      {([-2.6, 0, 2.6] as number[]).map((x) => (
        <mesh key={`divider-${x}`} position={[x, 0.44, 4.6]}>
          <boxGeometry args={[0.05, 0.84, 0.88]} />
          <meshStandardMaterial color={COUNTER_DARK} roughness={0.7} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════
          WELCOME BANNER — enhanced chalkboard
         ═══════════════════════════════════════════════ */}
      {/* Hanging chains */}
      {([-2.8, 2.8] as number[]).map((x) => (
        <mesh key={`chain-${x}`} position={[x, 5.56, -1.5]}>
          <cylinderGeometry args={[0.015, 0.015, 0.88, 6]} />
          <meshStandardMaterial color={PENDANT_BRASS} roughness={0.4} metalness={0.45} />
        </mesh>
      ))}
      {/* Outer frame */}
      <mesh position={[0, 4.9, -1.52]}>
        <boxGeometry args={[6.6, 1.4, 0.1]} />
        <meshStandardMaterial color={CHALKBOARD_FRAME} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Board body */}
      <mesh position={[0, 4.9, -1.46]}>
        <boxGeometry args={[6.2, 1.14, 0.06]} />
        <meshStandardMaterial color={CHALKBOARD} roughness={0.92} />
      </mesh>
      {/* Board inner face */}
      <mesh position={[0, 4.9, -1.42]}>
        <boxGeometry args={[5.9, 0.98, 0.02]} />
        <meshStandardMaterial color={CHALKBOARD_INNER} roughness={0.95} />
      </mesh>
      {/* Corner brackets */}
      {([-3.05, 3.05] as number[]).map((x) =>
        ([-0.52, 0.52] as number[]).map((yOff) => (
          <mesh key={`corner-${x}-${yOff}`} position={[x, 4.9 + yOff, -1.44]}>
            <boxGeometry args={[0.12, 0.12, 0.04]} />
            <meshStandardMaterial color={PENDANT_BRASS} roughness={0.4} metalness={0.4} />
          </mesh>
        ))
      )}
      <Text
        position={[0, 5.06, -1.38]}
        fontSize={0.3}
        color="rgba(255,255,255,0.92)"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={5.4}
        outlineWidth={0.012}
        outlineColor="rgba(0,0,0,0.3)"
      >
        Welcome to Oscar&apos;s Teahouse!
      </Text>
      <Text
        position={[0, 4.72, -1.38]}
        fontSize={0.12}
        color="rgba(255,255,255,0.38)"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
      >
        CURRENTLY OPEN
      </Text>

    </group>
  )
})

/* ─── Fake Window (decorative, glowing pane) ─────────────────── */

function FakeWindow({
  position,
  rotationY,
}: {
  position: [number, number, number]
  rotationY: number
}) {
  const FRAME = "#54381A"
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[3.9, 2.1, 0.08]} />
        <meshStandardMaterial color={FRAME} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Glowing pane — unlit material reads as daylight coming through */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[3.6, 1.8]} />
        <meshBasicMaterial color="#FFE9C6" />
      </mesh>
      {/* Mullions — 4 tiles across, 2 tiles high */}
      {([-0.9, 0, 0.9] as number[]).map((x) => (
        <mesh key={`mullion-${x}`} position={[x, 0, 0.055]}>
          <boxGeometry args={[0.08, 1.8, 0.02]} />
          <meshStandardMaterial color={FRAME} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[3.6, 0.08, 0.02]} />
        <meshStandardMaterial color={FRAME} roughness={0.7} />
      </mesh>
    </group>
  )
}

/* ─── Bubble Tea Cup ──────────────────────────────────────────── */

const BobaCup = memo(function BobaCup({
  liquidColor,
  pearlColor,
  active,
}: {
  liquidColor: string
  pearlColor: string
  active: boolean
}) {
  const pearlOffsets = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        x: Math.cos((i / 8) * Math.PI * 2) * 0.14,
        z: Math.sin((i / 8) * Math.PI * 2) * 0.14,
        y: 0.58 + Math.random() * 0.06,
      })),
    []
  )

  const activeEmissive = active ? liquidColor : "#000000"
  const activeEmissiveIntensity = active ? 0.22 : 0

  return (
    <group>
      {/* ── Stand ── */}
      {/* Base disc — wider, heavier feel */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.04, 16]} />
        <meshStandardMaterial color="#8A6838" roughness={0.75} metalness={0.1} />
      </mesh>
      {/* Base chamfer ring */}
      <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.29, 0.008, 6, 16]} />
        <meshStandardMaterial color="#6A4C22" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Stand pole — tapered */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.48, 10]} />
        <meshStandardMaterial color="#7A5428" roughness={0.82} metalness={0.06} />
      </mesh>
      {/* Stand top disc — cup cradle */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.32, 0.28, 0.04, 16]} />
        <meshStandardMaterial color="#8A6838" roughness={0.72} metalness={0.1} />
      </mesh>

      {/* ── Cup body ── */}
      {/* Cup outer shell — classic boba cup taper */}
      <mesh position={[0, 1.04, 0]} renderOrder={1}>
        <cylinderGeometry args={[0.34, 0.26, 0.96, 24]} />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          depthWrite={false}
          opacity={0.65}
          roughness={0.06}
          metalness={0.02}
        />
      </mesh>

      {/* Liquid fill — inner volume */}
      <mesh position={[0, 1.0, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.28, 0.21, 0.84, 20]} />
        <meshStandardMaterial
          color={liquidColor}
          emissive={activeEmissive}
          emissiveIntensity={activeEmissiveIntensity}
          transparent
          depthWrite={false}
          opacity={0.78}
          roughness={0.18}
        />
      </mesh>

      {/* Ice cubes (small translucent boxes) */}
      {[
        [0.08, 1.2, 0.06],
        [-0.06, 1.28, -0.04],
        [0.02, 1.14, -0.08],
      ].map((pos, i) => (
        <mesh key={`ice-${i}`} position={pos as [number, number, number]} rotation={[0.3 * i, 0.5 * i, 0.2 * i]} renderOrder={2}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            depthWrite={false}
            opacity={0.25}
            roughness={0.05}
            metalness={0.0}
          />
        </mesh>
      ))}

      {/* Tapioca pearls — more of them, slightly randomized */}
      {pearlOffsets.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshStandardMaterial
            color={pearlColor}
            emissive={active ? pearlColor : "#000000"}
            emissiveIntensity={active ? 0.15 : 0}
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* ── Lid ── */}
      {/* Dome lid — slightly convex */}
      <mesh position={[0, 1.52, 0]} renderOrder={3}>
        <cylinderGeometry args={[0.36, 0.34, 0.04, 24]} />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          depthWrite={false}
          opacity={0.6}
          roughness={0.04}
          metalness={0.06}
        />
      </mesh>
      {/* Lid rim ring */}
      <mesh position={[0, 1.53, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.015, 8, 24]} />
        <meshStandardMaterial color={liquidColor} roughness={0.1} metalness={0.08} />
      </mesh>
      {/* Straw hole indicator */}
      <mesh position={[0.06, 1.55, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.035, 8]} />
        <meshStandardMaterial color={liquidColor} transparent opacity={0.5} roughness={0.2} />
      </mesh>

      {/* ── Straw ── */}
      <mesh position={[0.06, 1.86, 0.04]} rotation={[0.04, 0, -0.04]}>
        <cylinderGeometry args={[0.026, 0.026, 0.68, 10]} />
        <meshStandardMaterial
          color={active ? liquidColor : "#D8D0C8"}
          emissive={active ? liquidColor : "#000000"}
          emissiveIntensity={active ? 0.25 : 0}
          roughness={0.35}
          metalness={0.02}
        />
      </mesh>
      {/* Straw tip bevel */}
      <mesh position={[0.06, 1.52, 0.04]} rotation={[0.04, 0, -0.04]}>
        <cylinderGeometry args={[0.026, 0.02, 0.04, 10]} />
        <meshStandardMaterial color={active ? liquidColor : "#C8C0B8"} roughness={0.4} />
      </mesh>
    </group>
  )
})

/* ─── Cup Shell (hover / focus wrapper) ─────────────────────── */

function CupShell({
  object,
  active,
  hovered,
  onFocus,
  onHoverChange,
  children,
}: {
  object: RoomObjectManifest
  active: boolean
  hovered: boolean
  onFocus: () => void
  onHoverChange: (id: RoomObjectId | null) => void
  children: React.ReactNode
}) {
  const groupRef = useRef<Group>(null)
  const labelRef = useRef<Group>(null)
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1))
  const labelWorldPos = useRef(new THREE.Vector3())
  const labelColor = active ? object.color : "rgba(255,255,255,0.85)"

  useFrame((state) => {
    if (!groupRef.current) return
    scaleVec.current.setScalar(active ? 1.08 : hovered ? 1.04 : 1)
    groupRef.current.scale.lerp(scaleVec.current, 0.12)

    // Counter perspective shrink so every label reads at a similar size —
    // otherwise far cups become smudges and the focused one fills the screen.
    if (labelRef.current) {
      const d = state.camera.position.distanceTo(labelRef.current.getWorldPosition(labelWorldPos.current))
      labelRef.current.scale.setScalar(labelScale(d))
    }
  })

  return (
    <group position={object.position}>
      <group
        ref={groupRef}
        onClick={(e) => { e.stopPropagation(); onFocus() }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverChange(object.id) }}
        onPointerOut={(e) => { e.stopPropagation(); onHoverChange(null) }}
      >
        {children}

        {/* Label above cup — always visible, naming the section */}
        <Billboard ref={labelRef} position={[0, 2.55, 0]}>
          {/* No backing plate: it was a fixed 1.1 x 0.26 regardless of text, so
              long labels overflowed it and short ones sat in dead space. The
              outline carries contrast against the light walls instead. */}
          <Text
            position={[0, 0, 0]}
            fontSize={active ? 0.17 : 0.14}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.018}
            outlineColor="#000000"
            outlineOpacity={0.75}
          >
            {object.label}
          </Text>
        </Billboard>
      </group>

      {/* Floor ring indicator — double ring for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.36, 0.44, 36]} />
        <meshBasicMaterial
          color={object.color}
          transparent
          opacity={active ? 0.7 : hovered ? 0.4 : 0.12}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.48, 0.52, 36]} />
        <meshBasicMaterial
          color={object.color}
          transparent
          opacity={active ? 0.3 : hovered ? 0.15 : 0.04}
        />
      </mesh>
    </group>
  )
}
