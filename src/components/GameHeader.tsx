
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { STAGES } from '../utils/gameData';

interface GameHeaderProps {
    currentStage: number;
    mode: 'student' | 'teacher';
    onShowLeaderboard?: () => void;
    onShowReview?: () => void;
}

export default function GameHeader({ currentStage, mode, onShowLeaderboard, onShowReview }: GameHeaderProps) {
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
            className="w-full text-white px-4 py-2 md:px-6 md:py-3 flex flex-col gap-2"
            style={{
                background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
                borderBottom: '1px solid rgba(220,38,38,0.08)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.8)',
                position: 'relative',
                zIndex: 50
            }}
        >
            {/* Top Row: Branding and Actions */}
            <div className="flex justify-between items-center">
                {/* Left: Branding */}
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0"
                        style={{
                            background: 'rgba(220,38,38,0.08)',
                            border: '1px solid rgba(220,38,38,0.2)',
                        }}
                    >
                        ⚔️
                    </div>
                    <div>
                        <h1 className="text-sm md:text-lg font-black uppercase tracking-tight leading-tight font-orbitron">
                            <span style={{ color: '#DC2626' }}>ĐẤU TRƯỜNG</span>
                            <span className="text-[#888]"> BẢN LĨNH</span>
                        </h1>
                        <p className="text-[10px] md:text-xs text-[#555] uppercase tracking-widest font-bold">
                            Chặng {currentStage + 1}: {STAGES[currentStage]?.name || ''}
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {mode === 'student' ? (
                        <div
                            className="px-2.5 py-1 rounded-full"
                            style={{
                                background: 'rgba(220,38,38,0.1)',
                                border: '1px solid rgba(220,38,38,0.2)',
                            }}
                        >
                            <span className="text-[10px] md:text-xs font-bold text-[#F87171] uppercase tracking-wider">
                                Đang Thi Đấu
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {onShowLeaderboard && (
                                <button
                                    onClick={onShowLeaderboard}
                                    className="px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold bg-white text-black hover:bg-slate-200 transition-all uppercase tracking-widest shadow-lg active:scale-95"
                                >
                                    📊 Bảng Xếp Hạng
                                </button>
                            )}
                            <button
                                onClick={toggleFullscreen}
                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-slate-800 text-white border border-white/10"
                            >
                                {isFullscreen ? '↙️' : '↗️'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Row: Progress Bar (Smaller on mobile) */}
            <div className="relative py-1">
                <div 
                    ref={containerRef}
                    className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-1 mask-fade-edges"
                >
                    {STAGES.map((stage, idx) => {
                        const isActive = idx === currentStage;
                        const isPast = idx < currentStage;
                        return (
                            <div key={stage.id} className="flex items-center flex-shrink-0">
                                <div
                                    className={`
                                        w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center 
                                        text-base md:text-xl border-2 transition-all duration-500 relative
                                    `}
                                    style={{
                                        borderColor: isActive ? '#DC2626' : (isPast ? '#991B1B' : '#222'),
                                        background: isActive ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.3)',
                                        boxShadow: isActive ? '0 0 15px rgba(220,38,38,0.4)' : 'none',
                                        zIndex: isActive ? 10 : 1
                                    }}
                                >
                                    {stage.icon}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="header-active-glow"
                                            className="absolute inset-[-4px] rounded-full border border-[#DC2626]/30"
                                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </div>
                                {idx < STAGES.length - 1 && (
                                    <div 
                                        className="w-4 md:w-8 h-[2px] mx-1 md:mx-0"
                                        style={{ background: isPast ? '#991B1B' : '#222' }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Row: Design Credits (Smallest) */}
            <div className="flex justify-center border-t border-white/5 pt-1">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-[#444] text-center">
                    Nhóm thiết kế: <span className="text-[#666]">NGUYỄN NGỌC BẢO- VÕ THỊ THU HÀ- NGUYỄN THỊ THU HIỀN</span>
                </p>
            </div>
        </div>
    );
}
