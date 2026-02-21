
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginScreen({ onStart }: { onStart: (name: string, className: string) => void }) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !className.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    onStart(name, className);
  };

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#1E293B] border-4 border-[#22D3EE]/30 flex items-center justify-center text-4xl shadow-lg shadow-[#22D3EE]/20">
            🤖
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Accent bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]" />

          {/* Titles */}
          <h1 className="text-3xl font-black text-[#0F172A] text-center tracking-tight uppercase">
            ENGLISH 12
          </h1>
          <h2 className="text-xl font-bold text-[#334155] text-center mt-1 uppercase tracking-wide">
            Artificial Intelligence
          </h2>
          <p className="text-[#22D3EE] text-center mt-2 font-medium text-sm">
            Reading Challenge
          </p>

          {/* Subtitle */}
          <p className="text-[#64748B] text-center mt-4 text-sm">
            Ready to test your knowledge?
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 focus:border-[#22D3EE] transition-all"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                Class
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">📖</span>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 focus:border-[#22D3EE] transition-all"
                  placeholder="e.g. 11A1"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold rounded-xl shadow-lg shadow-[#6366F1]/30 text-lg uppercase tracking-wider flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-[#6366F1]/40 transition-shadow"
            >
              START CHALLENGE
              <span className="text-xl">▶</span>
            </motion.button>
          </form>

          {/* Settings link */}
          <div className="text-center mt-5">
            <span className="text-[#94A3B8] text-sm cursor-pointer hover:text-[#64748B] transition-colors">
              ⚙️ Settings
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
