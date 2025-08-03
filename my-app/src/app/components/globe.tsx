"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView, type TargetAndTransition } from "framer-motion"
import { X, PowerOff } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface Location {
  id: number
  name: string
  coordinates: [number, number]
  photos: string[]
}

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
            <div className="relative w-full max-w-md">
              <img
                src={location.photos[currentPhoto] || "/placeholder.svg"}
                className="w-full aspect-square object-cover rounded-lg"
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
            <div className="flex gap-2 justify-center overflow-x-auto">
              {location.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhoto(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${currentPhoto === index
                    ? 'border-blue-400 scale-110'
                    : 'border-white/20 hover:border-white/40'
                    }`}
                >
                  <img
                    src={photo}
                    alt={`${location.name} photo ${index + 1}`}
                    className="w-full h-full object-cover"
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

export default function Globe() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0)
  const [isGlobeActive, setIsGlobeActive] = useState(false)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const ref = useRef(null)
  const inView = useInView(ref, { 
    once: false,
    amount: 0.3,
    margin: "-100px 0px -100px 0px"
  })

  useEffect(() => {
    fetch('/locations.json')
      .then(res => res.json())
      .then(data => setLocations(data));
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
    if (!map.current || locations.length === 0) return

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

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[currentStyleIndex].style,
      center: [-79.9, 43.5],
      zoom: 0.5,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

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
  }, [])

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
  }, [locations])

  return (
    <section ref={ref} id="globe" className="w-full max-w-7xl mx-auto px-4 mb-12">
      <div className="relative flex flex-col items-center justify-center py-12" onClick={() => setIsGlobeActive(true)}>
        <motion.div
          initial={{ opacity: 0, y: 50 } as any}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 } as any}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            My Journey Around the World
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-300 text-base lg:text-lg backdrop-blur-sm bg-black/20 rounded-lg p-3 max-w-2xl mx-auto mx-2">
            Explore the places I've been and the photos I took on my phone
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 } as any}
          animate={inView ? { opacity: isGlobeActive ? 1 : 0.5, y: 0 } : { opacity: 0, y: 20 } as any}
          transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
          className={`w-full h-[60vh] md:h-[70vh] lg:h-[75vh] rounded-2xl overflow-hidden bg-gradient-to-r from-red-500/50 via-yellow-500/50 via-green-500/50 via-blue-500/50 via-indigo-500/50 to-purple-500/50 p-1 relative transition-all duration-1000 ${isGlobeActive ? 'animate-rainbow-glow' : 'pointer-events-none'}`}
        >
          <div ref={mapContainer} className="w-full h-full rounded-2xl bg-black" />

          {/* Map Style Selector */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex gap-2">
              {mapStyles.map((style, index) => (
                <button
                  key={style.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    changeMapStyle(index)
                  }}
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

          {/* Deactivate Button */}
          {isGlobeActive && (
            <div className="absolute top-4 right-16 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsGlobeActive(false)
                }}
                className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-all duration-200"
                title="Deactivate Globe"
              >
                <PowerOff size={20} />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLocation && <PhotoGallery location={selectedLocation} onClose={() => setSelectedLocation(null)} />}
      </AnimatePresence>
    </section>
  )
}
