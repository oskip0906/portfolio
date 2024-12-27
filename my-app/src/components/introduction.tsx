"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Intro {
    name: string;
    title: string;
    bio: string;
}

export default function Introduction() {
    const [intro, setIntro] = useState<Intro>({
        name: "",
        title: "",
        bio: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/intro.json");
                const data = await response.json();
                setIntro(data.intro);
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
            
            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="text-3xl sm:text-4xl font-semibold text-gray-100 mb-4"
            >
                Hello, I’m {intro.name}!
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="text-lg sm:text-xl text-gray-200 font-medium mb-3"
            >
                <span className="text-blue-400">{intro.title}</span>.
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                className="text-sm sm:text-base text-gray-300 leading-relaxed"
            >
                {intro.bio}
            </motion.p>

        </motion.section>
    );
}