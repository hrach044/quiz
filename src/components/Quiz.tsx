import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Award } from "lucide-react";
import { Question } from "../types";

interface QuizProps {
  token: string;
  onSubmit: (answers: { questionId: number; optionIndex: number }[]) => void;
  onExit: () => void;
}

export default function Quiz({
  token,
  onSubmit,
  onExit,
}: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/api/quiz/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Не удалось загрузить вопросы");
        }
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки вопросов");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [token]);

  const handleSelectOption = async (optionIndex: number) => {
    const currentQuestion = questions[currentIndex];
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionIndex,
    };
    setAnswers(newAnswers);

    let finalQuestionsLength = questions.length;
    const baseQuestionsCount = questions.filter(q => q.id <= 20).length;

    // Check if we just answered the last base question
    if (currentIndex === baseQuestionsCount - 1) {
      try {
        const formattedAnswers = Object.entries(newAnswers)
          .filter(([qId]) => parseInt(qId, 10) <= 20) // only send standard questions for check
          .map(([qId, optIdx]) => ({
            questionId: parseInt(qId, 10),
            optionIndex: optIdx,
          }));

        const res = await fetch("/api/quiz/check-separator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: formattedAnswers }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.needsSeparator && data.separatorQuestion) {
            let updatedQuestions = [...questions];
            const alreadyHas = questions.some(q => q.id === data.separatorQuestion.id);
            if (!alreadyHas) {
              // Ensure we only have standard questions in the first elements, then append separator
              const base = questions.slice(0, baseQuestionsCount);
              updatedQuestions = [...base, data.separatorQuestion];
              setQuestions(updatedQuestions);
            }
            finalQuestionsLength = updatedQuestions.length;
          } else {
            // Remove any separator questions
            const base = questions.slice(0, baseQuestionsCount);
            setQuestions(base);
            finalQuestionsLength = base.length;

            // Remove any separator answers from state
            setAnswers(prev => {
              const cleaned = { ...prev };
              Object.keys(cleaned).forEach(k => {
                if (parseInt(k, 10) >= 100) {
                  delete cleaned[parseInt(k, 10)];
                }
              });
              return cleaned;
            });
          }
        }
      } catch (err) {
        console.error("Failed to check tie-breaker:", err);
      }
    }

    // Auto-advance with a slight delay for better feel
    if (currentIndex < finalQuestionsLength - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Пожалуйста, ответьте на все вопросы перед отправкой!");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([qId, optIdx]) => ({
      questionId: parseInt(qId, 10),
      optionIndex: optIdx as number,
    }));

    onSubmit(formattedAnswers);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Загрузка вопросов теста...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto mt-12">
        <p className="text-rose-200 text-center mb-6">{error}</p>
        <button
          onClick={onExit}
          className="bg-slate-800 text-white px-6 py-2 rounded-xl hover:bg-slate-700 transition"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isSelected = answers[currentQuestion.id] !== undefined;
  const isFinished = Object.keys(answers).length === questions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onExit}
          className="text-slate-400 hover:text-slate-200 flex items-center gap-2 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Выйти из теста
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
          <Award className="w-4 h-4 text-indigo-400" />
          Вопрос <span className="text-white font-bold">{currentIndex + 1}</span> из {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-950/80 rounded-full mb-12 overflow-hidden border border-slate-800/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
        />
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 md:p-8 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentQuestion.options.map((option, idx) => {
                const isOptionSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      isOptionSelected
                        ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/5 text-white"
                        : "bg-slate-950/50 border-slate-800/60 text-slate-300 hover:bg-slate-900/60 hover:border-slate-700/80 hover:text-white"
                    }`}
                  >
                    <span className="text-sm md:text-base pr-4 leading-relaxed">{option.text}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOptionSelected
                          ? "border-indigo-400 bg-indigo-500 text-white scale-110"
                          : "border-slate-700 group-hover:border-slate-500"
                      }`}
                    >
                      {isOptionSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-6 mt-4">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isSelected}
              className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 px-5 py-2.5 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition text-sm font-medium"
            >
              Дальше
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isFinished}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition text-sm"
            >
              Завершить тест
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
