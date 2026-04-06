import { NextResponse } from 'next/server'
import { readPortfolioJsonFile, sortTimelineByDateAsc } from '@/lib/portfolio-data'

export async function GET() {
  try {
    const data = await readPortfolioJsonFile<{ date: string }[]>('timeline.json')
    const sorted = sortTimelineByDateAsc(data || [])
    return NextResponse.json(sorted)
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json([], { status: 500 })
  }
}
