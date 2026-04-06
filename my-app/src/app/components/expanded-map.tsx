"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { type Location } from "@/lib/database"
import Image from "next/image"
import { useBackground } from "../contexts/background-context"

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function PhotoGallery({ location, onClose }: { location: Location; onClose: () => void }) {
  const { baseColor } = useBackground()
  const { r, g, b } = hexToRgb(baseColor)
  const brightR = Math.min(255, r + 80)
  const brightG = Math.min(255, g + 80)
  const brightB = Math.min(255, b + 80)
  const glowColor = `rgba(${brightR}, ${brightG}, ${brightB}, 0.25)`
  const accentColor = `rgb(${brightR}, ${brightG}, ${brightB})`

  const [current, setCurrent] = useState(0)
  const [allImagesLoaded, setAllImagesLoaded] = useState(false)

  useEffect(() => {
    setCurrent(0)
    setAllImagesLoaded(false)
  }, [location])

  useEffect(() => {
    let cancelled = false

    const preloadAll = async () => {
      if (location.photos.length === 0) {
        if (!cancelled) setAllImagesLoaded(true)
        return
      }

      await Promise.all(
        location.photos.map(
          (photo) =>
            new Promise<void>((resolve) => {
              const img = new window.Image()
              img.src = photo
              if (img.complete) {
                resolve()
                return
              }
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
        )
      )

      if (!cancelled) setAllImagesLoaded(true)
    }

    preloadAll()
    return () => {
      cancelled = true
    }
  }, [location])

  const scrollPrev = useCallback(() => setCurrent((p) => (p - 1 + location.photos.length) % location.photos.length), [location.photos.length])
  const scrollNext = useCallback(() => setCurrent((p) => (p + 1) % location.photos.length), [location.photos.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        scrollNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, scrollPrev, scrollNext])

  useEffect(() => {
    document.body.classList.add('scroll-locked')
    return () => document.body.classList.remove('scroll-locked')
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: `0 0 30px ${glowColor}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{location.name}</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">{current + 1} / {location.photos.length}</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative p-4">
          <div className="rounded-2xl border border-white/20 bg-black/35 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="relative w-full h-[26vh] sm:h-[34vh] bg-black/45 rounded-xl overflow-hidden">
              {!allImagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: `${accentColor} transparent transparent transparent` }}
                  />
                </div>
              )}
              {allImagesLoaded && (
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <Image
                      src={location.photos[current]}
                      alt={`${location.name} - ${current + 1}`}
                      fill
                      sizes="(max-width: 640px) 68vw, (max-width: 1024px) 52vw, 460px"
                      className="object-contain"
                      quality={35}
                      priority={current === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {location.photos.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/20 ring-1 ring-white/30 text-white hover:bg-black/70 transition-colors z-10"
                style={{ color: accentColor, boxShadow: `0 0 12px ${glowColor}` }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/20 ring-1 ring-white/30 text-white hover:bg-black/70 transition-colors z-10"
                style={{ color: accentColor, boxShadow: `0 0 12px ${glowColor}` }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {location.photos.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {location.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${i === current ? "scale-150" : "bg-white/30"}`}
                style={i === current ? { backgroundColor: accentColor } : {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ExpandedMapProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExpandedMap({ isOpen, onClose }: ExpandedMapProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isMapboxLoading, setIsMapboxLoading] = useState(false)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxgl, setMapboxgl] = useState<any>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<any>(null)
  const markers = useRef<any[]>([])

  const loadMapbox = useCallback(async () => {
    if (mapboxLoaded || isMapboxLoading) return
    setIsMapboxLoading(true)
    try {
      if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css'
        document.head.appendChild(link)
      }
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
        const response = await fetch('/api/locations')
        if (!response.ok) throw new Error('Failed to fetch locations')
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Failed to load locations:', error)
      }
    }
    fetchData()
  }, [])

  const createMarkerElement = useCallback((location: Location) => {
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
        map.current.flyTo({ center: location.coordinates, duration: 2000 })
      }
    })
    return markerElement
  }, [])

  const addMarkers = useCallback(() => {
    if (!map.current || locations.length === 0 || !mapboxgl) return
    markers.current.forEach((marker) => marker.remove())
    markers.current = []
    locations.forEach((location) => {
      const markerElement = createMarkerElement(location)
      const marker = new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
        .setLngLat(location.coordinates)
        .addTo(map.current!)
      markers.current.push(marker)
    })
  }, [locations, mapboxgl, createMarkerElement])

  useEffect(() => {
    if (isOpen && !mapboxLoaded && !isMapboxLoading) loadMapbox()
  }, [isOpen, loadMapbox, mapboxLoaded, isMapboxLoading])

  useEffect(() => {
    if (!isOpen || !mapContainer.current || map.current || !mapboxgl) return
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!mapboxToken) {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `<div class="flex items-center justify-center h-full bg-gray-900 text-white"><div class="text-center"><p class="text-lg mb-2">Map unavailable</p><p class="text-sm text-gray-400">Mapbox token not configured</p></div></div>`
      }
      return
    }
    mapboxgl.accessToken = mapboxToken
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard',
        center: [-79.9, 43.5],
        zoom: 1,
        trackResize: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false
      })
    } catch (error) {
      console.error('Failed to initialize map:', error)
      return
    }
    const isMobile = window.innerWidth < 640
    const navControl = new mapboxgl.NavigationControl()
    map.current.addControl(navControl, 'top-right')
    if (isMobile) {
      setTimeout(() => {
        const controlContainer = mapContainer.current?.querySelector('.mapboxgl-ctrl-top-right')
        if (controlContainer) (controlContainer as HTMLElement).style.top = '5rem'
      }, 100)
    }
    map.current.keyboard.disable()
    const resizeObserver = new ResizeObserver(() => { map.current?.resize() })
    resizeObserver.observe(mapContainer.current)
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
    if (mapInstance.loaded()) addMarkers()
    else mapInstance.on("load", addMarkers)
    return () => { if (mapInstance) mapInstance.off("load", addMarkers) }
  }, [locations, mapboxgl, addMarkers])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('scroll-locked')
      return () => document.body.classList.remove('scroll-locked')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-0"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full overflow-hidden"
      >
        <div className="relative w-full h-full">
          <div ref={mapContainer} className="w-full h-full">
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
