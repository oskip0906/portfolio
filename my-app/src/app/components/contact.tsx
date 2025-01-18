"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Contact {
    type: string;
    image: string;
    value: string;
}

export default function Contact() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const ref = useRef(null);
    const inView = useInView(ref);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/contacts.json");
                const data = await response.json();
                setContacts(data.contacts);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            id="contact"
            className="w-full rounded-lg p-4 sm:p-10 grid grid-cols-3 sm:grid-cols-6 gap-y-10"
        >
            
            {contacts.map((contact, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.2, duration: 0.4, ease: "easeOut" }}
                    className="flex justify-center mx-auto"
                >
                    <motion.a
                        href={contact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="text-lg sm:text-xl text-gray-200 font-medium block w-16 h-16 overflow-hidden mx-auto p-2"
                    >
                        <motion.img
                            src={contact.image}
                            alt={contact.type}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.1 }}
                            className="w-full h-full object-cover"
                        />
                    </motion.a>
                </motion.div>
            ))}
        </motion.section>
    );
}