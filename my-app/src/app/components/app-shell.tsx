"use client"

import type { ReactNode } from "react"
import DynamicBackground from "./dynamic-background"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DynamicBackground />
      <main className="relative z-10 min-h-screen overflow-hidden">
        {children}
      </main>
    </>
  )
}
