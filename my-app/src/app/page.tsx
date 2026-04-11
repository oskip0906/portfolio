import { readPortfolioJsonFile, sortTimelineByDateAsc } from "@/lib/portfolio-data"
import { type Intro, type Contact, type Memory } from "@/lib/database"
import Introduction from "./components/sections/introduction"
import Timeline from "./components/timeline"

export default async function Home() {
  const [intro, contacts, timeline] = await Promise.all([
    readPortfolioJsonFile<Intro>('intro.json'),
    readPortfolioJsonFile<Contact[]>('contacts.json'),
    readPortfolioJsonFile<Memory[]>('timeline.json'),
  ])

  return (
    <div className="w-full pb-4 pt-12 md:pt-10">
      <div className="flex justify-center">
        <Introduction intro={intro} contacts={contacts} />
      </div>
      <Timeline memories={sortTimelineByDateAsc(timeline)} />
    </div>
  )
}
