
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

    // Reset state when question changes
    useEffect(() => {
        setSelected(null);
        setFeedback(null);
        setRevealed(false);
        // Keep highlights across questions in teacher mode (teacher can clear manually)
    }, [question]);

    if (!question) return null;

    // ---- Student Mode: Check Answer ----
    const handleCheck = () => {
        if (!selected) return;

        if (selected === question.answer) {
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
    };

    // ---- Teacher Mode: Reveal ----
    const handleReveal = () => {
        setRevealed(true);
    };

    // ---- Teacher Mode: Toggle Highlight ----
    const handleHighlightToggle = () => {
        setHighlightMode(prev => !prev);
    };

    // ---- Teacher Mode: Clear Highlights ----
    const handleClearHighlights = () => {
        setHighlights([]);
    };

    // ---- Teacher Mode: Handle text selection for highlighting ----
    const handleTextSelect = useCallback(() => {
        if (!highlightMode || mode !== 'teacher') return;

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
            setHighlights(prev => [...prev, { text: selectedText, start: 0, end: selectedText.length }]);
            selection.removeAllRanges();
        }
    }, [highlightMode, mode]);

    // ---- Render highlighted passage ----
    const renderPassage = () => {
        if (mode === 'teacher' && highlights.length > 0) {
            let passageText = READING_PASSAGE;
            // Build highlighted version
            const parts: Array<{ text: string; highlighted: boolean }> = [];
            let remaining = passageText;

            for (const h of highlights) {
                const idx = remaining.indexOf(h.text);
                if (idx !== -1) {
                    if (idx > 0) {
                        parts.push({ text: remaining.substring(0, idx), highlighted: false });
                    }
                    parts.push({ text: h.text, highlighted: true });
                    remaining = remaining.substring(idx + h.text.length);
                }
            }
            if (remaining.length > 0) {
                parts.push({ text: remaining, highlighted: false });
            }

            if (parts.length > 0) {
                return (
                    <p className="text-sm md:text-lg text-[#334155] leading-relaxed" style={{ lineHeight: '1.6' }}>
                        {parts.map((part, i) => (
                            <span
                                key={i}
                                className={part.highlighted ? 'teacher-highlight' : ''}
                            >
                                {part.text}
                            </span>
                        ))}
                    </p>
                );
            }
        }

        return (
            <p className="text-sm md:text-lg text-[#334155] leading-relaxed whitespace-pre-line" style={{ lineHeight: '1.6' }}>
                {READING_PASSAGE}
            </p>
        );
    };

    const getOptionStyle = (option: string) => {
        const base = 'w-full p-3.5 md:p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium text-sm md:text-lg';

        // Teacher Reveal: show correct answer
        if (mode === 'teacher' && revealed && option === question.answer) {
            return `${base} bg-[#22C55E] border-[#22C55E] text-white shadow-lg`;
        }

        if (feedback === 'correct' && option === question.answer) {
            return `${base} bg-[#22C55E] border-[#22C55E] text-white shadow-lg`;
        }
        if (feedback === 'incorrect' && selected === option) {
            return `${base} bg-[#DC2626] border-[#DC2626] text-white`;
        }
        if (selected === option) {
            return `${base} bg-[#22D3EE]/10 border-[#22D3EE] text-[#0F172A] shadow-md ring-2 ring-[#22D3EE]/30`;
        }
        return `${base} bg-[#F9FAFB] border-[#E2E8F0] text-[#334155] hover:bg-[#E0F2FE] hover:border-[#22D3EE]/40`;
    };

    const getOptionBadgeStyle = (option: string, idx: number) => {
        const base = 'w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold shrink-0 transition-colors';

        if (mode === 'teacher' && revealed && option === question.answer) {
            return `${base} bg-white/30 text-white`;
        }
        if (selected === option) {
            return `${base} bg-[#22D3EE] text-white`;
        }
        if (feedback === 'correct' && option === question.answer) {
            return `${base} bg-white/30 text-white`;
        }
        if (feedback === 'incorrect' && selected === option) {
            return `${base} bg-white/30 text-white`;
        }
        return `${base} bg-[#E2E8F0] text-[#64748B]`;
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Desktop: Side-by-side | Mobile: Stacked */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">

                {/* LEFT: Reading Passage (40%) */}
                <div className="w-full md:w-[40%] flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] overflow-hidden h-full flex flex-col">
                        {/* Reading Header */}
                        <div className="px-5 py-3 border-b border-[#F1F5F9] flex items-center gap-2">
                            <span className="text-base">📖</span>
                            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Reading Passage</span>
                            {mode === 'teacher' && highlightMode && (
                                <span className="ml-auto text-[10px] text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full font-bold">
                                    ✏️ Highlight ON
                                </span>
                            )}
                        </div>

                        {/* Reading Content */}
                        <div
                            className="p-5 overflow-y-auto reading-scroll flex-1"
                            style={{ maxHeight: '60vh', cursor: mode === 'teacher' && highlightMode ? 'text' : 'default' }}
                            onMouseUp={handleTextSelect}
                        >
                            <h3 className="text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wide">AI All Around Us</h3>
                            {renderPassage()}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Question (60%) */}
                <div className="w-full md:w-[60%]">
                    <div className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] overflow-hidden flex flex-col">
                        {/* Question Header */}
                        <div className="px-5 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                            <span className="text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                Stage {stageNum}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#94A3B8]">
                                    {question.type === 'mcq' ? 'Multiple Choice' : 'True / False / Doesn\'t Say'}
                                </span>

                                {/* Teacher toolbar (compact, top-right) */}
                                {mode === 'teacher' && (
                                    <div className="flex items-center gap-1 ml-2">
                                        <button
                                            onClick={handleHighlightToggle}
                                            className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-colors ${highlightMode
                                                ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                                                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] hover:bg-[#FEF3C7] hover:text-[#92400E]'
                                                }`}
                                            title="Toggle highlight mode"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={handleClearHighlights}
                                            className="px-2 py-1 text-[10px] font-bold rounded-md border bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FECACA] transition-colors"
                                            title="Clear all highlights"
                                        >
                                            🧹
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 md:p-6 space-y-5">
                            {/* Question Text */}
                            <h2 className="text-base md:text-xl font-bold text-[#0F172A] leading-snug">
                                {question.question}
                            </h2>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-1.5 md:gap-2">
                                {question.options?.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (mode === 'teacher') {
                                                // Teacher can click options freely to highlight/discuss
                                                setSelected(selected === option ? null : option);
                                            } else {
                                                if (!feedback) setSelected(option);
                                            }
                                        }}
                                        className={getOptionStyle(option)}
                                        disabled={mode === 'student' && !!feedback}
                                    >
                                        <div className="flex items-center">
                                            <span className={getOptionBadgeStyle(option, idx)}>
                                                {mode === 'teacher' && revealed && option === question.answer
                                                    ? '✓'
                                                    : String.fromCharCode(65 + idx)}
                                            </span>
                                            <span>{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Bottom controls */}
                            <div className="pt-2 flex flex-col items-center gap-3">
                                {mode === 'student' ? (
                                    /* ---- STUDENT MODE ---- */
                                    <AnimatePresence mode="wait">
                                        {feedback === 'correct' ? (
                                            <motion.div
                                                key="correct"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-center w-full"
                                            >
                                                <div className="text-2xl md:text-3xl font-black text-[#22C55E] mb-3 tracking-wider">✅ CORRECT!</div>
                                                <button
                                                    onClick={() => onAnswer(selected!, true)}
                                                    className="w-full py-3.5 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm"
                                                >
                                                    Continue →
                                                </button>
                                            </motion.div>
                                        ) : feedback === 'incorrect' ? (
                                            <motion.div
                                                key="incorrect"
                                                initial={{ opacity: 0 }}
                                                animate={{ x: [0, -8, 8, -8, 8, 0], opacity: 1 }}
                                                className="text-center w-full"
                                            >
                                                <div className="text-xl md:text-2xl font-black text-[#DC2626] mb-2 tracking-wider">
                                                    ❌ INCORRECT
                                                </div>
                                                <p className="text-sm text-[#64748B] mb-4">
                                                    You should review the passage again.
                                                </p>
                                                <button
                                                    onClick={() => onAnswer(selected!, false)}
                                                    className="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm"
                                                >
                                                    ▶ Continue Challenge
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <button
                                                onClick={handleCheck}
                                                disabled={!selected}
                                                className={`
                                                    w-full py-3.5 font-bold text-base uppercase tracking-widest transition-all
                                                    ${selected
                                                        ? 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/30 hover:bg-[#D97706] hover:shadow-xl'
                                                        : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'}
                                                `}
                                                style={{ borderRadius: '14px' }}
                                            >
                                                Check Answer
                                            </button>
                                        )}
                                    </AnimatePresence>
                                ) : (
                                    /* ---- TEACHER MODE: Reveal + Next (no Submit) ---- */
                                    <div className="flex gap-3 w-full">
                                        {!revealed ? (
                                            <button
                                                onClick={handleReveal}
                                                className="flex-1 py-3 bg-[#F59E0B] text-white font-bold rounded-xl shadow-md hover:bg-[#D97706] transition-colors uppercase tracking-widest text-sm"
                                            >
                                                👁 Reveal
                                            </button>
                                        ) : (
                                            <div className="flex-1 py-3 bg-[#22C55E]/10 text-[#22C55E] font-bold rounded-xl text-center text-sm uppercase tracking-widest">
                                                ✅ Answer: {question.answer.length > 40 ? question.answer.substring(0, 40) + '…' : question.answer}
                                            </div>
                                        )}
                                        <button
                                            onClick={onNextQuestion}
                                            className="flex-1 py-3 bg-[#0F172A] text-white font-bold rounded-xl shadow-md hover:bg-[#1E293B] transition-colors uppercase tracking-widest text-sm"
                                        >
                                            Next →
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
