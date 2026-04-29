
import React from 'react';
import { motion } from 'framer-motion';

export default function WaitingScreen() {
    return (
        <div className="min-h-screen bg-[#000] flex flex-col items-center justify-center p-6 text-center select-none">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Animated hourglass */}
                <motion.div
                    animate={{ rotate: [0, 180, 180, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-7xl mb-8 inline-block"
                >
                    ⏳
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight font-orbitron">
                    Chờ giáo viên!!!!
                </h1>

                <p className="text-[#888] text-base md:text-lg mb-10 leading-relaxed">
                    Bài làm đã được nộp.<br />
                    Vui lòng đợi giáo viên xem kết quả.
                </p>

                {/* Pulsing dots indicator */}
                <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-[#DC2626]"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
