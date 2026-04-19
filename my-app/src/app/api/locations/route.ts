import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getPublicPhotosDir } from '@/lib/portfolio-data'

export async function GET() {
  try {
    const photosDir = getPublicPhotosDir()
    if (!fs.existsSync(photosDir)) {
      console.warn('Locations API: photos directory not found at', photosDir)
      return NextResponse.json([])
    }

    const locationNames = fs
      .readdirSync(photosDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)

    const locations = locationNames.map(name => {
      const locationDir = path.join(photosDir, name)

      // Read coordinates
      let coordinates: [number, number] = [0, 0]
      try {
        const coordsText = fs.readFileSync(path.join(locationDir, 'coords.txt'), 'utf-8').trim()
        const parsed = JSON.parse(coordsText)
        if (Array.isArray(parsed) && parsed.length === 2) {
          // coords.txt is [lat, lon], Mapbox needs [lon, lat]
          coordinates = [parsed[1], parsed[0]]
        }
      } catch {
        console.warn(`No coords.txt found for ${name}`)
      }

      // List photos
      const photos = fs
        .readdirSync(locationDir)
        .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
        .sort()
        .map(file => `/photos/${name}/${file}`)

      return { name, coordinates, photos }
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error reading locations:', error)
    return NextResponse.json([], { status: 500 })
  }
}
