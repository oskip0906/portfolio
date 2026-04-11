"use client"
import { motion } from "framer-motion"
import { type Interest } from "../../../lib/database"
import { Card, CardContent } from "../ui/card"

export default function Interests({ interests }: { interests: Interest[] }) {

  return (
    <section id="interests" className="w-full mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3vh] sm:gap-8">
        {interests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="group relative h-full min-h-[25vh] sm:min-h-[28vh] md:min-h-[30vh] hover:border-white/30 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <CardContent className="p-[2.5vh] sm:p-6 lg:p-[2.8vh] h-full flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">
                    {interest.emote}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {interest.name}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{interest.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
