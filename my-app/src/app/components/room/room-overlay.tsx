"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Menu, X } from "lucide-react"
import ColorPicker from "../color-picker"
import SpotifyPlayer from "../spotify-player"
import { useHoverMenu } from "../use-hover-menu"
import { SectionPanel } from "./room-panels"
import type { RoomHomePayload, RoomObjectId, RoomObjectManifest } from "./room-manifest"

function SectionsList({
  objects,
  onSelect,
}: {
  objects: RoomObjectManifest[]
  onSelect: (id: RoomObjectId) => void
}) {
  return (
    <>
      {objects.map((object) => (
        <button
          key={object.id}
          onClick={() => onSelect(object.id)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10"
        >
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ background: object.color }}
          />
          <span className="flex-1 text-sm text-white/85">{object.label}</span>
          {object.shortcut && (
            <span className="text-[10px] text-white/35 tabular-nums">{object.shortcut}</span>
          )}
        </button>
      ))}
    </>
  )
}

export default function RoomOverlay({
  payload,
  focusedId,
  onFocusChange,
  onReset,
}: {
  payload: RoomHomePayload
  focusedId: RoomObjectId | null
  onFocusChange: (id: RoomObjectId | null) => void
  onReset: () => void
}) {
  const { open: navOpen, setOpen: setNavOpen, hoverProps: navHoverProps } = useHoverMenu()
  const allObjects = payload.objects
  const activeObject = allObjects.find((o) => o.id === focusedId) ?? null

  // Never let the sections dropdown sit open behind a freshly-opened popup.
  useEffect(() => {
    if (focusedId) setNavOpen(false)
  }, [focusedId, setNavOpen])

  return (
    <div className="pointer-events-none fixed inset-0 z-20">

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {focusedId && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 pointer-events-auto"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
            onClick={onReset}
          />
        )}
      </AnimatePresence>

      {/* ── Section popup — frosted-glass panel, height-clamped so it can
           never grow tall enough to reach the sections dock / HUD icons,
           on any screen height ── */}
      <AnimatePresence>
        {focusedId && activeObject && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.8 }}
            className="absolute inset-0 flex items-start justify-center pointer-events-none pb-4 pt-[max(12.5dvh,5.5rem)] sm:items-center sm:p-6"
          >
            <div
              // 11rem = 2 x 5.5rem: the dock/HUD row (top offset + button height
              // + breathing room) never exceeds ~5.5rem at any breakpoint, and
              // centering always splits the leftover space evenly top/bottom —
              // so capping the height this way guarantees >= 5.5rem of clearance
              // above (and below) the popup no matter how short the viewport is.
              // Phones keep that same top gap (max(12.5dvh, 5.5rem) is where the
              // centered popup started) but stretch down to a small bottom margin.
              className="pointer-events-auto flex h-full w-[92vw] sm:h-[min(75dvh,calc(100dvh-11rem))] flex-col overflow-hidden rounded-3xl border border-white/[0.14] bg-neutral-950/80 shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:w-[85vw] md:w-[75vw] lg:w-[65vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent stripe */}
              <div className="flex-shrink-0 h-[3px] w-full" style={{ background: activeObject.color }} />

              {/* Header */}
              <div className="flex flex-shrink-0 items-center justify-between gap-4 px-4 pt-5 pb-4 sm:px-7">
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold leading-tight tracking-tight text-white">
                    {activeObject.label}
                  </h2>
                </div>
                <button
                  onClick={onReset}
                  aria-label="Close"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors hover:bg-white/14"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Section content — fills remaining space */}
              <div className="flex-1 overflow-y-auto px-4 pb-5 sm:px-7 sm:pb-7">
                <SectionPanel
                  id={activeObject.id}
                  payload={payload}
                  accentColor={activeObject.color}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar: one flex row, so the sections dock and the HUD can never
           overlap — the player's text truncates first on narrow screens ── */}
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
        {/* ── Section navigation dock — ALWAYS visible, opens on hover ── */}
        <div className="pointer-events-auto relative z-10 flex-shrink-0" {...navHoverProps}>
          <button
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Browse sections"
            aria-expanded={navOpen}
            className="flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-black/80 px-3.5 text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform hover:scale-105 sm:px-4"
          >
            <Menu size={18} />
            <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-white/70 sm:inline">
              Sections
            </span>
          </button>

          <AnimatePresence>
            {navOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                // pt-2 (not mt-2) keeps the gap under the button hoverable, so the menu doesn't close on the way down
                className="absolute left-0 top-full w-60 pt-2"
              >
                <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-white/10 bg-black/90 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <SectionsList
                    objects={allObjects}
                    onSelect={(id) => {
                      onFocusChange(id)
                      setNavOpen(false)
                    }}
                  />
                  <div className="my-1 border-t border-white/10" />
                  <Link
                    href="/"
                    onClick={() => setNavOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10"
                  >
                    <ArrowLeft size={14} className="flex-shrink-0 text-white/50" />
                    <span className="flex-1 text-sm text-white/85">Go back</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── HUD controls — always visible ── */}
        <div className="relative pointer-events-auto flex min-w-0 items-center gap-3">
          <SpotifyPlayer />
          <ColorPicker />
        </div>
      </div>
    </div>
  )
}
