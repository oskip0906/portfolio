"use client";
import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null as any);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (menuOpen) {
      timer = setTimeout(() => {
        setMenuOpen(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      setMenuOpen(false);
    }
  };

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
          onClick={() => setMenuOpen(!menuOpen)}
          onTouchStart={() => setMenuOpen(!menuOpen)}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/50 to-blue-500/50 text-white text-3xl flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
          aria-label="Toggle Menu"
          style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute top-24 left-1/2 transform -translate-x-1/2 mt-2 w-60 rounded-lg bg-sky-100/20 dark:bg-sky-800/20 text-gray-800 dark:text-white shadow-xl flex flex-col items-start justify-center space-y-1 p-3 backdrop-blur-sm"
              style={{
                boxShadow:
                  "0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)",
              }}
              initial={{ scale: 0.9, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onTouchStart={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
              >
                <span className="mr-2">🏠</span> Introduction
              </button>

              <button
                onClick={() => scrollToSection("experiences")}
                onTouchStart={() => scrollToSection("experiences")}
                className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
              >
                <span className="mr-2">💼</span> Experiences
              </button>

              <button
                onClick={() => scrollToSection("projects")}
                onTouchStart={() => scrollToSection("projects")}
                className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
              >
                <span className="mr-2">💡</span> Projects
              </button>

              <button
                onClick={() => scrollToSection("interests")}
                onTouchStart={() => scrollToSection("interests")}
                className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
              >
                <span className="mr-2">🎨</span> Interests
              </button>

              <button
                onClick={() => scrollToSection("globe")}
                onTouchStart={() => scrollToSection("globe")}
                className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
              >
                <span className="mr-2">🌍</span> Globe
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                onTouchStart={() => scrollToSection("contact")}
                className="w-full text-left px-4 py-2.5 rounded-md hover:scale-110 transition-transform flex items-center"
              >
                <span className="mr-2">✉️</span> Contact
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Draggable>
  );
}