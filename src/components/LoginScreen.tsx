
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
      setError('Vui lòng điền đầy đủ thông tin.');
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
      setPinError('Mã PIN không đúng. Vui lòng thử lại.');
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
        className="w-full max-w-xl"
      >
        {/* Title Section - "ĐẤU TRƯỜNG BẢN LĨNH" Style */}
        <div className="text-center mb-8 relative">
          {/* SYSTEM ONLINE tag */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg font-black uppercase tracking-[0.2em] mb-4"
            style={{ 
              color: '#DC2626', 
              textShadow: '0 0 20px rgba(220,38,38,0.5)',
              WebkitTextStroke: '1px rgba(220,38,38,0.3)'
            }}
          >
            VÌ MỘT MÔI TRƯỜNG KHÔNG KHÓI THUỐC
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-orbitron text-flicker"
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: '#F5F5F5',
              textShadow: '0 0 30px rgba(220,38,38,0.3), 0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.05em',
            }}
          >
            ĐẤU TRƯỜNG
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-orbitron"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              background: 'linear-gradient(180deg, #DC2626 0%, #EF4444 50%, #F87171 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(220,38,38,0.5))',
            }}
          >
            BẢN LĨNH
          </motion.h1>

          {/* Subtitle question */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-orbitron mt-5 text-xl md:text-2xl uppercase tracking-wider font-bold"
            style={{
              color: '#FFFFFF',
              textShadow: '0 0 15px rgba(255,255,255,0.3)',
            }}
          >
            SẴN SÀNG QUÉT SẠCH LÀN KHÓI ẢO?
          </motion.p>

          {/* Instruction subtext removed as requested */}
        </div>

        {/* Glass Card */}
        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          {/* Top accent bar - RED */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, #DC2626, #EF4444, #DC2626, transparent)' }}
          />
          {/* Scan line */}
          <div className="scan-line" />
          {/* Ambient inner glow */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.1) 0%, transparent 70%)' }}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#666] uppercase tracking-[0.15em] mb-2">
                Họ và Tên
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200"
                  style={{ color: nameFocused ? '#DC2626' : '#666' }}
                >
                  👤
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  className="w-full pl-12 pr-4 py-5 rounded-xl text-[#F5F5F5] placeholder-[#555] text-xl font-bold outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: nameFocused ? '2px solid #DC2626' : '1.5px solid rgba(255,255,255,0.2)',
                    boxShadow: nameFocused ? '0 0 0 4px rgba(220,38,38,0.2), 0 0 20px rgba(220,38,38,0.1)' : 'none',
                  }}
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-[10px] font-bold text-[#666] uppercase tracking-[0.15em] mb-2">
                Lớp
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200"
                  style={{ color: classFocused ? '#DC2626' : '#444' }}
                >
                  🏫
                </span>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  onFocus={() => setClassFocused(true)}
                  onBlur={() => setClassFocused(false)}
                  className="w-full pl-12 pr-4 py-5 rounded-xl text-[#F5F5F5] placeholder-[#555] text-xl font-bold outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: classFocused ? '2px solid #DC2626' : '1.5px solid rgba(255,255,255,0.2)',
                    boxShadow: classFocused ? '0 0 0 4px rgba(220,38,38,0.2), 0 0 20px rgba(220,38,38,0.1)' : 'none',
                  }}
                  placeholder="VD: 12A1"
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

            {/* KÍCH HOẠT TRÒ CHƠI Button */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-5 text-white font-black rounded-2xl text-lg md:text-xl uppercase tracking-[0.12em] flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #EF4444 100%)',
                boxShadow: '0 4px 24px rgba(220,38,38,0.5), 0 0 40px rgba(220,38,38,0.15)',
                border: '1px solid rgba(220,38,38,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(220,38,38,0.65), 0 0 60px rgba(239,68,68,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(220,38,38,0.5), 0 0 40px rgba(220,38,38,0.15)';
              }}
            >
              {/* Shimmer */}
              <span
                className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)', backgroundSize: '200% 100%' }}
              />
              <span className="relative flex items-center gap-2 font-orbitron text-base md:text-lg">
                KÍCH HOẠT TRÒ CHƠI
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
              className="w-full py-4 rounded-xl text-red-500 text-lg md:text-xl font-bold tracking-[0.1em] flex items-center justify-center gap-3 transition-all duration-200 hover:text-red-400 font-orbitron"
              style={{
                background: 'rgba(220,38,38,0.05)',
                border: '1.5px solid rgba(220,38,38,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.05)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              GIÁO VIÊN
            </button>
          </div>

          {/* Bottom note */}
          <p className="text-center text-[#222] text-[10px] mt-4 tracking-wider uppercase">
            ĐẤU TRƯỜNG BẢN LĨNH · THỬ THÁCH TRÍ TUỆ
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
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
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
                background: 'rgba(15,15,15,0.95)',
                border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '24px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.1)',
                padding: '28px 24px 24px',
              }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, #DC2626, transparent)' }}
              />

              <div className="text-center mb-5">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}
                >
                  <svg className="w-6 h-6 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Truy Cập Giáo Viên</h3>
                <p className="text-xs text-[#555] mt-1">Nhập mã PIN để tiếp tục</p>
              </div>

              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={handlePinKeyDown}
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-[#F5F5F5] outline-none rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  boxShadow: '0 0 0 0px rgba(220,38,38,0)',
                }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.15)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.25)'; }}
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
                  className="flex-1 py-2.5 rounded-xl text-[#666] text-sm font-semibold transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  Hủy
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #991B1B, #DC2626)',
                    boxShadow: '0 4px 16px rgba(220,38,38,0.4)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(220,38,38,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.4)'; }}
                >
                  Xác Nhận
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
