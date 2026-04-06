"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaGithub, FaLinkedinIn, FaInstagram, FaSteam, FaGlobe } from "react-icons/fa"
import { type IconType } from "react-icons"
import { type Contact } from "@/lib/database"

function getContactIcon(type: string): IconType {
  const normalized = type.toLowerCase()
  if (normalized.includes("github")) return FaGithub
  if (normalized.includes("linkedin")) return FaLinkedinIn
  if (normalized.includes("instagram")) return FaInstagram
  if (normalized.includes("steam")) return FaSteam
  return FaGlobe
}

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([])

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
    <section id="contact" className="w-full pt-1 pb-0">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Let&apos;s Connect</h2>

      <div className="relative w-full flex justify-between items-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/15" />
        {contacts
          .filter((contact) => {
            const normalized = contact.type.toLowerCase()
            return (
              normalized.includes("github") ||
              normalized.includes("linkedin") ||
              normalized.includes("instagram") ||
              normalized.includes("steam")
            )
          })
          .map((contact, index) => {
          const Icon = getContactIcon(contact.type)
          return (
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
                aria-label={contact.type}
                className="group w-16 h-16 bg-white/5 border border-cyan-400/40 rounded-2xl p-2 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-purple-400/50 hover:-translate-y-0.5"
                style={{
                  boxShadow: "0 0 8px rgba(34, 211, 238, 0.16), 0 0 16px rgba(139, 92, 246, 0.1), 0 0 24px rgba(236, 72, 153, 0.08)"
                }}
              >
                <span className="text-[28px] text-white/90 leading-none drop-shadow-[0_0_6px_rgba(34,211,238,0.28)] group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.36)] transition-all duration-300">
                  <Icon />
                </span>
              </a>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
