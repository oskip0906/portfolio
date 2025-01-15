"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
    image: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const ref = useRef(null);
    const inView = useInView(ref);

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
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center rounded-lg w-full h-full mb-10"
            id="projects"
        >

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="mx-auto text-3xl sm:text-4xl font-bold text-blue-200 mb-10 mt-10"
            >
                Projects
            </motion.h1>

            <motion.hr
                initial={{ width: 0 }}
                animate={inView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="border-t-2 border-gray-700 w-full mb-10"
            />
            
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={100} 
                navigation={{ enabled: true }}
                pagination={{
                    clickable: true,
                    bulletClass: 'pagination-button'
                }}
                speed={500}
                className="w-full relative" 
            >

                {projects.map((project, index) => (
                    <SwiperSlide key={index}>
                        <motion.div
                            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                            className="mx-4 sm:mx-20 mb-10 text-center"
                        >
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                                className="text-xl sm:text-3xl font-semibold text-gray-100 mb-4"
                            >
                                {project.name}
                            </motion.h2>

                            <div className="flex flex-col justify-between items-center">
                                <div className="flex-1">
                                    <motion.p
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                                        className="text-lg sm:text-xl text-gray-200 font-medium mb-4"
                                    >
                                        {project.date}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                                        className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 w-5/6 mx-auto"
                                    >
                                        {project.description}
                                    </motion.p>
                                </div>
                                
                                <motion.a 
                                    href={project.link} 
                                    className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 mb-4 sm:mb-8 mt-4 rounded-lg mx-auto" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <motion.img 
                                        src={project.image} 
                                        alt={project.name} 
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        className="rounded-lg max-w-full max-h-48 object-cover mx-auto" 
                                        style={{ filter: "grayscale(30%)" }}
                                        whileHover={{ filter: "grayscale(0%)" }}
                                    />
                                </motion.a>
                            </div>

                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.section>
    );
}