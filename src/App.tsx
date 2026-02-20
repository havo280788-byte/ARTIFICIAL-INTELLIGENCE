import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginScreen from './components/LoginScreen';
import GameHeader from './components/GameHeader';
import QuizCard from './components/QuizCard';
import GameOver from './components/GameOver';
import GameWin from './components/GameWin';
import Leaderboard from './components/Leaderboard';
import { STAGES, getRandomQuestions, Question } from './utils/gameData';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'game' | 'gameover' | 'win' | 'leaderboard'>('login');
  const [player, setPlayer] = useState({ name: '', className: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8 * 60); // 8 minutes
  const [questions, setQuestions] = useState<Question[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (screen === 'game' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setScreen('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, timeLeft]); // Added timeLeft to dependency array to ensure effect re-runs if timeLeft changes outside the interval

  const handleStart = (name: string, className: string) => {
    setPlayer({ name, className });
    setQuestions(getRandomQuestions());
    setCurrentStage(0);
    setTimeLeft(8 * 60);
    setScreen('game');
  };

  const handleCorrect = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      const duration = (8 * 60) - timeLeft;
      saveToLeaderboard(duration);
      setScreen('win');
    }
  };

  const handleIncorrect = () => {
    setScreen('gameover');
  };

  const saveToLeaderboard = (duration: number) => {
    const entry = {
      name: player.name,
      class: player.className,
      time: duration,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const rawData = localStorage.getItem('leaderboardARTIFICIAL INTELLIGENCE');
    let data = rawData ? JSON.parse(rawData) : [];

    if (data.length < 999) {
      data.push(entry);
      localStorage.setItem('leaderboardARTIFICIAL INTELLIGENCE', JSON.stringify(data));
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <GameHeader currentStage={currentStage} timeLeft={timeLeft} />
            <div className="p-4 w-full flex justify-center mt-8">
              <QuizCard
                question={questions[currentStage]}
                stageNum={currentStage + 1}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
              />
            </div>
          </motion.div>
        )}

        {screen === 'gameover' && (
          <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameOver onRestart={() => setScreen('login')} />
          </motion.div>
        )}

        {screen === 'win' && (
          <motion.div key="win" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameWin
              playerName={player.name}
              elapsedSeconds={(8 * 60) - timeLeft}
              onRestart={() => setScreen('login')}
              onLeaderboard={() => setScreen('leaderboard')}
            />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Leaderboard onBack={() => setScreen('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
