"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import { Calendar, ChevronLeft, ChevronRight, FlaskConical, BookOpen, Tag } from "lucide-react"
import { type Research } from "@/lib/database"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

export default function Research() {
  const [papers, setPapers] = useState<Research[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const swiperRef = useRef<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/research')
        if (!response.ok) throw new Error('Failed to fetch research')
        const data: Research[] = await response.json()
        setPapers(data)
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
      ref={ref}
      id="research"
      className="w-full max-w-screen-xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="swiper-pagination-research flex justify-center mb-8"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
        style={{ minHeight: "62vh" }}
      >
        {!isLoading && (
        <div className="relative">
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
            slideToClickedSlide={false}
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
              el: '.swiper-pagination-research',
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
            {papers.map((paper, index) => (
              <SwiperSlide key={index} className="max-w-md">
                <div className="group backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl min-h-[55vh] sm:min-h-[58vh] md:min-h-[60vh] lg:min-h-[62vh] flex flex-col hover:shadow-cyan-500/30 transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-[26vh] sm:h-[28vh] md:h-[30vh] overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                    <Image
                      src={paper.image}
                      alt={paper.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      priority
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    <div className="absolute top-4 right-4">
                      <motion.a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 5 } as any}
                        className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 text-white shadow-lg"
                      >
                        <BookOpen size={16} />
                      </motion.a>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400 font-medium">{paper.date}</span>
                    </div>

                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      {paper.name}
                    </h3>

                    <p className="text-gray-300 leading-relaxed flex-1 overflow-hidden">{paper.description}</p>

                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                      {paper.published_to && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-medium text-gray-300">
                          <BookOpen size={11} className="opacity-60" />
                          <span>{paper.published_to}</span>
                        </div>
                      )}
                      {paper.focus && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 text-xs font-semibold tracking-wide text-cyan-300">
                          <FlaskConical size={11} className="opacity-70" />
                          <span>{paper.focus}</span>
                        </div>
                      )}
                    </div>
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
