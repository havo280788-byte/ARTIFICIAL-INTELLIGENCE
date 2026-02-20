
import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function LoginScreen({ onStart }: { onStart: () => void }) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !className.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Ocean Guardian
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white"
            placeholder="Enter your name"
          />

          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white"
            placeholder="Enter your class"
          />

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg text-lg uppercase"
          >
            Start Adventure
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
