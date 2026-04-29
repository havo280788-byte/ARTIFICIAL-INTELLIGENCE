
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, READING_PASSAGE } from '../utils/gameData';

interface QuizCardProps {
    question: Question;
    stageNum: number;
    onAnswer: (selected: string, isCorrect: boolean, retryUsed: boolean) => void;
    mode?: 'student' | 'teacher';
    onNextQuestion?: () => void;
}

export default function QuizCard({ question, stageNum, onAnswer, mode = 'student', onNextQuestion }: QuizCardProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [retryUsed, setRetryUsed] = useState(false);
    const [randomMsg, setRandomMsg] = useState("");

    // Teacher mode states
    const [highlightMode, setHighlightMode] = useState(false);
    const [highlights, setHighlights] = useState<Array<{ text: string; start: number; end: number }>>([]);
    const [revealed, setRevealed] = useState(false);

    const SUCCESS_MESSAGES = [
        "Mục tiêu đã giải mã! Tiến tới chặng tiếp theo.",
        "Lá chắn thép kích hoạt! Bạn đang dẫn đầu cuộc đua.",
        "Bản lĩnh Alpha được khẳng định! Tiếp tục bẻ khóa ma trận."
    ];

    useEffect(() => {
        setSelected(null);
        setFeedback(null);
        setRevealed(false);
        setRetryUsed(false);
    }, [question]);

    useEffect(() => {
        if (feedback === 'correct') {
            setRandomMsg(SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
        }
    }, [feedback]);

    if (!question) return null;

    const handleCheck = () => {
        if (!selected) return;
        if (selected === question.answer) {
            setFeedback('correct');
        } else {
            if (!retryUsed) {
                // First failure, allow retry
                setRetryUsed(true);
                // We keep feedback as null so they can change their mind and click check again?
                // Actually, let's show an "Incorrect, try again" message instead.
                setFeedback('incorrect');
            } else {
                // Second failure
                setFeedback('incorrect');
            }
        }
    };

    const handleReveal = () => setRevealed(true);
    const handleHighlightToggle = () => setHighlightMode(prev => !prev);
    const handleClearHighlights = () => setHighlights([]);

    const handleTextSelect = useCallback(() => {
        if (!highlightMode) return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
            setHighlights(prev => [...prev, { text: selectedText, start: 0, end: selectedText.length }]);
            selection.removeAllRanges();
        }
    }, [highlightMode]);

    const renderPassage = () => {
        if (highlights.length > 0) {
            const parts: Array<{ text: string; highlighted: boolean }> = [];
            let remaining = READING_PASSAGE;
            for (const h of highlights) {
                const idx = remaining.indexOf(h.text);
                if (idx !== -1) {
                    if (idx > 0) parts.push({ text: remaining.substring(0, idx), highlighted: false });
                    parts.push({ text: h.text, highlighted: true });
                    remaining = remaining.substring(idx + h.text.length);
                }
            }
            if (remaining.length > 0) parts.push({ text: remaining, highlighted: false });
            if (parts.length > 0) {
                return (
                    <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: '#F5F5F5', lineHeight: '1.85', fontSize: 'clamp(16px, 2.1vw, 24px)' }}>
                        {parts.map((part, i) => (
                            <span
                                key={i}
                                style={part.highlighted ? {
                                    background: '#FACC15',
                                    color: '#1A1200',
                                    borderRadius: '3px',
                                    padding: '0 2px',
                                    boxShadow: '0 0 8px rgba(250,204,21,0.5)',
                                } : {}}
                            >
                                {part.text}
                            </span>
                        ))}
                    </p>
                );
            }
        }
        return (
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#F5F5F5', lineHeight: '1.85', fontSize: 'clamp(14px, 1.9vw, 22px)' }}>
                {READING_PASSAGE}
            </p>
        );
    };

    /* ---- Answer Button Styling ---- */
    const getOptionStyle = (option: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '100%',
            padding: '14px 16px',
            borderRadius: '14px',
            border: '1.5px solid',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
            fontWeight: 500,
            fontSize: 'clamp(14px, 1.5vw, 19px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1.5px solid transparent',
        };

        // Teacher reveal
        if (mode === 'teacher' && revealed && option === question.answer) {
            return {
                ...base,
                background: 'rgba(16,185,129,0.1)',
                borderColor: '#10B981',
                color: '#6EE7B7',
                boxShadow: '0 0 16px rgba(16,185,129,0.2)',
            };
        }
        // Correct
        if (feedback === 'correct' && option === question.answer) {
            return {
                ...base,
                background: 'rgba(16,185,129,0.1)',
                borderColor: '#10B981',
                color: '#6EE7B7',
                boxShadow: '0 0 16px rgba(16,185,129,0.25), 0 0 32px rgba(16,185,129,0.08)',
            };
        }
        // Wrong selected
        if (feedback === 'incorrect' && selected === option) {
            return {
                ...base,
                background: 'rgba(220,38,38,0.08)',
                borderColor: '#DC2626',
                color: '#FCA5A5',
                boxShadow: '0 0 12px rgba(220,38,38,0.2)',
            };
        }
        // Selected (not yet checked)
        if (selected === option) {
            return {
                ...base,
                background: 'rgba(220,38,38,0.08)',
                borderColor: '#DC2626',
                color: '#F5F5F5',
                boxShadow: '0 0 12px rgba(220,38,38,0.2), 0 0 0 1px rgba(220,38,38,0.15)',
            };
        }
        // Normal
        return {
            ...base,
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.12)',
            color: '#B0B0B0',
            boxShadow: '0 0 8px rgba(255,255,255,0.03)',
        };
    };

    const getBadgeStyle = (option: string, idx: number): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: 800,
            flexShrink: 0,
            transition: 'all 0.2s',
        };
        if ((mode === 'teacher' && revealed && option === question.answer) ||
            (feedback === 'correct' && option === question.answer)) {
            return { ...base, background: 'rgba(16,185,129,0.3)', color: '#6EE7B7' };
        }
        if (feedback === 'incorrect' && selected === option) {
            return { ...base, background: 'rgba(220,38,38,0.25)', color: '#FCA5A5' };
        }
        if (selected === option) {
            return { ...base, background: 'rgba(220,38,38,0.3)', color: '#FCA5A5' };
        }
        return { ...base, background: 'rgba(255,255,255,0.04)', color: '#444' };
    };

    /* ---- Card surface style ---- */
    const cardStyle: React.CSSProperties = {
        background: 'rgba(10,10,10,0.95)',
        border: '1.5px solid rgba(220,38,38,0.35)',
        borderRadius: '22px',
        boxShadow: '0 0 20px rgba(220,38,38,0.15), 0 0 40px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle: React.CSSProperties = {
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    /* ---- Stage badge label ---- */
    const stageBadgeStyle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: 700,
        color: '#F87171',
        background: 'rgba(220,38,38,0.1)',
        border: '1px solid rgba(220,38,38,0.2)',
        borderRadius: '99px',
        padding: '3px 12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-3 md:gap-5 max-h-screen overflow-hidden">
            {/* Left Column: Reading Passage */}
            <div
                className="w-full md:w-[42%] flex flex-col shrink-0 relative overflow-hidden"
                style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '20px',
                    boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)',
                }}
            >
                {/* Header Accent */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DC2626]/20 to-transparent" />

                <div className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
                    <div className="mb-3 md:mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🛡️</span>
                            <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-[#DC2626]">
                                Lời Hiệu Triệu
                            </h3>
                        </div>
                    </div>

                    <div 
                        className="flex-1 overflow-y-auto pr-2 no-scrollbar"
                        onMouseUp={handleTextSelect}
                    >
                        {renderPassage()}
                    </div>
                </div>
            </div>

            {/* Right Column: Quiz Questions */}
            <div
                className="flex-1 flex flex-col relative overflow-hidden"
                style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(220,38,38,0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}
            >
                {/* Header Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#DC2626]/40 to-transparent" />

                <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1 flex flex-col overflow-hidden">
                    {/* Stage Badge */}
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#F87171]" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                            Vòng {stageNum}
                        </span>
                    </div>

                    {/* Question Text */}
                    <h2 className="text-base md:text-xl font-bold leading-snug flex-shrink-0" style={{ color: '#F5F5F5', fontSize: 'clamp(15px, 2.2vw, 24px)' }}>
                        {question.question}
                    </h2>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto pr-1 no-scrollbar">
                        {question.options?.map((option, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={(!feedback && mode === 'student') || mode === 'teacher' ? { x: 2 } : {}}
                                whileTap={(!feedback && mode === 'student') || mode === 'teacher' ? { scale: 0.99 } : {}}
                                onClick={() => {
                                    if (mode === 'teacher') {
                                        setSelected(selected === option ? null : option);
                                    } else {
                                        if (!feedback) setSelected(option);
                                    }
                                }}
                                style={getOptionStyle(option)}
                                disabled={mode === 'student' && !!feedback}
                            >
                                <span style={getBadgeStyle(option, idx)}>
                                    {mode === 'teacher' && revealed && option === question.answer
                                        ? '✓'
                                        : String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-[13px] md:text-[15px] font-medium leading-tight">{option}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Bottom Controls */}
                    <div className="pt-2 flex-shrink-0">
                        {mode === 'student' ? (
                            <div className="w-full">
                                {!feedback && (
                                    <motion.button
                                        key="check"
                                        initial={{ opacity: 0.7 }}
                                        animate={{ opacity: 1 }}
                                        onClick={handleCheck}
                                        disabled={!selected}
                                        className="w-full py-3 md:py-3.5 font-black uppercase tracking-widest rounded-xl transition-all duration-300"
                                        style={selected ? {
                                            background: 'linear-gradient(135deg, #991B1B 0%, #DC2626 55%, #EF4444 100%)',
                                            boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontSize: 'clamp(13px, 1.4vw, 17px)',
                                        } : {
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.04)',
                                            color: '#333',
                                            cursor: 'not-allowed',
                                            fontSize: 'clamp(13px, 1.4vw, 17px)',
                                        }}
                                    >
                                        {selected ? '⚡ Kiểm Tra' : 'Chọn Đáp Án'}
                                    </motion.button>
                                )}
                            </div>
                        ) : (
                            /* Teacher Mode Controls */
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={handleReveal}
                                    className="flex-1 py-3 font-black uppercase tracking-widest rounded-xl text-xs md:text-sm transition-all"
                                    style={{
                                        background: revealed ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #1E293B, #0F172A)',
                                        color: revealed ? '#666' : '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {revealed ? 'Đã Hiện Đáp Án' : 'Hiện Đáp Án'}
                                </button>
                                {onNextQuestion && (
                                    <button
                                        onClick={onNextQuestion}
                                        className="px-5 py-3 font-black uppercase tracking-widest rounded-xl text-xs md:text-sm bg-white text-black"
                                    >
                                        Tiếp →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Overlay (Centered) */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-50 p-4"
                            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="w-full max-w-[320px] p-6 rounded-2xl flex flex-col items-center text-center"
                                style={{
                                    background: 'rgba(20,20,20,0.95)',
                                    border: `1.5px solid ${feedback === 'correct' ? '#10B981' : '#EF4444'}`,
                                    boxShadow: `0 0 50px ${feedback === 'correct' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                }}
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{
                                        background: feedback === 'correct' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                        border: `2px solid ${feedback === 'correct' ? '#10B981' : '#EF4444'}`,
                                        boxShadow: `0 0 20px ${feedback === 'correct' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`
                                    }}
                                >
                                    {feedback === 'correct' ? (
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={3}>
                                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={3}>
                                            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                                            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>

                                <h4 
                                    className="text-2xl font-black uppercase tracking-tighter mb-2"
                                    style={{ color: feedback === 'correct' ? '#10B981' : '#EF4444' }}
                                >
                                    {feedback === 'correct' ? "CHÍNH XÁC" : (retryUsed && selected !== question.answer ? "SAI RỒI" : "HẾT CƠ HỘI")}
                                </h4>

                                <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: '#A0A0A0' }}>
                                    {feedback === 'correct' ? randomMsg : 
                                      (retryUsed && selected !== question.answer ? "Bạn còn 1 cơ hội cuối cùng để chọn lại!" : "Hãy quan sát kỹ bài đọc ở chặng kế tiếp nhé.")}
                                </p>

                                {feedback === 'incorrect' && retryUsed && selected !== question.answer ? (
                                    <button
                                        onClick={() => {
                                            setFeedback(null);
                                            setSelected(null);
                                        }}
                                        className="w-full py-3 font-bold rounded-xl text-white uppercase tracking-widest transition-all active:scale-95"
                                        style={{ background: 'linear-gradient(135deg, #DC2626, #991B1B)', boxShadow: '0 4px 15px rgba(220,38,38,0.3)' }}
                                    >
                                        🔄 Thử Lại
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onAnswer(selected!, feedback === 'correct', retryUsed)}
                                        className="w-full py-3 font-bold rounded-xl text-white uppercase tracking-widest transition-all active:scale-95"
                                        style={{ 
                                            background: feedback === 'correct' ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(255,255,255,0.05)',
                                            border: feedback === 'correct' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: feedback === 'correct' ? '0 4px 15px rgba(16,185,129,0.3)' : 'none'
                                        }}
                                    >
                                        Tiếp Tục →
                                    </button>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

