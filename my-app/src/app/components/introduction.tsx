"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MusicPlayer from "./music";
import { Typewriter } from 'react-simple-typewriter'

interface Intro {
    name: string;
    title: string;
    bio: string;
    image: string | undefined;
}

export default function Introduction() {
    const [intro, setIntro] = useState<Intro>({ name: "", title: "", bio: "", image: undefined });

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
        <div id="introduction" className="w-full h-full pt-4">
            <motion.section
                initial={{ opacity: 0, y: 50, borderColor: 'rgba(0, 64, 255, 0.5)' }}
                animate={{ opacity: 1, y: 0, borderColor: ['rgba(0, 64, 255, 0.5)', 'rgba(255, 0, 0, 0.5)', 'rgba(0, 64, 255, 0.5)'] }}
                transition={{ duration: 0.8, ease: "easeOut", borderColor: { duration: 2, repeat: Infinity } }}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 w-full h-full border-dashed border-2"
            >   
                <div className="flex flex-col sm:w-2/3 sm:pl-8">
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
                        className="text-md sm:text-lg text-gray-300 leading-relaxed mt-2"
                        style={{ minHeight: '5rem' }}
                    >
                    <Typewriter
                        words={intro.bio.split(';')}
                        loop={false}
                        cursor
                        cursorStyle='|'
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                    </motion.p>

                    <div className="z-[999] flex opacity-80 justify-center sm:justify-start">
                        <MusicPlayer />
                    </div>
                </div>

                <div className="w-full sm:w-1/3 flex justify-center items-center sm:pr-8">
                    <motion.a
                        href="https://www.utoronto.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                        animate={{ rotate: [360, 0] }}
                        transition={{ duration: 100, repeat: Infinity }}
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mt-6 sm:mt-0 sm:ml-6 sm:ml-auto"
                    >
                        <motion.img
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                            src={intro.image}
                        />
                    </motion.a>
                </div>

            </motion.section>
        </div>
    );
}