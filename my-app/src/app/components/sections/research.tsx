"use client"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, FlaskConical, BookOpen, Quote, ChevronRight, AlignLeft } from "lucide-react"
import { type Research } from "@/lib/database"
import { useBackground } from "@/app/contexts/background-context"
import { getAccentColors, SidebarNav, CardShell, ProgressBar, MobileCardBase } from "../card-layout"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Research({ papers }: { papers: Research[] }) {
  const { baseColor } = useBackground()
  const { accent, accentLight } = getAccentColors(baseColor)
  const [current, setCurrent] = useState(0)

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

  const paper = papers[current]

  return (
    <section id="research" className="w-full px-4 sm:px-6 md:px-10">
      {/* Mobile: stacked cards */}
      <div className="md:hidden">
        <div className="space-y-6 pb-2">
          {papers.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i * 0.08}
            >
              <MobileResearchCard item={item} index={i} accent={accent} accentLight={accentLight} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
          <SidebarNav
            items={papers}
            current={current}
            onSelect={setCurrent}
            activeNumClass="text-purple-400"
            activeArrowClass="text-purple-400"
          />
        </motion.div>

        <motion.div
          className="md:col-span-2 lg:col-span-3 relative min-h-[70vh]"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {paper && (
            <CardShell
              current={current}
              accent={accent}
              accentLight={accentLight}
              cornerTL="border-purple-500/20"
              cornerBR="border-cyan-500/20"
            >
              <div className="p-8 lg:p-10">
                {/* Number + action row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl font-black bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${accent}, ${accentLight})` }}>
                    {String(current + 1).padStart(2, "0")}
                  </span>
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

                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">{paper.name}</h3>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                  <Quote size={14} className="text-purple-400/60" />
                  <div className="h-px w-8 bg-cyan-400/30 rounded-full" />
                </div>

                <p className="text-gray-300 leading-relaxed text-base lg:text-lg mb-8">{paper.description}</p>

                {/* Abstract */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <AlignLeft size={14} className="text-purple-400" />
                    <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Abstract</span>
                  </div>
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/8 px-4 py-3.5">
                    <p className="text-sm leading-6 text-gray-300 lg:text-[0.95rem]">
                      {paper.abstract}
                    </p>
                  </div>
                </div>

                {/* Footer */}
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
                  <ProgressBar current={current} total={papers.length} gradientClass="from-purple-400 to-cyan-400" />
                </div>
              </div>
            </CardShell>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function MobileResearchCard({ item, index, accent, accentLight }: {
  item: Research; index: number; accent: string; accentLight: string
}) {
  return (
    <MobileCardBase
      index={index}
      accent={accent}
      accentLight={accentLight}
      dividerClass="from-purple-400/50"
      link={item.link}
      linkContent={
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm font-semibold hover:bg-purple-500/20 transition-colors">
          <BookOpen size={12} />
          <span>Read</span>
        </span>
      }
    >
      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px w-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
        <Quote size={10} className="text-purple-400/60" />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-5">{item.description}</p>

      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <AlignLeft size={12} className="text-purple-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Abstract</span>
        </div>
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/8 px-3 py-2.5">
          <p className="text-xs leading-5 text-gray-300">{item.abstract}</p>
        </div>
      </div>

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
    </MobileCardBase>
  )
}
