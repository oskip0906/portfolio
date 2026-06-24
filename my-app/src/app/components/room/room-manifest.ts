import type {
  Contact,
  Experience,
  Intro,
  Interest,
  Project,
  Research,
} from "@/lib/database"

export type RoomObjectId =
  | "introduction"
  | "experiences"
  | "projects"
  | "research"
  | "interests"
  | "photos"
  | "contact"

export type RoomObjectKind =
  | "plinth"
  | "cabinet"
  | "table"
  | "desk"
  | "shelf"
  | "portal"
  | "intercom"

export interface RoomObjectManifest {
  id: RoomObjectId
  kind: RoomObjectKind
  label: string
  subtitle: string
  preview: string
  chips: string[]
  highlights: string[]
  route?: string
  routeLabel?: string
  externalHref?: string
  externalLabel?: string
  shortcut?: string
  color: string
  pearlColor: string
  position: [number, number, number]
  target: [number, number, number]
  cameraPosition: [number, number, number]
}

export interface RoomHomePayload {
  intro: Intro
  contacts: Contact[]
  experiences: Experience[]
  projects: Project[]
  research: Research[]
  interests: Interest[]
  objects: RoomObjectManifest[]
  notes: {
    roomTitle: string
    roomSubtitle: string
    fallbackReason: string
  }
}

function contactEmail(contacts: Contact[]): string | undefined {
  return contacts.find((c) => c.type.toLowerCase() === "email")?.value
}

function clipText(value: string, maxLength = 180) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trimEnd()}...`
}

function highlightNames(values: string[], count = 3) {
  return values.slice(0, count)
}

export function buildRoomPayload({
  intro,
  contacts,
  experiences,
  projects,
  research,
  interests,
}: {
  intro: Intro
  contacts: Contact[]
  experiences: Experience[]
  projects: Project[]
  research: Research[]
  interests: Interest[]
}): RoomHomePayload {
  const email = contactEmail(contacts)

  // Cups are clustered in a tight hexagon around the centered introduction cup
  // so the orbit camera can see the whole gallery without much zooming out.
  const objects: RoomObjectManifest[] = [
    {
      id: "introduction",
      kind: "plinth",
      label: "Introduction",
      subtitle: "Classic milk tea",
      preview: clipText(intro.bio.replaceAll(";", " ")),
      chips: ["Recruiter tour", intro.title, "Resume ready"],
      highlights: [intro.name, intro.title, email ?? "Toronto-based"],
      externalHref: intro.resume ?? undefined,
      externalLabel: intro.resume ? "Open resume" : undefined,
      shortcut: "1",
      color: "#C8A878",
      pearlColor: "#5C3010",
      position: [0, 0, 0],
      target: [0, 1.2, 0],
      cameraPosition: [0, 2.2, 4.6],
    },
    {
      id: "experiences",
      kind: "cabinet",
      label: "Experiences",
      subtitle: "Taro blend",
      preview: clipText(experiences[0]?.description ?? "Professional experience highlights."),
      chips: [`${experiences.length} roles`, experiences[0]?.company ?? "Industry work"],
      highlights: highlightNames(experiences.map((e) => `${e.company} · ${e.title}`)),
      route: "/experiences",
      routeLabel: "Open full section",
      shortcut: "2",
      color: "#B090CC",
      pearlColor: "#7040A8",
      position: [0, 0, 3.5],
      target: [0, 1.2, 3.5],
      cameraPosition: [0, 2.2, 7.5],
    },
    {
      id: "projects",
      kind: "table",
      label: "Projects",
      subtitle: "Matcha latte",
      preview: clipText(projects[0]?.description ?? "Selected project work."),
      chips: [`${projects.length} builds`, projects[0]?.type ?? "Portfolio work"],
      highlights: highlightNames(projects.map((p) => `${p.emote} ${p.name}`), 4),
      route: "/projects",
      routeLabel: "Open full section",
      shortcut: "3",
      color: "#88C878",
      pearlColor: "#2A6822",
      position: [3.03, 0.45, 1.75],
      target: [3.03, 1.65, 1.75],
      cameraPosition: [6.5, 2.4, 3.75],
    },
    {
      id: "research",
      kind: "desk",
      label: "Research",
      subtitle: "Jasmine gold",
      preview: clipText(research[0]?.abstract ?? research[0]?.description ?? "Research highlights."),
      chips: [`${research.length} papers`, research[0]?.published_to ?? "Published work"],
      highlights: highlightNames(research.map((r) => `${r.emote} ${r.name}`)),
      route: "/research",
      routeLabel: "Open full section",
      shortcut: "4",
      color: "#D8C870",
      pearlColor: "#9A8828",
      position: [3.03, 0.45, -1.75],
      target: [3.03, 1.65, -1.75],
      cameraPosition: [6.5, 2.4, -3.75],
    },
    {
      id: "interests",
      kind: "shelf",
      label: "Interests",
      subtitle: "Strawberry blend",
      preview: clipText(interests[0]?.description ?? "Interests and off-screen energy."),
      chips: [`${interests.length} collectibles`, "Personal layer"],
      highlights: highlightNames(interests.map((i) => `${i.emote} ${i.name}`), 4),
      route: "/interests",
      routeLabel: "Open full section",
      shortcut: "5",
      color: "#F09898",
      pearlColor: "#B02838",
      position: [0, 0, -3.5],
      target: [0, 1.2, -3.5],
      cameraPosition: [0, 2.2, -7.5],
    },
    {
      id: "photos",
      kind: "portal",
      label: "Photos",
      subtitle: "Mango passion",
      preview: "A travel and photo archive — world map view with a graceful gallery experience.",
      chips: ["Travel archive", "Globe view"],
      highlights: ["World map gallery", "Photo moments", "Graceful lazy-load"],
      route: "/globe",
      routeLabel: "Open photo portal",
      shortcut: "6",
      color: "#F0A840",
      pearlColor: "#C07020",
      position: [-3.03, 0, -1.75],
      target: [-3.03, 1.2, -1.75],
      cameraPosition: [-6.5, 2.2, -3.75],
    },
    {
      id: "contact",
      kind: "intercom",
      label: "Contact",
      subtitle: "Lychee sparkle",
      preview: "Send a message through the site — delivered to my inbox with SMTP when configured.",
      chips: ["In-modal form", "SMTP when configured"],
      highlights: ["Website form", "Optional return email", "SMTP when configured"],
      shortcut: "7",
      color: "#F0C0CC",
      pearlColor: "#D07088",
      position: [-3.03, 0, 1.75],
      target: [-3.03, 1.2, 1.75],
      cameraPosition: [-6.5, 2.2, 3.75],
    },
  ]

  return {
    intro,
    contacts,
    experiences,
    projects,
    research,
    interests,
    objects,
    notes: {
      roomTitle: "Boba Gallery",
      roomSubtitle: "Each drink is a chapter. Click one to read it.",
      fallbackReason: "Your browser doesn't support WebGL — here's the full layout without the tea shop.",
    },
  }
}
