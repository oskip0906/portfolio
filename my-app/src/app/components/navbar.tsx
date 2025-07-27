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
      }, 2000);
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <button
          onClick={toggleMenu}
          onTouchStart={toggleMenu}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/50 to-blue-500/50 text-white text-3xl flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
          style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute top-24 left-1/2 transform -translate-x-1/2 mt-2 w-60 rounded-lg bg-sky-100/20 dark:bg-sky-800/80 text-gray-800 dark:text-white shadow-xl flex flex-col items-start justify-center space-y-1 p-3 backdrop-blur-sm"
              style={{
                boxShadow:
                  "0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)",
              }}
              initial={{ scale: 0.9, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              role="menu"
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  onTouchStart={item.action}
                  className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
                  role="menuitem"
                >
                  <span className="mr-2">{item.icon}</span> {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Draggable>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;