
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, READING_PASSAGE } from '../utils/gameData';

interface QuizCardProps {
    question: Question;
    stageNum: number;
    onAnswer: (selected: string, isCorrect: boolean) => void;
    mode?: 'student' | 'teacher';
    onNextQuestion?: () => void;
}

export default function QuizCard({ question, stageNum, onAnswer, mode = 'student', onNextQuestion }: QuizCardProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    // Teacher mode states
    const [highlightMode, setHighlightMode] = useState(false);
    const [highlights, setHighlights] = useState<Array<{ text: string; start: number; end: number }>>([]);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        setSelected(null);
        setFeedback(null);
        setRevealed(false);
    }, [question]);

    if (!question) return null;

    const handleCheck = () => {
        if (!selected) return;
        setFeedback(selected === question.answer ? 'correct' : 'incorrect');
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
            gap: '10px',
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
            borderColor: 'rgba(255,255,255,0.06)',
            color: '#B0B0B0',
        };
    };

    const getBadgeStyle = (option: string, idx: number): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
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
        background: 'rgba(10,10,10,0.9)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '22px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
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
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">

                {/* LEFT: Reading Passage */}
                <div className="w-full md:w-[40%] flex-shrink-0">
                    <div style={cardStyle}>
                        {/* Reading Header */}
                        <div style={headerStyle}>
                            {/* Top accent strip */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, height: '2px',
                                    background: 'linear-gradient(90deg, #991B1B, #DC2626, #EF4444)',
                                }}
                            />
                            <div className="flex items-center gap-2 relative">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#DC2626' }}>
                                    Bài Đọc
                                </span>
                            </div>
                            {/* Highlight controls — available for all modes */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={handleHighlightToggle}
                                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all duration-200"
                                    style={highlightMode ? {
                                        background: 'rgba(250,204,21,0.12)',
                                        border: '1px solid rgba(250,204,21,0.4)',
                                        color: '#FACC15',
                                        boxShadow: '0 0 8px rgba(250,204,21,0.15)',
                                    } : {
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        color: '#444',
                                    }}
                                    title={highlightMode ? 'Nhấn để tắt chế độ đánh dấu' : 'Nhấn rồi chọn text để đánh dấu'}
                                >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9.5 21H5l1.5-4.5L18 5l3 3L9.5 21zm0 0" />
                                    </svg>
                                    {highlightMode ? 'Bật' : 'Đánh Dấu'}
                                </button>
                                {highlights.length > 0 && (
                                    <button
                                        onClick={handleClearHighlights}
                                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all duration-200"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            color: '#444',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.25)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                        title="Xóa tất cả đánh dấu"
                                    >
                                        Xóa
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Reading Content */}
                        <div
                            className="p-5 overflow-y-auto reading-scroll flex-1"
                            style={{ maxHeight: '60vh', cursor: highlightMode ? 'text' : 'auto', position: 'relative', userSelect: highlightMode ? 'text' : 'auto' }}
                            onMouseUp={handleTextSelect}
                        >
                            <h3
                                className="text-sm font-bold mb-3 uppercase tracking-wide"
                                style={{ color: '#DC2626' }}
                            >
                                AI All Around Us
                            </h3>
                            {renderPassage()}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Question + Answers */}
                <div className="w-full md:w-[60%]">
                    <div style={cardStyle}>
                        {/* Question Header */}
                        <div style={headerStyle}>
                            <div style={stageBadgeStyle}>Vòng {stageNum}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium" style={{ color: '#333' }}>
                                    {question.type === 'mcq' ? 'Trắc Nghiệm' : "Đúng / Sai / Không Đề Cập"}
                                </span>

                            </div>
                        </div>

                        <div className="p-5 md:p-6 space-y-4 flex-1 flex flex-col">
                            {/* Question Text */}
                            <h2 className="text-lg font-bold leading-snug" style={{ color: '#F5F5F5', fontSize: 'clamp(18px, 2.3vw, 28px)' }}>
                                {question.question}
                            </h2>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-2 flex-1">
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
                                        onMouseEnter={(e) => {
                                            if (!feedback && mode === 'student' && selected !== option) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.color = '#B0B0B0';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!feedback && mode === 'student' && selected !== option) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                                e.currentTarget.style.color = '#888';
                                            }
                                        }}
                                    >
                                        <span style={getBadgeStyle(option, idx)}>
                                            {mode === 'teacher' && revealed && option === question.answer
                                                ? '✓'
                                                : String.fromCharCode(65 + idx)}
                                        </span>
                                        <span style={{ fontSize: 'inherit' }}>{option}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Bottom Controls */}
                            <div className="pt-2 flex flex-col items-center gap-3">
                                {mode === 'student' ? (
                                    <AnimatePresence mode="wait">
                                        {feedback === 'correct' ? (
                                            <motion.div
                                                key="correct"
                                                initial={{ scale: 0.85, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-center w-full"
                                            >
                                                {/* Correct State */}
                                                <div className="flex flex-col items-center mb-3">
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                                                        style={{
                                                            background: 'rgba(16,185,129,0.12)',
                                                            border: '1.5px solid #10B981',
                                                            boxShadow: '0 0 20px rgba(16,185,129,0.35)',
                                                        }}
                                                    >
                                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5}>
                                                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <span
                                                        className="text-xl font-black tracking-wider uppercase"
                                                        style={{ color: '#10B981', textShadow: '0 0 20px rgba(16,185,129,0.5)' }}
                                                    >
                                                        CHÍNH XÁC!
                                                    </span>
                                                    <span className="text-xs mt-0.5" style={{ color: '#34D399' }}>
                                                        Tuyệt vời — tiếp tục nào!
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => onAnswer(selected!, true)}
                                                    className="w-full py-3.5 font-bold rounded-xl text-white uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #059669, #10B981)',
                                                        boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
                                                        fontSize: 'clamp(14px, 1.5vw, 19px)',
                                                    }}
                                                >
                                                    Tiếp Tục →
                                                </button>
                                            </motion.div>
                                        ) : feedback === 'incorrect' ? (
                                            <motion.div
                                                key="incorrect"
                                                initial={{ opacity: 0 }}
                                                animate={{ x: [0, -6, 6, -4, 4, 0], opacity: 1 }}
                                                className="text-center w-full"
                                            >
                                                <div className="flex flex-col items-center mb-3">
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                                                        style={{
                                                            background: 'rgba(220,38,38,0.1)',
                                                            border: '1.5px solid #DC2626',
                                                            boxShadow: '0 0 16px rgba(220,38,38,0.3)',
                                                        }}
                                                    >
                                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2.5}>
                                                            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                                                            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                                                        </svg>
                                                    </div>
                                                    <span
                                                        className="text-xl font-black tracking-wider uppercase"
                                                        style={{ color: '#EF4444' }}
                                                    >
                                                        SAI RỒI
                                                    </span>
                                                    <span className="text-xs mt-0.5" style={{ color: '#888' }}>
                                                        Xem lại bài đọc và thử câu tiếp theo.
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => onAnswer(selected!, false)}
                                                    className="w-full py-3.5 font-bold rounded-xl text-white uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.04)',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        boxShadow: 'none',
                                                        fontSize: 'clamp(14px, 1.5vw, 19px)',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                                >
                                                    ▶ Tiếp Tục Thử Thách
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="check"
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 1 }}
                                                onClick={handleCheck}
                                                disabled={!selected}
                                                className="w-full py-3.5 font-black uppercase tracking-widest rounded-xl transition-all duration-300"
                                                style={selected ? {
                                                    background: 'linear-gradient(135deg, #991B1B 0%, #DC2626 55%, #EF4444 100%)',
                                                    boxShadow: '0 4px 24px rgba(220,38,38,0.4)',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: 'clamp(14px, 1.5vw, 19px)',
                                                } : {
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.04)',
                                                    color: '#333',
                                                    cursor: 'not-allowed',
                                                    fontSize: 'clamp(14px, 1.5vw, 19px)',
                                                }}
                                                onMouseEnter={e => {
                                                    if (selected) {
                                                        e.currentTarget.style.boxShadow = '0 6px 32px rgba(220,38,38,0.6), 0 0 20px rgba(239,68,68,0.2)';
                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.boxShadow = selected ? '0 4px 24px rgba(220,38,38,0.4)' : 'none';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                            >
                                                {selected ? '⚡ Kiểm Tra Đáp Án' : 'Chọn Một Đáp Án'}
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                ) : (
                                    /* Teacher Mode Controls */
                                    <div className="flex gap-3 w-full">
                                        {!revealed ? (
                                            <button
                                                onClick={handleReveal}
                                                className="flex-1 py-3 font-bold rounded-xl text-white uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
                                                style={{
                                                    background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                                                    boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
                                                    fontSize: 'clamp(14px, 1.5vw, 19px)',
                                                }}
                                            >
                                                👁 Hiện Đáp Án
                                            </button>
                                        ) : (
                                            <div
                                                className="flex-1 py-3 font-bold rounded-xl text-center text-sm uppercase tracking-widest"
                                                style={{
                                                    background: 'rgba(16,185,129,0.06)',
                                                    border: '1px solid rgba(16,185,129,0.2)',
                                                    color: '#6EE7B7',
                                                }}
                                            >
                                                ✅ {question.answer.length > 40 ? question.answer.substring(0, 40) + '…' : question.answer}
                                            </div>
                                        )}
                                        <button
                                            onClick={onNextQuestion}
                                            className="flex-1 py-3 font-bold rounded-xl text-white uppercase tracking-widest transition-all duration-200"
                                            style={{
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                fontSize: 'clamp(14px, 1.5vw, 19px)',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                        >
                                            Tiếp →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
