import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('Supabase server client not initialized')
    return NextResponse.json(null, { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from('intro')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching intro:', error)
      return NextResponse.json(null, { status: 500 })
    }

    return NextResponse.json(data || null)
  } catch (error) {
    console.error('Error fetching intro:', error)
    return NextResponse.json(null, { status: 500 })
  }
}
