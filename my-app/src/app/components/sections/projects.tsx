"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import { ExternalLink, Calendar, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { type Project } from "@/lib/database"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import "../carousel-pagination.css"

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const swiperRef = useRef<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data: Project[] = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!swiperRef.current) return

      if (e.key === 'ArrowLeft') {
        swiperRef.current.slidePrev()
      } else if (e.key === 'ArrowRight') {
        swiperRef.current.slideNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.section
      id="projects"
      className="w-full px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
        style={{ minHeight: "75vh" }}
      >
        {!isLoading && (
          <div className="relative">
            {/* Pagination at top */}
            <div className="projects-pagination flex justify-center mb-6 gap-3"></div>

            <motion.button
              ref={prevRef}
              aria-label="Previous slide"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:flex absolute top-1/2 left-0 md:-left-3 xl:-left-6 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-cyan-400/30 transition"
            >
              <ChevronLeft size={22} />
            </motion.button>
            <motion.button
              ref={nextRef}
              aria-label="Next slide"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:flex absolute top-1/2 right-0 md:-right-3 xl:-right-6 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-purple-400/30 transition"
            >
              <ChevronRight size={22} />
            </motion.button>
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              initialSlide={1}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current } as any}
              onBeforeInit={(swiper) => {
                const navigation = swiper.params.navigation as any
                navigation.prevEl = prevRef.current
                navigation.nextEl = nextRef.current
              }}
              onInit={(swiper) => {
                swiperRef.current = swiper
                swiper.navigation.init()
                swiper.navigation.update()
              }}
              pagination={{
                clickable: true,
                dynamicBullets: false,
                el: '.projects-pagination',
              }}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: false,
              }}
              className="w-full !pb-6 !pt-2"
            >
              {projects.map((project, index) => (
                <SwiperSlide key={index} className="w-[75vw] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="group backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl min-h-[60vh] sm:min-h-[65vh] md:min-h-[68vh] lg:min-h-[70vh] flex flex-col hover:shadow-cyan-500/30 transition-shadow duration-300">
                    {/* Project Image */}
                    <div className="relative h-[28vh] sm:h-[30vh] md:h-[34vh] overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                        priority
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

                      {/* Overlay content */}
                      <div className="absolute top-4 right-4">
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, rotate: 5 } as any}
                          className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white"
                        >
                          <ExternalLink size={16} />
                        </motion.a>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-400 font-medium">{project.date}</span>
                      </div>

                      <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        {project.name}
                      </h3>

                      <p className="text-gray-300 leading-relaxed flex-1 overflow-hidden">{project.description}</p>

                      {project.type && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 text-xs font-semibold tracking-wide text-cyan-300">
                            <Tag size={11} className="opacity-70" />
                            <span>{project.type}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </motion.div>
    </motion.section>
  )
}