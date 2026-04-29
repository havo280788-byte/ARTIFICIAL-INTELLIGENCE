
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
    currentPlayerName?: string;
    onViewMyAttempt?: () => void;
}

const cardStyle: React.CSSProperties = {
    background: 'rgba(10,10,10,0.9)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
};

const headerStyle: React.CSSProperties = {
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
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

    // --- Skills Breakdown ---
    const skillsBreakdown = useMemo(() => {
        if (!analytics || analytics.questionRates.length === 0) return [];

        const skills = [
            { name: 'Quét Thông Tin', icon: '🔍', questions: ['q1', 'q2', 'q3', 'q4', 'q8'], color: '#DC2626' },
            { name: 'Chi Tiết Hỗ Trợ', icon: '📋', questions: ['q5'], color: '#EF4444' },
            { name: 'Tham Chiếu Đại Từ', icon: '🔗', questions: ['q6'], color: '#F87171' },
            { name: 'Ý Chính', icon: '💡', questions: ['q7'], color: '#F59E0B' },
            { name: 'Suy Luận', icon: '🧠', questions: ['q9'], color: '#10B981' },
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
                    <p className="text-sm" style={{ color: '#888' }}>Đang tải bảng xếp hạng...</p>
                </div>
            </div>
        );
    }

    // Rank badge colours
    const rankColor = (i: number) => {
        if (i === 0) return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' };
        if (i === 1) return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: '#94A3B8' };
        if (i === 2) return { bg: 'rgba(180,97,25,0.15)', border: 'rgba(180,97,25,0.35)', text: '#D97706' };
        return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', text: '#444' };
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
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #DC2626, #EF4444, transparent)' }} />

                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
                            >
                                🏆
                            </div>
                            <div>
                                <h1 className="text-lg font-black uppercase tracking-wider font-orbitron" style={{ color: '#F5F5F5' }}>
                                    Bảng Xếp Hạng
                                </h1>
                                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#333' }}>
                                    Top 10 · Đấu Trường Bản Lĩnh
                                </p>
                            </div>
                        </div>

                        {/* View Mode Toggle */}
                        <div
                            className="flex rounded-xl p-1"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            {(['student', 'teacher'] as ViewMode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setViewMode(m)}
                                    className="px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200"
                                    style={viewMode === m ? {
                                        background: 'linear-gradient(135deg, #991B1B, #DC2626)',
                                        color: '#fff',
                                        boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                                    } : { color: '#444' }}
                                >
                                    {m === 'student' ? '🎓 Học Sinh' : '👩‍🏫 Giáo Viên'}
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
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#333' }}
                        >
                            <span>Hạng & Học Sinh</span>
                            <div className="flex gap-8">
                                <span className="w-14 text-center">Điểm</span>
                                <span className="w-14 text-center">Thời Gian</span>
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
                                                borderBottom: index < top10.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                                                background: isMe ? 'rgba(220,38,38,0.06)' : 'transparent',
                                                borderLeft: isMe ? '2px solid rgba(220,38,38,0.5)' : '2px solid transparent',
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
                                                    <div className="font-bold text-sm flex items-center gap-2" style={{ color: isMe ? '#F87171' : '#B0B0B0' }}>
                                                        {entry.name}
                                                        {isMe && (
                                                            <span
                                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                                                                style={{ background: 'rgba(220,38,38,0.15)', color: '#F87171', border: '1px solid rgba(220,38,38,0.3)' }}
                                                            >
                                                                Bạn
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px]" style={{ color: '#333' }}>{entry.class}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-5">
                                                {/* Score */}
                                                <div className="w-14 text-center">
                                                    <span className="font-black text-sm" style={{ color: '#DC2626' }}>
                                                        {entry.score ?? '–'}
                                                    </span>
                                                    <span className="text-[10px]" style={{ color: '#333' }}>
                                                        /{entry.totalQuestions ?? 9}
                                                    </span>
                                                </div>
                                                {/* Time */}
                                                <div className="w-14 text-center font-mono font-bold text-sm" style={{ color: '#555' }}>
                                                    {formatTime(entry.time)}
                                                </div>
                                                {/* View My Attempt button (only for own row) */}
                                                {isMe && onViewMyAttempt && (
                                                    <button
                                                        onClick={onViewMyAttempt}
                                                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap"
                                                        style={{
                                                            background: 'rgba(220,38,38,0.1)',
                                                            border: '1px solid rgba(220,38,38,0.25)',
                                                            color: '#F87171',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.2)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; }}
                                                    >
                                                        Xem Bài
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-16 text-sm italic" style={{ color: '#333' }}>
                                    Chưa có ai tham gia. Hãy là người đầu tiên hoàn thành thử thách!
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className="px-6 py-4 flex items-center justify-between"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                        >
                            <span className="text-[11px]" style={{ color: '#333' }}>{totalEntries} lượt tham gia</span>
                            <button
                                onClick={onBack}
                                className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: '#555',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#888'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#555'; }}
                            >
                                ← Quay Lại
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== TEACHER VIEW ===== */}
                {viewMode === 'teacher' && (
                    <div className="space-y-4">
                        <div style={cardStyle}>
                            <div
                                className="flex items-center justify-between px-6 py-3.5 text-xs font-black uppercase tracking-widest"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#DC2626', background: 'rgba(220,38,38,0.02)' }}
                            >
                                <span>Thứ Hạng & Học Sinh</span>
                                <div className="flex gap-12">
                                    <span className="w-20 text-center">Kết Quả</span>
                                    <span className="w-20 text-center">Thời Gian</span>
                                </div>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                                {data.length > 0 ? (
                                    data.map((entry, index) => {
                                        const rc = rankColor(index);
                                        return (
                                            <motion.div
                                                key={entry.id || index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center justify-between px-6 py-5"
                                                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0"
                                                        style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-xl md:text-2xl" style={{ color: '#F5F5F5' }}>
                                                            {entry.name}
                                                        </div>
                                                        <div className="text-sm font-bold uppercase tracking-widest mt-0.5" style={{ color: '#555' }}>
                                                            {entry.class}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-10">
                                                    <div className="w-20 text-center">
                                                        <span className="font-black text-2xl md:text-3xl" style={{ color: '#DC2626' }}>
                                                            {entry.score ?? '–'}
                                                        </span>
                                                        <span className="text-xs font-bold" style={{ color: '#333' }}>
                                                            /1000
                                                        </span>
                                                    </div>
                                                    <div className="w-20 text-center font-mono font-black text-xl md:text-2xl" style={{ color: '#888' }}>
                                                        {formatTime(entry.time)}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 text-sm italic" style={{ color: '#333' }}>
                                        Chưa có dữ liệu thi đấu.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="flex justify-center gap-4 py-4">
                            <button
                                onClick={onBack}
                                className="px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-white text-black hover:bg-slate-200 transition-all active:scale-95"
                            >
                                ← Quay Lại
                            </button>
                            {!resetConfirm ? (
                                <button
                                    onClick={() => setResetConfirm(true)}
                                    className="px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
                                    style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#F87171' }}
                                >
                                    🗑 Xóa Tất Cả
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/40 p-2 rounded-xl px-5">
                                    <span className="text-xs font-bold text-red-400">Xóa vĩnh viễn?</span>
                                    <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs">Xác Nhận</button>
                                    <button onClick={() => setResetConfirm(false)} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg text-xs">Hủy</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {viewMode === 'teacher' && !analytics && (
                    <div style={{ ...cardStyle, padding: '32px', textAlign: 'center' }}>
                        <p style={{ color: '#333', fontStyle: 'italic' }}>Chưa có dữ liệu để phân tích.</p>
                        <button
                            onClick={onBack}
                            className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#555' }}
                        >
                            ← Quay Lại
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
