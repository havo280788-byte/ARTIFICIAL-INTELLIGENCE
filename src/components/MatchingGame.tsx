
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
        padding: '16px',
        borderRadius: '16px',
        border: '2px solid',
        borderColor: isMatched ? '#10B981' : isSelected ? '#DC2626' : 'rgba(255,255,255,0.06)',
        background: isMatched ? 'rgba(16,185,129,0.08)' : isSelected ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.02)',
        color: isMatched ? '#6EE7B7' : isSelected ? '#F5F5F5' : '#888',
        cursor: isMatched ? 'default' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
        minHeight: '90px',
        opacity: isMatched ? 0.6 : 1,
        boxShadow: isSelected ? '0 0 12px rgba(220,38,38,0.2)' : 'none',
    });

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-3 gap-8">
                {/* Column 1: Images */}
                <div className="space-y-4">
                    <h3 className="text-center font-black text-[#DC2626] uppercase tracking-wider text-base md:text-lg mb-3">Hình Ảnh</h3>
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
                                <img src={item.image} alt="Match" className="w-20 h-20 object-cover rounded-lg shadow-lg" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Column 2: Word Set 1 */}
                <div className="space-y-4">
                    <h3 className="text-center font-black text-[#EF4444] uppercase tracking-wider text-base md:text-lg mb-3">Từ Tiếng Anh</h3>
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
                                className={`text-xl md:text-2xl font-bold ${error && isSelected ? 'animate-shake' : ''}`}
                            >
                                {item.word1}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Column 3: Word Set 2 */}
                <div className="space-y-4">
                    <h3 className="text-center font-black text-[#F87171] uppercase tracking-wider text-base md:text-lg mb-3">Từ Tiếng Việt</h3>
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
                                className={`text-xl md:text-2xl font-bold ${error && isSelected ? 'animate-shake' : ''}`}
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
                    Thử lại! Chưa khớp.
                </motion.div>
            )}

            {matchedIds.length > 0 && matchedIds.length < items.length && (
                <div className="text-center mt-8 text-emerald-400 font-bold">
                    {matchedIds.length} / {items.length} đã ghép
                </div>
            )}
        </div>
    );
}
