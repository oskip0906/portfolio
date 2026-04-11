import { readPortfolioJsonFile, sortByContentDateDesc } from "@/lib/portfolio-data"
import { type Experience } from "@/lib/database"
import Experiences from "../components/sections/experiences"

export default async function ExperiencesPage() {
  const data = await readPortfolioJsonFile<(Experience & { date: string })[]>('experiences.json')
  const experiences = sortByContentDateDesc(data)

  return (
    <div className="w-full flex justify-center pt-10 sm:pt-16 md:pt-10">
      <Experiences experiences={experiences} />
    </div>
  )
}
