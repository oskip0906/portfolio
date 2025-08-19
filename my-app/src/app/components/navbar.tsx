"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null as any);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      timeoutRef.current = setTimeout(() => {
        setMenuOpen(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [menuOpen]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      setMenuOpen(false);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const menuItems = [
    { id: 'top', label: 'Introduction', icon: '🏠', action: scrollToTop },
    { id: 'experiences', label: 'Experiences', icon: '💼', action: () => scrollToSection('experiences') },
    { id: 'projects', label: 'Projects', icon: '💡', action: () => scrollToSection('projects') },
    { id: 'interests', label: 'Interests', icon: '🎨', action: () => scrollToSection('interests') },
    { id: 'globe', label: 'Globe', icon: '🌍', action: () => scrollToSection('globe') },
    { id: 'contact', label: 'Contact', icon: '✉️', action: () => scrollToSection('contact') },
  ];

  return (
    <Draggable nodeRef={dragRef}>
      <motion.div
        ref={dragRef}
        className="fixed top-4 right-1/4 z-[9999]"
        initial={false}
        animate={menuOpen ? ({ opacity: 1 } as any) : ({ opacity: 0.8 } as any)}
        transition={{ duration: 2 }}
      >
        <button
          onClick={toggleMenu}
          onTouchStart={toggleMenu}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/50 to-purple-500/50 text-white text-3xl flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl backdrop-blur-sm border border-white/20"
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
          style={{ 
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.3)" 
          } as any}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute top-24 left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-xl backdrop-blur-xl bg-gradient-to-br from-slate-800/70 to-slate-700/60 border border-white/20 shadow-2xl overflow-hidden"
              style={{
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.2)",
              } as any}
              initial={{ scale: 0.9, opacity: 0, y: -10 } as any}
              animate={{ scale: 1, opacity: 1, y: 0 } as any}
              exit={{ scale: 0.9, opacity: 0, y: -10 } as any}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="menu"
            >
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onTouchStart={item.action}
                    className="w-full text-left px-4 py-2.5 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-200 flex items-center text-gray-100 hover:text-white border-l-2 border-transparent hover:border-l-cyan-400"
                    role="menuitem"
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span className="text-base font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Draggable>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;