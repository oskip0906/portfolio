"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, FlaskConical, BookOpen, ArrowRight, Quote, Lightbulb, Target, ChevronRight, Code2 } from "lucide-react"
import { type Research } from "@/lib/database"

// Tech stack per research paper
const RESEARCH_TECH: Record<string, string[]> = {
  "H-WM System": ["Python", "PyTorch", "ROS2", "Vision-Language Models", "Symbolic AI"],
  "FORG3D Toolkit": ["Python", "Blender", "PyTorch", "Stable Diffusion", "OpenCV"],
  "H5N1 Social Media Analysis": ["Python", "PRAW", "NLTK", "scikit-learn", "Pandas"],
}

const RESEARCH_FINDINGS: Record<string, string[]> = {
  "H-WM System": [
    "Hierarchical guidance enables stable long-horizon task execution",
    "Integrates symbolic reasoning with perceptual grounding for VLA models",
  ],
  "FORG3D Toolkit": [
    "Configurable 3D rendering pipeline for spatial reasoning datasets",
    "AI-generated backgrounds enhance realism of training data",
  ],
  "H5N1 Social Media Analysis": [
    "Identified sentiment trends across US states during H5N1 outbreaks",
    "Reddit data reveals public concern patterns correlated with outbreak events",
  ],
}

function getResearchTech(name: string): string[] {
  return RESEARCH_TECH[name] ?? ["Python", "Research Tools"]
}

function getKeyFindings(name: string): string[] {
  return RESEARCH_FINDINGS[name] ?? ["Contributed novel insights to the field", "Results published in peer-reviewed venue"]
}

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
  const techStack = paper ? getResearchTech(paper.name) : []
  const findings = paper ? getKeyFindings(paper.name) : []

  return (
    <section id="research" className="w-full px-4 sm:px-6 md:px-10">
      {/* Mobile: stacked cards */}
      <div className="md:hidden">
        <div className="space-y-6 pb-2">
          {papers.map((item, i) => (
            <MobileResearchCard key={`${item.name}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Sidebar */}
        <div className="flex flex-col gap-1 sticky top-8">
          {papers.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 ${
                i === current
                  ? "bg-white/10 border border-white/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`text-xs font-mono font-bold tabular-nums w-6 flex-shrink-0 ${i === current ? "text-purple-400" : "text-white/30 group-hover:text-white/50"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-medium truncate ${i === current ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                {p.name}
              </span>
              {i === current && <ArrowRight size={12} className="ml-auto flex-shrink-0 text-purple-400" />}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="relative min-h-[70vh]">
          <AnimatePresence mode="wait">
            {paper && (
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
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-purple-500/20 rounded-tl-xl pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-500/20 rounded-br-xl pointer-events-none" />

                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-purple-500/60 via-cyan-500/40 to-transparent" />

                <div className="p-8 lg:p-10">
                  {/* Number + action row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {String(current + 1).padStart(2, "0")}
                      </span>
                      <div className="h-12 w-px bg-gradient-to-b from-purple-400/50 to-transparent" />
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Research</span>
                        <span className="text-sm text-gray-400">{papers.length} Publications</span>
                      </div>
                    </div>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/30 text-purple-300 text-sm font-semibold hover:border-purple-400/50 hover:from-purple-500/20 hover:to-cyan-500/20 transition-all duration-300"
                    >
                      <BookOpen size={14} />
                      <span>Read Paper</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                    {paper.name}
                  </h3>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                    <Quote size={14} className="text-purple-400/60" />
                    <div className="h-px w-8 bg-cyan-400/30 rounded-full" />
                  </div>

                  <p className="text-gray-300 leading-relaxed text-base lg:text-lg mb-8">
                    {paper.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Code2 size={14} className="text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 + i * 0.04 }}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300 font-medium cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb size={14} className="text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Key Findings</span>
                    </div>
                    <div className="space-y-2">
                      {findings.map((finding, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <Target size={14} className="text-purple-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">{finding}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom metadata bar */}
                  <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex flex-wrap gap-2 min-w-0">
                        {paper.published_to && (
                          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-sm font-medium text-gray-300">
                            <BookOpen size={12} className="opacity-60 shrink-0" />
                            <span>{paper.published_to}</span>
                          </div>
                        )}
                        {paper.focus && (
                          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/15 to-cyan-500/15 border border-purple-400/30 text-sm font-semibold tracking-wide text-purple-300">
                            <FlaskConical size={12} className="opacity-70 shrink-0" />
                            <span>{paper.focus}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        <Calendar size={14} className="shrink-0" />
                        <span className="text-sm font-medium">{paper.date}</span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((current + 1) / papers.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 tabular-nums">{current + 1}/{papers.length}</span>
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

function MobileResearchCard({ item, index }: { item: Research; index: number }) {
  const techStack = getResearchTech(item.name)
  const findings = getKeyFindings(item.name)

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="h-1 w-full bg-gradient-to-r from-purple-500/60 via-cyan-500/40 to-transparent" />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-purple-400/50 to-transparent" />
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm font-semibold hover:bg-purple-500/20 transition-colors"
          >
            <BookOpen size={12} />
            <span>Read</span>
          </a>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
          <Quote size={10} className="text-purple-400/60" />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-5">{item.description}</p>

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Code2 size={12} className="text-purple-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span key={tech} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Finding */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-5">
          <div className="flex items-start gap-2">
            <Lightbulb size={12} className="text-purple-400 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-300">{findings[0]}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2 min-w-0">
            {item.published_to && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs text-gray-300">
                <BookOpen size={10} className="opacity-60 shrink-0" />
                <span>{item.published_to}</span>
              </div>
            )}
            {item.focus && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20 text-xs font-semibold text-purple-300">
                <FlaskConical size={10} className="shrink-0" />
                <span>{item.focus}</span>
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
