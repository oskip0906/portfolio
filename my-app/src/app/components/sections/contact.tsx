"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { getContacts, type Contact } from "@/lib/database"

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContacts()
        setContacts(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl animate-pulse border border-white/20 mb-4" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-16"></div>
        </div>
      ))}
    </div>
  )

  return (
    <motion.section
      ref={ref}
      id="contact"
      className="w-full max-w-7xl mx-auto px-4 mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Let's Connect
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find me on these platforms and let's connect
        </p>
      </div>

      {/* Contact Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: "easeOut"
              }}
              className="flex flex-col items-center group"
            >
              <motion.a
                href={contact.value}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                whileHover={{ scale: 1.1 } as any}
                whileTap={{ scale: 0.95 } as any}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 scale-110" />
                  <div className="relative w-20 h-20 bg-black/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 flex items-center justify-center transition-all duration-300 hover:bg-black/20 hover:border-white/20">
                    <img
                      src={contact.image}
                      alt={contact.type}
                      className="w-full h-full object-contain"
                      style={{ aspectRatio: '1/1' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.a>

              {/* Label */}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                className="mt-4 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200 capitalize"
              >
                {contact.type}
              </motion.span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="flex space-x-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.section>
  )
}
