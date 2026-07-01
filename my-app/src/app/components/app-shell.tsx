"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // The static webpage needs normal document scrolling so its sidebar can
  // stay sticky — overflow-hidden on an ancestor breaks position: sticky.
  const isStaticPage = pathname === "/webpage"

  return (
    <>
      <div className="fixed inset-0 -z-20" style={{ background: "#808080" }} />
      <main className={cn("relative z-10 min-h-screen", !isStaticPage && "overflow-hidden")}>
        {children}
      </main>
    </>
  )
}
