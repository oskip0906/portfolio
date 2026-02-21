"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import { ExternalLink, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { type Project } from "@/lib/database"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data: Project[] = await response.json()

        // Preload all images before showing
        if (data.length > 0) {
          let loaded = 0
          const total = data.length

          await new Promise<void>((resolve) => {
            data.forEach((project) => {
              const img = new window.Image()
              img.onload = () => {
                loaded++
                if (loaded >= total) resolve()
              }
              img.onerror = () => {
                loaded++
                if (loaded >= total) resolve()
              }
              img.src = project.image
            })
          })
        }

        setProjects(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const ProjectsSkeleton = () => (
    <div className="flex items-center justify-center h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto mb-3"></div>
        <p className="text-sm text-white/70">Loading projects...</p>
      </div>
    </div>
  )

  return (
    <motion.section
      ref={ref}
      id="projects"
      className="w-full max-w-screen-xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Pagination at top */}
      <div className="swiper-pagination-top flex justify-center mt-4 md:mt-8 mb-8"></div>

      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="relative">
          <motion.button
            ref={prevRef}
            aria-label="Previous slide"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hidden sm:flex absolute top-1/2 -left-2 md:-left-6 xl:-left-10 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-cyan-400/30 transition"
          >
            <ChevronLeft size={22} />
          </motion.button>
          <motion.button
            ref={nextRef}
            aria-label="Next slide"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hidden sm:flex absolute top-1/2 -right-2 md:-right-6 xl:-right-10 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-purple-400/30 transition"
          >
            <ChevronRight size={22} />
          </motion.button>
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            slideToClickedSlide={false}
            initialSlide={1}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current } as any}
            onBeforeInit={(swiper) => {
              const navigation = swiper.params.navigation as any
              navigation.prevEl = prevRef.current
              navigation.nextEl = nextRef.current
            }}
            onInit={(swiper) => {
              swiper.navigation.init()
              swiper.navigation.update()
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
              el: '.swiper-pagination-top',
            }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            className="w-full [&_.swiper-pagination-bullet]:w-3 [&_.swiper-pagination-bullet]:h-3 [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-gradient-to-r [&_.swiper-pagination-bullet-active]:from-cyan-400 [&_.swiper-pagination-bullet-active]:to-purple-400 [&_.swiper-pagination-bullet-active]:scale-125"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={index} className="max-w-md">
                <div className="group backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl h-[600px] flex flex-col hover:shadow-cyan-500/30 transition-shadow duration-300">
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      priority={index < 3}
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

                    <p className="text-gray-300 leading-relaxed mb-6 flex-1 overflow-hidden">{project.description}</p>

                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 } as any}
                      whileTap={{ scale: 0.95 } as any}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium shadow-lg mt-auto"
                    >
                      <span>View Project</span>
                      <ExternalLink size={16} />
                    </motion.a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </motion.section>
  )
}