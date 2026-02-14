"use client"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { type Contact } from "@/lib/database"

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const ref = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/contacts')
        if (!response.ok) throw new Error('Failed to fetch contacts')
        const data = await response.json()
        setContacts(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <section ref={ref} id="contact" className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-6 gap-y-8">
        {contacts.map((contact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 } as any}
            animate={{ opacity: 1, scale: 1 } as any}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex flex-col items-center group"
          >
            <motion.a
              href={contact.value}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 } as any}
              whileTap={{ scale: 0.95 } as any}
              className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <img
                src={contact.image}
                alt={contact.type}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </motion.a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
