"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Contact {
    type: string;
    image: string;
    value: string;
}


export default function Contact() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    
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
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full mt-10 rounded-lg p-6 sm:p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-10"
        >
            
            {contacts.map((contact, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                    className="flex justify-center mx-auto"
                >
                    <motion.a
                        href={contact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                        className="text-lg sm:text-xl text-gray-200 font-medium block w-12 h-12 rounded-full overflow-hidden mx-auto"
                    >
                        <img src={contact.image} alt={contact.type} />
                    </motion.a>
                </motion.div>
            ))}
        </motion.div>
    );
}