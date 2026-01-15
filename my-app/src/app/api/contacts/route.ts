import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('Supabase server client not initialized')
    return NextResponse.json([], { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')

    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json([], { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json([], { status: 500 })
  }
}
