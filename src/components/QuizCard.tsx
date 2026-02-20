
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../utils/gameData';

interface QuizCardProps {
    question: Question;
    stageNum: number;
    onCorrect: () => void;
    onIncorrect: () => void;
}

export default function QuizCard({ question, stageNum, onCorrect, onIncorrect }: QuizCardProps) {
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
            setTimeout(() => onIncorrect(), 1000);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 px-6 py-4 flex justify-between items-center">
                <span className="text-white font-bold text-lg">STAGE {stageNum}</span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">10 Questions</span>
            </div>

            <div className="p-8 space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center">
                    {question.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {question.options?.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => !feedback && setSelected(option)}
                            className={`
                w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 font-medium
                ${selected === option ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-200' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'}
                ${feedback === 'correct' && option === question.answer ? 'bg-green-500 border-green-500 text-white shadow-green-200' : ''}
                ${feedback === 'incorrect' && selected === option ? 'bg-red-500 border-red-500 text-white' : ''}
              `}
                            disabled={!!feedback}
                        >
                            <div className="flex items-center">
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-400 font-bold text-sm shrink-0">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-4 flex flex-col items-center gap-4">
                    <AnimatePresence mode="wait">
                        {feedback === 'correct' ? (
                            <motion.div
                                key="correct"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <div className="text-4xl font-black text-green-500 mb-4 tracking-wider">CORRECT!</div>
                                <button
                                    onClick={onCorrect}
                                    className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 uppercase tracking-widest"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        ) : feedback === 'incorrect' ? (
                            <motion.div
                                key="incorrect"
                                initial={{ opacity: 0 }}
                                animate={{ x: [0, -10, 10, -10, 10, 0], opacity: 1 }}
                                className="text-2xl font-black text-red-500 tracking-wider"
                            >
                                INCORRECT.
                            </motion.div>
                        ) : (
                            <button
                                onClick={handleCheck}
                                disabled={!selected}
                                className={`
                  w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all
                  ${selected ? 'bg-orange-500 text-white shadow-xl hover:bg-orange-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
                            >
                                Check Answer
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
