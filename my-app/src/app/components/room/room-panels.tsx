"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ExternalLink, MoveUpRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { Typewriter } from "react-simple-typewriter"
import type { RoomHomePayload, RoomObjectId } from "./room-manifest"
import Contact from "../sections/contact"
import ContactMessageForm from "../contact-message-form"

interface PanelProps {
  payload: RoomHomePayload
  accentColor: string
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export function SectionPanel({ id, payload, accentColor }: PanelProps & { id: RoomObjectId }) {
  switch (id) {
    case "introduction": return <IntroPanel payload={payload} accentColor={accentColor} />
    case "experiences":  return <ExperiencesPanel payload={payload} accentColor={accentColor} />
    case "projects":     return <ProjectsPanel payload={payload} accentColor={accentColor} />
    case "research":     return <ResearchPanel payload={payload} accentColor={accentColor} />
    case "interests":    return <InterestsPanel payload={payload} accentColor={accentColor} />
    case "timeline":     return <TimelinePanel payload={payload} accentColor={accentColor} />
    case "contact":      return <ContactPanel accentColor={accentColor} />
    case "photos":       return <PhotosPanel accentColor={accentColor} />
    default:             return null
  }
}


// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.26em] text-white mb-2">{children}</p>
  )
}

// ─── Introduction ─────────────────────────────────────────────────────────────

function IntroPanel({ payload, accentColor }: PanelProps) {
  const { intro, contacts } = payload
  const paragraphs = intro.bio.split(";").map(p => p.trim()).filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto py-6 flex flex-col items-center gap-7 text-center">
      {/* Profile image */}
      <div
        className="w-32 h-32 rounded-full overflow-hidden border border-white/12 flex-shrink-0"
        style={{ boxShadow: `0 0 56px ${accentColor}45` }}
      >
        <img
          src={intro.image || "/placeholder.svg"}
          alt={intro.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
        />
      </div>

      {/* Name + title */}
      <div>
        <h3 className="text-3xl font-bold text-white tracking-tight">{intro.name}</h3>
        <p className="mt-2 text-sm text-white tracking-wide">{intro.title}</p>
      </div>

      {/* Bio */}
      <div className="text-left w-full rounded-xl border border-white/8 bg-white/[0.03] p-4 min-h-[80px]">
        <p className="text-sm leading-7 text-white">
          <Typewriter
            words={paragraphs}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </p>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap justify-center">
        {intro.resume && (
          <a
            href={intro.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
            style={{ background: accentColor }}
          >
            Open resume <ExternalLink size={13} />
          </a>
        )}
      </div>

      <div className="w-full text-left border-t border-white/10 pt-6 mt-1">
        <Contact contacts={contacts} variant="embedded" />
      </div>
    </div>
  )
}

// ─── Experiences ──────────────────────────────────────────────────────────────

function ExperiencesPanel({ payload, accentColor }: PanelProps) {
  const [flipped, setFlipped] = useState<number | null>(null)

  return (
    <div className="py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {payload.experiences.map((exp, i) => (
        <ExperienceCard
          key={i}
          exp={exp}
          accentColor={accentColor}
          isFlipped={flipped === i}
          onFlip={() => setFlipped(flipped === i ? null : i)}
        />
      ))}
    </div>
  )
}

