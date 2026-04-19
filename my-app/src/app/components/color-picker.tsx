"use client"
import { useState } from "react"
import { Palette, RotateCcw } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { motion, AnimatePresence } from "framer-motion"
import { useBackground } from "../contexts/background-context"
import { cn } from "@/lib/utils"

export default function ColorPicker({
  variant = "nav",
}: {
  variant?: "nav" | "hud"
}) {
  const { baseColor, setBaseColor, resetColor, roomTheme } = useBackground()
  const [isOpen, setIsOpen] = useState(false)
  const isHud = variant === "hud"

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
            ? "flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.08] shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            : "p-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
        )}
        style={isHud ? {
          boxShadow: `0 18px 40px ${roomTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`,
        } : undefined}
        title="Adjust room lighting"
        aria-label="Adjust room lighting"
      >
        <Palette size={isHud ? 16 : 18} style={isHud ? { color: roomTheme.uiAccent } : undefined} />
      </button>

      {/* Color Wheel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full mt-3 p-4 rounded-xl backdrop-blur-xl border border-white/20 shadow-2xl z-[10000]",
              isHud ? "right-0" : "left-1/2 -translate-x-1/2"
            )}
            style={{
              background: "rgba(20, 20, 30, 0.68)"
            }}
          >
            <HexColorPicker
              color={baseColor}
              onChange={setBaseColor}
              style={{ width: '200px', height: '200px' }}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-mono text-white/70">{baseColor}</span>
              <button
                onClick={resetColor}
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Reset to default"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
