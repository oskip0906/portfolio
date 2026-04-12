import { readPortfolioJsonFile, sortTimelineByDateAsc } from "@/lib/portfolio-data"
import { type Memory } from "@/lib/database"
import TimelineZigZag from "@/app/components/timeline-layout"

export default async function TimelinePage() {
  const raw = await readPortfolioJsonFile<Memory[]>("timeline.json")
  const memories = sortTimelineByDateAsc(raw)
  return <TimelineZigZag memories={memories} />
}
