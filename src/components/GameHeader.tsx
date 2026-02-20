
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { STAGES } from '../utils/gameData';

interface GameHeaderProps {
    currentStage: number;
    timeLeft: number; // in seconds
}

export default function GameHeader({ currentStage, timeLeft }: GameHeaderProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current stage on mobile
    useEffect(() => {
        if (containerRef.current) {
            const activeElement = containerRef.current.children[currentStage] as HTMLElement;
            if (activeElement) {
                const containerWidth = containerRef.current.offsetWidth;
                const elementOffset = activeElement.offsetLeft;
                const elementWidth = activeElement.offsetWidth;
                containerRef.current.scrollTo({
                    left: elementOffset - containerWidth / 2 + elementWidth / 2,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentStage]);

    return (
        <div className="w-full bg-slate-900 text-white p-4 md:p-6 shadow-2xl flex flex-col gap-6">
            {/* Top Titles */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🤖</span>
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-indigo-400">
                        Artificial Intelligence
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-500/30">
                        <span className="text-xl">🚀</span>
                        <span className="font-bold text-sm md:text-base whitespace-nowrap uppercase tracking-widest">
                            AI Discovery Challenge
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 min-w-[100px] justify-center">
                        <span className="text-xl text-indigo-400">⏱</span>
                        <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full max-w-4xl mx-auto px-4 overflow-hidden">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2" />
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-cyan-400 -translate-y-1/2 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />

                {/* Icons Scroll Area */}
                <div
                    ref={containerRef}
                    className="relative flex justify-between items-center w-full overflow-x-auto no-scrollbar py-4 px-2"
                >
                    {STAGES.map((stage, index) => {
                        const isActive = index === currentStage;
                        const isCompleted = index < currentStage;
                        const isUpcoming = index > currentStage;

                        return (
                            <motion.div
                                key={stage.id}
                                className="flex-shrink-0 flex items-center justify-center relative z-10 mx-2 md:mx-0"
                                animate={{ scale: isActive ? 1.1 : 1 }}
                            >
                                <div
                                    className={`
                    w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-xl transition-all duration-300 border-2
                    ${isActive ? 'bg-cyan-400 border-white shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20' :
                                            isCompleted ? 'bg-purple-300 border-purple-200 opacity-90' :
                                                'bg-slate-700 border-slate-600 opacity-60'}
                  `}
                                >
                                    {stage.icon}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
