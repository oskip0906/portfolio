"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import ColorPicker from "../color-picker"
import SpotifyPlayer from "../spotify-player"
import { SectionPanel } from "./room-panels"
import type { RoomHomePayload, RoomObjectId } from "./room-manifest"

export default function RoomOverlay({
  payload,
  focusedId,
  onFocusChange,
  onReset,
}: {
  payload: RoomHomePayload
  focusedId: RoomObjectId | null
  hoveredId: RoomObjectId | null
  onFocusChange: (id: RoomObjectId | null) => void
  onReset: () => void
}) {
  const [navOpen, setNavOpen] = useState(false)
  const allObjects = payload.objects
  const activeObject = allObjects.find((o) => o.id === focusedId) ?? null

  const tourIds = allObjects.map((o) => o.id)
  const currentIndex = focusedId ? tourIds.indexOf(focusedId) : -1
  const prevId = currentIndex > 0 ? tourIds[currentIndex - 1] : null
  const nextId =
    currentIndex >= 0 && currentIndex < tourIds.length - 1
      ? tourIds[currentIndex + 1]
      : null

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
            style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(3px)" }}
            onClick={onReset}
          />
        )}
      </AnimatePresence>

      {/* ── Centered modal ── */}
      <AnimatePresence>
        {focusedId && activeObject && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.8 }}
            className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto flex flex-col rounded-[24px] border border-white/15 overflow-hidden w-[92vw] md:w-[60%] h-[75vh] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              style={{
                background: "rgba(18, 13, 9, 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent stripe */}
              <div className="flex-shrink-0 h-[3px] w-full" style={{ background: activeObject.color }} />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 pt-4 pb-3 flex-shrink-0">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/50">
                    {activeObject.subtitle}
                  </p>
                  <h2 className="text-xl font-bold text-white leading-tight tracking-tight">
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

              {/* Scrollable section content */}
              <div className="flex-1 overflow-y-auto px-6 pb-2">
                <SectionPanel
                  id={activeObject.id}
                  payload={payload}
                  accentColor={activeObject.color}
                />
              </div>

              {/* Footer navigation */}
              <div className="flex-shrink-0 border-t border-white/8 px-6 py-3 flex items-center justify-between">
                <button
                  onClick={() => prevId && onFocusChange(prevId)}
                  disabled={!prevId}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <ChevronLeft size={13} /> Prev
                </button>

                <span className="text-[10px] text-white/40 tabular-nums">
                  {currentIndex >= 0 ? `${currentIndex + 1} / ${tourIds.length}` : ""}
                </span>

                <button
                  onClick={() => nextId && onFocusChange(nextId)}
                  disabled={!nextId}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HUD controls — always visible ── */}
      <div className="pointer-events-auto absolute right-4 top-4 flex items-center gap-3 sm:right-6 sm:top-6">
        <ColorPicker variant="hud" />
        <SpotifyPlayer variant="hud" />
      </div>

      {/* ── Section navigation dock ── */}
      {!focusedId && (
        <div className="pointer-events-auto absolute left-4 top-4 sm:left-6 sm:top-6">
          <button
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Browse sections"
            aria-expanded={navOpen}
            className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3.5 text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform hover:scale-105"
          >
            <Menu size={16} />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
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
                className="mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
              >
                {allObjects.map((object) => (
                  <button
                    key={object.id}
                    onClick={() => {
                      onFocusChange(object.id)
                      setNavOpen(false)
                    }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
