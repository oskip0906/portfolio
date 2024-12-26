"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Project {
    name: string;
    date: string;
    description: string;
    link: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/projects.json");
                const data = await response.json();
                setProjects(data.projects);
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
            className="flex flex-col items-center text-center bg-gray-800 shadow-lg rounded-lg p-6 sm:p-10 w-full h-full"
        >
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                className="w-full"
            >
                {projects.map((project, index) => (
                    <SwiperSlide key={index} className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                            className="mb-6 p-6 rounded-lg mx-auto"
                            style={{ margin: '0 40px 40px' }} 
                        >
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                                className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2"
                            >
                                {project.name}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                                className="text-lg sm:text-xl text-gray-200 font-medium mb-1"
                            >
                                {project.date}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                                className="text-sm sm:text-base text-gray-300 leading-relaxed"
                            >
                                {project.description}
                            </motion.p>

                            <motion.a
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm sm:text-base text-blue-400 hover:underline"
                            >
                                {project.link}
                            </motion.a>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.section>
    );
}