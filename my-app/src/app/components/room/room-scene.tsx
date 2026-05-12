"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import { useBackground } from "@/app/contexts/background-context"
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
  const { roomTheme } = useBackground()

  const handleObjectClick = (object: RoomObjectManifest) => {
    onFocusChange(object.id)
  }

  return (
    <>
      {/* Warm tea-shop lighting — no visible fixtures */}
      <ambientLight intensity={0.95} color="#FFF4E0" />
      <hemisphereLight intensity={0.42} color="#FFE8C0" groundColor="#5A3820" />
      <pointLight position={[0, 5.5, -2]} intensity={22} color="#FFD090" distance={26} />
      <pointLight position={[0, 5.5,  3]} intensity={18} color="#FFE0A0" distance={22} />

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
            roomTheme={roomTheme}
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

function TeaShopRoom() {
  const FLOOR = "#C49A52"
  const FLOOR_DARK = "#A07A38"
  const COUNTER_WOOD = "#3A220E"
  const COUNTER_TOP = "#5A3418"
  const TABLE_WOOD = "#8A5C28"
  const TABLE_TOP = "#A07040"

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color={FLOOR} roughness={0.82} metalness={0.04} side={THREE.DoubleSide} />
      </mesh>
      {/* Floor accent stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[0.08, 16]} />
        <meshStandardMaterial color={FLOOR_DARK} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color="#EEE4CC" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Corner pillars ── */}
      {([[-8, 0, -7], [8, 0, -7], [-8, 0, 7], [8, 0, 7]] as [number, number, number][]).map(([x, , z]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          {/* Base */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.55, 0.24, 0.55]} />
            <meshStandardMaterial color="#C8A870" roughness={0.6} metalness={0.08} />
          </mesh>
          {/* Shaft */}
          <mesh position={[0, 3.12, 0]}>
            <cylinderGeometry args={[0.18, 0.21, 5.76, 14]} />
            <meshStandardMaterial color="#DDD0B0" roughness={0.55} metalness={0.05} />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 6.0, 0]}>
            <boxGeometry args={[0.52, 0.24, 0.52]} />
            <meshStandardMaterial color="#C8A870" roughness={0.6} metalness={0.08} />
          </mesh>
        </group>
      ))}

      {/* ── Back counter ── */}
      {/* Counter body */}
      <mesh position={[0, 0.48, -5.2]}>
        <boxGeometry args={[10.5, 0.96, 1.4]} />
        <meshStandardMaterial color={COUNTER_WOOD} roughness={0.72} metalness={0.06} />
      </mesh>
      {/* Counter top surface */}
      <mesh position={[0, 0.97, -5.2]}>
        <boxGeometry args={[10.5, 0.05, 1.4]} />
        <meshStandardMaterial color={COUNTER_TOP} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Counter front trim */}
      <mesh position={[0, 0.62, -4.51]}>
        <boxGeometry args={[10.5, 0.08, 0.04]} />
        <meshStandardMaterial color="#2A1608" roughness={0.6} />
      </mesh>

      {/* ── Side tables ── */}
      {([-4.2, 4.2] as number[]).map((x) => (
        <group key={x} position={[x, 0, 0.2]}>
          {/* Table leg cylinder */}
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.76, 10]} />
            <meshStandardMaterial color={TABLE_WOOD} roughness={0.8} />
          </mesh>
          {/* Table top */}
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.72, 0.68, 0.07, 22]} />
            <meshStandardMaterial color={TABLE_TOP} roughness={0.6} metalness={0.06} />
          </mesh>
        </group>
      ))}

      {/* ── Front display shelf ── */}
      <mesh position={[0, 0.44, 4.6]}>
        <boxGeometry args={[8, 0.88, 0.9]} />
        <meshStandardMaterial color={TABLE_WOOD} roughness={0.74} />
      </mesh>
      <mesh position={[0, 0.9, 4.6]}>
        <boxGeometry args={[8, 0.05, 0.9]} />
        <meshStandardMaterial color={TABLE_TOP} roughness={0.52} metalness={0.08} />
      </mesh>

      {/* ── Hanging welcome banner ── */}
      {/* Chains */}
      {([-2.6, 2.6] as number[]).map((x) => (
        <mesh key={x} position={[x, 5.56, -1.5]}>
          <cylinderGeometry args={[0.018, 0.018, 0.88, 6]} />
          <meshStandardMaterial color="#9A8060" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* Board body */}
      <mesh position={[0, 4.9, -1.5]}>
        <boxGeometry args={[6.2, 1.2, 0.09]} />
        <meshStandardMaterial color="#1A2E18" roughness={0.9} />
      </mesh>
      {/* Board inner face */}
      <mesh position={[0, 4.9, -1.44]}>
        <boxGeometry args={[6.0, 1.04, 0.02]} />
        <meshStandardMaterial color="#142210" roughness={0.95} />
      </mesh>
      <Text
        position={[0, 5.02, -1.40]}
        fontSize={0.32}
        color="rgba(255,255,255,0.92)"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={5.6}
        outlineWidth={0.015}
        outlineColor="rgba(0,0,0,0.3)"
      >
        Welcome to Oscar&apos;s Teahouse!
      </Text>
      <Text
        position={[0, 4.68, -1.40]}
        fontSize={0.13}
        color="rgba(255,255,255,0.42)"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        CURRENTLY OPEN
      </Text>

    </group>
  )
}

