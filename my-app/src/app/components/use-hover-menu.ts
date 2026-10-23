"use client"
import { useEffect, useRef, useState, type PointerEvent } from "react"

// Hover opens the menu for mouse users only: on touch screens the emulated hover
// fires right before the click, so the click would immediately close it again.
// A tap/click anywhere outside closes it, so two menus never stay open on top of each other.
export function useHoverMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: globalThis.PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", closeOnOutside)
    return () => document.removeEventListener("pointerdown", closeOnOutside)
  }, [open])

  const hoverProps = {
    ref,
    onPointerEnter: (event: PointerEvent) => { if (event.pointerType === "mouse") setOpen(true) },
    onPointerLeave: (event: PointerEvent) => { if (event.pointerType === "mouse") setOpen(false) },
  }

  return { open, setOpen, hoverProps }
}
