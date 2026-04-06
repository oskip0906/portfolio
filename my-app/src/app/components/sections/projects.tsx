"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, Tag, ArrowRight } from "lucide-react"
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
    <section id="projects" className="w-full px-4 sm:px-6 md:px-10">
      {/* Mobile: stacked cards */}
      <div className="md:hidden">
        <div className="space-y-6 pb-2">
          {projects.map((item, i) => (
            <MobileCard
              key={`${item.name}-${i}`}
              item={item}
              index={i}
              linkIcon={<ExternalLink size={14} />}
            />
          ))}
        </div>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Sidebar */}
        <div className="flex flex-col gap-1 sticky top-8">
          {projects.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 ${
                i === current
                  ? "bg-white/10 border border-white/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`text-xs font-mono font-bold tabular-nums w-6 flex-shrink-0 ${i === current ? "text-cyan-400" : "text-white/30 group-hover:text-white/50"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-medium truncate ${i === current ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                {p.name}
              </span>
              {i === current && <ArrowRight size={12} className="ml-auto flex-shrink-0 text-cyan-400" />}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="relative min-h-[55vh]">
          <AnimatePresence mode="wait">
            {project && (
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
                  <span className="text-[10rem] font-black text-white/[0.03] block">
                    {String(current + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Top accent bar */}
                <div className="h-px w-full bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent" />

                <div className="p-8 lg:p-10">
                  {/* Number + action row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {String(current + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
                    >
                      <ExternalLink size={13} />
                      View
                    </a>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {project.name}
                  </h3>

                  <div className="h-px w-16 bg-gradient-to-r from-cyan-400 to-purple-400 mb-5 rounded-full" />

                  <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                    {project.description}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex flex-wrap gap-2 min-w-0">
                      {project.type && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 text-xs font-semibold tracking-wide text-cyan-300">
                          <Tag size={11} className="opacity-70 shrink-0" />
                          <span>{project.type}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 shrink-0 sm:ml-auto">
                      <Calendar size={15} className="shrink-0" />
                      <span className="text-sm font-medium">{project.date}</span>
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

function MobileCard({ item, index, linkIcon }: {
  item: Project
  index: number
  linkIcon: React.ReactNode
}) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="h-px w-full bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
          >
            {linkIcon}
            <span>View</span>
          </a>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
        <div className="h-px w-10 bg-gradient-to-r from-cyan-400 to-purple-400 mb-3 rounded-full" />
        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex flex-wrap gap-2 min-w-0">
            {item.type && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
                <Tag size={10} className="shrink-0" />
                <span>{item.type}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 shrink-0 sm:ml-auto">
            <Calendar size={13} className="shrink-0" />
            <span className="text-sm">{item.date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
