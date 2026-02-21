
import React from 'react';
import { motion } from 'framer-motion';

interface GameOverProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
    onLeaderboard: () => void;
    onReview: () => void;
}

export default function GameOver({ score, totalQuestions, onRestart, onLeaderboard, onReview }: GameOverProps) {
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen animated-gradient-bg flex flex-col items-center justify-center p-4 md:p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
            >
                {/* Red accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] to-[#F59E0B]" />

                <div className="text-6xl mb-4">😔</div>
                <h1 className="text-2xl md:text-3xl font-black text-[#DC2626] mb-2 uppercase tracking-tight">
                    Challenge Failed
                </h1>
                <p className="text-sm text-[#64748B] mb-6">
                    Don't give up! Review the passage and try again.
                </p>

                {/* Score summary */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                        <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Score</div>
                        <div className="text-2xl font-black text-[#0F172A]">{score}/{totalQuestions}</div>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                        <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Accuracy</div>
                        <div className="text-2xl font-black text-[#0F172A]">{accuracy}%</div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRestart}
                        className="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg text-sm uppercase tracking-widest hover:bg-[#1E293B] transition-colors"
                    >
                        🔄 Try Again
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
                        onClick={onLeaderboard}
                        className="w-full py-3.5 bg-[#F8FAFC] text-[#334155] font-bold rounded-xl text-sm uppercase tracking-widest border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
                    >
                        🏆 View Leaderboard
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
