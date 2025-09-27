"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Map } from "lucide-react"
import { getLocations, type Location } from "@/lib/database"
import Image from "next/image"

const mapStyles = [
  { id: 'Standard', name: 'Standard', style: 'mapbox://styles/mapbox/standard' },
  { id: 'Satellite', name: 'Satellite', style: 'mapbox://styles/mapbox/standard-satellite' },
]

function PhotoGallery({ location, onClose }: { location: Location; onClose: () => void }) {
  const [currentPhoto, setCurrentPhoto] = useState(0)

  const nextPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev + 1) % location.photos.length)
  }, [location.photos.length])

  const prevPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev - 1 + location.photos.length) % location.photos.length)
  }, [location.photos.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      } else if (event.key === "ArrowLeft") {
        prevPhoto()
      } else if (event.key === "ArrowRight") {
        nextPhoto()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, prevPhoto, nextPhoto])

  // Lock body scroll while gallery is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 } as any}
      animate={{ opacity: 1 } as any}
      exit={{ opacity: 0 } as any}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 } as any}
        animate={{ scale: 1, opacity: 1 } as any}
        exit={{ scale: 0.9, opacity: 0 } as any}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative max-w-3xl w-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl shadow-xl overflow-hidden"
        style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' } as any}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 backdrop-blur-sm border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">{location.name}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Photo Display */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            {location.photos.length > 1 && (
              <button
                onClick={prevPhoto}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white p-2 rounded-full shadow-md transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            )}
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={location.photos[currentPhoto] || "/placeholder.svg"}
                alt={`${location.name} - Photo ${currentPhoto + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover rounded-lg"
                quality={80}
                priority={currentPhoto === 0}
              />
              {/* Photo counter */}
              <div className="absolute bottom-3 right-3 backdrop-blur-sm bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentPhoto + 1} / {location.photos.length}
              </div>
            </div>
            {location.photos.length > 1 && (
              <button
                onClick={nextPhoto}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white p-2 rounded-full shadow-md transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                </svg>
              </button>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {location.photos.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto overflow-y-hidden">
              {location.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhoto(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${currentPhoto === index
                    ? 'border-blue-400'
                    : 'border-white/20 hover:border-white/40'
                    }`}
                >
                  <Image
                    src={photo}
                    alt={`${location.name} photo ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    quality={60}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ExpandedMap({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0)
  const [isMapboxLoading, setIsMapboxLoading] = useState(false)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxgl, setMapboxgl] = useState<any>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<any>(null)
  const markers = useRef<any[]>([])

  // Lazy load mapbox-gl
  const loadMapbox = useCallback(async () => {
    if (mapboxLoaded || isMapboxLoading) return

    setIsMapboxLoading(true)
    
    try {
      // Load CSS first
      if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css'
        document.head.appendChild(link)
      }

      // Dynamically import mapbox-gl
      const mapboxModule = await import('mapbox-gl')
      setMapboxgl(mapboxModule.default)
      setMapboxLoaded(true)
    } catch (error) {
      console.error('Failed to load Mapbox GL:', error)
    } finally {
      setIsMapboxLoading(false)
    }
  }, [mapboxLoaded, isMapboxLoading])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLocations()
        setLocations(data)
      } catch (error) {
        console.error('Failed to load locations:', error)
      }
    }

    fetchData()
  }, [])

  const createMarkerElement = (location: Location) => {
    const markerElement = document.createElement("div")
    markerElement.className = "custom-marker"
    markerElement.innerHTML = `
      <div class="relative group cursor-pointer">
        <div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-md hover:scale-110 transition-all duration-200 flex items-center justify-center hover:bg-blue-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div class="absolute -top-10 left-2/3 transform -translate-x-2/3 bg-black/80 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          ${location.name}
        </div>
      </div>
    `

    markerElement.addEventListener("click", (e) => {
      e.stopPropagation()
      setSelectedLocation(location)

      if (map.current) {
        map.current.flyTo({
          center: location.coordinates,
          duration: 2000,
        })
      }
    })

    return markerElement
  }

  const addMarkers = () => {
    if (!map.current || locations.length === 0 || !mapboxgl) return

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    // Add markers for each location
    locations.forEach((location) => {
      const markerElement = createMarkerElement(location)
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat(location.coordinates)
        .addTo(map.current!)

      markers.current.push(marker)
    })
  }

  const changeMapStyle = (styleIndex: number) => {
    if (map.current) {
      map.current.setStyle(mapStyles[styleIndex].style)
      setCurrentStyleIndex(styleIndex)

      // Re-add markers after style change
      map.current.once('styledata', addMarkers)
    }
  }

  // Load mapbox when modal opens
  useEffect(() => {
    if (isOpen && !mapboxLoaded && !isMapboxLoading) {
      loadMapbox()
    }
  }, [isOpen, loadMapbox, mapboxLoaded, isMapboxLoading])

  useEffect(() => {
    if (!isOpen || !mapContainer.current || map.current || !mapboxgl) return

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    
    if (!mapboxToken) {
      console.warn('Mapbox access token not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables.')
      // Show a message in the map container
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-900 text-white">
            <div class="text-center">
              <p class="text-lg mb-2">Map unavailable</p>
              <p class="text-sm text-gray-400">Mapbox token not configured</p>
            </div>
          </div>
        `
      }
      return
    }

    mapboxgl.accessToken = mapboxToken

    // Initialize map with error handling
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyles[currentStyleIndex].style,
        center: [-79.9, 43.5],
        zoom: 1,
        trackResize: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false
      })
    } catch (error) {
      console.error('Failed to initialize map:', error)
      // Show error message in container
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-900 text-white">
            <div class="text-center">
              <p class="text-lg mb-2">Map failed to load</p>
              <p class="text-sm text-gray-400">Check console for details</p>
            </div>
          </div>
        `
      }
      return
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Disable keyboard interactions
    map.current.keyboard.disable()

    // Handle map resize
    const resizeObserver = new ResizeObserver(() => {
      map.current?.resize()
    })
    resizeObserver.observe(mapContainer.current)

    // Cleanup function
    return () => {
      resizeObserver.disconnect()
      if (map.current) {
        markers.current.forEach((marker) => marker.remove())
        markers.current = []
        map.current.remove()
        map.current = null
      }
    }
  }, [isOpen, mapboxgl])

  useEffect(() => {
    if (!map.current || locations.length === 0) return

    const mapInstance = map.current

    if (mapInstance.loaded()) {
      addMarkers()
    } else {
      mapInstance.on("load", addMarkers)
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("load", addMarkers)
      }
    }
  }, [locations, mapboxgl])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 } as any}
      animate={{ opacity: 1 } as any}
      exit={{ opacity: 0 } as any}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-0"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 } as any}
        animate={{ scale: 1, opacity: 1 } as any}
        exit={{ scale: 0.9, opacity: 0 } as any}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-3">
            <Map className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Explore My Photos</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-full">
          <div ref={mapContainer} className="w-full h-full">
            {/* Loading state */}
            {isMapboxLoading && (
              <div className="flex items-center justify-center h-full bg-gray-900 text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-lg mb-2">Loading Map...</p>
                  <p className="text-sm text-gray-400">Please wait</p>
                </div>
              </div>
            )}
          </div>

          {/* Map Style Selector */}
          {mapboxLoaded && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex gap-2">
                {mapStyles.map((style, index) => (
                  <button
                    key={style.id}
                    onClick={() => changeMapStyle(index)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentStyleIndex === index
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedLocation && (
          <PhotoGallery 
            location={selectedLocation} 
            onClose={() => setSelectedLocation(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}