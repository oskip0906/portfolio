import { NextResponse } from 'next/server'
import { readPortfolioJsonFile } from '@/lib/portfolio-data'

export async function GET() {
  try {
    const data = await readPortfolioJsonFile<unknown[]>('interests.json')
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching interests:', error)
    return NextResponse.json([], { status: 500 })
  }
}
