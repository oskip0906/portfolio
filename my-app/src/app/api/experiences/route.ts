import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

// Parse date string and extract start and end dates
function parseDates(dateString: string): { startDate: Date; endDate: Date } {
  const parts = dateString.split(' - ')
  const startDateStr = parts[0].trim()
  const endDateStr = parts[1]?.trim()

  // Parse start date
  const startDate = new Date(startDateStr + ' 01')

  // Parse end date
  let endDate: Date
  if (!endDateStr) {
    // Single date, use same as start date
    endDate = startDate
  } else if (endDateStr.toLowerCase() === 'present') {
    // "Present" means today
    endDate = new Date()
  } else {
    // Parse end date
    endDate = new Date(endDateStr + ' 01')
  }

  return {
    startDate: isNaN(startDate.getTime()) ? new Date(0) : startDate,
    endDate: isNaN(endDate.getTime()) ? new Date(0) : endDate,
  }
}

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('Supabase server client not initialized')
    return NextResponse.json([], { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')

    if (error) {
      console.error('Error fetching experiences:', error)
      return NextResponse.json([], { status: 500 })
    }

    // Sort by start date (descending), then by end date (descending)
    const sortedData = (data || []).sort((a, b) => {
      const { startDate: startA, endDate: endA } = parseDates(a.date)
      const { startDate: startB, endDate: endB } = parseDates(b.date)

      // First sort by start date (most recent first)
      const startDiff = startB.getTime() - startA.getTime()
      if (startDiff !== 0) return startDiff

      // If start dates are equal, sort by end date (most recent first)
      return endB.getTime() - endA.getTime()
    })

    return NextResponse.json(sortedData)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json([], { status: 500 })
  }
}
