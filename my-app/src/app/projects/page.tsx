import { readPortfolioJsonFile, sortByContentDateDesc } from "@/lib/portfolio-data"
import { type Project } from "@/lib/database"
import Projects from "../components/sections/projects"

export default async function ProjectsPage() {
  const data = await readPortfolioJsonFile<(Project & { date: string })[]>('projects.json')
  const projects = sortByContentDateDesc(data)

  return (
    <div className="w-full flex justify-center pt-10 sm:pt-16 md:pt-10">
      <Projects projects={projects} />
    </div>
  )
}
