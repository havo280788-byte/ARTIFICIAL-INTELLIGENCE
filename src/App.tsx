
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
      <AnimatePresence mode="wait">
        {!started && (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onStart={() => setStarted(true)} />
          </motion.div>
        )}
        {started && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
              Game Ready – You can now extend this inside Antigravity 🚀
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
