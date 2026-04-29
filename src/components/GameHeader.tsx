
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { STAGES } from '../utils/gameData';

interface GameHeaderProps {
    currentStage: number;
    timeLeft: number;
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

    const isWarning = timeLeft <= 60;
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen().catch(() => { });
        }
    }, []);

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);
    const containerRef = useRef<HTMLDivElement>(null);

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
        <div
            className="w-full text-white px-4 py-3 md:px-6 md:py-4 flex flex-col gap-3"
            style={{
                background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
                borderBottom: '1px solid rgba(220,38,38,0.08)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.8)',
            }}
        >
            {/* Top Row */}
            <div className="flex justify-between items-center">
                {/* Left: Branding */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{
                            background: 'rgba(220,38,38,0.08)',
                            border: '1px solid rgba(220,38,38,0.2)',
                            boxShadow: '0 0 12px rgba(220,38,38,0.2)',
                        }}
                    >
                        ⚔️
                    </div>
                    <div>
                        <h1 className="text-sm md:text-xl font-black uppercase tracking-tight leading-tight font-orbitron">
                            <span style={{ color: '#DC2626' }}>ĐẤU TRƯỜNG</span>
                            <span className="text-[#888]"> BẢN LĨNH</span>
                        </h1>
                        <p className="text-[10px] md:text-xs text-[#333] uppercase tracking-widest hidden md:block font-semibold">
                            Thử Thách Từ Vựng
                        </p>
                    </div>
                </div>

                {/* Right: Timer or Teacher badge */}
                <div className="flex items-center gap-2">
                    {mode === 'student' ? (
                        <motion.div
                            animate={isWarning ? { scale: [1, 1.04, 1] } : {}}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{
                                background: isWarning ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.04)',
                                border: isWarning ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                boxShadow: isWarning ? '0 0 12px rgba(220,38,38,0.2)' : 'none',
                            }}
                        >
                            <span className="text-sm" style={{ color: isWarning ? '#F87171' : '#DC2626' }}>⏱</span>
                            <span
                                className="font-mono text-lg md:text-2xl font-bold tracking-wider"
                                style={{ color: isWarning ? '#F87171' : '#F5F5F5' }}
                            >
                                {formatTime(timeLeft)}
                            </span>
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <div
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full teacher-badge"
                                style={{
                                    background: 'rgba(16,185,129,0.08)',
                                    border: '1px solid rgba(16,185,129,0.25)',
                                }}
                            >
                                <span className="text-sm md:text-base">🟢</span>
                                <span className="text-xs md:text-sm font-bold text-[#6EE7B7] uppercase tracking-wider whitespace-nowrap">
                                    Chế Độ Giáo Viên
                                </span>
                            </div>
                            {/* Teacher quick actions */}
                            <div className="hidden md:flex items-center gap-1.5">
                                {onShowReview && (
                                    <button
                                        onClick={onShowReview}
                                        className="px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            color: '#555',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; e.currentTarget.style.color = '#F87171'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#555'; }}
                                    >
                                        Xem Lại
                                    </button>
                                )}
                                {onShowLeaderboard && (
                                    <button
                                        onClick={onShowLeaderboard}
                                        className="px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            color: '#555',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; e.currentTarget.style.color = '#F87171'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#555'; }}
                                    >
                                        Bảng Xếp Hạng
                                    </button>
                                )}
                                {/* Fullscreen button – desktop Teacher View only */}
                                <button
                                    onClick={toggleFullscreen}
                                    title={isFullscreen ? 'Thoát Toàn Màn Hình' : 'Toàn Màn Hình'}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5"
                                    style={{
                                        background: isFullscreen ? 'rgba(220,38,38,0.10)' : 'rgba(255,255,255,0.03)',
                                        border: isFullscreen ? '1px solid rgba(220,38,38,0.35)' : '1px solid rgba(255,255,255,0.06)',
                                        color: isFullscreen ? '#DC2626' : '#555',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; e.currentTarget.style.color = '#DC2626'; }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = isFullscreen ? 'rgba(220,38,38,0.10)' : 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = isFullscreen ? 'rgba(220,38,38,0.35)' : 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.color = isFullscreen ? '#DC2626' : '#555';
                                    }}
                                >
                                    {isFullscreen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                                            <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                                            <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                                        </svg>
                                    )}
                                    {isFullscreen ? 'Thu Nhỏ' : 'Phóng To'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
                {/* Background line */}
                <div
                    className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                {/* Progress line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-px -translate-y-1/2"
                    style={{
                        background: 'linear-gradient(90deg, #991B1B, #DC2626, #EF4444)',
                        boxShadow: '0 0 8px rgba(220,38,38,0.5)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />

                {/* Stage Icons */}
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
                                animate={{ scale: isActive ? 1.2 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {isActive && (
                                    <span
                                        className="absolute inset-0 rounded-full border border-[#DC2626]/50"
                                        style={{
                                            animation: 'pulseRing 2s ease-out infinite',
                                            transform: 'scale(1.5)',
                                        }}
                                    />
                                )}
                                <div
                                    className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm md:text-lg border-2 transition-all duration-300 relative"
                                    style={{
                                        ...(isActive ? {
                                            background: 'rgba(220,38,38,0.2)',
                                            borderColor: '#DC2626',
                                            boxShadow: '0 0 12px rgba(220,38,38,0.8), 0 0 24px rgba(220,38,38,0.4)',
                                        } : isCompleted ? {
                                            background: 'rgba(220,38,38,0.1)',
                                            borderColor: 'rgba(220,38,38,0.3)',
                                            opacity: 0.85,
                                        } : {
                                            background: 'rgba(255,255,255,0.02)',
                                            borderColor: 'rgba(255,255,255,0.05)',
                                            opacity: 0.4,
                                        })
                                    }}
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