function ExperienceCard({
  exp, accentColor, isFlipped, onFlip,
}: {
  exp: RoomHomePayload["experiences"][number]
  accentColor: string
  isFlipped: boolean
  onFlip: () => void
}) {
  return (
    <div
      onClick={onFlip}
      className="cursor-pointer select-none relative"
      style={{ height: "210px" }}
    >
      {/* Front */}
      <div
        className="absolute inset-0 rounded-2xl border border-white/8 bg-white/[0.04] p-4 flex flex-col items-center justify-center gap-3"
        style={{
          opacity: isFlipped ? 0 : 1,
          transform: isFlipped ? "scale(0.96)" : "scale(1)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: isFlipped ? "none" : "auto",
        }}
      >
        <img
          src={exp.image || "/placeholder.svg"}
          alt={exp.company}
          className="w-12 h-12 rounded-full object-cover border border-white/10"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
        />
        <div className="text-center">
          <p className="font-semibold text-sm text-white">{exp.company}</p>
          <p className="text-xs text-white mt-0.5">{exp.title}</p>
          <p className="text-[10px] text-white mt-1.5">{exp.date as string}</p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.22em] text-white">tap to read</p>
      </div>

      {/* Back */}
      <div
        className="absolute inset-0 rounded-2xl p-4 flex flex-col gap-2"
        style={{
          opacity: isFlipped ? 1 : 0,
          transform: isFlipped ? "scale(1)" : "scale(0.96)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: isFlipped ? "auto" : "none",
          background: `${accentColor}14`,
          border: `1px solid ${accentColor}32`,
        }}
      >
        <p className="text-xs font-semibold text-white flex-shrink-0">
          {exp.company} · {exp.title}
        </p>
        <p className="text-[12px] leading-[1.6] text-white flex-1 overflow-y-auto">
          {exp.description}
        </p>
        {exp.link && (
          <a
            href={exp.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] transition-colors mt-auto flex-shrink-0"
            style={{ color: accentColor }}
          >
            Visit site <ExternalLink size={9} />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsPanel({ payload, accentColor }: PanelProps) {
  const [selected, setSelected] = useState(0)
  const project = payload.projects[selected]
  const count = payload.projects.length

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setSelected(s => (s - 1 + count) % count)
      else if (e.key === "ArrowRight") setSelected(s => (s + 1) % count)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [count])

  return (
    <div className="py-2 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {payload.projects.map((p, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap"
            style={selected === i
              ? { background: accentColor, color: "#fff" }
              : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }
            }
          >
            {p.emote} {p.name}
          </button>
        ))}
      </div>
      <ProjectDetail project={project} accentColor={accentColor} />
    </div>
  )
}

