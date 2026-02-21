
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, READING_PASSAGE } from '../utils/gameData';

interface QuizCardProps {
    question: Question;
    stageNum: number;
    onAnswer: (selected: string, isCorrect: boolean) => void;
}

export default function QuizCard({ question, stageNum, onAnswer }: QuizCardProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    // Reset state when question changes
    useEffect(() => {
        setSelected(null);
        setFeedback(null);
    }, [question]);

    if (!question) return null;

    const handleCheck = () => {
        if (!selected) return;

        if (selected === question.answer) {
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
            setTimeout(() => onAnswer(selected, false), 1200);
        }
    };

    const getOptionStyle = (option: string) => {
        const base = 'w-full p-3.5 md:p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium text-sm md:text-base';

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
                        </div>

                        {/* Reading Content */}
                        <div className="p-5 overflow-y-auto reading-scroll flex-1" style={{ maxHeight: '60vh' }}>
                            <h3 className="text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wide">AI All Around Us</h3>
                            <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line" style={{ lineHeight: '1.6' }}>
                                {READING_PASSAGE}
                            </p>
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
                            <span className="text-xs text-[#94A3B8]">
                                {question.type === 'mcq' ? 'Multiple Choice' : 'True / False / Doesn\'t Say'}
                            </span>
                        </div>

                        <div className="p-5 md:p-6 space-y-5">
                            {/* Question Text */}
                            <h2 className="text-base md:text-lg font-bold text-[#0F172A] leading-snug">
                                {question.question}
                            </h2>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-2.5 md:gap-3">
                                {question.options?.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => !feedback && setSelected(option)}
                                        className={getOptionStyle(option)}
                                        disabled={!!feedback}
                                    >
                                        <div className="flex items-center">
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold shrink-0 transition-colors
                                                ${selected === option ? 'bg-[#22D3EE] text-white' : 'bg-[#E2E8F0] text-[#64748B]'}
                                                ${feedback === 'correct' && option === question.answer ? 'bg-white/30 text-white' : ''}
                                                ${feedback === 'incorrect' && selected === option ? 'bg-white/30 text-white' : ''}
                                            `}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span>{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Feedback / Check Button */}
                            <div className="pt-2 flex flex-col items-center gap-3">
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
                                            className="text-xl md:text-2xl font-black text-[#DC2626] tracking-wider"
                                        >
                                            ❌ INCORRECT.
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
