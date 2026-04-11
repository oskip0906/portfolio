"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, FlaskConical, BookOpen, ArrowRight, ChevronUp, ChevronDown, Microscope, Sparkles } from "lucide-react"
import { type Research } from "@/lib/database"

export default function Research() {
  const [papers, setPapers] = useState<Research[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/research')
        if (!response.ok) throw new Error('Failed to fetch research')
        const data: Research[] = await response.json()
        setPapers(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const scrollPrev = useCallback(() => setCurrent((p) => Math.max(0, p - 1)), [])
  const scrollNext = useCallback(() => setCurrent((p) => Math.min(papers.length - 1, p + 1)), [papers.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') scrollPrev()
      else if (e.key === 'ArrowDown') scrollNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollPrev, scrollNext])

  if (isLoading) return null

  const paper = papers[current]

  return (
    <section id="research" className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Mobile: Full-screen stacked cards */}
      <div className="md:hidden">
        <div className="space-y-8 pb-4">
          {papers.map((item, i) => (
            <MobileCard
              key={`${item.name}-${i}`}
              item={item}
              index={i}
              total={papers.length}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Full-screen immersive layout */}
      <div className="hidden md:flex md:gap-8 lg:gap-12 items-stretch min-h-[calc(100vh-120px)]">
        {/* Left sidebar - Research navigation */}
        <div className="w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col">
          <div className="sticky top-6 flex flex-col h-[calc(100vh-140px)]">
            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Microscope size={18} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Research</h2>
                  <p className="text-xs text-white/40">{papers.length} publications</p>
                </div>
              </div>
            </div>

            {/* Research list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {papers.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 ${
                    i === current
                      ? "bg-gradient-to-r from-purple-500/15 to-cyan-500/10 border border-purple-400/30 shadow-lg shadow-purple-500/5"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className={`text-xs font-mono font-bold tabular-nums w-6 flex-shrink-0 ${
                    i === current ? "text-purple-400" : "text-white/30 group-hover:text-white/50"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block truncate ${
                      i === current ? "text-white" : "text-white/50 group-hover:text-white/80"
                    }`}>
                      {p.name}
                    </span>
                    {i === current && p.focus && (
                      <span className="text-xs text-purple-400/70 mt-0.5 block">{p.focus}</span>
                    )}
                  </div>
                  {i === current && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Navigation controls */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={scrollPrev}
                disabled={current === 0}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronUp size={18} />
              </button>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-sm font-mono text-purple-400">{current + 1}</span>
                <span className="text-sm text-white/30"> / {papers.length}</span>
              </div>
              <button
                onClick={scrollNext}
                disabled={current === papers.length - 1}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content card - Full height */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {paper && (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Decorative background elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Gradient orbs */}
                  <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                  
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }} />
                  
                  {/* Large watermark number */}
                  <div className="absolute -top-8 -right-8 leading-none select-none">
                    <span className="text-[16rem] lg:text-[20rem] font-black text-white/[0.02]">
                      {String(current + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" />
                  <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-pulse delay-300" />
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-700" />
                </div>

                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500" />

                <div className="relative p-8 lg:p-12 xl:p-16 h-full flex flex-col">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                          {String(current + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white/40 uppercase tracking-wider font-medium">Research</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={14} className="text-white/40" />
                          <span className="text-sm text-white/60">{paper.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 text-white font-semibold hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300"
                    >
                      <span>Read Paper</span>
                      <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
                    </a>
                  </div>

                  {/* Title section */}
                  <div className="flex-1 flex flex-col justify-center max-w-3xl">
                    <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight text-balance">
                      {paper.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                      {paper.focus && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/15 to-cyan-500/15 border border-purple-400/25">
                          <FlaskConical size={14} className="text-purple-400" />
                          <span className="text-sm font-semibold text-purple-300">{paper.focus}</span>
                        </div>
                      )}
                      {paper.published_to && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15">
                          <Sparkles size={14} className="text-white/50" />
                          <span className="text-sm font-medium text-white/70">{paper.published_to}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                      {paper.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-white/40" />
                      <span className="text-sm text-white/40">Academic Research</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-xs font-medium text-purple-300">
                        Publication
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function MobileCard({ item, index, total }: {
  item: Research
  index: number
  total: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
              <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Research {index + 1} of {total}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar size={12} className="text-white/40" />
                <span className="text-xs text-white/50">{item.date}</span>
              </div>
            </div>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-300 text-sm font-semibold hover:bg-purple-500/25 transition-colors"
          >
            <BookOpen size={14} />
            <span>Read</span>
          </a>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{item.name}</h3>
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
          {item.focus && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20">
              <FlaskConical size={12} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-300">{item.focus}</span>
            </div>
          )}
          {item.published_to && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/15">
              <Sparkles size={11} className="text-white/50" />
              <span className="text-xs text-white/60">{item.published_to}</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  )
}
