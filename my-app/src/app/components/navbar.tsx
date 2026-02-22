"use client"
import React, { useState, useCallback, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, FolderOpen, Heart, Globe, Mail, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/experiences', label: 'Experiences', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/interests', label: 'Interests', icon: Heart },
  { href: '/globe', label: 'Globe', icon: Globe },
]

const NavBar = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <nav className="fixed top-4 inset-x-0 mx-auto z-[9999] w-[95%] max-w-4xl flex justify-center">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.15)"
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full flex items-center justify-between px-4 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.15)"
        }}
      >
        {/* Current Page Name */}
        <div className="flex items-center gap-2 text-white">
          {(() => {
            const currentItem = navItems.find(item => item.href === pathname)
            const Icon = currentItem?.icon || Home
            return (
              <>
                <Icon size={18} />
                <span className="text-sm font-medium">{currentItem?.label || 'Home'}</span>
              </>
            )
          })()}
        </div>

        {/* Burger Menu Button */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

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
                  {navItems.map((item) => {
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
