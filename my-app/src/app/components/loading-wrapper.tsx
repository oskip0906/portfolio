"use client"
import { useLoading } from "./loading-context"
import LoadingSpinner from "./loading-spinner"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface LoadingWrapperProps {
  children: ReactNode
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const { isLoading } = useLoading()

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-50"
        >
          <LoadingSpinner />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: isLoading ? 0 : 0.3 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}