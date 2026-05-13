"use client"

import type { ReactNode } from "react"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-20" style={{ background: "#808080" }} />
      <main className="relative z-10 min-h-screen overflow-hidden">
        {children}
      </main>
    </>
  )
}
