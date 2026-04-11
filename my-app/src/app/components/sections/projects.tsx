"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, Tag, ArrowRight, Code2, Layers, Sparkles, Zap, ChevronRight } from "lucide-react"
import { type Project } from "@/lib/database"

// Generate consistent pseudo-random values for each project
function getProjectFeatures(index: number) {
  const features = [
    ["Responsive Design", "API Integration", "Real-time Updates"],
    ["Authentication", "Database", "Cloud Hosting"],
    ["Mobile First", "Performance", "Accessibility"],
    ["Animations", "Dark Mode", "SEO Optimized"],
    ["Microservices", "CI/CD", "Testing"],
  ]
  return features[index % features.length]
}

function getProjectStats(index: number) {
  const stats = [
    { lines: "2.5K+", files: "45", commits: "120+" },
    { lines: "5K+", files: "78", commits: "200+" },
    { lines: "3.2K+", files: "52", commits: "85+" },
    { lines: "8K+", files: "95", commits: "350+" },
    { lines: "1.8K+", files: "32", commits: "65+" },
  ]
  return stats[index % stats.length]
}

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
  const features = getProjectFeatures(current)
  const stats = getProjectStats(current)

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
        <div className="relative min-h-[70vh]">
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
                  <span className="text-[12rem] font-black text-white/[0.02] block">
                    {String(current + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-xl pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-purple-500/20 rounded-br-xl pointer-events-none" />

                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent" />

                <div className="p-8 lg:p-10">
                  {/* Number + action row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {String(current + 1).padStart(2, "0")}
                      </span>
                      <div className="h-12 w-px bg-gradient-to-b from-cyan-400/50 to-transparent" />
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Project</span>
                        <span className="text-sm text-gray-400">{projects.length} Total</span>
                      </div>
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 text-cyan-300 text-sm font-semibold hover:border-cyan-400/50 hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300"
                    >
                      <ExternalLink size={14} />
                      <span>View Project</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                    <Sparkles size={14} className="text-cyan-400/60" />
                    <div className="h-px w-8 bg-purple-400/30 rounded-full" />
                  </div>

                  <p className="text-gray-300 leading-relaxed text-base lg:text-lg mb-8">
                    {project.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Code2 size={18} className="text-cyan-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.lines}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Lines of Code</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Layers size={18} className="text-purple-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.files}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Files</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Zap size={18} className="text-pink-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.commits}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Commits</div>
                    </motion.div>
                  </div>

                  {/* Features Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={14} className="text-cyan-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Key Features</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, i) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                        >
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom metadata bar */}
                  <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2 min-w-0">
                        {project.type && (
                          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-400/30 text-sm font-semibold tracking-wide text-cyan-300">
                            <Tag size={12} className="opacity-70 shrink-0" />
                            <span>{project.type}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        <Calendar size={14} className="shrink-0" />
                        <span className="text-sm font-medium">{project.date}</span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Progress</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((current + 1) / projects.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 tabular-nums">{current + 1}/{projects.length}</span>
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
  const features = getProjectFeatures(index)
  const stats = getProjectStats(index)
  
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent" />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-cyan-400/50 to-transparent" />
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
          >
            {linkIcon}
            <span>View</span>
          </a>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
          <Sparkles size={10} className="text-cyan-400/60" />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-5">{item.description}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <Code2 size={14} className="text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{stats.lines}</div>
            <div className="text-[10px] text-gray-400 uppercase">Lines</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <Layers size={14} className="text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{stats.files}</div>
            <div className="text-[10px] text-gray-400 uppercase">Files</div>
          </div>
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
            <Zap size={14} className="text-pink-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{stats.commits}</div>
            <div className="text-[10px] text-gray-400 uppercase">Commits</div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {features.map((feature) => (
            <span key={feature} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2 min-w-0">
            {item.type && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
                <Tag size={10} className="shrink-0" />
                <span>{item.type}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 shrink-0 sm:ml-auto">
            <Calendar size={12} className="shrink-0" />
            <span className="text-xs">{item.date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