function ProjectDetail({
  project, accentColor,
}: {
  project: RoomHomePayload["projects"][number]
  accentColor: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 flex flex-col gap-4">
      <div>
        <div className="text-4xl mb-2">{project.emote}</div>
        <h3 className="text-xl font-bold text-white">{project.name}</h3>
        <p className="mt-2 text-sm text-white leading-6">{project.description}</p>
      </div>

      {(project.tech ?? []).length > 0 && (
        <div>
          <SectionLabel>Stack</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {(project.tech ?? []).map(t => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full text-xs border font-mono"
                style={{
                  background: `${accentColor}16`,
                  borderColor: `${accentColor}35`,
                  color: accentColor,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {(project.features ?? []).length > 0 && (
        <div>
          <SectionLabel>Features</SectionLabel>
          <ul className="space-y-1.5">
            {(project.features ?? []).map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                <span
                  className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: accentColor }}
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto flex-wrap pt-1">
        <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-white">{project.type}</span>
        <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-white">{project.date as string}</span>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110"
            style={{ background: accentColor }}
          >
            Open project <MoveUpRight size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Research ─────────────────────────────────────────────────────────────────

function ResearchPanel({ payload, accentColor }: PanelProps) {
  const [selected, setSelected] = useState(0)
  const paper = payload.research[selected]
  const count = payload.research.length

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setSelected(s => (s - 1 + count) % count)
      else if (e.key === "ArrowRight") setSelected(s => (s + 1) % count)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [count])

  return (
    <div className="py-2 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {payload.research.map((r, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap"
            style={selected === i
              ? { background: accentColor, color: "#fff" }
              : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }
            }
          >
            {r.emote} {r.name}
          </button>
        ))}
      </div>
      <ResearchDetail paper={paper} accentColor={accentColor} />
    </div>
  )
}

function ResearchDetail({
  paper, accentColor,
}: {
  paper: RoomHomePayload["research"][number]
  accentColor: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 flex flex-col gap-4">
      <div>
        <div className="text-4xl mb-2">{paper.emote}</div>
        <h3 className="text-xl font-bold text-white">{paper.name}</h3>
        <p className="mt-2 text-sm text-white leading-6">{paper.description}</p>
      </div>

      {paper.abstract && (
        <div
          className="rounded-xl p-4 border"
          style={{ background: `${accentColor}0e`, borderColor: `${accentColor}28` }}
        >
          <SectionLabel>Abstract</SectionLabel>
          <p className="text-sm text-white leading-6 italic">{paper.abstract}</p>
        </div>
      )}

      {(paper.findings ?? []).length > 0 && (
        <div>
          <SectionLabel>Key findings</SectionLabel>
          <ul className="space-y-1.5">
            {(paper.findings ?? []).map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                <span
                  className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: accentColor }}
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto flex-wrap pt-1">
        <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-white">{paper.published_to}</span>
        <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-white">{paper.focus}</span>
        <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-white">{paper.date as string}</span>
        {paper.link && (
          <a
            href={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110"
            style={{ background: accentColor }}
          >
            Read paper <BookOpen size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Interests ────────────────────────────────────────────────────────────────

function InterestsPanel({ payload, accentColor }: PanelProps) {
  return (
    <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {payload.interests.map((interest, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 flex flex-col gap-2.5 transition-all duration-300 hover:border-white/14 hover:bg-white/[0.05]"
        >
          <span className="text-3xl leading-none">{interest.emote}</span>
          <p className="font-semibold text-sm" style={{ color: accentColor }}>
            {interest.name}
          </p>
          <p className="text-xs text-white leading-[1.6]">{interest.description}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

const TIMELINE_PALETTES = [
  { dot: "#60A5FA", bg: "rgba(96,165,250,0.07)", border: "rgba(96,165,250,0.22)" },
  { dot: "#A78BFA", bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.22)" },
  { dot: "#F472B6", bg: "rgba(244,114,182,0.07)", border: "rgba(244,114,182,0.22)" },
]

function TimelinePanel({ payload }: PanelProps) {
  return (
    <div className="py-4 relative">
      {/* Vertical spine */}
      <div className="absolute top-4 bottom-4 bg-white/6" style={{ left: "19px", width: "1px" }} />

      <div className="flex flex-col gap-5">
        {payload.timeline.map((item, i) => {
          const p = TIMELINE_PALETTES[i % TIMELINE_PALETTES.length]
          return (
            <div key={i} className="flex gap-4 items-start">
              {/* Node */}
              <div
                className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center border z-10"
                style={{ background: p.bg, borderColor: p.border }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.dot }} />
              </div>

              {/* Card */}
              <div
                className="flex-1 rounded-2xl border p-4 -mt-0.5"
                style={{ background: p.bg, borderColor: p.border }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.24em] mb-1.5 font-medium"
                  style={{ color: p.dot }}
                >
                  {item.date}
                </p>
                <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                <p className="text-sm text-white leading-[1.6]">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Contact (SMTP form in this popup; social links live on Introduction) ─

function ContactPanel({ accentColor }: Pick<PanelProps, "accentColor">) {
  return (
    <div className="w-full max-w-md mx-auto py-2 px-1 text-left">
      <ContactMessageForm variant="modal" accentColor={accentColor} />
    </div>
  )
}

// ─── Photos (redirect panel) ──────────────────────────────────────────────────

function PhotosPanel({ accentColor }: { accentColor: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border border-white/10"
        style={{ background: `${accentColor}1e` }}
      >
        🌍
      </div>
      <div className="max-w-sm">
        <h3 className="text-xl font-semibold text-white">Photo Gallery</h3>
        <p className="mt-2 text-sm text-white leading-6">
          The photo gallery lives on its own page — an interactive globe with travel moments and photo archives.
        </p>
      </div>
      <Link
        href="/globe"
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
        style={{ background: accentColor }}
      >
        Open photo gallery <MoveUpRight size={14} />
      </Link>
    </div>
  )
}
