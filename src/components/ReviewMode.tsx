
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const passagePanelStyle: React.CSSProperties = {
    background: 'rgba(10,10,10,0.9)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
};

const questionPanelStyle: React.CSSProperties = {
    background: 'rgba(10,10,10,0.9)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
};

export default function ReviewMode({ answers, questions, onBack }: ReviewModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(0);
    const [studentEntries, setStudentEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // If student review (answers already provided), skip firestore load
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getHighlightedPassage = (answer: any, question: Question | undefined) => {
        if (!question) return null;
        const paragraphs = READING_PASSAGE.split('\n\n');
        const qLower = (question.question || "").toLowerCase();

        let relIdx = -1;
        if (qLower.includes('paragraph 1') || qLower.includes('what can ai do')) relIdx = 0;
        else if (qLower.includes('paragraph 2') || qLower.includes('"them"') || qLower.includes('robot') || qLower.includes('rescue') || qLower.includes('factory')) relIdx = 1;
        else if (qLower.includes('paragraph 3') || qLower.includes('digital assistant') || qLower.includes('navigation') || qLower.includes('diet') || qLower.includes('personal habits')) relIdx = 2;
        else if (qLower.includes('last paragraph') || qLower.includes('inferred')) relIdx = 3;

        return paragraphs.map((p, i) => ({ text: p, highlighted: i === relIdx }));
    };

    if (loading) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-pulse">⏳</div>
                    <p className="text-sm" style={{ color: '#555' }}>Đang tải bài xem lại...</p>
                </div>
            </div>
        );
    }

    if (activeAnswers.length === 0) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
                <div className="glass-card p-10 text-center max-w-sm">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="font-bold mb-2" style={{ color: '#B0B0B0' }}>Không có câu trả lời để xem lại.</p>
                    <p className="text-sm mb-6" style={{ color: '#444' }}>Chưa có bài nộp từ học sinh.</p>
                    <button
                        onClick={onBack}
                        className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-white"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        ← Quay Lại
                    </button>
                </div>
            </div>
        );
    }

    const answer = activeAnswers[currentIndex];
    const question = activeQuestions.find(q => q.id === answer.questionId);
    const paragraphs = getHighlightedPassage(answer, question);

    const totalCorrect = activeAnswers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((totalCorrect / activeAnswers.length) * 100);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#000' }}>
            {/* ===== Header ===== */}
            <div
                className="text-white px-4 py-3 flex flex-col gap-2 shrink-0"
                style={{
                    background: 'linear-gradient(180deg, #000 0%, #0A0A0A 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
                        >
                            🔍
                        </div>
                        <div>
                            <h1 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#B0B0B0' }}>
                                Xem Lại Đáp Án
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#333' }}>
                                Chỉ đọc · Đấu Trường Bản Lĩnh
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Score summary */}
                        <div
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <span className="text-xs font-bold" style={{ color: '#DC2626' }}>{totalCorrect}/{activeAnswers.length}</span>
                            <span className="text-[10px]" style={{ color: '#333' }}>đúng</span>
                            <span className="text-xs font-bold" style={{ color: '#555' }}>{accuracy}%</span>
                        </div>
                        <span className="text-[11px]" style={{ color: '#333' }}>
                            {currentIndex + 1} / {activeAnswers.length}
                        </span>
                        <button
                            onClick={onBack}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#555' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                            ✕ Đóng
                        </button>
                    </div>
                </div>

                {/* Question progress dots */}
                <div className="flex gap-1 flex-wrap">
                    {activeAnswers.map((a, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center transition-all"
                            style={{
                                background: i === currentIndex
                                    ? 'rgba(220,38,38,0.8)'
                                    : a.isCorrect
                                        ? 'rgba(16,185,129,0.25)'
                                        : 'rgba(220,38,38,0.25)',
                                border: i === currentIndex
                                    ? '1px solid #DC2626'
                                    : a.isCorrect
                                        ? '1px solid rgba(16,185,129,0.4)'
                                        : '1px solid rgba(220,38,38,0.35)',
                                color: i === currentIndex ? '#fff' : a.isCorrect ? '#6EE7B7' : '#FCA5A5',
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* Teacher: student picker */}
                {isTeacherView && studentEntries.length > 0 && (
                    <div
                        className="flex items-center gap-2 rounded-lg px-3 py-2"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <span className="text-xs whitespace-nowrap" style={{ color: '#444' }}>👤 Học sinh:</span>
                        <select
                            value={selectedStudent}
                            onChange={e => { setSelectedStudent(Number(e.target.value)); setCurrentIndex(0); }}
                            className="flex-1 bg-transparent text-sm font-bold border-none outline-none cursor-pointer"
                            style={{ color: '#B0B0B0' }}
                        >
                            {studentEntries.map((entry, idx) => (
                                <option key={idx} value={idx} className="bg-[#0A0A0A] text-white">
                                    {entry.name} ({entry.class}) — {entry.score}/{entry.totalQuestions} — {formatTime(entry.time)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* ===== Body ===== */}
            <div className="flex-1 p-3 md:p-5 overflow-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-5 h-full"
                    >
                        {/* LEFT: Reading Passage */}
                        <div className="w-full md:w-[40%] flex-shrink-0">
                            <div style={passagePanelStyle}>
                                {/* Red top accent */}
                                <div style={{ height: '2px', background: 'linear-gradient(90deg, #991B1B, #DC2626, #EF4444)', flexShrink: 0 }} />
                                <div
                                    className="px-5 py-3 flex items-center gap-2"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#DC2626' }}>
                                        Bài Đọc
                                    </span>
                                    {paragraphs?.some(p => p.highlighted) && (
                                        <span
                                            className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}
                                        >
                                            Đã đánh dấu
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 overflow-y-auto reading-scroll flex-1" style={{ maxHeight: '65vh' }}>
                                    <h3 className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#DC2626' }}>
                                        AI All Around Us
                                    </h3>
                                    {paragraphs ? (
                                        paragraphs.map((p, i) => (
                                            <p
                                                key={i}
                                                className="text-sm leading-relaxed mb-4 rounded-lg transition-all"
                                                style={{
                                                    lineHeight: '1.75',
                                                    ...(p.highlighted ? {
                                                        background: 'rgba(245,158,11,0.06)',
                                                        borderLeft: '3px solid rgba(245,158,11,0.5)',
                                                        paddingLeft: '12px',
                                                        paddingTop: '8px',
                                                        paddingBottom: '8px',
                                                        color: '#B0B0B0',
                                                    } : {
                                                        color: '#444',
                                                    })
                                                }}
                                            >
                                                {p.text}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#444', lineHeight: '1.75' }}>
                                            {READING_PASSAGE}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Question + Read-only Answer Review */}
                        <div className="w-full md:w-[60%]">
                            <div style={questionPanelStyle}>
                                {/* Header */}
                                <div
                                    className="px-5 py-3 flex items-center justify-between"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                >
                                    <span
                                        className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                                        style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#F87171' }}
                                    >
                                        Vòng {currentIndex + 1}
                                    </span>
                                    <span
                                        className="text-[11px] font-bold px-3 py-1 rounded-full"
                                        style={answer.isCorrect ? {
                                            background: 'rgba(16,185,129,0.1)',
                                            border: '1px solid rgba(16,185,129,0.25)',
                                            color: '#6EE7B7',
                                        } : {
                                            background: 'rgba(220,38,38,0.08)',
                                            border: '1px solid rgba(220,38,38,0.25)',
                                            color: '#F87171',
                                        }}
                                    >
                                        {answer.isCorrect ? '✓ Đúng' : '✕ Sai'}
                                    </span>
                                </div>

                                <div className="p-5 md:p-6 space-y-4">
                                    {/* Question text */}
                                    <h2 className="text-base md:text-lg font-bold leading-snug" style={{ color: '#F5F5F5' }}>
                                        {question?.question}
                                    </h2>

                                    {/* Options — read-only */}
                                    <div className="space-y-2">
                                        {question?.options?.map((option, idx) => {
                                            const isCorrectOption = option === question.answer;
                                            const wasSelected = option === (answer as any).selectedAnswer;
                                            const isWrongSelection = wasSelected && !answer.isCorrect;

                                            let style: React.CSSProperties;
                                            if (isCorrectOption) {
                                                style = {
                                                    background: 'rgba(16,185,129,0.08)',
                                                    border: '1.5px solid rgba(16,185,129,0.4)',
                                                    color: '#6EE7B7',
                                                };
                                            } else if (isWrongSelection) {
                                                style = {
                                                    background: 'rgba(220,38,38,0.06)',
                                                    border: '1.5px solid rgba(220,38,38,0.35)',
                                                    color: '#FCA5A5',
                                                };
                                            } else {
                                                style = {
                                                    background: 'rgba(255,255,255,0.02)',
                                                    border: '1.5px solid rgba(255,255,255,0.04)',
                                                    color: '#333',
                                                };
                                            }

                                            const badgeStyle: React.CSSProperties = isCorrectOption
                                                ? { background: 'rgba(16,185,129,0.2)', color: '#6EE7B7' }
                                                : isWrongSelection
                                                    ? { background: 'rgba(220,38,38,0.15)', color: '#FCA5A5' }
                                                    : { background: 'rgba(255,255,255,0.03)', color: '#333' };

                                            return (
                                                <div
                                                    key={idx}
                                                    className="w-full p-3.5 rounded-xl text-left text-sm flex items-center gap-3"
                                                    style={{ ...style, cursor: 'default' }}
                                                >
                                                    <span
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                                        style={badgeStyle}
                                                    >
                                                        {isCorrectOption ? '✓' : isWrongSelection ? '✕' : String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span style={{ fontWeight: isCorrectOption ? 600 : 400 }}>{option}</span>
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
                                        className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                                        style={currentIndex === 0 ? {
                                            background: 'rgba(255,255,255,0.01)',
                                            color: '#1A1A1A',
                                            cursor: 'not-allowed',
                                            border: '1px solid rgba(255,255,255,0.03)',
                                        } : {
                                            background: 'rgba(255,255,255,0.03)',
                                            color: '#555',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => { if (currentIndex > 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#888'; } }}
                                        onMouseLeave={e => { if (currentIndex > 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#555'; } }}
                                    >
                                        ← Trước
                                    </button>
                                    <button
                                        onClick={() => setCurrentIndex(prev => Math.min(activeAnswers.length - 1, prev + 1))}
                                        disabled={currentIndex === activeAnswers.length - 1}
                                        className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                                        style={currentIndex === activeAnswers.length - 1 ? {
                                            background: 'rgba(255,255,255,0.01)',
                                            color: '#1A1A1A',
                                            cursor: 'not-allowed',
                                            border: '1px solid rgba(255,255,255,0.03)',
                                        } : {
                                            background: 'linear-gradient(135deg, #991B1B, #DC2626)',
                                            color: '#fff',
                                            boxShadow: '0 4px 16px rgba(220,38,38,0.35)',
                                            cursor: 'pointer',
                                            border: 'none',
                                        }}
                                        onMouseEnter={e => { if (currentIndex < activeAnswers.length - 1) { e.currentTarget.style.boxShadow = '0 6px 24px rgba(220,38,38,0.5)'; e.currentTarget.style.transform = 'scale(1.01)'; } }}
                                        onMouseLeave={e => { if (currentIndex < activeAnswers.length - 1) { e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.35)'; e.currentTarget.style.transform = 'scale(1)'; } }}
                                    >
                                        Tiếp →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
