"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Experience {
  title: string;
  company: string;
  date: string;
  description: string;
}

interface ExperienceCardProps {
  experience: Experience;
}

const FlippableExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => setIsFlipped((prev) => !prev);

    return (
        <div
            className="relative w-full h-[30vh] cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={handleFlip}
        >
            <motion.div
              className="absolute inset-0 rounded-lg shadow-md p-4 border border-blue-300 border-opacity-50"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                boxShadow: "0 5px 10px rgba(0, 187, 255, 0.5)"
              }}
              whileHover={{ backgroundColor: "rgba(71, 23, 205, 0.1)" }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              initial={{ rotateY: 180 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2">
                  {experience.company}
              </h2>

              <p className="text-lg sm:text-xl text-gray-200 font-medium mb-2">
                  {experience.title}
              </p>

              <p className="italic text-sm sm:text-base text-gray-200 font-bold mb-2">
                  {experience.date}
              </p>

              <span className="text-xs text-blue-200">Click to flip!</span>
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-lg shadow-md p-4 border border-blue-300 border-opacity-50 flex items-center justify-center overflow-hidden"
              style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
              }}
              whileHover={{ backgroundColor: "rgba(71, 23, 205, 0.1)" }}
              animate={{ rotateY: isFlipped ? 0 : -180 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >

              <p className="text-md sm:text-lg text-gray-300 leading-relaxed mt-2 overflow-y-auto max-h-full">
                  {experience.description}
              </p>
          
            </motion.div>
        </div>
    );
};

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/experiences.json");
        const data = await response.json();
        setExperiences(data.experiences);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center px-4 w-full"
      id="experiences"
    >

      <div className="w-full mx-auto">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-center mx-auto text-3xl sm:text-4xl font-bold text-blue-200 my-10"
        >
          Experiences
        </motion.h1>

        <div className="w-full mx-auto">
          <motion.hr
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="border-t-2 border-gray-700 w-full mb-10"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience, index) => (
              <FlippableExperienceCard key={index} experience={experience} />
            ))}
          </div>
        </div>

      </div>

    </motion.section>
  );
}