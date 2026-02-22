
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Question, READING_PASSAGE, QUESTIONS } from '../utils/gameData';
import { AnswerRecord } from '../App';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface LeaderboardEntry {
    name: string;
    class: string;
    time: number;
    score: number;
    totalQuestions: number;
    answers: { questionId: string; question: string; selectedAnswer: string; correctAnswer: string; isCorrect: boolean }[];
    date: string;
}

interface ReviewModeProps {
    answers: AnswerRecord[];
    questions: Question[];
    onBack: () => void;
}

export default function ReviewMode({ answers, questions, onBack }: ReviewModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(0);
    const [studentEntries, setStudentEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Load student submissions from Firestore for teacher use
    useEffect(() => {
        if (answers.length > 0) {
            setLoading(false);
            return;
        }
        const load = async () => {
            try {
                const snap = await getDocs(collection(db, 'leaderboard'));
                const entries = snap.docs
                    .map(d => d.data() as LeaderboardEntry)
                    .filter(e => e.answers && e.answers.length > 0);
                setStudentEntries(entries);
            } catch (err) {
                console.error('Failed to load student data:', err);
            }
            setLoading(false);
        };
        load();
    }, [answers]);

    const isTeacherView = answers.length === 0;
    const activeAnswers = isTeacherView
        ? (studentEntries[selectedStudent]?.answers || [])
        : answers;
    const activeQuestions = questions.length > 0 ? questions : QUESTIONS;

    if (loading) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="text-4xl mb-4 animate-pulse">⏳</div>
                    <p className="text-sm text-[#94A3B8]">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (activeAnswers.length === 0) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-[#64748B] mb-2 font-bold">No answers to review.</p>
                    <p className="text-[#94A3B8] text-sm mb-6">No student submissions found yet.</p>
                    <button onClick={onBack} className="px-6 py-3 bg-[#0F172A] text-white font-bold rounded-xl">
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const answer = activeAnswers[currentIndex];
    const question = activeQuestions.find(q => q.id === answer.questionId);

    const getHighlightedPassage = () => {
        if (!question) return READING_PASSAGE;

        const passageParagraphs = READING_PASSAGE.split('\n\n');
        const questionLower = question.question.toLowerCase();

        let relevantParagraphIndex = -1;
        if (questionLower.includes('paragraph 1') || questionLower.includes('what can ai do')) {
            relevantParagraphIndex = 0;
        } else if (questionLower.includes('paragraph 2') || questionLower.includes('"them"') || questionLower.includes('robot') || questionLower.includes('rescue') || questionLower.includes('factory') || questionLower.includes('industrial')) {
            relevantParagraphIndex = 1;
        } else if (questionLower.includes('paragraph 3') || questionLower.includes('digital assistant') || questionLower.includes('navigation') || questionLower.includes('diet') || questionLower.includes('gadget') || questionLower.includes('personal habits')) {
            relevantParagraphIndex = 2;
        } else if (questionLower.includes('last paragraph') || questionLower.includes('inferred')) {
            relevantParagraphIndex = 3;
        }

        return passageParagraphs.map((p, i) => ({
            text: p,
            highlighted: i === relevantParagraphIndex
        }));
    };

    const highlightedParagraphs = getHighlightedPassage();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col">
            {/* Header */}
            <div className="bg-[#0F172A] text-white px-4 py-3 flex flex-col gap-2 border-b border-[#1E293B]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📖</span>
                        <h1 className="text-sm font-bold uppercase tracking-wider">Review Mode</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-[#94A3B8]">
                            Question {currentIndex + 1} of {activeAnswers.length}
                        </span>
                        <button
                            onClick={onBack}
                            className="px-3 py-1.5 bg-[#1E293B] text-white text-xs font-bold rounded-lg border border-[#334155] hover:bg-[#334155] transition-colors"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* Student picker (teacher view only) */}
                {isTeacherView && studentEntries.length > 0 && (
                    <div className="flex items-center gap-2 bg-[#1E293B] rounded-lg px-3 py-2 border border-[#334155]">
                        <span className="text-xs text-[#94A3B8] whitespace-nowrap">👤 Student:</span>
                        <select
                            value={selectedStudent}
                            onChange={(e) => {
                                setSelectedStudent(Number(e.target.value));
                                setCurrentIndex(0);
                            }}
                            className="flex-1 bg-transparent text-white text-sm font-bold border-none outline-none cursor-pointer"
                        >
                            {studentEntries.map((entry, idx) => (
                                <option key={idx} value={idx} className="bg-[#0F172A] text-white">
                                    {entry.name} ({entry.class}) — {entry.score}/{entry.totalQuestions} — {formatTime(entry.time)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 p-3 md:p-5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-5">
                    {/* LEFT: Reading with highlighting */}
                    <div className="w-full md:w-[40%] flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] overflow-hidden h-full flex flex-col">
                            <div className="px-5 py-3 border-b border-[#F1F5F9] flex items-center gap-2">
                                <span className="text-base">📖</span>
                                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Reading Passage</span>
                                <span className="ml-auto text-[10px] text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full font-bold">Evidence highlighted</span>
                            </div>
                            <div className="p-5 overflow-y-auto reading-scroll flex-1" style={{ maxHeight: '65vh' }}>
                                <h3 className="text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wide">AI All Around Us</h3>
                                {Array.isArray(highlightedParagraphs) ? (
                                    highlightedParagraphs.map((p, i) => (
                                        <p
                                            key={i}
                                            className={`text-sm leading-relaxed mb-4 rounded-lg transition-all ${p.highlighted
                                                ? 'bg-[#FEF3C7] border-l-4 border-[#F59E0B] pl-3 py-2 text-[#0F172A] font-medium'
                                                : 'text-[#64748B]'
                                                }`}
                                            style={{ lineHeight: '1.6' }}
                                        >
                                            {p.text}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line" style={{ lineHeight: '1.6' }}>
                                        {READING_PASSAGE}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Question + Answer review */}
                    <div className="w-full md:w-[60%]">
                        <div className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] overflow-hidden">
                            {/* Question header */}
                            <div className="px-5 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                                <span className="text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Stage {currentIndex + 1}
                                </span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${answer.isCorrect ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#DC2626]/10 text-[#DC2626]'
                                    }`}>
                                    {answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                </span>
                            </div>

                            <div className="p-5 md:p-6 space-y-4">
                                <h2 className="text-base md:text-lg font-bold text-[#0F172A] leading-snug">
                                    {answer.question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-2.5">
                                    {question?.options?.map((option, idx) => {
                                        const isCorrectOption = option === answer.correctAnswer;
                                        const wasSelected = option === answer.selectedAnswer;
                                        const isWrongSelection = wasSelected && !answer.isCorrect;

                                        let style = 'bg-[#F9FAFB] border-[#E2E8F0] text-[#94A3B8]';
                                        if (isCorrectOption) {
                                            style = 'bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E] font-semibold';
                                        }
                                        if (isWrongSelection) {
                                            style = 'bg-[#DC2626]/10 border-[#DC2626] text-[#DC2626] line-through';
                                        }

                                        return (
                                            <div
                                                key={idx}
                                                className={`w-full p-3.5 rounded-xl border-2 text-left text-sm ${style}`}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold shrink-0 ${isCorrectOption ? 'bg-[#22C55E] text-white' :
                                                        isWrongSelection ? 'bg-[#DC2626] text-white' :
                                                            'bg-[#E2E8F0] text-[#94A3B8]'
                                                        }`}>
                                                        {isCorrectOption ? '✓' : isWrongSelection ? '✕' : String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span>{option}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="px-5 pb-5 flex gap-3">
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentIndex === 0}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors ${currentIndex === 0
                                        ? 'bg-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                                        : 'bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                                        }`}
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.min(activeAnswers.length - 1, prev + 1))}
                                    disabled={currentIndex === activeAnswers.length - 1}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors ${currentIndex === activeAnswers.length - 1
                                        ? 'bg-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                                        : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                                        }`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
