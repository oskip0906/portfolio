import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase server client not initialized' },
        { status: 500 }
      )
    }

    // List all files in the 'songs' bucket
    const { data, error } = await supabase.storage
      .from("songs")
      .list("", { limit: 100 })
  
    if (error) {
      console.error('Error fetching songs from storage:', error)
      return NextResponse.json(
        { error: 'Failed to fetch songs', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.log('No songs found in storage bucket')
      return NextResponse.json([])
    }
    // Get public URLs and extract names
    const songs = data
      .filter(file => {
        // Filter out folders and hidden files
        const isHidden = file.name.startsWith('.')
        const isFolder = !file.name.includes('.')
        return !isHidden && !isFolder
      })
      .map(file => {
        const { data: urlData } = supabase.storage
          .from('songs')
          .getPublicUrl(file.name)

        // Extract name by splitting on '.' and taking everything before the extension
        const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.')

        return {
          path: urlData.publicUrl,
          name: nameWithoutExtension
        }
      })

    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error in songs API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
