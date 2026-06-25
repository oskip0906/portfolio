import Link from "next/link"
import { ExternalLink, Mail, MoveUpRight, BookOpen } from "lucide-react"
import { getRoomPayload } from "@/lib/get-room-payload"
import Contact from "../components/ui/contact"
import ContactMessageForm from "../components/contact-message-form"

const ACCENT = "#1d4ed8"

export default async function ResumePage() {
  const payload = await getRoomPayload()
  const { intro, contacts, experiences, projects, research, interests } = payload

  const navItems: { id: string; label: string }[] = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "research", label: "Research" },
    { id: "interests", label: "Interests" },
    { id: "photos", label: "Photos" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-slate-700 hover:text-slate-950">
            ← Choose version
          </Link>
          <nav className="hidden flex-wrap items-center gap-5 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* ── Hero / About ── */}
        <section id="about" className="flex flex-col gap-8 border-b border-slate-200 pb-12 sm:flex-row sm:items-start">
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={intro.image || "/placeholder.svg"}
              alt={intro.name}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Portfolio</p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-950">{intro.name}</h1>
            <p className="mt-2 text-lg text-slate-600">{intro.title}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
              {intro.bio.replaceAll(";", " ")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {intro.resume && (
                <a
                  href={intro.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Open resume <ExternalLink size={14} />
                </a>
              )}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Get in touch <Mail size={14} />
              </a>
            </div>
            <div className="mt-8 rounded-2xl bg-slate-950 p-5">
              <Contact contacts={contacts} variant="embedded" />
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section id="experience" className="border-b border-slate-200 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Experience</h2>
          <div className="mt-6 flex flex-col gap-6">
            {experiences.map((exp, i) => (
              <article key={i} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exp.image || "/placeholder.svg"}
                  alt={exp.company}
                  className="h-14 w-14 flex-shrink-0 rounded-full border border-slate-200 object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {exp.title} · {exp.company}
                    </h3>
                    <span className="text-sm text-slate-500">{exp.date as string}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{exp.description}</p>
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      Visit site <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="border-b border-slate-200 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Projects</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project, i) => (
              <article key={i} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {project.emote} {project.name}
                  </h3>
                  <span className="text-xs text-slate-500">{project.date as string}</span>
                </div>
                <p className="text-sm leading-6 text-slate-700">{project.description}</p>
                {(project.tech ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {(project.tech ?? []).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-mono text-blue-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {(project.features ?? []).length > 0 && (
                  <ul className="space-y-1">
                    {(project.features ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-700" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{project.type}</span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      Open project <MoveUpRight size={12} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Research ── */}
        <section id="research" className="border-b border-slate-200 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Research</h2>
          <div className="mt-6 flex flex-col gap-5">
            {research.map((paper, i) => (
              <article key={i} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {paper.emote} {paper.name}
                  </h3>
                  <span className="text-xs text-slate-500">{paper.date as string}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{paper.description}</p>
                {paper.abstract && (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Abstract</p>
                    <p className="mt-2 text-sm italic leading-6 text-slate-700">{paper.abstract}</p>
                  </div>
                )}
                {(paper.findings ?? []).length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {(paper.findings ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-700" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{paper.published_to}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{paper.focus}</span>
                  {paper.link && (
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      Read paper <BookOpen size={12} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Interests ── */}
        <section id="interests" className="border-b border-slate-200 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Interests</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {interests.map((interest, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-4">
                <span className="text-3xl leading-none">{interest.emote}</span>
                <p className="mt-2 font-semibold text-slate-950">{interest.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{interest.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Photos ── */}
        <section id="photos" className="border-b border-slate-200 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Photos</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            A travel and photo archive presented as an interactive globe — explore moments by location.
          </p>
          <Link
            href="/globe"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Open photo gallery <MoveUpRight size={14} />
          </Link>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Contact</h2>
          <div className="mt-6 max-w-md rounded-2xl bg-slate-950 p-6">
            <ContactMessageForm accentColor={ACCENT} />
          </div>
        </section>
      </main>
    </div>
  )
}
