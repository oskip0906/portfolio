import { NextResponse } from 'next/server'
import { readPortfolioJsonFile, sortByContentDateDesc } from '@/lib/portfolio-data'

export async function GET() {
  try {
    const data = await readPortfolioJsonFile<{ date: string }[]>('research.json')
    const sortedData = sortByContentDateDesc(data || [])
    return NextResponse.json(sortedData)
  } catch (error) {
    console.error('Error fetching research:', error)
    return NextResponse.json([], { status: 500 })
  }
}
