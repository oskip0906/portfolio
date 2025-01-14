"use client"
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const AudioPlayer: React.FC = () => {
    
    const [isShowing, setIsShowing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
      
    function controlSong() {
        const audio = document.getElementById('audio') as HTMLAudioElement | null;
        const progressBar = document.getElementById('progressBar') as HTMLInputElement | null;
        if (audio && progressBar) {
            audio.currentTime = parseFloat(progressBar.value);
        }
    }
    
    function updateProgress() {
        const audio = document.getElementById('audio') as HTMLAudioElement | null;
        const progressBar = document.getElementById('progressBar') as HTMLInputElement | null;
        if (audio && progressBar && !isNaN(audio.duration)) {
            progressBar.max = audio.duration.toString();
            progressBar.value = audio.currentTime.toString();
        }
    }

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            className="text-center mt-4 bg-gray-900 p-2 sm:p-4 rounded-lg"
            style={{ boxShadow: '0 0 20px rgba(0, 64, 255, 0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.button
                onClick={() => setIsShowing(!isShowing)}
                className="btn btn-secondary font-bold"
                whileHover={{ scale: 1.05 }}
            >
                {isShowing ? 'Hide Music Player' : 'Show Music Player'}
            </motion.button>

            <audio id="audio" src="music.mp3" ref={audioRef} onTimeUpdate={updateProgress} className="hidden"></audio>

            {isShowing && (
                <motion.div
                    className="flex items-center justify-between mt-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button onClick={togglePlayPause} className="btn btn-primary rounded mr-5 py-2 px-4 text-sm font-semibold" style={{ boxShadow: '0 0 10px rgba(28, 69, 181, 0.9)' }}>Play/Pause</button>
                    <input className="w-24 sm:w-64 md:w-96" type="range" id="progressBar" defaultValue="0" max="100" onInput={controlSong} />
                </motion.div>
            )}
        </motion.div>
    );
};

export default AudioPlayer;