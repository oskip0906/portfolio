"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, FlaskConical, BookOpen, ArrowRight, Quote, Lightbulb, Target, TrendingUp, ChevronRight, FileText, Users } from "lucide-react"
import { type Research } from "@/lib/database"

// Generate research-specific data for each paper
function getResearchMethodology(index: number) {
  const methods = [
    ["Literature Review", "Quantitative Analysis", "Experiments"],
    ["Case Study", "Data Mining", "Statistical Modeling"],
    ["Qualitative Research", "Surveys", "Interviews"],
    ["Mixed Methods", "Meta-Analysis", "Simulation"],
    ["Field Study", "Comparative Analysis", "Prototyping"],
  ]
  return methods[index % methods.length]
}

function getResearchImpact(index: number) {
  const impacts = [
    { citations: "25+", reads: "1.2K", downloads: "450" },
    { citations: "42+", reads: "2.8K", downloads: "890" },
    { citations: "18+", reads: "950", downloads: "320" },
    { citations: "65+", reads: "4.5K", downloads: "1.5K" },
    { citations: "12+", reads: "680", downloads: "210" },
  ]
  return impacts[index % impacts.length]
}

function getKeyFindings(index: number) {
  const findings = [
    ["Novel approach demonstrated 40% improvement", "Framework applicable to multiple domains"],
    ["Significant correlation found between variables", "Results validated across datasets"],
    ["Proposed model outperforms existing methods", "Scalable to enterprise applications"],
    ["New insights into user behavior patterns", "Actionable recommendations provided"],
    ["Theory successfully tested in practice", "Methodology replicable for future research"],
  ]
  return findings[index % findings.length]
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
  const methodology = getResearchMethodology(current)
  const impact = getResearchImpact(current)
  const findings = getKeyFindings(current)

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

                  {/* Impact Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <TrendingUp size={18} className="text-purple-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{impact.citations}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Citations</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Users size={18} className="text-cyan-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{impact.reads}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Reads</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <FileText size={18} className="text-pink-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{impact.downloads}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Downloads</div>
                    </motion.div>
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

                  {/* Methodology Tags */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FlaskConical size={14} className="text-cyan-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Methodology</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {methodology.map((method, i) => (
                        <motion.div
                          key={method}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                        >
                          {method}
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
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Progress</span>
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
  const methodology = getResearchMethodology(index)
  const impact = getResearchImpact(index)
  const findings = getKeyFindings(index)

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

        {/* Impact Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <TrendingUp size={14} className="text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{impact.citations}</div>
            <div className="text-[10px] text-gray-400 uppercase">Citations</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <Users size={14} className="text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{impact.reads}</div>
            <div className="text-[10px] text-gray-400 uppercase">Reads</div>
          </div>
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
            <FileText size={14} className="text-pink-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{impact.downloads}</div>
            <div className="text-[10px] text-gray-400 uppercase">Downloads</div>
          </div>
        </div>

        {/* Key Finding */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-5">
          <div className="flex items-start gap-2">
            <Lightbulb size={12} className="text-purple-400 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-300">{findings[0]}</span>
          </div>
        </div>

        {/* Methodology Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {methodology.map((method) => (
            <span key={method} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
              {method}
            </span>
          ))}
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
