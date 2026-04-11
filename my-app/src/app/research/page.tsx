import { readPortfolioJsonFile } from "@/lib/portfolio-data"
import { type Research } from "@/lib/database"
import ResearchSection from "../components/sections/research"

export default async function ResearchPage() {
  const papers = await readPortfolioJsonFile<Research[]>('research.json')

  return (
    <div className="w-full flex justify-center pt-10 sm:pt-16 md:pt-10">
      <ResearchSection papers={papers} />
    </div>
  )
}
