import { readPortfolioJsonFile, sortByContentDateDesc } from "@/lib/portfolio-data"
import type {
  Contact,
  Experience,
  Intro,
  Interest,
  Project,
  Research,
} from "@/lib/database"
import { buildRoomPayload } from "@/app/components/room/room-manifest"
import type { RoomHomePayload } from "@/app/components/room/room-manifest"

export async function getRoomPayload(): Promise<RoomHomePayload> {
  const [intro, contacts, rawExperiences, rawProjects, research, interests] = await Promise.all([
    readPortfolioJsonFile<Intro>("intro.json"),
    readPortfolioJsonFile<Contact[]>("contacts.json"),
    readPortfolioJsonFile<(Experience & { date: string })[]>("experiences.json"),
    readPortfolioJsonFile<(Project & { date: string })[]>("projects.json"),
    readPortfolioJsonFile<Research[]>("research.json"),
    readPortfolioJsonFile<Interest[]>("interests.json"),
  ])
  const experiences = sortByContentDateDesc(rawExperiences)
  const projects = sortByContentDateDesc(rawProjects)

  return buildRoomPayload({
    intro,
    contacts,
    experiences,
    projects,
    research,
    interests,
  })
}
