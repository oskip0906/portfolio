import Link from "next/link"
import { Instrument_Serif } from "next/font/google"
import { ArrowUp, ArrowUpRight, FileText, Mail } from "lucide-react"
import { FaDiscord, FaEnvelope, FaGithub, FaGlobe, FaInstagram, FaLinkedinIn, FaSteam } from "react-icons/fa"
import { getRoomPayload } from "@/lib/get-room-payload"
import ContactMessageForm from "./components/contact-message-form"
import SectionNav from "./components/section-nav"

const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif", display: "swap" })
const display = "font-[family-name:var(--font-serif)] font-normal tracking-tight"

function contactHref(type: string, value: string) {
  const normalized = type.toLowerCase()
  if (normalized === "email" || normalized.includes("mail")) {
    return `mailto:${value.replace(/^mailto:/i, "")}`
  }
  return value
}

// Kept separate from ui/contact.tsx on purpose: a module imported by both this server page and a
// client component made Next 15.1 drop the teahouse from the client manifest (prerender error on Vercel).
function contactIcon(type: string) {
  const normalized = type.toLowerCase()
  if (normalized === "email" || normalized.includes("mail")) return FaEnvelope
  if (normalized.includes("github")) return FaGithub
  if (normalized.includes("linkedin")) return FaLinkedinIn
  if (normalized.includes("instagram")) return FaInstagram
  if (normalized.includes("steam")) return FaSteam
  return FaGlobe
}

function contactLabel(type: string) {
  const normalized = type.toLowerCase()
  if (normalized === "email" || normalized.includes("mail")) return "Email"
  if (normalized.includes("github")) return "GitHub"
  if (normalized.includes("linkedin")) return "LinkedIn"
  if (normalized.includes("instagram")) return "Instagram"
  if (normalized.includes("steam")) return "Steam"
  if (normalized.includes("discord")) return "Discord"
  return type
}

const NAV_ITEMS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
]

