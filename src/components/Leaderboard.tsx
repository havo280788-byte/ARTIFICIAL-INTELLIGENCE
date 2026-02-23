
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../utils/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface Entry {
    id?: string;
    name: string;
    class: string;
    time: number;
    score?: number;
    totalQuestions?: number;
    answers?: { questionId: string; isCorrect: boolean }[];
    date: string;
}

type ViewMode = 'student' | 'teacher';

interface LeaderboardProps {
    onBack: () => void;
    currentPlayerName?: string;   // student's own name for highlight
    onViewMyAttempt?: () => void; // callback to open student's own review
}

const cardStyle: React.CSSProperties = {
    background: 'rgba(10,15,30,0.85)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
};

const headerStyle: React.CSSProperties = {
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

export default function Leaderboard({ onBack, currentPlayerName, onViewMyAttempt }: LeaderboardProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('student');
    const [resetConfirm, setResetConfirm] = useState(false);
    const [data, setData] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    // Realtime listener
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
            const entries: Entry[] = snapshot.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Entry, 'id'>)
            }));
            entries.sort((a, b) => {
                const scoreA = a.score ?? 0;
                const scoreB = b.score ?? 0;
                if (scoreB !== scoreA) return scoreB - scoreA;
                return a.time - b.time;
            });
            setData(entries);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleReset = async () => {
        try {
            const snap = await getDocs(collection(db, 'leaderboard'));
            const deletes = snap.docs.map(d => deleteDoc(doc(db, 'leaderboard', d.id)));
            await Promise.all(deletes);
        } catch (err) {
            console.error('Reset failed:', err);
        }
        setResetConfirm(false);
    };

    const top10 = data.slice(0, 10);
    const totalEntries = data.length;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const analytics = useMemo(() => {
        if (data.length === 0) return null;

        const completedEntries = data.filter(e => (e.score ?? 0) === (e.totalQuestions ?? 9));
        const completionRate = data.length > 0 ? Math.round((completedEntries.length / data.length) * 100) : 0;

        const avgAccuracy = data.length > 0
            ? Math.round(data.reduce((sum, e) => sum + ((e.score ?? 0) / (e.totalQuestions ?? 9)) * 100, 0) / data.length)
            : 0;

        const highAccuracyEntries = data.filter(e => ((e.score ?? 0) / (e.totalQuestions ?? 9)) >= 0.8);
        const fastestTime = highAccuracyEntries.length > 0
            ? Math.min(...highAccuracyEntries.map(e => e.time))
            : null;

        const questionStats: { [key: string]: { correct: number; total: number } } = {};
        data.forEach(entry => {
            entry.answers?.forEach(a => {
                if (!questionStats[a.questionId]) {
                    questionStats[a.questionId] = { correct: 0, total: 0 };
                }
                questionStats[a.questionId].total++;
                if (a.isCorrect) questionStats[a.questionId].correct++;
            });
        });

        const questionRates = Object.entries(questionStats)
            .sort(([a], [b]) => {
                const numA = parseInt(a.replace(/\D/g, ''));
                const numB = parseInt(b.replace(/\D/g, ''));
                return numA - numB;
            })
            .map(([id, stats]) => ({
                id,
                label: `Q${id.replace(/\D/g, '')}`,
                rate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            }));

        const hardest = [...questionRates].sort((a, b) => a.rate - b.rate).slice(0, 2);

        return { completionRate, avgAccuracy, fastestTime, questionRates, hardest, totalTeams: data.length };
    }, [data]);

    // --- CORRECTED Skills Breakdown ---
    // Scanning: q1,q2,q3,q4,q8 (5 câu)
    // Supporting Details: q5 (1 câu)
    // Pronoun Reference: q6 (1 câu)
    // Identifying Main Idea: q7 (1 câu)
    // Making Inferences: q9 (1 câu)
    const skillsBreakdown = useMemo(() => {
        if (!analytics || analytics.questionRates.length === 0) return [];

        const skills = [
            { name: 'Scanning', icon: '🔍', questions: ['q1', 'q2', 'q3', 'q4', 'q8'], color: '#22D3EE' },
            { name: 'Supporting Details', icon: '📋', questions: ['q5'], color: '#6366F1' },
            { name: 'Pronoun Reference', icon: '🔗', questions: ['q6'], color: '#8B5CF6' },
            { name: 'Identifying Main Idea', icon: '💡', questions: ['q7'], color: '#F59E0B' },
            { name: 'Making Inferences', icon: '🧠', questions: ['q9'], color: '#10B981' },
        ];

        return skills.map(skill => {
            const relevantAnswers = data.flatMap(e =>
                (e.answers || []).filter(a => skill.questions.includes(a.questionId))
            );
            const correct = relevantAnswers.filter(a => a.isCorrect).length;
            const total = relevantAnswers.length;
            const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
            return { ...skill, rate, correct, total };
        });
    }, [data, analytics]);

    if (loading) {
        return (
            <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="text-4xl mb-4 animate-pulse">⏳</div>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    // Rank badge colours
    const rankColor = (i: number) => {
        if (i === 0) return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' };
        if (i === 1) return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: '#94A3B8' };
        if (i === 2) return { bg: 'rgba(180,97,25,0.15)', border: 'rgba(180,97,25,0.35)', text: '#D97706' };
        return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', text: '#475569' };
    };

    return (
        <div className="min-h-screen animated-gradient-bg p-4 md:p-6 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl"
            >
                {/* ===== Header ===== */}
                <div style={{ ...cardStyle, marginBottom: '16px', borderRadius: '20px' }}>
                    <div style={{ ...headerStyle, padding: '16px 24px' }}>
                        {/* Top accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #22D3EE, #6366F1, transparent)' }} />

                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}
                            >
                                🏆
                            </div>
                            <div>
                                <h1 className="text-lg font-black uppercase tracking-wider" style={{ color: '#F1F5F9' }}>
                                    Leaderboard
                                </h1>
                                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
                                    Top 10 · AI Reading Challenge
                                </p>
                            </div>
                        </div>

                        {/* View Mode Toggle */}
                        <div
                            className="flex rounded-xl p-1"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            {(['student', 'teacher'] as ViewMode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setViewMode(m)}
                                    className="px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200"
                                    style={viewMode === m ? {
                                        background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                                        color: '#fff',
                                        boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                                    } : { color: '#475569' }}
                                >
                                    {m === 'student' ? '🎓 Student' : '👩‍🏫 Teacher'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== STUDENT VIEW ===== */}
                {viewMode === 'student' && (
                    <div style={cardStyle}>
                        {/* Column headers */}
                        <div
                            className="flex items-center justify-between px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#334155' }}
                        >
                            <span>Rank & Student</span>
                            <div className="flex gap-8">
                                <span className="w-14 text-center">Score</span>
                                <span className="w-14 text-center">Time</span>
                            </div>
                        </div>

                        {/* Rows */}
                        <div>
                            {top10.length > 0 ? (
                                top10.map((entry, index) => {
                                    const rc = rankColor(index);
                                    const isMe = currentPlayerName && entry.name === currentPlayerName;

                                    return (
                                        <motion.div
                                            key={entry.id || index}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className="flex items-center justify-between px-6 py-3.5 relative"
                                            style={{
                                                borderBottom: index < top10.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                                background: isMe ? 'rgba(99,102,241,0.08)' : 'transparent',
                                                borderLeft: isMe ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Rank badge */}
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                                                    style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}
                                                >
                                                    {index + 1}
                                                </div>

                                                {/* Name + class */}
                                                <div>
                                                    <div className="font-bold text-sm flex items-center gap-2" style={{ color: isMe ? '#A5B4FC' : '#CBD5E1' }}>
                                                        {entry.name}
                                                        {isMe && (
                                                            <span
                                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                                                                style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)' }}
                                                            >
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px]" style={{ color: '#334155' }}>{entry.class}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-5">
                                                {/* Score */}
                                                <div className="w-14 text-center">
                                                    <span className="font-black text-sm" style={{ color: '#22D3EE' }}>
                                                        {entry.score ?? '–'}
                                                    </span>
                                                    <span className="text-[10px]" style={{ color: '#334155' }}>
                                                        /{entry.totalQuestions ?? 9}
                                                    </span>
                                                </div>
                                                {/* Time */}
                                                <div className="w-14 text-center font-mono font-bold text-sm" style={{ color: '#64748B' }}>
                                                    {formatTime(entry.time)}
                                                </div>
                                                {/* View My Attempt button (only for own row) */}
                                                {isMe && onViewMyAttempt && (
                                                    <button
                                                        onClick={onViewMyAttempt}
                                                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap"
                                                        style={{
                                                            background: 'rgba(99,102,241,0.12)',
                                                            border: '1px solid rgba(99,102,241,0.3)',
                                                            color: '#818CF8',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.22)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; }}
                                                    >
                                                        View Attempt
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-16 text-sm italic" style={{ color: '#334155' }}>
                                    No entries yet. Be the first to complete the challenge!
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className="px-6 py-4 flex items-center justify-between"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        >
                            <span className="text-[11px]" style={{ color: '#334155' }}>{totalEntries} total entries</span>
                            <button
                                onClick={onBack}
                                className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#64748B',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94A3B8'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748B'; }}
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== TEACHER VIEW ===== */}
                {viewMode === 'teacher' && analytics && (
                    <div className="space-y-4">
                        {/* Class Snapshot */}
                        <div style={cardStyle}>
                            <div style={headerStyle}>
                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#22D3EE' }}>
                                    📊 Class Snapshot
                                </span>
                            </div>
                            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Teams Joined', value: analytics.totalTeams, color: '#F1F5F9' },
                                    { label: 'Completion', value: `${analytics.completionRate}%`, color: '#10B981' },
                                    { label: 'Avg Accuracy', value: `${analytics.avgAccuracy}%`, color: '#22D3EE' },
                                    { label: 'Fastest (≥80%)', value: analytics.fastestTime !== null ? formatTime(analytics.fastestTime) : '—', color: '#F59E0B' },
                                ].map(stat => (
                                    <div
                                        key={stat.label}
                                        className="rounded-xl p-4 text-center"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                                    >
                                        <div className="text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: '#334155' }}>
                                            {stat.label}
                                        </div>
                                        <div className="text-2xl font-black font-mono" style={{ color: stat.color }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Insights */}
                        <div style={cardStyle}>
                            <div style={headerStyle}>
                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#22D3EE' }}>
                                    📈 Question Insights
                                </span>
                                {analytics.hardest.length > 0 && (
                                    <span
                                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: 'rgba(220,38,38,0.12)', color: '#F87171', border: '1px solid rgba(220,38,38,0.25)' }}
                                    >
                                        Hardest: {analytics.hardest.map(h => h.label).join(', ')}
                                    </span>
                                )}
                            </div>
                            <div className="p-5 space-y-2.5">
                                {analytics.questionRates.map((q) => (
                                    <div key={q.id} className="flex items-center gap-3">
                                        <span className="text-xs font-bold w-8 shrink-0" style={{ color: '#475569' }}>{q.label}</span>
                                        <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${q.rate}%` }}
                                                transition={{ duration: 0.8, delay: 0.1 }}
                                                className="h-full rounded-full flex items-center justify-end pr-2"
                                                style={{
                                                    background: q.rate >= 80 ? '#10B981' : q.rate >= 50 ? '#F59E0B' : '#DC2626',
                                                    boxShadow: q.rate >= 80
                                                        ? '0 0 8px rgba(16,185,129,0.4)'
                                                        : q.rate >= 50
                                                            ? '0 0 8px rgba(245,158,11,0.4)'
                                                            : '0 0 8px rgba(220,38,38,0.3)',
                                                }}
                                            >
                                                {q.rate > 15 && (
                                                    <span className="text-[10px] font-bold text-white">{q.rate}%</span>
                                                )}
                                            </motion.div>
                                        </div>
                                        {q.rate <= 15 && (
                                            <span className="text-[10px] font-bold w-8" style={{ color: '#475569' }}>{q.rate}%</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills Breakdown */}
                        <div style={cardStyle}>
                            <div style={headerStyle}>
                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#22D3EE' }}>
                                    🧠 Skills Breakdown — AI Reading
                                </span>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {skillsBreakdown.map((skill) => (
                                    <div
                                        key={skill.name}
                                        className="rounded-xl p-4"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                                    >
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{skill.icon}</span>
                                                <span className="text-xs font-bold" style={{ color: '#CBD5E1' }}>{skill.name}</span>
                                            </div>
                                            <span className="text-sm font-black" style={{ color: skill.color }}>{skill.rate}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.rate}%` }}
                                                transition={{ duration: 0.8 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: skill.color, boxShadow: `0 0 8px ${skill.color}60` }}
                                            />
                                        </div>
                                        <div className="text-[10px] mt-1.5" style={{ color: '#334155' }}>
                                            {skill.correct}/{skill.total} correct
                                            <span className="ml-2" style={{ color: '#1E3A5F' }}>
                                                · Q{skill.questions.map(q => q.replace('q', '')).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="flex flex-col items-center gap-3 pb-4">
                            <div className="flex gap-3 flex-wrap justify-center">
                                <button
                                    onClick={onBack}
                                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#64748B',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
                                >
                                    ← Back to Start
                                </button>
                                {!resetConfirm ? (
                                    <button
                                        onClick={() => setResetConfirm(true)}
                                        className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                        style={{
                                            background: 'rgba(220,38,38,0.1)',
                                            border: '1px solid rgba(220,38,38,0.3)',
                                            color: '#F87171',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; }}
                                    >
                                        🗑 Reset Data
                                    </button>
                                ) : (
                                    <div
                                        className="flex items-center gap-2 rounded-xl px-4 py-2"
                                        style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)' }}
                                    >
                                        <span className="text-xs font-bold" style={{ color: '#F87171' }}>Are you sure?</span>
                                        <button
                                            onClick={handleReset}
                                            className="px-3 py-1 rounded-lg text-xs font-bold text-white"
                                            style={{ background: '#DC2626' }}
                                        >
                                            Yes, Reset
                                        </button>
                                        <button
                                            onClick={() => setResetConfirm(false)}
                                            className="px-3 py-1 rounded-lg text-xs font-bold"
                                            style={{ background: 'rgba(255,255,255,0.06)', color: '#64748B' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'teacher' && !analytics && (
                    <div style={{ ...cardStyle, padding: '32px', textAlign: 'center' }}>
                        <p style={{ color: '#334155', fontStyle: 'italic' }}>No data available yet for analytics.</p>
                        <button
                            onClick={onBack}
                            className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748B' }}
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
