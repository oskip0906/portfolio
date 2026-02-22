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
    <section ref={ref} id="contact" className="w-full pt-1 pb-0">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Let&apos;s Connect</h2>

      <div className="relative w-full flex justify-between items-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/15" />
        {contacts.map((contact, index) => (
          <motion.div
            key={index}
            className="relative z-10"
            initial={{ opacity: 0, y: 10 } as any}
            animate={{ opacity: 1, y: 0 } as any}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <a
              href={contact.value}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <img
                src={contact.image}
                alt={contact.type}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </a>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-center text-gray-400">Discord: <span className="text-gray-200 font-medium">oskip123</span></p>
    </section>
  )
}
