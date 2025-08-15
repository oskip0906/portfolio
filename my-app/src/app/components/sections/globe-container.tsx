"use client"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import GlobePreview from "../globe-preview"
import ExpandedMap from "../expanded-map"

export default function GlobeContainer() {
  const [showExpandedMap, setShowExpandedMap] = useState(false)

  const handleGlobeClick = () => {
    setShowExpandedMap(true)
  }

  const handleMapClose = () => {
    setShowExpandedMap(false)
  }

  return (
    <>
      <GlobePreview onGlobeClick={handleGlobeClick} />
      
      <AnimatePresence>
        {showExpandedMap && (
          <ExpandedMap 
            isOpen={showExpandedMap} 
            onClose={handleMapClose} 
          />
        )}
      </AnimatePresence>
    </>
  )
}