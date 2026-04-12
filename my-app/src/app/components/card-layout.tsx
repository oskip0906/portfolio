"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { hexToHsl, getAccentColors } from "@/lib/utils"

export { hexToHsl, getAccentColors }

// ── Sidebar navigation ──────────────────────────────────────────────────────

interface SidebarNavProps {
  items: { name: string }[]
  current: number
  onSelect: (i: number) => void
  activeNumClass?: string
  activeArrowClass?: string
}

export function SidebarNav({
  items,
  current,
  onSelect,
  activeNumClass = "text-cyan-400",
  activeArrowClass = "text-cyan-400",
}: SidebarNavProps) {
  return (
    <div className="col-span-1 flex flex-col gap-1 sticky top-8">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 ${
            i === current
              ? "bg-white/10 border border-white/20"
              : "hover:bg-white/5 border border-transparent"
          }`}
        >
          <span className={`text-xs font-mono font-bold tabular-nums w-6 flex-shrink-0 ${
            i === current ? activeNumClass : "text-white/30 group-hover:text-white/50"
          }`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={`text-sm font-medium truncate ${
            i === current ? "text-white" : "text-white/50 group-hover:text-white/80"
          }`}>
            {item.name}
          </span>
          {i === current && <ArrowRight size={12} className={`ml-auto flex-shrink-0 ${activeArrowClass}`} />}
        </button>
      ))}
    </div>
  )
}

// ── Card shell (desktop) ────────────────────────────────────────────────────

interface CardShellProps {
  current: number
  accent: string
  accentLight: string
  cornerTL?: string
  cornerBR?: string
  children: React.ReactNode
}

export function CardShell({
  current,
  accent,
  accentLight,
  cornerTL = "border-cyan-500/20",
  cornerBR = "border-purple-500/20",
  children,
}: CardShellProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Big watermark number */}
        <div className="absolute top-0 right-0 leading-none select-none pointer-events-none overflow-hidden rounded-tr-3xl">
          <span className="text-[12rem] font-black text-white/[0.02] block">
            {String(current + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Decorative corners */}
        <div className={`absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 ${cornerTL} rounded-tl-xl pointer-events-none`} />
        <div className={`absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 ${cornerBR} rounded-br-xl pointer-events-none`} />

        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${accent}99, ${accentLight}60, transparent)` }} />

        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Progress bar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  current: number
  total: number
  gradientClass?: string
}

export function ProgressBar({ current, total, gradientClass = "from-cyan-400 to-purple-400" }: ProgressBarProps) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradientClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>
      <span className="text-xs text-gray-500 tabular-nums">{current + 1}/{total}</span>
    </div>
  )
}

// ── Mobile card base (wrapper + accent bar + number header) ─────────────────

interface MobileCardBaseProps {
  index: number
  accent: string
  accentLight: string
  dividerClass?: string
  link: string
  linkContent: React.ReactNode
  children: React.ReactNode
}

export function MobileCardBase({
  index,
  accent,
  accentLight,
  dividerClass = "from-cyan-400/50",
  link,
  linkContent,
  children,
}: MobileCardBaseProps) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${accent}99, ${accentLight}60, transparent)` }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${accent}, ${accentLight})` }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={`h-8 w-px bg-gradient-to-b ${dividerClass} to-transparent`} />
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkContent}
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
