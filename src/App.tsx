import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginScreen from './components/LoginScreen';
import GameHeader from './components/GameHeader';
import QuizCard from './components/QuizCard';
import GameOver from './components/GameOver';
import GameWin from './components/GameWin';
import Leaderboard from './components/Leaderboard';
import ReviewMode from './components/ReviewMode';
import { STAGES, getRandomQuestions, Question } from './utils/gameData';

export type AnswerRecord = {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export default function App() {
  const [screen, setScreen] = useState<'login' | 'game' | 'gameover' | 'win' | 'leaderboard' | 'review'>('login');
  const [player, setPlayer] = useState({ name: '', className: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8 * 60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
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
  }, [screen, timeLeft]);

  const handleStart = (name: string, className: string) => {
    setPlayer({ name, className });
    setQuestions(getRandomQuestions());
    setCurrentStage(0);
    setTimeLeft(8 * 60);
    setScore(0);
    setAnswers([]);
    setScreen('game');
  };

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
        const finalScore = score + 1; // current score + this correct answer
        saveToLeaderboard(duration, finalScore, [...answers, record]);
        setScreen('win');
      }
    } else {
      // On incorrect, still move to gameover but record the answer
      const duration = (8 * 60) - timeLeft;
      saveToLeaderboard(duration, score, [...answers, record]);
      setScreen('gameover');
    }
  };

  const saveToLeaderboard = (duration: number, finalScore: number, allAnswers: AnswerRecord[]) => {
    const entry = {
      name: player.name,
      class: player.className,
      time: duration,
      score: finalScore,
      totalQuestions: STAGES.length,
      answers: allAnswers,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const rawData = localStorage.getItem('leaderboardARTIFICIAL INTELLIGENCE');
    let data = rawData ? JSON.parse(rawData) : [];

    if (data.length < 999) {
      data.push(entry);
      localStorage.setItem('leaderboardARTIFICIAL INTELLIGENCE', JSON.stringify(data));
    }
  };

  const elapsedSeconds = (8 * 60) - timeLeft;

  return (
    <div className="font-sans antialiased text-slate-900 bg-[#0F172A] min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen bg-[#0F172A]">
            <GameHeader currentStage={currentStage} timeLeft={timeLeft} />
            <div className="p-3 md:p-5 w-full flex-1">
              <QuizCard
                question={questions[currentStage]}
                stageNum={currentStage + 1}
                onAnswer={handleAnswer}
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
              onRestart={() => setScreen('login')}
              onLeaderboard={() => setScreen('leaderboard')}
              onReview={() => setScreen('review')}
            />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Leaderboard onBack={() => setScreen('login')} />
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReviewMode
              answers={answers}
              questions={questions}
              onBack={() => setScreen('login')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
