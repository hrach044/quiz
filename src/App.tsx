import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wrench, Code, BarChart3, Users, Palette, Compass, LogOut } from "lucide-react";
import LoginRegister from "./components/LoginRegister";
import Quiz from "./components/Quiz";
import ResultView from "./components/ResultView";
import ProcessingScreen from "./components/ProcessingScreen";
import { CareerResult } from "./types";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("career_quiz_token"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("career_quiz_email"));
  const [appState, setAppState] = useState<"loading" | "auth" | "dashboard" | "quiz" | "processing">("loading");
  const [result, setResult] = useState<CareerResult | null>(null);

  // 1. Validate auth token on mount
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setAppState("auth");
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();
        setEmail(data.user.email);
        localStorage.setItem("career_quiz_email", data.user.email);

        // Fetch user's previous quiz results
        const stateRes = await fetch("/api/quiz/state", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const stateData = await stateRes.json();

        if (stateData.hasResult && stateData.result) {
          setResult(stateData.result);
          setAppState("dashboard");
        } else {
          setAppState("dashboard"); // Let user click "Start Test" on dashboard
        }
      } catch (err) {
        handleLogout();
      }
    }

    checkAuth();
  }, [token]);

  const handleAuthSuccess = (newToken: string, userEmail: string) => {
    localStorage.setItem("career_quiz_token", newToken);
    localStorage.setItem("career_quiz_email", userEmail);
    setToken(newToken);
    setEmail(userEmail);
  };

  const handleLogout = () => {
    localStorage.removeItem("career_quiz_token");
    localStorage.removeItem("career_quiz_email");
    setToken(null);
    setEmail(null);
    setResult(null);
    setAppState("auth");
  };

  const handleStartQuiz = () => {
    setAppState("quiz");
  };

  const handleRestartQuiz = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/quiz/restart", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setResult(null);
        setAppState("quiz");
      }
    } catch (err) {
      console.error("Failed to reset quiz:", err);
    }
  };

  const handleSubmitQuiz = async (formattedAnswers: { questionId: number; optionIndex: number }[]) => {
    setAppState("processing");
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ошибка отправки результатов");
      }

      setResult(data);
      setAppState("dashboard");
    } catch (err: any) {
      alert(`Ошибка при обработке результатов: ${err.message || "Ошибка соединения с сервером"}`);
      setAppState("quiz");
    }
  };

  if (appState === "loading") {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-mono">Проверка авторизации...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 relative overflow-x-hidden">
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 pointer-events-none" />

      <AnimatePresence mode="wait">
        {appState === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginRegister onAuthSuccess={handleAuthSuccess} />
          </motion.div>
        )}

        {appState === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingScreen />
          </motion.div>
        )}

        {appState === "quiz" && token && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            <Quiz
              token={token}
              onSubmit={handleSubmitQuiz}
              onExit={() => setAppState("dashboard")}
            />
          </motion.div>
        )}

        {appState === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            {result ? (
              <ResultView
                result={result}
                onRestart={handleRestartQuiz}
                onLogout={handleLogout}
              />
            ) : (
              // Welcome Screen if quiz hasn't been taken
              <div className="max-w-4xl mx-auto px-4">
                {/* Header bar */}
                <div className="flex justify-between items-center mb-12 border-b border-slate-800/60 pb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white font-display tracking-tight text-lg">
                      Career Path Finder
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm hidden sm:inline font-mono">
                      {email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-rose-400 flex items-center gap-1.5 text-sm font-medium transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </div>

                {/* Welcome Card */}
                <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 md:p-12 relative overflow-hidden text-center max-w-2xl mx-auto shadow-2xl">
                  {/* Glowing background */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="p-4 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-6 inline-flex animate-pulse">
                    <Wrench className="w-10 h-10 text-white animate-spin" style={{ animationDuration: "12s" }} />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                    Найдите свое истинное призвание
                  </h1>
                  
                  <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-md mx-auto">
                    Пройдите профессиональный тест из 6 вопросов, чтобы определить свои сильные стороны в четырех ключевых сферах рынка труда.
                  </p>

                  {/* 4 Spheres Icons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-center max-w-lg mx-auto">
                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 flex flex-col items-center">
                      <Code className="w-6 h-6 text-indigo-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-300">Tech</span>
                    </div>
                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 flex flex-col items-center">
                      <BarChart3 className="w-6 h-6 text-emerald-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-300">Analytics</span>
                    </div>
                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 flex flex-col items-center">
                      <Users className="w-6 h-6 text-amber-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-300">Management</span>
                    </div>
                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 flex flex-col items-center">
                      <Palette className="w-6 h-6 text-rose-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-300">Creative</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-indigo-500/25 transition active:scale-[0.98] cursor-pointer text-base"
                  >
                    Начать тестирование
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
