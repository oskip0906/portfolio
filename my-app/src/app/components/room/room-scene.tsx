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
      {/* ── Warm tea-shop lighting ── */}
      <ambientLight intensity={0.7} color="#FFF4E0" />
      <hemisphereLight intensity={0.5} color="#FFE8C0" groundColor="#5A3820" />

      {/* Main overhead warm lights */}
      <pointLight position={[0, 5.4, -1]} intensity={18} color="#FFD090" distance={24} />
      <pointLight position={[0, 5.4, 3]} intensity={14} color="#FFE0A0" distance={20} />

      {/* Accent fill lights for depth */}
      <pointLight position={[-5, 3.5, 4]} intensity={6} color="#FFE8C8" distance={14} />
      <pointLight position={[5, 3.5, 4]} intensity={6} color="#FFE8C8" distance={14} />

      {/* Soft back-wall wash */}
      <pointLight position={[0, 4.0, -4.5]} intensity={8} color="#FFDCA0" distance={16} />

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
  const { roomTheme, wallColor, ceilingColor, floorColor } = useBackground()
  const FLOOR = roomTheme.roomFloorColor
  const FLOOR_DARK = roomTheme.roomFloorDarkColor
  const PILLAR = roomTheme.roomPillarColor
  const PILLAR_ACCENT = roomTheme.roomPillarAccentColor

  // Refined wood palette
  const COUNTER_DARK = "#2A1608"
  const COUNTER_WOOD = "#3A220E"
  const COUNTER_TOP = "#5A3418"
  const TABLE_WOOD = "#8A5C28"
  const TABLE_TOP = "#A07040"
  const BASEBOARD = "#2C1A0A"
  const CROWN = "#C8A878"
  const BEAM_COLOR = "#6A4420"
  const WAINSCOT_PANEL = "#E8D8C4"
  const WAINSCOT_RAIL = "#C0A888"
  const WALL_UPPER = wallColor
  const CEILING_COLOR = ceilingColor
  const PLANK_A = floorColor
  // derive a slightly darker plank variant by blending toward dark
  const PLANK_B = floorColor
  const PENDANT_SHADE = "#1A1A1A"
  const PENDANT_BRASS = "#B8944C"
  const CHALKBOARD_FRAME = "#5A3C1E"
  const CHALKBOARD = "#1A2E18"
  const CHALKBOARD_INNER = "#142210"

  return (
    <group>
      {/* ═══════════════════════════════════════════════
          FLOOR — alternating wood plank strips
         ═══════════════════════════════════════════════ */}
      {Array.from({ length: 18 }, (_, i) => {
        const z = -8.5 + i * 1.0
        const isEven = i % 2 === 0
        return (
          <mesh key={`plank-${i}`} position={[0, -0.19, z]}>
            <boxGeometry args={[20, 0.02, 0.94]} />
            <meshStandardMaterial
              color={isEven ? PLANK_A : PLANK_B}
              roughness={0.82}
              metalness={0.02}
            />
          </mesh>
        )
      })}
      {/* Floor base underneath planks */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[22, 0.06, 20]} />
        <meshStandardMaterial color={FLOOR_DARK} roughness={0.95} />
      </mesh>

      {/* ═══════════════════════════════════════════════
          CEILING — warm plaster with exposed beams
         ═══════════════════════════════════════════════ */}
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[22, 0.15, 20]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.92} />
      </mesh>
      {/* Ceiling beams running front-to-back */}
      {([-4.5, 0, 4.5] as number[]).map((x) => (
        <mesh key={`beam-${x}`} position={[x, 6.08, 0]}>
          <boxGeometry args={[0.35, 0.24, 19.6]} />
          <meshStandardMaterial color={BEAM_COLOR} roughness={0.85} metalness={0.04} />
        </mesh>
      ))}
      {/* Cross beams */}
      {([-5, 0, 5] as number[]).map((z) => (
        <mesh key={`xbeam-${z}`} position={[0, 6.02, z]}>
          <boxGeometry args={[19.6, 0.16, 0.28]} />
          <meshStandardMaterial color={BEAM_COLOR} roughness={0.85} metalness={0.04} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════
          WALLS — upper plaster + lower wainscoting
         ═══════════════════════════════════════════════ */}
      <WallWithWainscoting
        position={[0, 3.0, -9.8]}
        size={[21.6, 6.0, 0.3]}
        upperColor={WALL_UPPER}
        panelColor={WAINSCOT_PANEL}
        railColor={WAINSCOT_RAIL}
        baseboardColor={BASEBOARD}
        crownColor={CROWN}
        facing="south"
      />
      <WallWithWainscoting
        position={[0, 3.0, 9.8]}
        size={[21.6, 6.0, 0.3]}
        upperColor={WALL_UPPER}
        panelColor={WAINSCOT_PANEL}
        railColor={WAINSCOT_RAIL}
        baseboardColor={BASEBOARD}
        crownColor={CROWN}
        facing="north"
      />
      <WallWithWainscoting
        position={[-10.5, 3.0, 0]}
        size={[0.3, 6.0, 19.9]}
        upperColor={WALL_UPPER}
        panelColor={WAINSCOT_PANEL}
        railColor={WAINSCOT_RAIL}
        baseboardColor={BASEBOARD}
        crownColor={CROWN}
        facing="east"
      />
      <WallWithWainscoting
        position={[10.5, 3.0, 0]}
        size={[0.3, 6.0, 19.9]}
        upperColor={WALL_UPPER}
        panelColor={WAINSCOT_PANEL}
        railColor={WAINSCOT_RAIL}
        baseboardColor={BASEBOARD}
        crownColor={CROWN}
        facing="west"
      />

      {/* ═══════════════════════════════════════════════
          PENDANT LIGHTS — 3 hanging fixtures
         ═══════════════════════════════════════════════ */}
      {([-3.2, 0, 3.2] as number[]).map((x) => (
        <PendantLight key={`pendant-${x}`} position={[x, 5.2, 1.5]} shadeColor={PENDANT_SHADE} brassColor={PENDANT_BRASS} />
      ))}

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

      {/* Back shelf (behind counter on wall) */}
      <mesh position={[0, 2.2, -9.4]}>
        <boxGeometry args={[8, 0.08, 0.6]} />
        <meshStandardMaterial color={TABLE_WOOD} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Shelf brackets */}
      {([-3.6, -1.2, 1.2, 3.6] as number[]).map((x) => (
        <group key={`bracket-${x}`}>
          <mesh position={[x, 1.9, -9.2]}>
            <boxGeometry args={[0.08, 0.5, 0.04]} />
            <meshStandardMaterial color={PENDANT_BRASS} roughness={0.5} metalness={0.35} />
          </mesh>
          <mesh position={[x, 2.15, -9.2]}>
            <boxGeometry args={[0.08, 0.04, 0.38]} />
            <meshStandardMaterial color={PENDANT_BRASS} roughness={0.5} metalness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Decorative jars on back shelf */}
      {([-2.8, -1.4, 0, 1.4, 2.8] as number[]).map((x, i) => {
        const jarColors = ["#E8C8A0", "#C0A080", "#D8B888", "#A88868", "#E0D0B8"]
        return (
          <group key={`jar-${x}`}>
            <mesh position={[x, 2.45, -9.3]}>
              <cylinderGeometry args={[0.14, 0.12, 0.4, 10]} />
              <meshStandardMaterial color={jarColors[i]} roughness={0.4} metalness={0.08} />
            </mesh>
            {/* Jar lid */}
            <mesh position={[x, 2.68, -9.3]}>
              <cylinderGeometry args={[0.11, 0.15, 0.06, 10]} />
              <meshStandardMaterial color="#806040" roughness={0.5} metalness={0.15} />
            </mesh>
          </group>
        )
      })}

      {/* ═══════════════════════════════════════════════
          SIDE TABLES — enhanced with crossbar detail
         ═══════════════════════════════════════════════ */}
      {([-4.2, 4.2] as number[]).map((x) => (
        <group key={`table-${x}`} position={[x, 0, 0.2]}>
          {/* Center pedestal */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 0.4, 12]} />
            <meshStandardMaterial color={TABLE_WOOD} roughness={0.75} metalness={0.04} />
          </mesh>
          {/* Base disc */}
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.38, 0.4, 0.02, 16]} />
            <meshStandardMaterial color={COUNTER_DARK} roughness={0.7} metalness={0.08} />
          </mesh>
          {/* Table top */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.76, 0.72, 0.06, 24]} />
            <meshStandardMaterial color={TABLE_TOP} roughness={0.55} metalness={0.06} />
          </mesh>
          {/* Rim ring */}
          <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.74, 0.012, 6, 24]} />
            <meshStandardMaterial color={COUNTER_DARK} roughness={0.6} metalness={0.1} />
          </mesh>
        </group>
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

      {/* ═══════════════════════════════════════════════
          DECORATIVE ELEMENTS
         ═══════════════════════════════════════════════ */}

      {/* Small potted plants on counter */}
      {([-4.2, 4.2] as number[]).map((x) => (
        <group key={`plant-${x}`} position={[x, 1.04, -5.2]}>
          {/* Pot */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.16, 8]} />
            <meshStandardMaterial color="#C4956A" roughness={0.85} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
            <meshStandardMaterial color="#3A2A18" roughness={0.95} />
          </mesh>
          {/* Plant leaves (small spheres) */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#4A8A3A" roughness={0.8} />
          </mesh>
          <mesh position={[0.05, 0.36, 0.03]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#5A9A48" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Floor mat in front of counter */}
      <mesh position={[0, -0.17, -3.8]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.02, 1.6]} />
        <meshStandardMaterial color="#8A6848" roughness={0.95} />
      </mesh>
      {/* Mat border */}
      <mesh position={[0, -0.165, -3.8]}>
        <boxGeometry args={[3.4, 0.005, 1.8]} />
        <meshStandardMaterial color="#6A4828" roughness={0.9} />
      </mesh>

      {/* Small menu board leaning on counter */}
      <mesh position={[-2.8, 1.28, -4.5]} rotation={[0.18, 0.12, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.04]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>
      <mesh position={[-2.8, 1.28, -4.48]} rotation={[0.18, 0.12, 0]}>
        <boxGeometry args={[0.48, 0.62, 0.02]} />
        <meshStandardMaterial color={CHALKBOARD_INNER} roughness={0.95} />
      </mesh>

    </group>
  )
}

/* ─── Wall with Wainscoting ──────────────────────────────────── */

function WallWithWainscoting({
  position,
  size,
  upperColor,
  panelColor,
  railColor,
  baseboardColor,
  crownColor,
  facing,
}: {
  position: [number, number, number]
  size: [number, number, number]
  upperColor: string
  panelColor: string
  railColor: string
  baseboardColor: string
  crownColor: string
  facing: "north" | "south" | "east" | "west"
}) {
  const isXWall = facing === "north" || facing === "south"
  const wallWidth = isXWall ? size[0] : size[2]
  const thickness = isXWall ? size[2] : size[0]

  // Offsets for the trim pieces — they sit slightly in front of the wall face
  const trimOffset = thickness / 2 + 0.02
  const trimDir = facing === "south" || facing === "west" ? 1 : -1

  const trimPos = (y: number): [number, number, number] => {
    if (isXWall) return [position[0], y, position[2] + trimDir * trimOffset]
    return [position[0] + trimDir * trimOffset, y, position[2]]
  }
  const trimSize = (w: number, h: number, d: number): [number, number, number] => {
    if (isXWall) return [w, h, d]
    return [d, h, w]
  }

  return (
    <group>
      {/* Main wall body — upper section (above wainscoting) */}
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={upperColor} roughness={0.88} />
      </mesh>

      {/* Wainscoting panel (lower 1.6m of wall, slightly proud) */}
      <mesh position={trimPos(0.8)}>
        <boxGeometry args={trimSize(wallWidth, 1.6, 0.04)} />
        <meshStandardMaterial color={panelColor} roughness={0.8} />
      </mesh>

      {/* Chair rail (top of wainscoting) */}
      <mesh position={trimPos(1.62)}>
        <boxGeometry args={trimSize(wallWidth + 0.04, 0.06, 0.06)} />
        <meshStandardMaterial color={railColor} roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Baseboard */}
      <mesh position={trimPos(0.06)}>
        <boxGeometry args={trimSize(wallWidth + 0.04, 0.12, 0.06)} />
        <meshStandardMaterial color={baseboardColor} roughness={0.7} metalness={0.04} />
      </mesh>

      {/* Crown molding */}
      <mesh position={trimPos(5.98)}>
        <boxGeometry args={trimSize(wallWidth + 0.04, 0.08, 0.08)} />
        <meshStandardMaterial color={crownColor} roughness={0.6} metalness={0.06} />
      </mesh>
    </group>
  )
}

/* ─── Pendant Light Fixture ──────────────────────────────────── */

function PendantLight({
  position,
  shadeColor,
  brassColor,
}: {
  position: [number, number, number]
  shadeColor: string
  brassColor: string
}) {
  return (
    <group position={position}>
      {/* Wire/cord */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.1, 4]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      {/* Canopy (ceiling mount) */}
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
        <meshStandardMaterial color={brassColor} roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Shade — truncated cone */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.28, 0.24, 16]} />
        <meshStandardMaterial color={shadeColor} roughness={0.9} metalness={0.08} />
      </mesh>
      {/* Brass ring at bottom of shade */}
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.012, 6, 16]} />
        <meshStandardMaterial color={brassColor} roughness={0.35} metalness={0.45} />
      </mesh>
      {/* Warm glow bulb (emissive sphere) */}
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#FFD890"
          emissive="#FFD080"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>
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
