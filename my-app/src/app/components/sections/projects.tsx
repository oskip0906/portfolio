"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, Tag, ArrowRight, Sparkles, ChevronRight, Code2 } from "lucide-react"
import { type Project } from "@/lib/database"

// Tech stack per project name
const PROJECT_TECH: Record<string, string[]> = {
  "Equicourt": ["Next.js", "TypeScript", "Python", "FastAPI", "OpenAI", "Supabase"],
  "UofT ClubHub": ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Python", "OpenAI"],
  "PseudoGrader": ["React", "Node.js", "Python", "OpenAI", "PDF.js"],
  "Basic Neural Network": ["Python", "NumPy", "MNIST"],
  "Scriptorium": ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Docker"],
  "WelcoMate (UofT W3B Davinci Competition B2B 1st Place Winner)": ["React", "Node.js", "OpenAI", "Supabase"],
  "Little Learners": ["React", "TypeScript", "OpenAI", "Node.js"],
  "Toronto Asian Art Museum Explorer": ["Android", "Java", "SQLite", "iText"],
  "League of Legends Statistics Analyzer": ["Python", "scikit-learn", "React", "Flask", "Riot API"],
  "MealSimple (Uoft EWB Hackathon 1st Place Winner)": ["JavaScript", "HTML/CSS", "Google Maps API", "ChatGPT API"],
  "Daily World Diary": ["Python", "ChatGPT API", "NewsAPI"],
  "Broke Besties": ["Next.js", "TypeScript", "OpenAI", "Supabase", "PostgreSQL"],
}

const PROJECT_FEATURES: Record<string, string[]> = {
  "Equicourt": ["Multi-LLM RAG System", "Speech Recognition", "PDF Parsing", "Canadian Law DB"],
  "UofT ClubHub": ["Club Search", "Instagram Scraper", "AI Chatbot", "Exec Dashboard"],
  "PseudoGrader": ["AI Logic Checks", "Code Translation", "Test Case Evaluation", "PDF/Image Upload"],
  "Basic Neural Network": ["95% MNIST Accuracy", "Custom Hyperparams", "Built from Scratch"],
  "Scriptorium": ["Multi-language Execution", "Blog System", "Code Templates", "Docker Sandbox"],
  "WelcoMate (UofT W3B Davinci Competition B2B 1st Place Winner)": ["AI Trip Planner", "PMS & CRM", "Guest Check-in", "Service Booking"],
  "Little Learners": ["Learning Roadmap", "Mini-games", "AI Books", "Rewards System"],
  "Toronto Asian Art Museum Explorer": ["Artifact Search", "Admin Tools", "PDF Reports", "Database"],
  "League of Legends Statistics Analyzer": ["100K Data Entries", "75%+ Accuracy ML", "Riot API", "Player Stats"],
  "MealSimple (Uoft EWB Hackathon 1st Place Winner)": ["Food Bank Locator", "Recipe Filter", "AI Custom Recipes", "Maps API"],
  "Daily World Diary": ["Daily News Fetch", "First-person Narrative", "Cited Sources"],
  "Broke Besties": ["Receipt Scanning", "Expense Splitting", "Group Management", "AI Chat"],
}

function getProjectTech(name: string): string[] {
  return PROJECT_TECH[name] ?? ["JavaScript", "HTML/CSS"]
}

function getProjectFeatures(name: string): string[] {
  return PROJECT_FEATURES[name] ?? ["Web Application", "Responsive Design", "API Integration"]
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
  const techStack = project ? getProjectTech(project.name) : []
  const features = project ? getProjectFeatures(project.name) : []

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
                    <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {String(current + 1).padStart(2, "0")}
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

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Code2 size={14} className="text-cyan-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300 font-medium cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={14} className="text-cyan-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Key Features</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature) => (
                        <div
                          key={feature}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom metadata bar */}
                  <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-3">
                      {project.type && (
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-400/30 text-sm font-semibold tracking-wide text-cyan-300">
                          <Tag size={12} className="opacity-70 shrink-0" />
                          <span>{project.type}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        <Calendar size={14} className="shrink-0" />
                        <span className="text-sm font-medium">{project.date}</span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="hidden md:flex items-center gap-3">
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
  const techStack = getProjectTech(item.name)
  const features = getProjectFeatures(item.name)

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

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Code2 size={12} className="text-cyan-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span key={tech} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-medium">
                {tech}
              </span>
            ))}
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
