import { readPortfolioJsonFile, sortByContentDateDesc } from "@/lib/portfolio-data"
import type {
  Contact,
  Experience,
  Intro,
  Interest,
  Project,
  Research,
} from "@/lib/database"
import RoomExperience from "./components/room/room-experience"
import { buildRoomPayload } from "./components/room/room-manifest"

export default async function Home() {
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
  const payload = buildRoomPayload({
    intro,
    contacts,
    experiences,
    projects,
    research,
    interests,
  })

  return (
    <div className="w-full">
      <RoomExperience payload={payload} />
    </div>
  )
}
