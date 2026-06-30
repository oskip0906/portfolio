"use client"
import { useState } from "react"
import { Palette, RotateCcw } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { motion, AnimatePresence } from "framer-motion"
import { useBackground } from "../contexts/background-context"
import { cn } from "@/lib/utils"

type Tab = "walls" | "ceiling" | "floor"

const TABS: { id: Tab; label: string }[] = [
  { id: "walls",   label: "Walls"   },
  { id: "ceiling", label: "Ceiling" },
  { id: "floor",   label: "Floor"   },
]

export default function ColorPicker({
  variant = "nav",
}: {
  variant?: "nav" | "hud"
}) {
  const {
    wallColor,    setWallColor,    resetWallColor,
    ceilingColor, setCeilingColor, resetCeilingColor,
    floorColor,   setFloorColor,   resetFloorColor,
    roomTheme,
  } = useBackground()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("walls")
  const isHud = variant === "hud"

  const tabConfig: Record<Tab, { color: string; onChange: (c: string) => void; onReset: () => void }> = {
    walls:   { color: wallColor,    onChange: setWallColor,    onReset: resetWallColor    },
    ceiling: { color: ceilingColor, onChange: setCeilingColor, onReset: resetCeilingColor },
    floor:   { color: floorColor,   onChange: setFloorColor,   onReset: resetFloorColor   },
  }

  const current = tabConfig[activeTab]

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Palette Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full text-white transition-transform hover:scale-110",
          isHud
            ? "flex h-11 w-11 items-center justify-center border border-white/10 bg-black/80 shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            : "p-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
        )}
        style={isHud ? {
          boxShadow: `0 18px 40px ${roomTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`,
        } : undefined}
        title="Customise room"
        aria-label="Customise room"
      >
        <Palette size={isHud ? 16 : 18} style={isHud ? { color: roomTheme.uiAccent } : undefined} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full mt-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-2xl z-[10000] overflow-hidden",
              isHud ? "right-0" : "left-1/2 -translate-x-1/2"
            )}
            style={{ background: "rgba(20, 20, 30, 0.80)", width: 232 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
