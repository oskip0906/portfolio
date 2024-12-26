"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Experience {
    title: string;
    company: string;
    date: string;
    description: string;
}

export default function Experiences() {
    const [experiences, setExperiences] = useState<Experience[]>([]);

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center sm:items-start text-center sm:text-left bg-gray-800 shadow-lg rounded-lg p-6 sm:p-10 w-full h-full"
        >
            {experiences.map((experience, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                    className="mb-6"
                >
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2"
                    >
                        {experience.company}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                        className="text-lg sm:text-xl text-gray-200 font-medium mb-1"
                    >
                        {experience.title}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                        className="text-sm sm:text-base text-gray-300 leading-relaxed"
                    >
                        {experience.description}
                    </motion.p>
                </motion.div>
            ))}
        </motion.section>
    );
}