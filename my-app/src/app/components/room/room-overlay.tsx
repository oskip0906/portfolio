"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import ColorPicker from "../color-picker"
import SpotifyPlayer from "../spotify-player"
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
  hoveredId: RoomObjectId | null
  onFocusChange: (id: RoomObjectId | null) => void
  onReset: () => void
}) {
  const [navOpen, setNavOpen] = useState(false)
  const allObjects = payload.objects
  const activeObject = allObjects.find((o) => o.id === focusedId) ?? null

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
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
            onClick={onReset}
          />
        )}
      </AnimatePresence>

      {/* ── Section popup — 75vw × 90vh frosted-glass panel: barely-there frame, opaque content ── */}
      <AnimatePresence>
        {focusedId && activeObject && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.8 }}
            className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none sm:p-6"
          >
            <div
              className="pointer-events-auto flex h-[75vh] w-[75vw] flex-col overflow-hidden rounded-3xl bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent stripe */}
              <div className="flex-shrink-0 h-[3px] w-full" style={{ background: activeObject.color }} />

              {/* Header */}
              <div className="flex flex-shrink-0 items-center justify-between gap-4 px-7 pt-5 pb-4">
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
              <div className="flex-1 overflow-y-auto px-7 pb-7">
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

      {/* ── HUD controls — always visible ── */}
      <div className="pointer-events-auto absolute right-4 top-4 flex items-center gap-3 sm:right-6 sm:top-6">
        <ColorPicker variant="hud" />
        <SpotifyPlayer variant="hud" />
      </div>

      {/* ── Section navigation dock — ALWAYS visible, whether a popup is open or not ── */}
      <div className="pointer-events-auto absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
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
              <SectionsList
                objects={allObjects}
                onSelect={(id) => {
                  onFocusChange(id)
                  setNavOpen(false)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
