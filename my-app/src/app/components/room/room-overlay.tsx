"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
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
              className="pointer-events-auto flex flex-col rounded-[24px] border border-white/10 overflow-hidden w-[92vw] md:w-[60%]"
              style={{
                height: "75vh",
                background: "rgba(9, 6, 3, 0.98)",
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
                  className="mt-0.5 flex-shrink-0 rounded-full border border-white/10 bg-white/[0.06] p-2 text-white transition-colors hover:bg-white/14"
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
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <ChevronLeft size={13} /> Prev
                </button>

                <span className="text-[10px] text-white/40 tabular-nums">
                  {currentIndex >= 0 ? `${currentIndex + 1} / ${tourIds.length}` : ""}
                </span>

                <button
                  onClick={() => nextId && onFocusChange(nextId)}
                  disabled={!nextId}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-20"
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
    </div>
  )
}
