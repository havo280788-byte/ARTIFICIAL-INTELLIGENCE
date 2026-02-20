
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface GameWinProps {
    playerName: string;
    elapsedSeconds: number;
    onRestart: () => void;
    onLeaderboard: () => void;
}

export default function GameWin({ playerName, elapsedSeconds, onRestart, onLeaderboard }: GameWinProps) {
    useEffect(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-700 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-2xl w-full bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border-4 border-white/20 shadow-2xl relative"
            >
                <div className="text-4xl mb-6">蕜 蕪 蕫 蕬 蕭 蕮 蕯 蕰</div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                    className="text-9xl mb-8"
                >
                    🏆
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tight">
                    CONGRATULATIONS!
                </h1>
                <div className="text-3xl md:text-4xl font-bold bg-white/20 px-8 py-3 rounded-full inline-block mb-10 border border-white/30">
                    {playerName}
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                        <div className="text-green-200 text-sm uppercase font-black mb-1">Completion Time</div>
                        <div className="text-4xl font-black">{formatTime(elapsedSeconds)}</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                        <div className="text-yellow-200 text-sm uppercase font-black mb-1">Trophy Earned</div>
                        <div className="text-2xl font-black flex items-center justify-center gap-2">
                            <span className="text-3xl">袨</span> BRAVE TROPHY
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLeaderboard}
                        className="flex-1 py-5 bg-white text-emerald-700 font-black text-xl rounded-2xl shadow-xl uppercase tracking-widest hover:bg-slate-100 transition-colors"
                    >
                        LEADERBOARD
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRestart}
                        className="flex-1 py-5 bg-emerald-400 text-white font-black text-xl rounded-2xl shadow-xl uppercase tracking-widest border-4 border-emerald-300 hover:bg-emerald-500 transition-colors"
                    >
                        PLAY AGAIN
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
