"use client"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Calendar, Tag, Sparkles, ChevronRight, Code2 } from "lucide-react"
import { type Project } from "@/lib/database"
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

const techTagColors = [
  {
    bg: "#22d3ee20",
    border: "#22d3ee40",
    text: "#22d3ee",
  },
  {
    bg: "#8b5cf620",
    border: "#8b5cf640",
    text: "#8b5cf6",
  },
  {
    bg: "#ec489920",
    border: "#ec489940",
    text: "#ec4899",
  },
]

function getTechTagStyle(index: number) {
  const color = techTagColors[index % techTagColors.length]
  return {
    backgroundColor: color.bg,
    borderColor: color.border,
    color: color.text,
  }
}

export default function Projects({ projects }: { projects: Project[] }) {
  const { baseColor } = useBackground()
  const { accent, accentLight } = getAccentColors(baseColor)
  const [current, setCurrent] = useState(0)

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

  const project = projects[current]
  const techStack = project?.tech ?? []

  return (
    <section id="projects" className="w-full px-4 sm:px-6 md:px-10">
      {/* Mobile: stacked cards */}
      <div className="md:hidden">
        <div className="space-y-6 pb-2">
          {projects.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i * 0.08}
            >
              <MobileProjectCard item={item} index={i} accent={accent} accentLight={accentLight} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
          <SidebarNav
            items={projects}
            current={current}
            onSelect={setCurrent}
            activeNumClass="text-cyan-400"
            activeArrowClass="text-cyan-400"
          />
        </motion.div>

        <motion.div
          className="md:col-span-2 lg:col-span-3 relative min-h-[70vh]"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {project && (
            <CardShell current={current} accent={accent} accentLight={accentLight}>
              <div className="p-8 lg:p-10">
                {/* Number + action row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl font-black bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${accent}, ${accentLight})` }}>
                    {String(current + 1).padStart(2, "00")}
                  </span>
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
                  {project.emote && <span className="mr-3">{project.emote}</span>}{project.name}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                  <Sparkles size={14} className="text-cyan-400/60" />
                  <div className="h-px w-8 bg-purple-400/30 rounded-full" />
                </div>

                <p className="text-gray-300 leading-relaxed text-base lg:text-lg mb-8">{project.description}</p>

                {/* Tech Stack */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 size={14} className="text-cyan-400" />
                    <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg border text-sm font-medium cursor-default"
                        style={getTechTagStyle(index)}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-3">
                    {project.type && (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-400/30 text-sm font-semibold tracking-wide text-cyan-300">
                        <Tag size={12} className="opacity-70 shrink-0" />
                        <span>{project.type}</span>
                      </div>
                    )}
                    <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      <Calendar size={14} className="shrink-0" />
                      <span className="text-sm font-medium">{project.date}</span>
                    </div>
                  </div>
                  <ProgressBar current={current} total={projects.length} />
                </div>
              </div>
            </CardShell>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function MobileProjectCard({ item, index, accent, accentLight }: {
  item: Project; index: number; accent: string; accentLight: string
}) {
  const techStack = item.tech ?? []

  return (
    <MobileCardBase
      index={index}
      accent={accent}
      accentLight={accentLight}
      dividerClass="from-cyan-400/50"
      link={item.link}
      linkContent={
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-colors">
          <ExternalLink size={14} />
          <span>View</span>
        </span>
      }
    >
      <h3 className="text-xl font-bold text-white mb-2">
        {item.emote && <span className="mr-2">{item.emote}</span>}{item.name}
      </h3>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px w-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
        <Sparkles size={10} className="text-cyan-400/60" />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-5">{item.description}</p>

      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Code2 size={12} className="text-cyan-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tech Stack</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech, index) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg border text-xs font-medium"
              style={getTechTagStyle(index)}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

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
    </MobileCardBase>
  )
}
