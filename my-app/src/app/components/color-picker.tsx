"use client"
import { useState } from "react"
import { Palette, RotateCcw } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { motion, AnimatePresence } from "framer-motion"
import { useBackground } from "../contexts/background-context"

export default function ColorPicker() {
  const { baseColor, setBaseColor, resetColor } = useBackground()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Palette Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white hover:scale-110 transition-transform"
        title="Theme Color"
      >
        <Palette size={18} />
      </button>

      {/* Color Wheel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 p-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
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
