"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    // Highlight whichever section is crossing the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-30% 0px -65% 0px" },
    )
    items.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label="Sections" className="flex flex-col gap-1">
      {items.map((item, i) => {
        const isActive = active === item.id
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "group flex items-center gap-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
              isActive ? "text-stone-900" : "text-stone-400 hover:text-stone-700",
            )}
          >
            <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive ? "w-14 bg-[#3d6b4f]" : "w-7 bg-stone-300 group-hover:w-11 group-hover:bg-stone-500",
              )}
            />
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
