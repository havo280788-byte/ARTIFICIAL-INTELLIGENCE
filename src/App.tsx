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

import { STAGES, QUESTIONS, Question } from './utils/gameData';
import { db } from './utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export type AnswerRecord = {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
};

export default function App() {
  const [screen, setScreen] = useState<'login' | 'game' | 'gameover' | 'win' | 'leaderboard' | 'review' | 'waiting'>('login');
  const [player, setPlayer] = useState({ name: '', className: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  // Timer removed as requested
  const timerRef = useRef<any>(null);

  // Student start
  const handleStart = (name: string, className: string) => {
    setPlayer({ name, className });
    setCurrentStage(0);
    setScore(0);
    setAnswers([]);
    setMode('student');
    setScreen('game');
  };

  // Teacher start (no name/class needed, no timer)
  const handleTeacherStart = () => {
    setPlayer({ name: 'Teacher', className: '' });
    setCurrentStage(0);
    setScore(0);
    setAnswers([]);
    setMode('teacher');
    setScreen('game');
  };

  // handleComplete removed as logic is now in QuizCard callback

  const saveToLeaderboard = async (duration: number, finalScore: number, allAnswers: any[]) => {
    const entry = {
      name: player.name,
      class: player.className,
      time: duration,
      score: finalScore,
      totalQuestions: QUESTIONS.length,
      answers: allAnswers,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      await addDoc(collection(db, 'leaderboard'), entry);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    }
  };

  // Timer logic removed

  return (
    <div className="font-sans antialiased text-slate-900 bg-[#000000] min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onStart={handleStart} onTeacherStart={handleTeacherStart} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen bg-[#000000]">
            <GameHeader
              currentStage={currentStage}
              mode={mode}
              onShowLeaderboard={mode === 'teacher' ? () => setScreen('leaderboard') : undefined}
              onShowReview={mode === 'teacher' ? () => setScreen('review') : undefined}
            />
            <div className="p-3 md:p-5 w-full flex-1 overflow-auto">
              <QuizCard
                question={QUESTIONS[currentStage]}
                stageNum={currentStage + 1}
                onAnswer={(selected, isCorrect, retryUsed) => {
                  const record = { 
                    questionId: QUESTIONS[currentStage].id, 
                    selectedAnswer: selected,
                    isCorrect 
                  };
                  setAnswers(prev => [...prev, record]);
                  
                  // Scoring: 100 for first-try correct, 50 for second-try correct
                  let points = 0;
                  if (isCorrect) {
                    points = retryUsed ? 50 : 100;
                  }
                  setScore(s => s + points);
                  
                  // Progress to next stage or finish
                  const currentFinalScore = score + points;
                  setTimeout(() => {
                    if (currentStage < STAGES.length - 1) {
                      setCurrentStage(prev => prev + 1);
                    } else {
                      saveToLeaderboard(0, currentFinalScore, [...answers, record]);
                      setScreen(mode === 'student' ? 'win' : 'login');
                    }
                  }, 1500);
                }}
                mode={mode}
                onNextQuestion={() => {
                   if (currentStage < STAGES.length - 1) {
                      setCurrentStage(prev => prev + 1);
                    } else {
                      setScreen(mode === 'student' ? 'win' : 'login');
                    }
                }}
              />
            </div>
          </motion.div>
        )}


        {screen === 'gameover' && (
          <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameOver
              score={score}
              totalQuestions={STAGES.length * 100}
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
              totalQuestions={STAGES.length * 100}
              elapsedSeconds={0}
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
              questions={QUESTIONS}
              onBack={() => setScreen(mode === 'teacher' ? 'game' : 'win')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
