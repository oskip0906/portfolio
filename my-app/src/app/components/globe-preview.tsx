"use client"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

const LazyGlobe = dynamic(() => import("./lazy-globe"), { ssr: false })

export default function GlobePreview({ onGlobeClick }: { onGlobeClick: () => void }) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const globeContainerRef = useRef<HTMLDivElement | null>(null)
	const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 320, height: 320 })

	useEffect(() => {
		if (typeof window === "undefined" || !containerRef.current) return

		const updateSize = () => {
			if (containerRef.current) {
				const { clientWidth, clientHeight } = containerRef.current
				setDimensions({ width: clientWidth, height: clientHeight })
			}
		}

		updateSize()
		const resizeObserver = new ResizeObserver(updateSize)
		resizeObserver.observe(containerRef.current)
		return () => resizeObserver.disconnect()
	}, [])

	useEffect(() => {
		const globeContainer = globeContainerRef.current
		if (!globeContainer) return

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault()
		}

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault()
		}

		// Add event listeners with passive: false to allow preventDefault
		globeContainer.addEventListener('wheel', handleWheel, { passive: false })
		globeContainer.addEventListener('touchmove', handleTouchMove, { passive: false })

		return () => {
			globeContainer.removeEventListener('wheel', handleWheel)
			globeContainer.removeEventListener('touchmove', handleTouchMove)
		}
	}, [])

	return (
		<section id="globe" className="w-full max-w-7xl mx-auto px-4 mb-12">
			<div className="text-center mb-8">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 mt-6">
          Explore My Journey
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Click on the Globe below!
        </p>
			</div>

			<div
				className="flex items-center justify-center"
			>
				<div
					ref={globeContainerRef}
					onClick={onGlobeClick}
					className="relative rounded-full p-[3px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(147,51,234,0.35)] cursor-pointer transition-transform duration-300 hover:scale-105 overscroll-none touch-none"
				>
					<div ref={containerRef} className="rounded-full bg-black/60 backdrop-blur-md overflow-hidden w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
						<LazyGlobe width={dimensions.width} height={dimensions.height} />
					</div>
					<div className="pointer-events-none absolute -inset-4 rounded-full blur-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
				</div>
			</div>
		</section>
	)
}