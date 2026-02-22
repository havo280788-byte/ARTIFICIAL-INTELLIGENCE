
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface GameWinProps {
    playerName: string;
    score: number;
    totalQuestions: number;
    elapsedSeconds: number;
    mode: 'student' | 'teacher';
    onRestart: () => void;
    onLeaderboard: () => void;
    onReview: () => void;
    onWaiting: () => void;
}

export default function GameWin({ playerName, score, totalQuestions, elapsedSeconds, mode, onRestart, onLeaderboard, onReview, onWaiting }: GameWinProps) {
    useEffect(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#22D3EE', '#22C55E', '#F59E0B']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#22D3EE', '#22C55E', '#F59E0B']
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
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const accuracy = Math.round((score / totalQuestions) * 100);

    const getBadge = () => {
        if (accuracy >= 90) return { label: 'AI Reading Pro', icon: '🏅', color: 'from-yellow-400 to-amber-500' };
        if (accuracy >= 80) return { label: 'AI Analyst', icon: '📊', color: 'from-cyan-400 to-blue-500' };
        if (accuracy >= 60) return { label: 'AI Explorer', icon: '🔍', color: 'from-violet-400 to-purple-500' };
        return { label: 'AI Beginner', icon: '🌱', color: 'from-green-400 to-emerald-500' };
    };

    const badge = getBadge();

    return (
        <div className="min-h-screen animated-gradient-bg flex flex-col items-center justify-center p-4 md:p-6 text-center text-white overflow-hidden">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
            >
                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22D3EE] to-[#22C55E]" />

                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                    className="text-6xl mb-4"
                >
                    ✅
                </motion.div>

                <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-1 uppercase tracking-tight">
                    Challenge Completed!
                </h1>
                <p className="text-sm text-[#64748B] mb-6">Great job, {playerName}!</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                        <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Accuracy</div>
                        <div className="text-xl font-black text-[#0F172A]">{accuracy}%</div>
                        <div className="text-xs text-[#64748B]">{score}/{totalQuestions}</div>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                        <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Time</div>
                        <div className="text-xl font-black text-[#0F172A]">{formatTime(elapsedSeconds)}</div>
                    </div>
                    <div className={`bg-gradient-to-br ${badge.color} rounded-xl p-3 text-white`}>
                        <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">Badge</div>
                        <div className="text-xl mb-0.5">{badge.icon}</div>
                        <div className="text-[10px] font-bold leading-tight">{badge.label}</div>
                    </div>
                </div>

                {/* Buttons — Student vs Teacher */}
                <div className="space-y-3">
                    {mode === 'student' ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onWaiting}
                            className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg text-sm uppercase tracking-widest hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="inline-block animate-pulse">⏳</span>
                            Waiting for Teacher Review…
                        </motion.button>
                    ) : (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onLeaderboard}
                                className="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg text-sm uppercase tracking-widest hover:bg-[#1E293B] transition-colors"
                            >
                                🏆 View Leaderboard
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onReview}
                                className="w-full py-3.5 bg-[#22D3EE] text-white font-bold rounded-xl shadow-lg text-sm uppercase tracking-widest hover:bg-[#06B6D4] transition-colors"
                            >
                                📖 Review Answers
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onRestart}
                                className="w-full py-3.5 bg-[#F8FAFC] text-[#334155] font-bold rounded-xl text-sm uppercase tracking-widest border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
                            >
                                Play Again
                            </motion.button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
