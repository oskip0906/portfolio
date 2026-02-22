"use client"
import { memo } from "react"
import { motion } from "framer-motion"
import { Shuffle } from "lucide-react"

const SpotifyFooterPlayer = memo(() => {

  return (
    <div className="flex items-center gap-2 h-full">
      <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 flex-1"
        >
          Click shuffle for a random song!
        </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-500 hover:to-green-600 rounded-full text-white flex items-center gap-2 transition-all disabled:opacity-50 flex-shrink-0"
      >
        <Shuffle className="w-4 h-4" />
      </motion.button>
    </div>
  )
})

SpotifyFooterPlayer.displayName = 'SpotifyFooterPlayer'
export default SpotifyFooterPlayer
