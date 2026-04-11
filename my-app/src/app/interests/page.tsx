import { readPortfolioJsonFile } from "@/lib/portfolio-data"
import { type Interest } from "@/lib/database"
import Interests from "../components/sections/interests"

export default async function InterestsPage() {
  const interests = await readPortfolioJsonFile<Interest[]>('interests.json')

  return (
    <div className="w-full flex justify-center pt-10 sm:pt-16 md:pt-10">
      <Interests interests={interests} />
    </div>
  )
}
