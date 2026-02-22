"use client"
import { useEffect, useState, useCallback, memo, type FormEvent } from "react"
import { Typewriter } from "react-simple-typewriter"
import { type Intro as IntroType } from "../../../lib/database"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import SpotifyPlayer from "../spotify"
import Contact from "./contact"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const Introduction = memo(() => {
  const [intro, setIntro] = useState<IntroType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/intro')
      if (!response.ok) throw new Error('Failed to fetch intro')
      const data = await response.json()
      setIntro(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSendMessage = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return

    setIsSending(true)
    setSendStatus(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          senderName: senderName.trim() || undefined,
          senderEmail: senderEmail.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      setMessage("")
      setSenderName("")
      setSenderEmail("")
      setSendStatus("Message sent successfully!")
    } catch (sendError) {
      console.error("Failed to send message:", sendError)
      setSendStatus("Failed to send. Please try again.")
    } finally {
      setIsSending(false)
    }
  }, [intro, message])

  if (error) {
    return (
      <div id="introduction" className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center text-red-400">
          <p>Error loading content: {error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !intro) {
    return <div id="introduction" className="w-full max-w-7xl mx-auto px-2 sm:px-4 min-h-[500px]" />
  }

  return (
    <div id="introduction" className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">

        <motion.div
          className="md:col-span-8 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mb-10">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto sm:mx-0 flex-shrink-0">
              <a
                href="https://www.utoronto.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative rounded-full overflow-hidden bg-white/5 border-2 border-cyan-400/50 shadow-lg"
                style={{
                  boxShadow: "0 0 15px rgba(34, 211, 238, 0.3), 0 0 30px rgba(139, 92, 246, 0.2), 0 0 45px rgba(236, 72, 153, 0.15)"
                }}
                aria-label="Visit University of Toronto website"
              >
                <Image
                  src={intro.image}
                  alt="Profile"
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                  className="object-cover"
                  priority
                  quality={90}
                />
              </a>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 leading-tight">
                Hi, I&apos;m {intro.name}!
              </h1>
              <p className="text-xl text-gray-200 font-light leading-relaxed">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  {intro.title}
                </span>
              </p>
              <a
                href={intro.resume!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open my resume"
                className="group relative inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-xl overflow-hidden text-white font-semibold text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(236,72,153,0.15) 100%)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(236,72,153,0.12) 100%)" }}
                />
                <span className="relative flex items-center gap-2">
                  <span>📄</span>
                  <span>Resume</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-90 transition-opacity duration-200" />
                </span>
              </a>
            </div>
          </div>
          <div className="text-md sm:text-lg text-gray-300 leading-relaxed bg-white/5 rounded-2xl p-6 border border-white/10 min-h-[160px]">
            <Typewriter
              words={intro.bio.split(";")}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-4 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl flex flex-col justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Send Me a Message</h2>
          <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Name (optional)"
                className="h-11 px-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm"
              />
              <input
                type="email"
                name="senderEmail"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Email (optional)"
                className="h-11 px-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm"
              />
            </div>
            <textarea
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message or feedback..."
              className="h-22 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm resize-none align-top"
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-500/70 to-purple-500/70 hover:from-cyan-400/80 hover:to-purple-400/80 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
          {sendStatus && <p className="mt-2 text-sm text-gray-300 text-center">{sendStatus}</p>}
        </motion.div>

        <motion.div
          className="md:col-span-6 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl flex flex-col justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <SpotifyPlayer />
        </motion.div>

        <motion.div
          className="md:col-span-6 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl flex flex-col justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          <Contact />
        </motion.div>
      </div>
    </div>
  )
})

Introduction.displayName = 'Introduction'

export default Introduction
