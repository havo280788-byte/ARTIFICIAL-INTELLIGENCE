
import React from 'react';
import { motion } from 'framer-motion';

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

export default function GameWin({ playerName, score, totalQuestions, elapsedSeconds, mode, onLeaderboard, onReview }: GameWinProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const accuracy = Math.round((score / totalQuestions) * 100);

    const getBadge = () => {
        if (accuracy >= 90) return { label: 'AI Reading Pro', icon: '🏅', from: '#F59E0B', to: '#D97706' };
        if (accuracy >= 80) return { label: 'AI Analyst', icon: '📊', from: '#22D3EE', to: '#0284C7' };
        if (accuracy >= 60) return { label: 'AI Explorer', icon: '🔍', from: '#8B5CF6', to: '#6D28D9' };
        return { label: 'AI Beginner', icon: '🌱', from: '#10B981', to: '#059669' };
    };

    const badge = getBadge();

    const getAccuracyColor = () => {
        if (accuracy >= 80) return '#10B981';
        if (accuracy >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div className="min-h-screen animated-gradient-bg flex flex-col items-center justify-center p-4 md:p-6">
            <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="glass-card p-8 relative overflow-hidden">
                    {/* Top accent */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, #22D3EE, #6366F1, #8B5CF6, transparent)' }}
                    />
                    {/* Ambient glow */}
                    <div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-28 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
                    />

                    {/* Checkmark icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', bounce: 0.45, delay: 0.15 }}
                        className="flex justify-center mb-5"
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: 'rgba(16,185,129,0.12)',
                                border: '2px solid #10B981',
                                boxShadow: '0 0 24px rgba(16,185,129,0.35)',
                            }}
                        >
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5}>
                                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <div className="text-center mb-1">
                        <h1
                            className="text-2xl font-black uppercase tracking-tight"
                            style={{ color: '#F1F5F9' }}
                        >
                            Challenge Completed!
                        </h1>
                        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                            Well done, <span style={{ color: '#94A3B8' }}>{playerName}</span>!
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px my-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {/* Accuracy */}
                        <div
                            className="rounded-xl p-3.5 text-center"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#475569' }}>
                                Accuracy
                            </div>
                            <div className="text-2xl font-black" style={{ color: getAccuracyColor() }}>
                                {accuracy}%
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
                                {score}/{totalQuestions}
                            </div>
                        </div>

                        {/* Time */}
                        <div
                            className="rounded-xl p-3.5 text-center"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#475569' }}>
                                Time
                            </div>
                            <div className="text-2xl font-black font-mono" style={{ color: '#22D3EE' }}>
                                {formatTime(elapsedSeconds)}
                            </div>
                        </div>

                        {/* Badge */}
                        <div
                            className="rounded-xl p-3 text-center flex flex-col items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${badge.from}18, ${badge.to}10)`,
                                border: `1px solid ${badge.from}30`,
                            }}
                        >
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: badge.from }}>
                                Badge
                            </div>
                            <div className="text-xl mb-0.5">{badge.icon}</div>
                            <div className="text-[9px] font-bold leading-tight" style={{ color: badge.from }}>
                                {badge.label}
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons — student mode */}
                    {mode === 'student' && (
                        <div className="space-y-2.5">
                            {/* Primary: Leaderboard */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onLeaderboard}
                                className="w-full py-3.5 text-white font-black rounded-xl text-sm uppercase tracking-widest relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 55%, #8B5CF6 100%)',
                                    boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.6)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.45)'; }}
                            >
                                🏆 View Leaderboard
                            </motion.button>

                            {/* Secondary: Review */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onReview}
                                className="w-full py-3.5 font-bold rounded-xl text-sm uppercase tracking-widest transition-all duration-200"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#94A3B8',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)';
                                    e.currentTarget.style.color = '#22D3EE';
                                    e.currentTarget.style.boxShadow = '0 0 12px rgba(34,211,238,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                    e.currentTarget.style.color = '#94A3B8';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                🔍 Review Answers
                            </motion.button>
                        </div>
                    )}

                    {/* Teacher mode — minimal back prompt */}
                    {mode === 'teacher' && (
                        <button
                            onClick={onLeaderboard}
                            className="w-full py-3.5 font-bold rounded-xl text-sm uppercase tracking-widest"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#64748B',
                            }}
                        >
                            🏆 View Leaderboard
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
