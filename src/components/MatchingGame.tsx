
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchingItem } from '../utils/gameData';

interface MatchingGameProps {
    items: MatchingItem[];
    onComplete: (score: number) => void;
    mode?: 'student' | 'teacher';
}

export default function MatchingGame({ items, onComplete, mode = 'student' }: MatchingGameProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedWord1, setSelectedWord1] = useState<string | null>(null);
    const [selectedWord2, setSelectedWord2] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<string[]>([]);
    const [error, setError] = useState(false);

    const [shuffledImages, setShuffledImages] = useState<MatchingItem[]>([]);
    const [shuffledWord1s, setShuffledWord1s] = useState<MatchingItem[]>([]);
    const [shuffledWord2s, setShuffledWord2s] = useState<MatchingItem[]>([]);

    useEffect(() => {
        setShuffledImages([...items].sort(() => Math.random() - 0.5));
        setShuffledWord1s([...items].sort(() => Math.random() - 0.5));
        setShuffledWord2s([...items].sort(() => Math.random() - 0.5));
    }, [items]);

    useEffect(() => {
        if (selectedImage && selectedWord1 && selectedWord2) {
            if (selectedImage === selectedWord1 && selectedWord1 === selectedWord2) {
                // Correct match
                setMatchedIds(prev => [...prev, selectedImage]);
                resetSelection();
            } else {
                // Wrong match
                setError(true);
                setTimeout(() => {
                    setError(false);
                    resetSelection();
                }, 1000);
            }
        }
    }, [selectedImage, selectedWord1, selectedWord2]);

    useEffect(() => {
        if (matchedIds.length === items.length && items.length > 0) {
            setTimeout(() => onComplete(items.length), 500);
        }
    }, [matchedIds, items, onComplete]);

    const resetSelection = () => {
        setSelectedImage(null);
        setSelectedWord1(null);
        setSelectedWord2(null);
    };

    const cardStyle = (isSelected: boolean, isMatched: boolean) => ({
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid',
        borderColor: isMatched ? '#10B981' : isSelected ? '#6366F1' : 'rgba(255,255,255,0.1)',
        background: isMatched ? 'rgba(16,185,129,0.1)' : isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
        color: isMatched ? '#6EE7B7' : isSelected ? '#F1F5F9' : '#94A3B8',
        cursor: isMatched ? 'default' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
        minHeight: '80px',
        opacity: isMatched ? 0.6 : 1,
    });

    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <div className="grid grid-cols-3 gap-6">
                {/* Column 1: Images */}
                <div className="space-y-4">
                    <h3 className="text-center font-bold text-sky-400 uppercase tracking-wider text-sm mb-2">Images</h3>
                    {shuffledImages.map(item => {
                        const isMatched = matchedIds.includes(item.id);
                        const isSelected = selectedImage === item.id;
                        return (
                            <motion.div
                                key={`img-${item.id}`}
                                whileHover={!isMatched ? { scale: 1.02, x: 2 } : {}}
                                whileTap={!isMatched ? { scale: 0.98 } : {}}
                                onClick={() => !isMatched && setSelectedImage(item.id)}
                                style={cardStyle(isSelected, isMatched)}
                                className={error && isSelected ? 'animate-shake' : ''}
                            >
                                <img src={item.image} alt="Match" className="w-16 h-16 object-cover rounded-lg shadow-lg" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Column 2: Word Set 1 */}
                <div className="space-y-4">
                    <h3 className="text-center font-bold text-indigo-400 uppercase tracking-wider text-sm mb-2">Word Set 1</h3>
                    {shuffledWord1s.map(item => {
                        const isMatched = matchedIds.includes(item.id);
                        const isSelected = selectedWord1 === item.id;
                        return (
                            <motion.div
                                key={`w1-${item.id}`}
                                whileHover={!isMatched ? { scale: 1.02, x: 2 } : {}}
                                whileTap={!isMatched ? { scale: 0.98 } : {}}
                                onClick={() => !isMatched && setSelectedWord1(item.id)}
                                style={cardStyle(isSelected, isMatched)}
                                className={`text-lg font-bold ${error && isSelected ? 'animate-shake' : ''}`}
                            >
                                {item.word1}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Column 3: Word Set 2 */}
                <div className="space-y-4">
                    <h3 className="text-center font-bold text-purple-400 uppercase tracking-wider text-sm mb-2">Word Set 2</h3>
                    {shuffledWord2s.map(item => {
                        const isMatched = matchedIds.includes(item.id);
                        const isSelected = selectedWord2 === item.id;
                        return (
                            <motion.div
                                key={`w2-${item.id}`}
                                whileHover={!isMatched ? { scale: 1.02, x: 2 } : {}}
                                whileTap={!isMatched ? { scale: 0.98 } : {}}
                                onClick={() => !isMatched && setSelectedWord2(item.id)}
                                style={cardStyle(isSelected, isMatched)}
                                className={`text-lg font-bold ${error && isSelected ? 'animate-shake' : ''}`}
                            >
                                {item.word2}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-8 text-red-400 font-bold"
                >
                    Try again! Not a match.
                </motion.div>
            )}

            {matchedIds.length > 0 && matchedIds.length < items.length && (
                <div className="text-center mt-8 text-emerald-400 font-bold">
                    {matchedIds.length} / {items.length} matched
                </div>
            )}
        </div>
    );
}
