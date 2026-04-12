"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect, useContext, createContext, RefObject } from "react"
import { type Memory } from "@/lib/database"
import { useBackground } from "@/app/contexts/background-context"
import { hexHue } from "@/lib/utils"

const PALETTE = [
  {
    solid: "#22d3ee",
    faint: "rgba(34,211,238,0.10)",
    border: "rgba(34,211,238,0.22)",
    glow: "rgba(34,211,238,0.55)",
  },
  {
    solid: "#a78bfa",
    faint: "rgba(167,139,250,0.10)",
    border: "rgba(167,139,250,0.22)",
    glow: "rgba(167,139,250,0.55)",
  },
  {
    solid: "#f472b6",
    faint: "rgba(244,114,182,0.10)",
    border: "rgba(244,114,182,0.22)",
    glow: "rgba(244,114,182,0.55)",
  },
]

type Pal = (typeof PALETTE)[number]

// ── Responsive layout values ──────────────────────────────────────────────────

type Layout = {
  CARD_W: number
  CARD_H: number
  COL_GAP: number
  CONN_H: number
  DOT_S: number
  COL_H: number
  /** Top band (horizontal layout) for the scroll track + car overlay */
  SPINE_NAV_H: number
  ENTRY_W: number
}

const LAYOUT_DEFAULTS: Layout = {
  CARD_W: 300,
  CARD_H: 250,
  COL_GAP: 20,
  CONN_H: 44,
  DOT_S: 18,
  COL_H: 250 * 2 + 44 * 2 + 56,
  SPINE_NAV_H: 56,
  ENTRY_W: 300 + 20 * 2,
}

const LayoutCtx = createContext<Layout>(LAYOUT_DEFAULTS)

function useLayoutValues(): Layout {
  // Fixed defaults on server and first client render — reading `window` in the
  // initializer breaks hydration because SSR cannot know the real viewport.
  const [vw, setVw] = useState(1280)
  const [vh, setVh] = useState(800)

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    onResize()
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const CARD_W  = Math.round(Math.min(Math.max(220, vw * 0.22), 340))
  const CARD_H  = Math.round(Math.min(Math.max(180, vh * 0.28), 280))
  const COL_GAP = Math.round(Math.min(Math.max(14, vw * 0.015), 28))
  const CONN_H  = Math.round(Math.min(Math.max(32, vh * 0.055), 56))
  const DOT_S = 18
  // Room for racecar SVG + gap + track, clamped for small viewports
  const SPINE_NAV_H = Math.round(Math.min(Math.max(52, vh * 0.075), 80))
  const COL_H = CARD_H * 2 + CONN_H * 2 + SPINE_NAV_H
  const ENTRY_W = CARD_W + COL_GAP * 2

  return { CARD_W, CARD_H, COL_GAP, CONN_H, DOT_S, COL_H, SPINE_NAV_H, ENTRY_W }
}

// ── Shared Dot ────────────────────────────────────────────────────────────────

function Dot({ pal, inView }: { pal: Pal; inView: boolean }) {
  const { DOT_S } = useContext(LayoutCtx)
  return (
    <motion.div
      className="rounded-full relative z-20 shrink-0"
      style={{
        width: DOT_S,
        height: DOT_S,
        background: pal.solid,
        opacity: 0.35,
        boxShadow: `0 0 0 3px rgba(8,8,18,0.85), 0 0 10px ${pal.glow}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 0.35 } : {}}
      transition={{ duration: 0.32, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-[4px] rounded-full bg-white/15" />
    </motion.div>
  )
}

/** Reserves the top band where the shared `ScrollNav` overlay sits */
function SpineSpacer() {
  const { SPINE_NAV_H } = useContext(LayoutCtx)
  return <div className="shrink-0 w-px" style={{ height: SPINE_NAV_H }} aria-hidden />
}

// ── Horizontal connector ──────────────────────────────────────────────────────

function HConnector({
  pal,
  inView,
  originTop,
  height,
}: {
  pal: Pal
  inView: boolean
  originTop: boolean
  /** Defaults to `CONN_H`; use a larger value for a line from the track down to a bottom card */
  height?: number
}) {
  const { CONN_H } = useContext(LayoutCtx)
  const h = height ?? CONN_H
  return (
    <motion.div
      style={{
        width: 1,
        height: h,
        background: pal.solid,
        opacity: 0.3,
        originY: originTop ? 0 : 1,
      }}
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 0.28, delay: 0.14 }}
    />
  )
}

// ── Horizontal card ───────────────────────────────────────────────────────────

function HCard({ memory, pal, side }: { memory: Memory; pal: Pal; side: "top" | "bottom" }) {
  const { CARD_W, CARD_H } = useContext(LayoutCtx)
  const accent = side === "top"
    ? { borderBottom: `3px solid ${pal.solid}` }
    : { borderTop:    `3px solid ${pal.solid}` }

  return (
    <div
      className="relative rounded-xl overflow-hidden flex flex-col"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${pal.border}`,
        ...accent,
      }}
    >
      {/* Fixed header */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <span
          className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold tracking-[0.2em] uppercase mb-2.5"
          style={{ background: pal.faint, color: pal.solid }}
        >
          {memory.date}
        </span>
        <h3 className="text-base font-bold text-white leading-snug">
          {memory.title}
        </h3>
      </div>

      {/* Scrollable description */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `${pal.solid}44 transparent`,
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "rgba(156,163,175,0.85)" }}>
          {memory.description}
        </p>
      </div>
    </div>
  )
}

