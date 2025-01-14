"use client";
import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";

export default function NavBar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null as any);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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
          className="w-16 h-16 rounded-full bg-blue-800 text-white text-2xl flex items-center justify-center shadow-lg focus:outline-none transition-transform hover:scale-110"
          aria-label="Toggle Menu"
          style={{ boxShadow: "0 0 20px rgba(65, 65, 194, 0.5)" }}
        >
          ☰
        </button>

        {menuOpen && (
          <div 
            className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-900 text-white shadow-lg flex flex-col items-center justify-center space-y-6 p-4"
            style={{ boxShadow: "0 0 20px rgba(108, 108, 196, 0.5)" }}
          >
            <button
              onClick={() => scrollToSection("introduction")}
              onTouchStart={() => scrollToSection("introduction")}
              className="hover:text-gray-400 transition"
            >
              Introduction
            </button>
            <button
              onClick={() => scrollToSection("experiences")}
              onTouchStart={() => scrollToSection("experiences")}
              className="hover:text-gray-400 transition"
            >
              Experiences
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              onTouchStart={() => scrollToSection("projects")}
              className="hover:text-gray-400 transition"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("interests")}
              onTouchStart={() => scrollToSection("interests")}
              className="hover:text-gray-400 transition"
            >
              Interests
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              onTouchStart={() => scrollToSection("contact")}
              className="hover:text-gray-400 transition"
            >
              Contact
            </button>
          </div>
        )}
      </motion.div>

    </Draggable>
  );
}