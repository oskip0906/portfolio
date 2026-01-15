import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('Supabase server client not initialized')
    return NextResponse.json([], { status: 500 })
  }

  try {
    // Fetch location metadata from the locations table
    const { data: locations, error: locationsError } = await supabase.storage
      .from('photos')
      .list('', { limit: 100 })

    if (locationsError) {
      console.error('Error fetching locations:', locationsError)
      return NextResponse.json([], { status: 500 })
    }

    if (!locations || locations.length === 0) {
      return NextResponse.json([])
    }

    // For each location, fetch photos and coordinates from the storage bucket
    const locationsWithPhotos = await Promise.all(
      locations.map(async (location) => {
        const { data: files, error: storageError } = await supabase
          .storage
          .from('photos')
          .list(location.name, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          })

        if (storageError) {
          console.error(`Error fetching photos for ${location.name}:`, storageError)
          return { name: location.name, coordinates: [0, 0], photos: [] }
        }

        // Get public URLs for all photos (exclude coords.txt and placeholder files)
        const photos = files
          ?.filter(file => !file.name.includes('.emptyFolderPlaceholder') && file.name !== 'coords.txt')
          .map(file => {
            const { data } = supabase
              .storage
              .from('photos')
              .getPublicUrl(`${location.name}/${file.name}`)
            return data.publicUrl
          }) || []

        // Fetch coordinates from coords.txt file
        let coordinates: [number, number] = [0, 0]
        try {
          const { data: coordsData, error: coordsError } = await supabase
            .storage
            .from('photos')
            .download(`${location.name}/coords.txt`)

          if (!coordsError && coordsData) {
            const coordsText = await coordsData.text()
            // Parse the coordinates from format
            const parsed = JSON.parse(coordsText.trim())
            if (Array.isArray(parsed) && parsed.length === 2) {
              coordinates = [parsed[1], parsed[0]]
            }

            console.log(`Coordinates for ${location.name}:`, coordinates)
          } else {
            console.warn(`No coords.txt found for ${location.name}`)
          }
        } catch (error) {
          console.error(`Error parsing coords for ${location.name}:`, error)
        }

        return { name: location.name, coordinates, photos }
      })
    )

    return NextResponse.json(locationsWithPhotos)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json([], { status: 500 })
  }
}