// ── Horizontal entry (one column) ─────────────────────────────────────────────

function HEntry({ memory, index }: { memory: Memory; index: number }) {
  const { ENTRY_W, CARD_H, CONN_H, COL_GAP } = useContext(LayoutCtx)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const pal    = PALETTE[index % PALETTE.length]
  const isTop  = index % 2 === 0

  return (
    <div
      ref={ref}
      className="shrink-0 flex flex-col items-center"
      style={{ width: ENTRY_W, paddingLeft: COL_GAP, paddingRight: COL_GAP }}
    >
      <SpineSpacer />

      {isTop ? (
        <>
          <HConnector pal={pal} inView={inView} originTop />
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <HCard memory={memory} pal={pal} side="top" />
          </motion.div>
          <div style={{ height: CONN_H }} aria-hidden />
          <div style={{ height: CARD_H }} aria-hidden />
        </>
      ) : (
        <>
          <HConnector
            pal={pal}
            inView={inView}
            originTop
            height={CARD_H + CONN_H + CONN_H}
          />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <HCard memory={memory} pal={pal} side="bottom" />
          </motion.div>
        </>
      )}
    </div>
  )
}

// ── Vertical card ─────────────────────────────────────────────────────────────

function VCard({ memory, pal }: { memory: Memory; pal: Pal }) {
  return (
    <div
      className="relative rounded-xl p-4 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${pal.border}`,
        borderLeft: `3px solid ${pal.solid}`,
      }}
    >
      <span
        className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold tracking-[0.2em] uppercase mb-2.5"
        style={{ background: pal.faint, color: pal.solid }}
      >
        {memory.date}
      </span>
      <h3 className="text-base font-bold text-white mb-2 leading-snug">
        {memory.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(156,163,175,0.85)" }}>
        {memory.description}
      </p>
    </div>
  )
}

// ── Vertical entry ────────────────────────────────────────────────────────────

