
import React from 'react';
import { motion } from 'framer-motion';

export default function GameOver({ onRestart }: { onRestart: () => void }) {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-8xl mb-8">😵</div>
                <h1 className="text-6xl font-black text-red-500 mb-4 tracking-tighter">
                    INCORRECT.
                </h1>
                <p className="text-slate-400 text-xl mb-12">
                    Better luck next time! Review your AI knowledge and try again.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRestart}
                    className="w-full py-5 bg-white text-slate-900 font-black text-2xl rounded-2xl shadow-xl uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                    PLAY AGAIN!
                </motion.button>
            </motion.div>
        </div>
    );
}
