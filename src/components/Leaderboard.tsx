
import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Entry {
    name: string;
    class: string;
    time: number;
    date: string;
}

export default function Leaderboard({ onBack }: { onBack: () => void }) {
    const data: Entry[] = useMemo(() => {
        const raw = localStorage.getItem('leaderboardARTIFICIAL INTELLIGENCE');
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw) as Entry[];
            // Sort by time ascending (fastest first)
            return parsed.sort((a, b) => a.time - b.time);
        } catch {
            return [];
        }
    }, []);

    const top10 = data.slice(0, 10);
    const totalEntries = data.length;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
            >
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white">
                    <div className="text-5xl mb-4">🏆</div>
                    <h1 className="text-3xl font-black uppercase tracking-widest">Top 10 Fastest</h1>
                    <p className="text-indigo-100 opacity-80 mt-2">Artificial Intelligence Challenger</p>
                </div>

                <div className="p-8">
                    <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-wider px-4">
                        <span>Rank & Player</span>
                        <div className="flex gap-12">
                            <span>Time</span>
                            <span className="hidden sm:inline">Date</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {top10.length > 0 ? (
                            top10.map((entry, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${index === 0 ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100' :
                                            index === 1 ? 'bg-slate-50 border-slate-200' :
                                                index === 2 ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl ${index === 0 ? 'bg-yellow-400 text-white' :
                                                index === 1 ? 'bg-slate-300 text-white' :
                                                    index === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg">{entry.name}</div>
                                            <div className="text-xs text-slate-400 font-medium">Class: {entry.class}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="font-black text-indigo-600 text-xl">{formatTime(entry.time)}</div>
                                        <div className="hidden sm:block text-slate-400 text-xs font-medium w-24 text-right">
                                            {entry.date}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-slate-400 font-medium italic">
                                No entries yet. Be the first to win!
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-slate-500 font-medium text-sm">
                            {totalEntries >= 999
                                ? "⚠️ FULL LEADERBOARD (999 people)."
                                : `${totalEntries} total achievements recorded.`}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBack}
                            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg hover:bg-slate-800"
                        >
                            Back to Start
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