function VEntry({ memory, index }: { memory: Memory; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const pal    = PALETTE[index % PALETTE.length]

  return (
    <div ref={ref} className="flex items-start gap-5 py-5">
      <div className="shrink-0 flex justify-center w-[18px] mt-1">
        <Dot pal={pal} inView={inView} />
      </div>
      <motion.div
        className="flex-1 min-w-0"
        initial={{ opacity: 0, x: 14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <VCard memory={memory} pal={pal} />
      </motion.div>
    </div>
  )
}

// ── Racecar SVG ───────────────────────────────────────────────────────────────

const RACE_CAR_W = 58
const RACE_CAR_H = 30

function RacecarIcon({ color }: { color: string }) {
  return (
    <svg
      width={RACE_CAR_W}
      height={RACE_CAR_H}
      viewBox="0 0 58 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Exhaust glow */}
      <ellipse cx="5" cy="16" rx="4" ry="2.5" fill="rgba(251,146,60,0.55)" />
      <ellipse cx="3" cy="16" rx="2.5" ry="1.5" fill="rgba(253,224,71,0.4)" />

      {/* Rear wing blade */}
      <rect x="1" y="6" width="10" height="2.5" rx="1" fill={color} />
      {/* Rear wing post */}
      <rect x="7" y="7" width="2.5" height="7" rx="0.8" fill={color} opacity="0.85" />

      {/* Main body */}
      <path
        d="M8 12 C8 9 11 8 15 8 L38 8 C44 8 48 9.5 50 12 L50 18 C48 20 44 21 38 21 L15 21 C11 21 8 20 8 18 Z"
        fill={color}
        opacity="0.95"
      />
      {/* Body underside shadow */}
      <path
        d="M8 17 C8 19 11 21 15 21 L38 21 C44 21 48 20 50 18 L50 17 C48 19.5 44 20.5 38 20.5 L15 20.5 C11 20.5 8 19.5 8 17 Z"
        fill="rgba(0,0,0,0.25)"
      />

      {/* Cockpit surround */}
      <path
        d="M18 8 C20 4 24 3 29 3 C34 3 37 5 38 8 Z"
        fill={color}
        opacity="0.6"
      />
      {/* Cockpit interior */}
      <path
        d="M20 8 C22 5 25 4 29 4 C33 4 36 5.5 36.5 8 Z"
        fill="#08080f"
      />
      {/* Visor */}
      <path
        d="M22 8 C23.5 6 26 5.2 29 5.2 C32 5.2 34.5 6.3 35 8 Z"
        fill="rgba(125,211,252,0.45)"
      />

      {/* Front nose */}
      <path d="M50 12 L55 13.5 L55 16.5 L50 18 Z" fill={color} opacity="0.85" />
      {/* Front wing blade */}
      <rect x="50" y="19" width="7" height="2.5" rx="0.8" fill={color} />
      {/* Front wing endplate */}
      <rect x="55.5" y="17" width="1.5" height="5" rx="0.5" fill={color} opacity="0.7" />

      {/* Rear wheel */}
      <circle cx="15" cy="23" r="6.5" fill="#0d0d14" />
      <circle cx="15" cy="23" r="4.5" fill="#1a1a28" />
      <circle cx="15" cy="23" r="2"   fill="#252538" />
      <circle cx="15" cy="23" r="0.8" fill={color} opacity="0.6" />
      {/* Rear tyre highlight */}
      <path d="M10.5 19 A6.5 6.5 0 0 1 19.5 19" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />

      {/* Front wheel */}
      <circle cx="41" cy="23" r="5.5" fill="#0d0d14" />
      <circle cx="41" cy="23" r="3.8" fill="#1a1a28" />
      <circle cx="41" cy="23" r="1.6" fill="#252538" />
      <circle cx="41" cy="23" r="0.6" fill={color} opacity="0.6" />
      {/* Front tyre highlight */}
      <path d="M37 19.5 A5.5 5.5 0 0 1 45 19.5" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />

      {/* Body highlight stripe */}
      <path
        d="M10 11 C12 10 16 9.5 20 9.5 L36 9.5 C40 9.5 44 10 47 11.5"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Racetrack navigator ────────────────────────────────────────────────────────

function ScrollNav({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  const { ENTRY_W, SPINE_NAV_H } = useContext(LayoutCtx)
  const trackRef = useRef<HTMLDivElement>(null)
  const laneRef  = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  /** Pointer X minus left edge of car (in screen space along the lane) on pointerdown */
  const grabOffsetX = useRef(0)
  const [ratio, setRatio] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const sync = () => {
      if (isDragging.current) return
      const max = el.scrollWidth - el.clientWidth
      setRatio(max > 0 ? el.scrollLeft / max : 0)
    }
    sync()
    el.addEventListener("scroll", sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", sync)
      ro.disconnect()
    }
  }, [scrollRef])

  const applyClientXToScroll = (clientX: number) => {
    const el = scrollRef.current
    const lane = laneRef.current
    if (!el || !lane) return
    const laneRect = lane.getBoundingClientRect()
    const travel = Math.max(0, laneRect.width - RACE_CAR_W)
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    if (travel <= 0 || max <= 0) {
      setRatio(0)
      return
    }
    const x = Math.max(0, Math.min(travel, clientX - laneRect.left - grabOffsetX.current))
    const r = x / travel
    el.scrollLeft = r * max
    setRatio(r)
  }

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    const lane = laneRef.current
    if (!el || !lane) return
    const laneRect = lane.getBoundingClientRect()
    const travel = Math.max(0, laneRect.width - RACE_CAR_W)
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    if (travel <= 0 || max <= 0) return
    const desiredLeft = e.clientX - laneRect.left - RACE_CAR_W / 2
    const x = Math.max(0, Math.min(travel, desiredLeft))
    el.scrollLeft = (x / travel) * max
    setRatio(x / travel)
  }

  const handleCarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const el = scrollRef.current
    const lane = laneRef.current
    if (!el || !lane) return
    const laneRect = lane.getBoundingClientRect()
    const travel = Math.max(0, laneRect.width - RACE_CAR_W)
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    const carLeft = max > 0 && travel > 0 ? (el.scrollLeft / max) * travel : 0
    grabOffsetX.current = e.clientX - laneRect.left - carLeft
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleCarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    applyClientXToScroll(e.clientX)
  }

  const handleCarPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    isDragging.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    const el = scrollRef.current
    if (el) {
      const max = el.scrollWidth - el.clientWidth
      setRatio(max > 0 ? el.scrollLeft / max : 0)
    }
  }

  // Arrow keys scroll by one entry
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        el.scrollBy({ left: ENTRY_W, behavior: "smooth" })
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        el.scrollBy({ left: -ENTRY_W, behavior: "smooth" })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [scrollRef, ENTRY_W])

  // Derive car color from the current background hue — vivid accent
  // (must be before any early return to satisfy Rules of Hooks)
  const { baseColor } = useBackground()
  const h        = hexHue(baseColor)
  const carColor = `hsl(${h.toFixed(0)}, 80%, 68%)`
  const carGlow  = `hsla(${h.toFixed(0)}, 80%, 68%, 0.5)`

  return (
    <div
      className="absolute left-0 right-0 top-0 z-[25] flex flex-col justify-center px-2 pointer-events-none"
      style={{ height: SPINE_NAV_H }}
    >
      <div ref={laneRef} className="relative w-full select-none pointer-events-auto">
        {/* ── Racecar — 1:1 with pointer while dragging (no motion tween) ── */}
        <div className="relative w-full" style={{ height: RACE_CAR_H + 4 }}>
          <div
            className="absolute top-0 z-20 cursor-grab touch-none active:cursor-grabbing"
            style={{
              left: `calc(${ratio} * (100% - ${RACE_CAR_W}px))`,
              width: RACE_CAR_W,
              filter: `drop-shadow(0 0 7px ${carGlow})`,
            }}
            onPointerDown={handleCarPointerDown}
            onPointerMove={handleCarPointerMove}
            onPointerUp={handleCarPointerUp}
            onPointerCancel={handleCarPointerUp}
            onLostPointerCapture={() => {
              isDragging.current = false
            }}
          >
            <RacecarIcon color={carColor} />
          </div>
        </div>

        {/* ── Track — single translucent surface ── */}
        <div
          ref={trackRef}
          className="relative mt-1 cursor-pointer overflow-hidden w-full"
          style={{ height: 10, borderRadius: 3, background: "rgba(255,255,255,0.07)" }}
          onClick={handleTrackClick}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              transform: "translateY(-50%)",
              background:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 9px, transparent 9px, transparent 20px)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ height: 1, background: "rgba(255,255,255,0.1)" }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Page Component ─────────────────────────────────────────────────────────────

export default function TimelineZigZag({ memories }: { memories: Memory[] }) {
  const hScrollRef = useRef<HTMLDivElement>(null)
  const layout     = useLayoutValues()

  return (
    <LayoutCtx.Provider value={layout}>
      <div className="px-2 sm:px-4 pt-10 sm:pt-16 md:pt-10 pb-16">

        {/* ── Vertical layout — md and below ── */}
        <div className="block lg:hidden relative">
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "8px",
              width: "1px",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.07) 4%, rgba(255,255,255,0.07) 96%, transparent 100%)",
            }}
          />
          {memories.map((memory, i) => (
            <VEntry key={`${memory.date}-${i}`} memory={memory} index={i} />
          ))}
        </div>

        {/* ── Horizontal layout — lg and above ── */}
        <div className="hidden lg:block">
          {/* Scroll area — no native scrollbar */}
          <div
            ref={hScrollRef}
            className="relative overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div
              className="hide-scrollbar relative flex flex-row"
              style={{ width: "max-content", height: layout.COL_H }}
            >
              <ScrollNav scrollRef={hScrollRef} />
              {memories.map((memory, i) => (
                <HEntry key={`${memory.date}-${i}`} memory={memory} index={i} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </LayoutCtx.Provider>
  )
}