/* ─── Bubble Tea Cup ──────────────────────────────────────────── */

function BobaCup({
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
      Array.from({ length: 6 }, (_, i) => ({
        x: Math.cos((i / 6) * Math.PI * 2) * 0.13,
        z: Math.sin((i / 6) * Math.PI * 2) * 0.13,
      })),
    []
  )

  const activeEmissive = active ? liquidColor : "#000000"
  const activeEmissiveIntensity = active ? 0.18 : 0

  return (
    <group>
      {/* Stand base disc */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 14]} />
        <meshStandardMaterial color="#9A7040" roughness={0.8} metalness={0.08} />
      </mesh>
      {/* Stand pole */}
      <mesh position={[0, 0.275, 0]}>
        <cylinderGeometry args={[0.055, 0.08, 0.45, 10]} />
        <meshStandardMaterial color="#7A5428" roughness={0.82} metalness={0.06} />
      </mesh>
      {/* Stand top disc */}
      <mesh position={[0, 0.525, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 14]} />
        <meshStandardMaterial color="#9A7040" roughness={0.78} metalness={0.08} />
      </mesh>

      {/* Cup outer body (tinted translucent plastic) */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.33, 0.27, 0.94, 20]} />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          opacity={0.72}
          roughness={0.08}
          metalness={0.0}
        />
      </mesh>

      {/* Liquid fill */}
      <mesh position={[0, 0.99, 0]}>
        <cylinderGeometry args={[0.27, 0.22, 0.82, 18]} />
        <meshStandardMaterial
          color={liquidColor}
          emissive={activeEmissive}
          emissiveIntensity={activeEmissiveIntensity}
          transparent
          opacity={0.72}
          roughness={0.2}
        />
      </mesh>

      {/* Tapioca pearls at the bottom */}
      {pearlOffsets.map((p, i) => (
        <mesh key={i} position={[p.x, 0.62, p.z]}>
          <sphereGeometry args={[0.048, 8, 8]} />
          <meshStandardMaterial
            color={pearlColor}
            emissive={active ? pearlColor : "#000000"}
            emissiveIntensity={active ? 0.12 : 0}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Lid seal */}
      <mesh position={[0, 1.49, 0]}>
        <cylinderGeometry args={[0.36, 0.33, 0.06, 20]} />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          opacity={0.72}
          roughness={0.05}
          metalness={0.04}
        />
      </mesh>
      {/* Lid rim ring */}
      <mesh position={[0, 1.51, 0]}>
        <torusGeometry args={[0.34, 0.018, 8, 20]} />
        <meshStandardMaterial color={liquidColor} roughness={0.12} />
      </mesh>

      {/* Straw */}
      <group>
        <mesh position={[0.06, 1.82, 0.04]} rotation={[0.04, 0, -0.04]}>
          <cylinderGeometry args={[0.028, 0.028, 0.64, 8]} />
          <meshStandardMaterial
            color={active ? liquidColor : "#D8D0C8"}
            emissive={active ? liquidColor : "#000000"}
            emissiveIntensity={active ? 0.22 : 0}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  )
}

/* ─── Cup Shell (hover / focus wrapper) ─────────────────────── */

function CupShell({
  object,
  active,
  hovered,
  onFocus,
  onHoverChange,
  roomTheme,
  children,
}: {
  object: RoomObjectManifest
  active: boolean
  hovered: boolean
  onFocus: () => void
  onHoverChange: (id: RoomObjectId | null) => void
  roomTheme: { uiAccent: string; emissiveAccent: string }
  children: React.ReactNode
}) {
  const groupRef = useRef<Group>(null)
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1))
  const labelColor = active ? object.color : "rgba(255,255,255,0.82)"

  useFrame(() => {
    if (!groupRef.current) return
    scaleVec.current.setScalar(active ? 1.08 : hovered ? 1.04 : 1)
    groupRef.current.scale.lerp(scaleVec.current, 0.12)
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

        {/* Label above cup */}
        <Text
          position={[0, 2.55, 0]}
          fontSize={0.22}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="rgba(0,0,0,0.45)"
        >
          {object.label}
        </Text>
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.1}
          color="rgba(255,255,255,0.45)"
          anchorX="center"
          anchorY="middle"
        >
          {object.subtitle}
        </Text>
      </group>

      {/* Floor ring indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.38, 0.48, 36]} />
        <meshBasicMaterial
          color={object.color}
          transparent
          opacity={active ? 0.7 : hovered ? 0.4 : 0.15}
        />
      </mesh>
    </group>
  )
}
