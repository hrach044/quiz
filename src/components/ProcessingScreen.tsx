import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wrench } from "lucide-react";

const LOADING_STATUSES = [
  "Собираем ваши ответы на вопросы...",
  "Разбираем ваши склонности по категориям...",
  "Анализируем баллы по Tech, Analytics, Management и Creative...",
  "Формулируем запрос к ИИ-ассистенту Gemini...",
  "Генерируем детальный психологический портрет...",
  "Готовим список из 5 амбициозных профессиональных ролей...",
  "Финальная сборка вашего персонального отчета..."
];

export default function ProcessingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 z-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Pulsing ring around the spinner */}
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-44 h-44 rounded-full border border-indigo-500/30"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-60 h-60 rounded-full border border-cyan-500/20"
        />

        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Main animated gradient spinner */}
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-transparent border-r-indigo-500 border-l-cyan-400 rounded-full animate-spin" />
          <Wrench className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <div className="max-w-md text-center relative z-10">
        <h3 className="text-2xl font-bold font-display tracking-tight text-white mb-3">
          Анализ результатов
        </h3>
        
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-slate-400 text-sm font-medium tracking-wide"
            >
              {LOADING_STATUSES[statusIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
