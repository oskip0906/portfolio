"use client"
import { useRef } from "react"
import { motion } from "framer-motion"

export default function ScrollSeparator() {
	const ref = useRef(null)
	const inView = true

	return (
		<section ref={ref} className="w-full max-w-7xl mx-auto px-4 my-12 h-[40vh] md:h-[25vh] flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.96 } as any}
				animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 } as any}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="relative w-full flex flex-col items-center gap-6"
			>
				{/* Glowing gradient line that draws in */}
				<motion.div
					className="h-1 w-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"
					animate={inView ? { width: "66%" } : { width: 0 } as any}
					transition={{ duration: 1.2, ease: "easeInOut" }}
				/>

				{/* Label */}
				<motion.div
					initial={{ opacity: 0, y: 10 } as any}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 } as any}
					transition={{ delay: 0.2, duration: 0.6 }}
					className="text-center"
				>
					<p className="text-sm md:text-base text-gray-300">
						<span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
							Scroll to explore
						</span>
					</p>
				</motion.div>

				{/* Animated chevrons */}
				<div className="flex flex-col items-center gap-2 mt-2">
					{[0, 1, 2].map((i) => (
						<motion.svg
							key={i}
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="text-white/80"
							initial={{ opacity: 0, y: -6 } as any}
							animate={inView ? { opacity: [0.2, 1, 0.2], y: [ -2, 2, -2 ] } : { opacity: 0.2, y: -6 } as any}
							transition={{ duration: 1.2, delay: i * 0.12 + 0.15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
						>
							<path d="M6 9l6 6 6-6" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<defs>
								<linearGradient id="grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
									<stop offset="0%" stopColor="#22d3ee" />
									<stop offset="50%" stopColor="#a855f7" />
									<stop offset="100%" stopColor="#ec4899" />
								</linearGradient>
							</defs>
						</motion.svg>
					))}
				</div>

				{/* Soft glow background */}
				<div className="absolute inset-0 -z-10 flex items-center justify-center">
					<div className="w-2/3 h-24 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-2xl"></div>
				</div>
			</motion.div>
		</section>
	)
} 