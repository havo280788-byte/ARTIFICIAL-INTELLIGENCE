
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
                className="max-w-md w-full glass-card p-8 md:p-10 relative overflow-hidden"
            >
                {/* Red accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, transparent, #DC2626, #EF4444, #DC2626, transparent)' }}
                />

                <div className="text-6xl mb-4">💀</div>
                <h1 className="text-2xl md:text-3xl font-black text-[#DC2626] mb-2 uppercase tracking-tight font-orbitron">
                    Thất Bại
                </h1>
                <p className="text-sm text-[#555] mb-6">
                    Đừng bỏ cuộc! Xem lại bài đọc và thử lại.
                </p>

                {/* Score summary */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-[10px] text-[#555] uppercase font-bold tracking-wider mb-1">Điểm</div>
                        <div className="text-2xl font-black text-[#F5F5F5]">{score}/{totalQuestions}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-[10px] text-[#555] uppercase font-bold tracking-wider mb-1">Độ Chính Xác</div>
                        <div className="text-2xl font-black text-[#DC2626]">{accuracy}%</div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRestart}
                        className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg text-sm uppercase tracking-widest transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #991B1B, #DC2626)',
                            boxShadow: '0 4px 20px rgba(220,38,38,0.4)',
                        }}
                    >
                        🔄 Thử Lại
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onReview}
                        className="w-full py-3.5 font-bold rounded-xl text-sm uppercase tracking-widest transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#888',
                        }}
                    >
                        📖 Xem Lại Đáp Án
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onLeaderboard}
                        className="w-full py-3.5 font-bold rounded-xl text-sm uppercase tracking-widest transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: '#555',
                        }}
                    >
                        🏆 Bảng Xếp Hạng
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
