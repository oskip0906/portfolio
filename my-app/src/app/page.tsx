import { readPortfolioJsonFile } from "@/lib/portfolio-data"
import { type Intro, type Contact } from "@/lib/database"
import Introduction from "./components/sections/introduction"

export default async function Home() {
  const [intro, contacts] = await Promise.all([
    readPortfolioJsonFile<Intro>("intro.json"),
    readPortfolioJsonFile<Contact[]>("contacts.json"),
  ])

  return (
    <div className="w-full pb-4 pt-12 md:pt-10">
      <div className="flex justify-center">
        <Introduction intro={intro} contacts={contacts} />
      </div>
    </div>
  )
}
