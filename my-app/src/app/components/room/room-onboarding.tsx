"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Hand, MousePointerClick, X, ZoomIn } from "lucide-react"

const STORAGE_KEY = "boba-room-onboarding-seen"

export default function RoomOnboarding({ hidden }: { hidden?: boolean }) {
  const [seen, setSeen] = useState(true)

  useEffect(() => {
    setSeen(Boolean(window.localStorage.getItem(STORAGE_KEY)))
  }, [])

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "1")
    setSeen(true)
  }

  return (
    <AnimatePresence>
      {!seen && !hidden && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:bottom-6"
        >
          <div
            className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-black/85 px-4 py-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:gap-5"
          >
            <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-white/80">
                <Hand size={15} className="text-white/50" />
                Drag to look around
              </span>
              <span className="flex items-center gap-1.5 text-white/80">
                <ZoomIn size={15} className="text-white/50" />
                Scroll or pinch to zoom
              </span>
              <span className="flex items-center gap-1.5 text-white/80">
                <MousePointerClick size={15} className="text-white/50" />
                Click a cup to open it
              </span>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss tutorial"
              className="flex-shrink-0 rounded-full border border-white/10 bg-white/[0.06] p-1.5 text-white transition-colors hover:bg-white/14"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
