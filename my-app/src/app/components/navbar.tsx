"use client"
import React, { useState, useCallback, memo, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Briefcase, FolderOpen, Heart, Images, Menu, X, FlaskConical, Clock } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import ColorPicker from "./color-picker"
import SpotifyPlayer from "./spotify-player"

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/experiences', label: 'Experiences', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/research', label: 'Research', icon: FlaskConical },
  { href: '/interests', label: 'Interests', icon: Heart },
  { href: '/timeline', label: 'Timeline', icon: Clock },
  { href: '/globe', label: 'Photos', icon: Images },
]

const NavBar = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handleNumberShortcut = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      if (!["1", "2", "3", "4", "5", "6", "7"].includes(event.key)) return

      const index = Number(event.key) - 1
      const destination = navItems[index]?.href
      if (!destination || destination === pathname) return

      event.preventDefault()
      router.push(destination)
      setMenuOpen(false)
    }

    window.addEventListener("keydown", handleNumberShortcut)
    return () => window.removeEventListener("keydown", handleNumberShortcut)
  }, [pathname, router])

  return (
    <nav className="fixed top-4 inset-x-0 mx-auto z-[9999] w-[90vw] flex justify-center">
      <div
        className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl w-full"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.15)"
        }}
      >
        {/* Left: Color Picker */}
        <div className="w-10 flex items-center justify-start flex-shrink-0">
          <ColorPicker />
        </div>

        {/* Center: Nav Tabs */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Right: Music Player */}
        <div className="w-10 flex items-center justify-end flex-shrink-0">
          <SpotifyPlayer />
        </div>
      </div>

      {/* Condensed Navigation (below lg) */}
      <div
        className="lg:hidden w-full relative flex items-center px-3 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.15)"
        }}
      >
        {/* Left: Color Picker */}
        <div className="flex items-center z-10">
          <ColorPicker />
        </div>

        {/* Current Page Name & Burger Menu — absolutely centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 text-white pointer-events-auto">
            {(() => {
              const currentItem = navItems.find(item => item.href === pathname)
              const Icon = currentItem?.icon || Home
              return (
                <>
                  <Icon size={18} />
                  <span className="text-sm font-medium">
                    {currentItem?.label || "Home"}
                  </span>
                </>
              )
            })()}
            <button
              onClick={toggleMenu}
              className="p-1.5 ml-1 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Right: Music Player */}
        <div className="ml-auto flex items-center z-10">
          <SpotifyPlayer />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 -z-10"
                onClick={closeMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />

              {/* Menu */}
              <motion.div
                className="absolute top-16 left-1/2 transform -translate-x-1/2 w-56 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/20 shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 211, 238, 0.2)"
                }}
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="py-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link key={item.href} href={item.href} onClick={closeMenu}>
                        <div
                          className={`flex items-center gap-3 px-4 py-3 ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-l-2 border-cyan-400'
                              : 'hover:bg-white/10 border-l-2 border-transparent hover:border-l-white/30'
                          }`}
                          role="menuitem"
                        >
                          <Icon
                            size={20}
                            className={isActive ? 'text-cyan-400' : 'text-gray-400'}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isActive ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
})

NavBar.displayName = 'NavBar'
export default NavBar
