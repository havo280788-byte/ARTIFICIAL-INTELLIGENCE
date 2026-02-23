
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginScreenProps {
  onStart: (name: string, className: string) => void;
  onTeacherStart: () => void;
}

export default function LoginScreen({ onStart, onTeacherStart }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [classFocused, setClassFocused] = useState(false);

  const TEACHER_PIN = '1234';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !className.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    onStart(name, className);
  };

  const handlePinSubmit = () => {
    if (pin === TEACHER_PIN) {
      setPinError('');
      setShowPinDialog(false);
      setPin('');
      onTeacherStart();
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handlePinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePinSubmit();
    if (e.key === 'Escape') {
      setShowPinDialog(false);
      setPin('');
      setPinError('');
    }
  };

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <motion.div
            animate={{ boxShadow: ['0 0 16px rgba(34,211,238,0.4)', '0 0 32px rgba(34,211,238,0.7)', '0 0 16px rgba(34,211,238,0.4)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full border-2 border-[#22D3EE]/40 flex items-center justify-center text-4xl relative"
            style={{ background: 'rgba(34,211,238,0.08)' }}
          >
            🤖
            {/* Outer ring pulse */}
            <span className="absolute inset-0 rounded-full border border-[#22D3EE]/20 scale-110 animate-ping" style={{ animationDuration: '3s' }} />
          </motion.div>
        </div>

        {/* Glass Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, #22D3EE, #6366F1, #8B5CF6, transparent)' }}
          />
          {/* Ambient inner glow */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
          />

          {/* Title */}
          <div className="text-center mb-1">
            <h1
              className="text-4xl font-black tracking-tight uppercase"
              style={{
                background: 'linear-gradient(135deg, #22D3EE 0%, #6366F1 50%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.04em',
              }}
            >
              ENGLISH 12
            </h1>
            <p className="text-[#8B5CF6] font-semibold uppercase tracking-[0.2em] text-xs mt-1">
              Artificial Intelligence
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[#22D3EE] text-xs font-bold uppercase tracking-widest">Reading Challenge</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Subtitle */}
          <p className="text-[#64748B] text-center text-sm mb-6">
            Ready to test your AI reading skills?
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em] mb-2">
                Full Name
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200"
                  style={{ color: nameFocused ? '#22D3EE' : '#475569' }}
                >
                  👤
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[#F1F5F9] placeholder-[#334155] text-sm font-medium outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: nameFocused ? '1.5px solid #22D3EE' : '1.5px solid rgba(255,255,255,0.08)',
                    boxShadow: nameFocused ? '0 0 0 3px rgba(34,211,238,0.12), 0 0 16px rgba(34,211,238,0.08)' : 'none',
                  }}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em] mb-2">
                Class
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200"
                  style={{ color: classFocused ? '#22D3EE' : '#475569' }}
                >
                  🏫
                </span>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  onFocus={() => setClassFocused(true)}
                  onBlur={() => setClassFocused(false)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[#F1F5F9] placeholder-[#334155] text-sm font-medium outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: classFocused ? '1.5px solid #22D3EE' : '1.5px solid rgba(255,255,255,0.08)',
                    boxShadow: classFocused ? '0 0 0 3px rgba(34,211,238,0.12), 0 0 16px rgba(34,211,238,0.08)' : 'none',
                  }}
                  placeholder="e.g. 12A1"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#F87171] text-xs text-center font-medium"
              >
                ⚠ {error}
              </motion.p>
            )}

            {/* START CHALLENGE Button */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 text-white font-black rounded-xl text-base uppercase tracking-[0.12em] flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 55%, #8B5CF6 100%)',
                boxShadow: '0 4px 24px rgba(99,102,241,0.5), 0 0 40px rgba(34,211,238,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.65), 0 0 60px rgba(34,211,238,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.5), 0 0 40px rgba(34,211,238,0.15)';
              }}
            >
              {/* Shimmer */}
              <span
                className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)', backgroundSize: '200% 100%' }}
              />
              <span className="relative flex items-center gap-2">
                ⚡ START CHALLENGE
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
          </form>

          {/* Teacher Button — desktop only */}
          <div className="hidden md:block mt-3">
            <button
              onClick={() => {
                setShowPinDialog(true);
                setPinError('');
                setPin('');
              }}
              className="w-full py-3 rounded-xl text-[#475569] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 hover:text-[#94A3B8]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Teacher
            </button>
          </div>

          {/* Bottom note */}
          <p className="text-center text-[#1E3A5F] text-[10px] mt-4 tracking-wider">
            ENGLISH 12 · AI READING MODULE
          </p>
        </div>
      </motion.div>

      {/* PIN Dialog Overlay */}
      <AnimatePresence>
        {showPinDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(2,8,24,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs relative overflow-hidden"
              style={{
                background: 'rgba(10,15,30,0.95)',
                border: '1px solid rgba(34,211,238,0.2)',
                borderRadius: '24px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(34,211,238,0.1)',
                padding: '28px 24px 24px',
              }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, #22D3EE, transparent)' }}
              />

              <div className="text-center mb-5">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}
                >
                  <svg className="w-6 h-6 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#F1F5F9]">Teacher Access</h3>
                <p className="text-xs text-[#475569] mt-1">Enter PIN to continue</p>
              </div>

              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={handlePinKeyDown}
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-[#F1F5F9] outline-none rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  boxShadow: '0 0 0 0px rgba(34,211,238,0)',
                }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.15)'; e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(34,211,238,0.25)'; }}
                placeholder="••••"
                maxLength={6}
                autoFocus
              />

              {pinError && (
                <p className="text-[#F87171] text-xs text-center mt-2 font-medium">{pinError}</p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
                  className="flex-1 py-2.5 rounded-xl text-[#64748B] text-sm font-semibold transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'; }}
                >
                  Enter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
