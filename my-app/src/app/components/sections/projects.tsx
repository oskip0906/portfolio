"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, Tag, ArrowRight, ChevronUp, ChevronDown, Code2, Layers } from "lucide-react"
import { type Project } from "@/lib/database"

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data: Project[] = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const scrollPrev = useCallback(() => setCurrent((p) => Math.max(0, p - 1)), [])
  const scrollNext = useCallback(() => setCurrent((p) => Math.min(projects.length - 1, p + 1)), [projects.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') scrollPrev()
      else if (e.key === 'ArrowDown') scrollNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollPrev, scrollNext])

  if (isLoading) return null

  const project = projects[current]

  return (
    <section id="projects" className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Mobile: Full-screen stacked cards */}
      <div className="md:hidden">
        <div className="space-y-8 pb-4">
          {projects.map((item, i) => (
            <MobileCard
              key={`${item.name}-${i}`}
              item={item}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Full-screen immersive layout */}
      <div className="hidden md:flex md:gap-8 lg:gap-12 items-stretch min-h-[calc(100vh-120px)]">
        {/* Left sidebar - Project navigation */}
        <div className="w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col">
          <div className="sticky top-6 flex flex-col h-[calc(100vh-140px)]">
            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                  <Code2 size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Projects</h2>
                  <p className="text-xs text-white/40">{projects.length} works</p>
                </div>
              </div>
            </div>

            {/* Project list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {projects.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 ${
                    i === current
                      ? "bg-gradient-to-r from-cyan-500/15 to-purple-500/10 border border-cyan-400/30 shadow-lg shadow-cyan-500/5"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className={`text-xs font-mono font-bold tabular-nums w-6 flex-shrink-0 ${
                    i === current ? "text-cyan-400" : "text-white/30 group-hover:text-white/50"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block truncate ${
                      i === current ? "text-white" : "text-white/50 group-hover:text-white/80"
                    }`}>
                      {p.name}
                    </span>
                    {i === current && p.type && (
                      <span className="text-xs text-cyan-400/70 mt-0.5 block">{p.type}</span>
                    )}
                  </div>
                  {i === current && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"
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
                <span className="text-sm font-mono text-cyan-400">{current + 1}</span>
                <span className="text-sm text-white/30"> / {projects.length}</span>
              </div>
              <button
                onClick={scrollNext}
                disabled={current === projects.length - 1}
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
            {project && (
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
                  <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                  
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
                </div>

                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />

                <div className="relative p-8 lg:p-12 xl:p-16 h-full flex flex-col">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                        <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {String(current + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white/40 uppercase tracking-wider font-medium">Project</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={14} className="text-white/40" />
                          <span className="text-sm text-white/60">{project.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-white font-semibold hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300"
                    >
                      <span>View Project</span>
                      <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Title section */}
                  <div className="flex-1 flex flex-col justify-center max-w-3xl">
                    <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight text-balance">
                      {project.name}
                    </h3>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                      {project.type && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-400/25">
                          <Layers size={14} className="text-cyan-400" />
                          <span className="text-sm font-semibold text-cyan-300">{project.type}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer with tags */}
                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-white/40" />
                      <span className="text-sm text-white/40">Technologies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.type?.split(',').map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                          {tech.trim()}
                        </span>
                      ))}
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
  item: Project
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
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
              <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Project {index + 1} of {total}</p>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/25 transition-colors"
          >
            <ExternalLink size={14} />
            <span>View</span>
          </a>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{item.name}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
          {item.type && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20">
              <Layers size={12} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300">{item.type}</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  )
}
