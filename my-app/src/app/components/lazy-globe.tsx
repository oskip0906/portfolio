"use client"
import { useEffect, useRef } from "react"
import Globe from "react-globe.gl"

export default function LazyGlobe({ width, height }: { width: number; height: number }) {
	const globeRef = useRef<any>(null)

	useEffect(() => {
		if (!globeRef.current) return
		const controls = globeRef.current.controls?.()
		if (controls) {
			controls.autoRotate = true
			controls.autoRotateSpeed = 0.5
			controls.enablePan = false
			controls.enableZoom = false
		}
		globeRef.current.pointOfView?.({ altitude: 2.2 }, 0)
	}, [width, height])

	return (
		<Globe
			ref={globeRef}
			width={width}
			height={height}
			backgroundColor="rgba(0,0,0,0)"
			showAtmosphere={true}
			atmosphereColor="lightskyblue"
			atmosphereAltitude={0.2}
			enablePointerInteraction={false}
			rendererConfig={{ antialias: true, powerPreference: "high-performance" }}
			globeImageUrl="https://unpkg.com/three-globe@2.29.0/example/img/earth-blue-marble.jpg"
			bumpImageUrl="https://unpkg.com/three-globe@2.29.0/example/img/earth-topology.png"
		/>
	)
} 