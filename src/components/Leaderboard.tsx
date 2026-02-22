
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

export default function Leaderboard({ onBack }: { onBack: () => void }) {
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

    const skillsBreakdown = useMemo(() => {
        if (!analytics || analytics.questionRates.length === 0) return [];

        const skills = [
            { name: 'Fact Retrieval', icon: '📋', questions: ['q1', 'q4'], color: '#22D3EE' },
            { name: 'Reference (Pronouns)', icon: '🔗', questions: ['q6'], color: '#8B5CF6' },
            { name: 'Inference', icon: '💡', questions: ['q9'], color: '#F59E0B' },
            { name: 'Detail / Scanning', icon: '🔍', questions: ['q2', 'q3', 'q5', 'q7', 'q8'], color: '#22C55E' },
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
                    <p className="text-sm text-[#94A3B8]">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen animated-gradient-bg p-4 md:p-6 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl"
            >
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4">
                    <div className="bg-[#0F172A] px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🏆</span>
                            <div>
                                <h1 className="text-xl font-black text-white uppercase tracking-wider">Leaderboard</h1>
                                <p className="text-xs text-[#94A3B8]">Top 10 • AI Reading Challenge</p>
                            </div>
                        </div>

                        <div className="flex bg-[#1E293B] rounded-lg p-1 border border-[#334155]">
                            <button
                                onClick={() => setViewMode('student')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'student' ? 'bg-[#22D3EE] text-white' : 'text-[#94A3B8] hover:text-white'
                                    }`}
                            >
                                🎓 Student
                            </button>
                            <button
                                onClick={() => setViewMode('teacher')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'teacher' ? 'bg-[#22D3EE] text-white' : 'text-[#94A3B8] hover:text-white'
                                    }`}
                            >
                                👩‍🏫 Teacher
                            </button>
                        </div>
                    </div>
                </div>

                {/* STUDENT VIEW */}
                {viewMode === 'student' && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="px-6 py-3 border-b border-[#F1F5F9] flex justify-between items-center text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            <span>Rank & Team</span>
                            <div className="flex gap-8">
                                <span className="w-14 text-center">Score</span>
                                <span className="w-14 text-center">Time</span>
                            </div>
                        </div>

                        <div className="divide-y divide-[#F8FAFC]">
                            {top10.length > 0 ? (
                                top10.map((entry, index) => (
                                    <div
                                        key={entry.id || index}
                                        className={`flex items-center justify-between px-6 py-3.5 transition-colors ${index === 0 ? 'bg-[#FFFBEB]' :
                                            index === 1 ? 'bg-[#F8FAFC]' :
                                                index === 2 ? 'bg-[#FFF7ED]' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-[#F59E0B] text-white' :
                                                index === 1 ? 'bg-[#94A3B8] text-white' :
                                                    index === 2 ? 'bg-[#D97706] text-white' :
                                                        'bg-[#F1F5F9] text-[#94A3B8]'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <div className="font-bold text-[#0F172A] text-sm">{entry.name}</div>
                                                <div className="text-[10px] text-[#94A3B8]">{entry.class}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="w-14 text-center font-bold text-[#22D3EE] text-sm">
                                                {entry.score ?? '—'}/{entry.totalQuestions ?? 9}
                                            </div>
                                            <div className="w-14 text-center font-mono font-bold text-[#0F172A] text-sm">
                                                {formatTime(entry.time)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 text-[#94A3B8] font-medium italic text-sm">
                                    No entries yet. Be the first to complete the challenge!
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-[#F1F5F9] flex items-center justify-between">
                            <span className="text-xs text-[#94A3B8]">{totalEntries} total entries</span>
                            <button
                                onClick={onBack}
                                className="px-5 py-2 bg-[#0F172A] text-white font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-[#1E293B] transition-colors"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {/* TEACHER VIEW */}
                {viewMode === 'teacher' && analytics && (
                    <div className="space-y-4">
                        {/* Panel 1: Class Snapshot */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#F1F5F9]">
                                <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">📊 Class Snapshot</h2>
                            </div>
                            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] text-center">
                                    <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Teams Joined</div>
                                    <div className="text-2xl font-black text-[#0F172A]">{analytics.totalTeams}</div>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] text-center">
                                    <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Completion</div>
                                    <div className="text-2xl font-black text-[#22C55E]">{analytics.completionRate}%</div>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] text-center">
                                    <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Avg Accuracy</div>
                                    <div className="text-2xl font-black text-[#22D3EE]">{analytics.avgAccuracy}%</div>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] text-center">
                                    <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Fastest (≥80%)</div>
                                    <div className="text-2xl font-black text-[#F59E0B]">
                                        {analytics.fastestTime !== null ? formatTime(analytics.fastestTime) : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 2: Question Insights */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                                <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">📈 Question Insights</h2>
                                {analytics.hardest.length > 0 && (
                                    <span className="text-[10px] text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded-full font-bold">
                                        Hardest: {analytics.hardest.map(h => h.label).join(', ')}
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="space-y-2.5">
                                    {analytics.questionRates.map((q) => (
                                        <div key={q.id} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-[#64748B] w-8 shrink-0">{q.label}</span>
                                            <div className="flex-1 h-6 bg-[#F1F5F9] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${q.rate}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 }}
                                                    className={`h-full rounded-full flex items-center justify-end pr-2 ${q.rate >= 80 ? 'bg-[#22C55E]' :
                                                        q.rate >= 50 ? 'bg-[#F59E0B]' :
                                                            'bg-[#DC2626]'
                                                        }`}
                                                >
                                                    {q.rate > 15 && (
                                                        <span className="text-[10px] font-bold text-white">{q.rate}%</span>
                                                    )}
                                                </motion.div>
                                            </div>
                                            {q.rate <= 15 && (
                                                <span className="text-[10px] font-bold text-[#94A3B8]">{q.rate}%</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Panel 3: Skills Breakdown */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#F1F5F9]">
                                <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">🧠 Skills Breakdown (AI Reading)</h2>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {skillsBreakdown.map((skill) => (
                                    <div key={skill.name} className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{skill.icon}</span>
                                                <span className="text-xs font-bold text-[#334155]">{skill.name}</span>
                                            </div>
                                            <span className="text-sm font-black" style={{ color: skill.color }}>{skill.rate}%</span>
                                        </div>
                                        <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.rate}%` }}
                                                transition={{ duration: 0.8 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: skill.color }}
                                            />
                                        </div>
                                        <div className="text-[10px] text-[#94A3B8] mt-1">{skill.correct}/{skill.total} correct</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col items-center gap-3 pb-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={onBack}
                                    className="px-6 py-2.5 bg-white text-[#0F172A] font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                                >
                                    ← Back to Start
                                </button>
                                {!resetConfirm ? (
                                    <button
                                        onClick={() => setResetConfirm(true)}
                                        className="px-6 py-2.5 bg-[#DC2626] text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg hover:bg-[#B91C1C] transition-colors"
                                    >
                                        🗑 Reset Data
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-2">
                                        <span className="text-xs text-[#DC2626] font-bold">Are you sure?</span>
                                        <button
                                            onClick={handleReset}
                                            className="px-3 py-1 bg-[#DC2626] text-white text-xs font-bold rounded-lg hover:bg-[#B91C1C] transition-colors"
                                        >
                                            Yes, Reset
                                        </button>
                                        <button
                                            onClick={() => setResetConfirm(false)}
                                            className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-xs font-bold rounded-lg hover:bg-[#E2E8F0] transition-colors"
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
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <p className="text-[#94A3B8] italic">No data available yet for analytics.</p>
                        <button
                            onClick={onBack}
                            className="mt-4 px-6 py-2.5 bg-[#0F172A] text-white font-bold rounded-xl text-xs uppercase tracking-widest"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
