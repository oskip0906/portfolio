"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Interest {
    name: string;
    description: string;
}

export default function Interests() {
    const [interests, setInterests] = useState<Interest[]>([]);
    const ref = useRef(null);
    const inView = useInView(ref);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/interests.json");
                const data = await response.json();
                setInterests(data.interests);
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
            className="flex flex-col items-center sm:mt-0 px-6 sm:px-10" 
            id="interests"
        >

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="mx-auto text-3xl sm:text-4xl font-bold text-blue-200 mb-12 mt-10"
            >
                Interests
            </motion.h1>    

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {interests.map((interest: Interest, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                        className="bg-gray-700 rounded-lg p-6 shadow-lg shadow-blue-800/50"
                    >
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                            className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2"
                        >
                            {interest.name}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                            className="text-sm sm:text-base text-gray-300 leading-relaxed"
                        >
                            {interest.description}
                        </motion.p>
                    </motion.div>
                ))}

            </div>

        </motion.section>
    );
}