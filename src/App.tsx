import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginScreen from './components/LoginScreen';
import GameHeader from './components/GameHeader';
import QuizCard from './components/QuizCard';
import GameOver from './components/GameOver';
import GameWin from './components/GameWin';
import Leaderboard from './components/Leaderboard';
import ReviewMode from './components/ReviewMode';
import WaitingScreen from './components/WaitingScreen';

import { STAGES, getItemsForStage, MatchingItem } from './utils/gameData';
import { db } from './utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import MatchingGame from './components/MatchingGame';

export type AnswerRecord = {
  questionId: string;
  isCorrect: boolean;
};

export default function App() {
  const [screen, setScreen] = useState<'login' | 'game' | 'gameover' | 'win' | 'leaderboard' | 'review' | 'waiting'>('login');
  const [player, setPlayer] = useState({ name: '', className: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8 * 60);
  const [items, setItems] = useState<MatchingItem[]>([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  const timerRef = useRef<any>(null);

  // Timer: only runs in student mode
  useEffect(() => {
    if (screen === 'game' && timeLeft > 0 && mode === 'student') {
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
  }, [screen, timeLeft, mode]);

  // Student start
  const handleStart = (name: string, className: string) => {
    setPlayer({ name, className });
    const initialItems = getItemsForStage(1);
    setItems(initialItems);
    setCurrentStage(0);
    setTimeLeft(8 * 60);
    setScore(0);
    setAnswers([]);
    setMode('student');
    setScreen('game');
  };

  // Teacher start (no name/class needed, no timer)
  const handleTeacherStart = () => {
    setPlayer({ name: 'Teacher', className: '' });
    const initialItems = getItemsForStage(1);
    setItems(initialItems);
    setCurrentStage(0);
    setTimeLeft(8 * 60); // not used but reset
    setScore(0);
    setAnswers([]);
    setMode('teacher');
    setScreen('game');
  };

  // All matched in current stage
  const handleComplete = (points: number) => {
    setScore(prev => prev + points);

    if (currentStage < STAGES.length - 1) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setItems(getItemsForStage(nextStage + 1));
    } else {
      const duration = (8 * 60) - timeLeft;
      const finalScore = score + points;

      if (mode === 'student') {
        saveToLeaderboard(duration, finalScore, []);
      }
      setScreen(mode === 'student' ? 'win' : 'login');
    }
  };

  const saveToLeaderboard = async (duration: number, finalScore: number, allAnswers: any[]) => {
    const entry = {
      name: player.name,
      class: player.className,
      time: duration,
      score: finalScore,
      totalQuestions: items.length,
      answers: allAnswers,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      await addDoc(collection(db, 'leaderboard'), entry);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    }
  };

  const elapsedSeconds = (8 * 60) - timeLeft;

  return (
    <div className="font-sans antialiased text-slate-900 bg-[#0F172A] min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onStart={handleStart} onTeacherStart={handleTeacherStart} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen bg-[#0F172A]">
            <GameHeader
              currentStage={currentStage}
              timeLeft={timeLeft}
              mode={mode}
              onShowLeaderboard={mode === 'teacher' ? () => setScreen('leaderboard') : undefined}
              onShowReview={mode === 'teacher' ? () => setScreen('review') : undefined}
            />
            <div className="p-3 md:p-5 w-full flex-1">
              <MatchingGame
                items={items}
                onComplete={handleComplete}
                mode={mode}
              />
            </div>
          </motion.div>
        )}


        {screen === 'gameover' && (
          <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameOver
              score={score}
              totalQuestions={STAGES.length}
              onRestart={() => setScreen('login')}
              onLeaderboard={() => setScreen('leaderboard')}
              onReview={() => setScreen('review')}
            />
          </motion.div>
        )}

        {screen === 'win' && (
          <motion.div key="win" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameWin
              playerName={player.name}
              score={score}
              totalQuestions={STAGES.length}
              elapsedSeconds={elapsedSeconds}
              mode={mode}
              onRestart={() => setScreen('login')}
              onLeaderboard={() => setScreen('leaderboard')}
              onReview={() => setScreen('review')}
              onWaiting={() => setScreen('waiting')}
            />
          </motion.div>
        )}

        {screen === 'waiting' && (
          <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <WaitingScreen />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Leaderboard
              onBack={() => setScreen(mode === 'teacher' ? 'game' : 'win')}
              currentPlayerName={mode === 'student' ? player.name : undefined}
              onViewMyAttempt={mode === 'student' ? () => setScreen('review') : undefined}
            />
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReviewMode
              answers={answers}
              questions={[]}
              onBack={() => setScreen(mode === 'teacher' ? 'game' : 'win')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
