"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // The static webpage needs normal document scrolling so its sidebar can
  // stay sticky — overflow-hidden on an ancestor breaks position: sticky.
  const isStaticPage = pathname === "/webpage"

  // Keep the document background white on the static page so overscroll/rubber-band
  // bounce reveals white instead of the dark 3D-scene backdrop color.
  useEffect(() => {
    document.body.classList.toggle("static-page", isStaticPage)
    return () => document.body.classList.remove("static-page")
  }, [isStaticPage])

  // Keep the document background white on the static page so overscroll/rubber-band
  // bounce reveals white instead of the dark 3D-scene backdrop color.
  useEffect(() => {
    document.body.classList.toggle("static-page", isStaticPage)
    return () => document.body.classList.remove("static-page")
  }, [isStaticPage])

  return (
    <>
      {!isStaticPage && <div className="fixed inset-0 -z-20" style={{ background: "#808080" }} />}
      <main className={cn("relative z-10 min-h-screen", !isStaticPage && "overflow-hidden")}>
        {children}
      </main>
    </>
  )
}
