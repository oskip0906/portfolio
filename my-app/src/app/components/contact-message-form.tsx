"use client"

import { useState, useCallback, type FormEvent } from "react"

type Props = {
  className?: string
  /** Tighter copy and spacing for the room overlay modal. */
  variant?: "default" | "modal"
  accentColor?: string
}

export default function ContactMessageForm({
  className = "",
  variant = "default",
  accentColor,
}: Props) {
  const modal = variant === "modal"
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<string | null>(null)

  const handleSendMessage = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [message],
  )

  return (
    <div className={className}>
      <h2
        className={`font-semibold text-white text-center ${
          modal ? "text-lg mb-2" : "text-xl mb-3"
        }`}
      >
        Send me a message
      </h2>
      {!modal && (
        <p className="text-sm text-gray-400 text-center mb-4 leading-relaxed">
          Relayed with Gmail SMTP when <code className="text-gray-300 text-xs">SMTP_USER</code> /{" "}
          <code className="text-gray-300 text-xs">SMTP_PASS</code> are set on the server.
        </p>
      )}
      {modal && (
        <p className="text-xs text-white/45 text-center mb-3 leading-relaxed">
          Delivers to my inbox via the site API.
        </p>
      )}
      <form onSubmit={handleSendMessage} className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-2.5">
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
            placeholder="Your email (optional)"
            className="h-11 px-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm"
          />
        </div>
        <textarea
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message or feedback…"
          rows={modal ? 4 : 5}
          className={`px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm resize-y align-top ${
            modal ? "min-h-[100px]" : "min-h-[120px]"
          }`}
        />
        <button
          type="submit"
          disabled={isSending || !message.trim()}
          className={`h-11 px-5 rounded-xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:brightness-110 ${
            accentColor
              ? ""
              : "bg-gradient-to-r from-cyan-500/70 to-purple-500/70 hover:from-cyan-400/80 hover:to-purple-400/80"
          }`}
          style={accentColor ? { background: accentColor } : undefined}
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </form>
      {sendStatus && <p className="mt-3 text-sm text-gray-300 text-center">{sendStatus}</p>}
    </div>
  )
}