function SectionHeading({ index, title, meta }: { index: number; title: string; meta?: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-mono text-xs text-[#3d6b4f]">{String(index).padStart(2, "0")}</span>
      <h2 className={`${display} text-4xl text-stone-900 sm:text-[2.75rem]`}>{title}</h2>
      <span className="h-px flex-1 translate-y-[-0.4rem] bg-stone-200" />
      {meta && <span className="text-xs text-stone-400">{meta}</span>}
    </div>
  )
}

export default async function HomePage() {
  const payload = await getRoomPayload()
  const { intro, contacts, experiences, projects, research } = payload
  const linkableContacts = contacts.filter((c) => c.type.toLowerCase() !== "discord")
  const discord = contacts.find((c) => c.type.toLowerCase() === "discord")
  const email = contacts.find((c) => c.type.toLowerCase() === "email")
  const bio = intro.bio.split(";").map((p) => p.trim()).filter(Boolean)

  return (
    <div className={`${serif.variable} min-h-screen bg-[#fbfaf7] text-stone-800 selection:bg-[#3d6b4f]/15`}>
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:flex lg:gap-16 lg:px-12">
        {/* ── Sidebar ── */}
        <header className="flex flex-col gap-10 pb-6 pt-10 lg:sticky lg:top-0 lg:h-screen lg:w-[21rem] lg:flex-shrink-0 lg:justify-between lg:py-20">
          <div>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={intro.image || "/placeholder.svg"}
                alt=""
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-stone-200"
                loading="eager"
              />
              <p className="text-sm leading-5 text-stone-500">{intro.title}</p>
            </div>

            <h1 className={`${display} mt-6 text-6xl leading-[0.95] text-stone-900`}>{intro.name}</h1>

            <div className="mt-5 max-w-sm space-y-1 text-[15px] leading-7 text-stone-600">
              {bio.map((line) => <p key={line}>{line}</p>)}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {intro.resume && (
                <a
                  href={intro.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#3d6b4f] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2f5540]"
                >
                  <FileText size={15} /> Resume
                </a>
              )}
              {email && (
                <a
                  href={contactHref(email.type, email.value)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-stone-300 px-5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-800 hover:text-stone-900"
                >
                  <Mail size={15} /> Email me
                </a>
              )}
            </div>

            <div className="mt-14 hidden lg:block">
              <SectionNav items={NAV_ITEMS} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {linkableContacts.map((contact) => {
              const Icon = contactIcon(contact.type)
              const isMail = contact.type.toLowerCase().includes("mail")
              return (
                <a
                  key={contact.type}
                  href={contactHref(contact.type, contact.value)}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  aria-label={contactLabel(contact.type)}
                  title={contactLabel(contact.type)}
                  className="grid h-10 w-10 place-items-center rounded-full text-stone-500 transition-colors hover:bg-stone-900/5 hover:text-stone-900"
                >
                  <Icon size={18} />
                </a>
              )
            })}
            {discord && (
              <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-stone-500">
                <FaDiscord size={16} aria-label="Discord" /> {discord.value}
              </span>
            )}
          </div>
        </header>

        {/* ── Content ── */}
        <div className="min-w-0 flex-1 pb-28 lg:pt-20">
          <section id="experience" className="scroll-mt-8 pt-14 lg:pt-0">
            <SectionHeading index={1} title="Experience" meta={`${experiences.length} roles`} />
            <ol className="ml-5 border-l border-stone-200">
              {experiences.map((exp) => (
                <li key={`${exp.company}-${exp.title}`} className="relative pb-11 pl-9 last:pb-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={exp.image || "/placeholder.svg"}
                    alt=""
                    className="absolute -left-5 top-0 h-10 w-10 rounded-full border-4 border-[#fbfaf7] bg-white object-cover ring-1 ring-stone-200"
                    loading="lazy"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-1.5">
                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-lg font-semibold text-stone-900 hover:text-[#3d6b4f]"
                      >
                        {exp.company}
                        <ArrowUpRight size={15} className="text-stone-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3d6b4f]" />
                      </a>
                    ) : (
                      <h3 className="text-lg font-semibold text-stone-900">{exp.company}</h3>
                    )}
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-400">{exp.date as string}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-[#3d6b4f]">{exp.title}</p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-600">{exp.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="projects" className="scroll-mt-8 pt-12 sm:pt-24">
            <SectionHeading index={2} title="Projects" meta={`${projects.length} builds`} />
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <a
                  key={project.name}
                  href={project.link || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_18px_40px_-18px_rgba(28,25,23,0.25)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-[#3d6b4f]/[0.08] text-xl">
                      {project.emote}
                    </span>
                    <ArrowUpRight size={18} className="text-stone-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3d6b4f]" />
                  </div>
                  <h3 className="mt-4 font-semibold text-stone-900">{project.name}</h3>
                  <p className="mt-1 text-xs text-stone-400">
                    {project.type} · {project.date as string}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{project.description}</p>
                  {(project.features ?? []).length > 0 && (
                    <ul className="mt-3 list-disc space-y-0.5 pl-4 text-sm leading-6 text-stone-600">
                      {(project.features ?? []).map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  )}
                  {(project.tech ?? []).length > 0 && (
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                      {(project.tech ?? []).map((t) => (
                        <li key={t} className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] text-stone-600">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </a>
              ))}
            </div>
          </section>

          <section id="research" className="scroll-mt-8 pt-12 sm:pt-24">
            <SectionHeading index={3} title="Research" meta={`${research.length} papers`} />
            <div className="flex flex-col gap-4">
              {research.map((paper) => (
                <a
                  key={paper.name}
                  href={paper.link || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_18px_40px_-18px_rgba(28,25,23,0.25)] sm:flex-row sm:p-6"
                >
                  <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-stone-900 text-[11px] font-bold tracking-[0.12em] text-[#efe6d2]">
                    {paper.published_to}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#3d6b4f]">
                      {paper.focus} · {paper.date as string}
                    </p>
                    <h3 className={`${display} mt-2 text-2xl leading-snug text-stone-900`}>{paper.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{paper.description}</p>
                    {(paper.findings ?? []).length > 0 && (
                      <ul className="mt-2 list-disc space-y-0.5 pl-4 text-sm leading-6 text-stone-600">
                        {(paper.findings ?? []).map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#3d6b4f]">
                      Read paper
                      <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section id="contact" className="scroll-mt-8 pt-12 sm:pt-24">
            <SectionHeading index={4} title="Contact" />
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
              <p className={`${display} text-3xl text-stone-900`}>Say hello.</p>
              <p className="mb-6 mt-2 text-sm leading-6 text-stone-500">
                Questions, opportunities, or just a hi. It goes straight to my inbox.
              </p>
              <ContactMessageForm variant="plain" />
            </div>
          </section>

          <footer className="mt-16 flex items-center justify-between border-t border-stone-200 pt-6 text-xs text-stone-400">
            <span>© {new Date().getFullYear()} {intro.name}</span>
            <a href="#" className="inline-flex items-center gap-1 transition-colors hover:text-stone-800">
              Back to top <ArrowUp size={12} />
            </a>
          </footer>
        </div>
      </div>

      {/* Floating way into the 3D teahouse */}
      <Link
        href="/teahouse"
        aria-label="Enter the 3D teahouse"
        title="Enter the 3D teahouse"
        className="group fixed bottom-5 right-5 z-50 flex items-center rounded-full bg-[#3d6b4f] p-2 text-white shadow-[0_14px_34px_-10px_rgba(47,85,64,0.7)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2f5540] hover:shadow-[0_20px_40px_-12px_rgba(47,85,64,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3d6b4f]/30 motion-safe:animate-[fab-in_0.5s_ease-out_0.4s_backwards] sm:bottom-8 sm:right-8"
      >
        <span
          aria-hidden="true"
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-white/15 text-xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
        >
          🧋
        </span>
        {/* Rests as a small circle (fits beside the content); the label shows briefly on load and on hover/focus. */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:pl-2.5 group-hover:pr-3 group-hover:opacity-100 group-focus-visible:max-w-[10rem] group-focus-visible:pl-2.5 group-focus-visible:pr-3 group-focus-visible:opacity-100 motion-safe:animate-[fab-label_4s_ease-in-out_1.2s_backwards]">
          Enter the teahouse
        </span>
      </Link>
    </div>
  )
}
