"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import { ExternalLink, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { getProjects, type Project } from "@/lib/database"
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
        const data = await getProjects()
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
    <div className="flex justify-center">
      <div className="max-w-md">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl h-[600px] flex flex-col">
          <div className="relative h-64 bg-white/10 animate-pulse"></div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="h-4 bg-white/10 rounded animate-pulse mb-3 w-20"></div>
            <div className="h-6 bg-white/10 rounded animate-pulse mb-4"></div>
            <div className="space-y-2 mb-6 flex-1">
              <div className="h-4 bg-white/10 rounded animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
            </div>
            <div className="h-12 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <motion.section
      ref={ref}
      id="projects"
      className="w-full max-w-screen-xl mx-auto px-4 mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 mt-6">
          Projects
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Showcasing my creative work and technical expertise
        </p>
      </div>

      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="relative">
          <motion.button
          ref={prevRef}
          aria-label="Previous slide"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="hidden sm:flex absolute top-1/2 -left-2 md:-left-6 xl:-left-10 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl hover:shadow-[0_0_35px_rgba(34,211,238,0.65)] hover:ring-2 hover:ring-cyan-400/50 transition focus:outline-none"
        >
          <ChevronLeft size={22} />
        </motion.button>
        <motion.button
          ref={nextRef}
          aria-label="Next slide"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="hidden sm:flex absolute top-1/2 -right-2 md:-right-6 xl:-right-10 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl hover:shadow-[0_0_35px_rgba(168,85,247,0.65)] hover:ring-2 hover:ring-purple-400/50 transition focus:outline-none"
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
          }}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          className="w-full"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={index} className="max-w-md">
              <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl h-[600px] flex flex-col hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-shadow duration-300">
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    quality={75}
                    style={{ aspectRatio: '16/9' }}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

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