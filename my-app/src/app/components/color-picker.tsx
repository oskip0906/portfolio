"use client"
import { useState } from "react"
import { Palette, RotateCcw } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { motion, AnimatePresence } from "framer-motion"
import { useBackground } from "../contexts/background-context"
import { cn } from "@/lib/utils"
import { useHoverMenu } from "./use-hover-menu"

type Tab = "walls" | "ceiling" | "floor"

const TABS: { id: Tab; label: string }[] = [
  { id: "walls",   label: "Walls"   },
  { id: "ceiling", label: "Ceiling" },
  { id: "floor",   label: "Floor"   },
]

export default function ColorPicker() {
  const {
    wallColor,    setWallColor,    resetWallColor,
    ceilingColor, setCeilingColor, resetCeilingColor,
    floorColor,   setFloorColor,   resetFloorColor,
    roomTheme,
  } = useBackground()

  const { open: isOpen, setOpen: setIsOpen, hoverProps } = useHoverMenu()
  const [activeTab, setActiveTab] = useState<Tab>("walls")

  const tabConfig: Record<Tab, { color: string; onChange: (c: string) => void; onReset: () => void }> = {
    walls:   { color: wallColor,    onChange: setWallColor,    onReset: resetWallColor    },
    ceiling: { color: ceilingColor, onChange: setCeilingColor, onReset: resetCeilingColor },
    floor:   { color: floorColor,   onChange: setFloorColor,   onReset: resetFloorColor   },
  }

  const current = tabConfig[activeTab]

  return (
    <div className="relative flex-shrink-0" {...hoverProps}>
      {/* Palette Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white backdrop-blur-xl transition-transform hover:scale-105"
        style={{
          boxShadow: `0 18px 40px ${roomTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`,
        }}
        title="Customise room"
        aria-label="Customise room"
        aria-expanded={isOpen}
      >
        <Palette size={24} style={{ color: roomTheme.uiAccent }} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            // pt-3 (not mt-3) keeps the gap under the button hoverable, so the menu doesn't close on the way down
            className="absolute right-0 top-full z-[10000] w-[232px] pt-3"
          >
            <div
              className="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl border border-white/20 shadow-2xl backdrop-blur-xl"
              style={{ background: "rgba(20, 20, 30, 0.80)" }}
            >
              {/* Tab bar */}
              <div className="flex border-b border-white/10">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-medium uppercase tracking-widest transition-colors",
                      activeTab === tab.id
                        ? "text-white border-b-2 border-white/60 -mb-px"
                        : "text-white/40 hover:text-white/70"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Picker body */}
              <div className="p-4">
                <HexColorPicker
                  color={current.color}
                  onChange={current.onChange}
                  style={{ width: "100%", height: 180 }}
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/60">{current.color}</span>
                  <button
                    onClick={current.onReset}
                    className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                    title="Reset to default"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
