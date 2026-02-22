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
import { STAGES, getRandomQuestions, Question } from './utils/gameData';
import { db } from './utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export type AnswerRecord = {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export default function App() {
  const [screen, setScreen] = useState<'login' | 'game' | 'gameover' | 'incorrect' | 'win' | 'leaderboard' | 'review' | 'waiting'>('login');
  const [player, setPlayer] = useState({ name: '', className: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8 * 60);
  const [questions, setQuestions] = useState<Question[]>([]);
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
    setQuestions(getRandomQuestions());
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
    setQuestions(getRandomQuestions());
    setCurrentStage(0);
    setTimeLeft(8 * 60); // not used but reset
    setScore(0);
    setAnswers([]);
    setMode('teacher');
    setScreen('game');
  };

  // Student: handle answer with score/save logic
  const handleAnswer = (selected: string, isCorrect: boolean) => {
    const q = questions[currentStage];
    const record: AnswerRecord = {
      questionId: q.id,
      question: q.question,
      selectedAnswer: selected,
      correctAnswer: q.answer,
      isCorrect
    };
    setAnswers(prev => [...prev, record]);

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (currentStage < STAGES.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        const duration = (8 * 60) - timeLeft;
        const finalScore = score + 1;
        // Only save in student mode
        if (mode === 'student') {
          saveToLeaderboard(duration, finalScore, [...answers, record]);
        }
        setScreen(mode === 'student' ? 'win' : 'login');
      }
    } else {
      // Wrong answer: show incorrect feedback screen
      setScreen('incorrect');
    }
  };

  // Teacher: next question (no scoring)
  const handleTeacherNext = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      // All questions reviewed — go back to login
      setScreen('login');
    }
  };

  const saveToLeaderboard = async (duration: number, finalScore: number, allAnswers: AnswerRecord[]) => {
    const entry = {
      name: player.name,
      class: player.className,
      time: duration,
      score: finalScore,
      totalQuestions: STAGES.length,
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
              <QuizCard
                question={questions[currentStage]}
                stageNum={currentStage + 1}
                onAnswer={handleAnswer}
                mode={mode}
                onNextQuestion={mode === 'teacher' ? handleTeacherNext : undefined}
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

        {screen === 'incorrect' && (
          <motion.div key="incorrect" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="min-h-screen animated-gradient-bg flex flex-col items-center justify-center p-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] to-[#F59E0B]" />
                <div className="text-6xl mb-4">❌</div>
                <h1 className="text-2xl md:text-3xl font-black text-[#DC2626] mb-3 uppercase tracking-tight">
                  Incorrect
                </h1>
                <p className="text-base text-[#64748B] mb-8 leading-relaxed">
                  You should review the passage again.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (currentStage < STAGES.length - 1) {
                      setCurrentStage(prev => prev + 1);
                      setScreen('game');
                    } else {
                      const duration = (8 * 60) - timeLeft;
                      if (mode === 'student') {
                        saveToLeaderboard(duration, score, [...answers]);
                      }
                      setScreen(mode === 'student' ? 'win' : 'login');
                    }
                  }}
                  className="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg text-sm uppercase tracking-widest hover:bg-[#1E293B] transition-colors"
                >
                  ▶ Continue Challenge
                </motion.button>
              </motion.div>
            </div>
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
            <Leaderboard onBack={() => setScreen(mode === 'teacher' ? 'game' : 'login')} />
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReviewMode
              answers={answers}
              questions={questions}
              onBack={() => setScreen(mode === 'teacher' ? 'game' : 'login')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
