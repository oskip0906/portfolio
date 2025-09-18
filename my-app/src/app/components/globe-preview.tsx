"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function GlobePreview() {
	const router = useRouter()

	const handleGlobeClick = () => {
		router.push("/globe")
	}
	return (
		<motion.section
			id="globe"
			className="w-full max-w-7xl mx-auto px-4 mb-12"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className="text-center mb-8">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 mt-6">
          Explore My Journey
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Click on the Globe below!
        </p>
			</div>

			<div className="flex items-center justify-center">
				<div
					onClick={handleGlobeClick}
					className="relative rounded-full p-[3px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(147,51,234,0.35)] cursor-pointer transition-transform duration-300 hover:scale-105"
				>
					<div className="rounded-full bg-black/60 backdrop-blur-md overflow-hidden w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
						<Image
							src="/earth.svg"
							alt="Earth Globe"
							width={400}
							height={400}
							className="text-cyan-400"
							priority
							style={{ aspectRatio: '1/1' }}
						/>
					</div>
					<div className="pointer-events-none absolute -inset-4 rounded-full blur-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
				</div>
			</div>
		</motion.section>
	)
}