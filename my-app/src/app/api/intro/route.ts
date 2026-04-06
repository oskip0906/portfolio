import { NextResponse } from 'next/server'
import { readPortfolioJsonFile } from '@/lib/portfolio-data'

export async function GET() {
  try {
    const data = await readPortfolioJsonFile<Record<string, unknown>>('intro.json')
    return NextResponse.json(data || null)
  } catch (error) {
    console.error('Error fetching intro:', error)
    return NextResponse.json(null, { status: 500 })
  }
}
