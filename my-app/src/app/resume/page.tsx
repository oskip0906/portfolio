import Link from "next/link"
import { getRoomPayload } from "@/lib/get-room-payload"
import ContactMessageForm from "../components/contact-message-form"

function contactHref(type: string, value: string) {
  const normalized = type.toLowerCase()
  if (normalized === "email" || normalized.includes("mail")) {
    return `mailto:${value.replace(/^mailto:/i, "")}`
  }
  return value
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

export default async function ResumePage() {
  const payload = await getRoomPayload()
  const { intro, contacts, experiences, projects, research } = payload
  const linkableContacts = contacts.filter((c) => c.type.toLowerCase() !== "discord")
  const discord = contacts.find((c) => c.type.toLowerCase() === "discord")

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-10 md:flex-row md:gap-14">
          {/* ── Sidebar ── */}
          <aside className="flex-shrink-0 md:sticky md:top-10 md:h-fit md:w-52">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 hover:underline">
              ← Choose version
            </Link>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={intro.image || "/placeholder.svg"}
              alt={intro.name}
              className="mt-4 h-32 w-32 rounded-md object-cover"
              loading="eager"
            />
            <h1 className="mt-4 text-lg font-semibold text-gray-900">{intro.name}</h1>
            <p className="mt-1 text-sm text-gray-600">{intro.title}</p>

            {intro.resume && (
              <a
                href={intro.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-blue-700 hover:underline"
              >
                Download CV
              </a>
            )}

            <nav className="mt-8 flex flex-col gap-2 text-sm text-gray-500">
              {NAV_ITEMS.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="hover:text-gray-900 hover:underline">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-1.5 text-sm">
              {linkableContacts.map((contact, i) => (
                <a
                  key={i}
                  href={contactHref(contact.type, contact.value)}
                  target={contact.type.toLowerCase().includes("mail") ? undefined : "_blank"}
                  rel={contact.type.toLowerCase().includes("mail") ? undefined : "noopener noreferrer"}
                  className="text-blue-700 hover:underline"
                >
                  {contactLabel(contact.type)}
                </a>
              ))}
              {discord && <p className="text-gray-500">Discord: {discord.value}</p>}
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 md:max-w-3xl">
            <section id="experience" className="pb-10">
              <h2 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Experience</h2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {experiences.map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {exp.title} · {exp.company}
                      </p>
                      <p className="text-xs text-gray-500">{exp.date as string}</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-gray-700">{exp.description}</p>
                    {exp.link && (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm text-blue-700 hover:underline"
                      >
                        Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="projects" className="border-t border-gray-200 py-10">
              <h2 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Projects</h2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {projects.map((project, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {project.emote} {project.name}
                      </p>
                      <p className="text-xs text-gray-500">{project.date as string} · {project.type}</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-gray-700">{project.description}</p>
                    {(project.tech ?? []).length > 0 && (
                      <p className="mt-1.5 text-xs text-gray-500">
                        {(project.tech ?? []).join(" · ")}
                      </p>
                    )}
                    {(project.features ?? []).length > 0 && (
                      <ul className="mt-2 list-disc space-y-0.5 pl-4">
                        {(project.features ?? []).map((f) => (
                          <li key={f} className="text-sm leading-6 text-gray-700">{f}</li>
                        ))}
                      </ul>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-block text-sm text-blue-700 hover:underline"
                      >
                        Open project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="research" className="border-t border-gray-200 py-10">
              <h2 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Research</h2>
              <div className="mt-4 flex flex-col gap-6">
                {research.map((paper, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {paper.emote} {paper.name}
                      </p>
                      <p className="text-xs text-gray-500">{paper.date as string}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{paper.published_to} · {paper.focus}</p>
                    <p className="mt-1.5 text-sm leading-6 text-gray-700">{paper.description}</p>
                    {(paper.findings ?? []).length > 0 && (
                      <ul className="mt-2 list-disc space-y-0.5 pl-4">
                        {(paper.findings ?? []).map((f) => (
                          <li key={f} className="text-sm leading-6 text-gray-700">{f}</li>
                        ))}
                      </ul>
                    )}
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-block text-sm text-blue-700 hover:underline"
                      >
                        Read paper
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        <section id="contact" className="border-t border-gray-200 py-10">
          <h2 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Contact</h2>
          <div className="mt-4">
            <ContactMessageForm variant="plain" />
          </div>
        </section>
      </div>
    </div>
  )
}
