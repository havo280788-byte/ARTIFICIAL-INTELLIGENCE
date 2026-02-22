
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { STAGES } from '../utils/gameData';

interface GameHeaderProps {
    currentStage: number;
    timeLeft: number; // in seconds
    mode: 'student' | 'teacher';
    onShowLeaderboard?: () => void;
    onShowReview?: () => void;
}

export default function GameHeader({ currentStage, timeLeft, mode, onShowLeaderboard, onShowReview }: GameHeaderProps) {
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
        <div className="w-full bg-[#0F172A] text-white px-4 py-3 md:px-6 md:py-4 shadow-2xl flex flex-col gap-3">
            {/* Top Row: Title + Timer/Teacher badge */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl">🤖</span>
                    <div>
                        <h1 className="text-sm md:text-lg font-black uppercase tracking-tight text-white leading-tight">
                            <span className="text-[#22D3EE]">AI</span> – English 12
                        </h1>
                        <p className="text-[10px] md:text-xs text-[#94A3B8] uppercase tracking-widest hidden md:block">
                            Reading Challenge
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {mode === 'student' ? (
                        /* Student: Timer */
                        <div className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-full border border-[#334155]">
                            <span className="text-base text-[#22D3EE]">⏱</span>
                            <span className="font-mono text-lg md:text-xl font-bold tracking-wider">{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        /* Teacher: Mode badge + controls */
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-[#064E3B] px-3 py-1.5 rounded-full border border-[#10B981]/30">
                                <span className="text-sm">🟢</span>
                                <span className="text-xs font-bold text-[#6EE7B7] uppercase tracking-wider whitespace-nowrap">Teacher Mode</span>
                            </div>
                            {/* Teacher-only quick actions */}
                            <div className="hidden md:flex items-center gap-1.5">
                                {onShowReview && (
                                    <button
                                        onClick={onShowReview}
                                        className="px-2.5 py-1 bg-[#1E293B] text-[#94A3B8] text-[10px] font-bold rounded-lg border border-[#334155] hover:bg-[#334155] hover:text-white transition-colors uppercase tracking-wider"
                                    >
                                        Review
                                    </button>
                                )}
                                {onShowLeaderboard && (
                                    <button
                                        onClick={onShowLeaderboard}
                                        className="px-2.5 py-1 bg-[#1E293B] text-[#94A3B8] text-[10px] font-bold rounded-lg border border-[#334155] hover:bg-[#334155] hover:text-white transition-colors uppercase tracking-wider"
                                    >
                                        Leaderboard
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#1E293B] -translate-y-1/2" />
                <motion.div
                    className="absolute top-1/2 left-0 h-0.5 bg-[#22D3EE] -translate-y-1/2"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />

                {/* Icons Scroll Area */}
                <div
                    ref={containerRef}
                    className="relative flex justify-between items-center w-full overflow-x-auto no-scrollbar py-2 px-1"
                >
                    {STAGES.map((stage, index) => {
                        const isActive = index === currentStage;
                        const isCompleted = index < currentStage;

                        return (
                            <motion.div
                                key={stage.id}
                                className="flex-shrink-0 flex items-center justify-center relative z-10 mx-1 md:mx-0"
                                animate={{ scale: isActive ? 1.15 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div
                                    className={`
                                        w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm md:text-lg transition-all duration-300 border-2
                                        ${isActive ? 'bg-[#22D3EE] border-white icon-glow z-20' :
                                            isCompleted ? 'bg-[#334155] border-[#22D3EE]/40 opacity-90' :
                                                'bg-[#1E293B] border-[#334155] opacity-50'}
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
