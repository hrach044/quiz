import React from "react";
import { motion } from "motion/react";
import {
  Code,
  BarChart3,
  Users,
  Palette,
  RotateCcw,
  LogOut,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Lightbulb,
  Briefcase,
  Compass,
  CheckCircle2,
  Target
} from "lucide-react";
import { CareerResult } from "../types";

interface ResultViewProps {
  result: CareerResult;
  onRestart: () => void;
  onLogout: () => void;
}

const CATEGORY_META: Record<
  string,
  {
    title: string;
    icon: React.ComponentType<any>;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    desc: string;
  }
> = {
  tech: {
    title: "Технологии и инженерия (Tech)",
    icon: Code,
    colorClass: "text-indigo-400 bg-indigo-500/10",
    bgClass: "bg-indigo-600",
    borderClass: "border-indigo-500/30",
    desc: "Ваш сильный конек — системное мышление, проектирование архитектур, автоматизация процессов и непосредственная разработка сложных технических решений."
  },
  analytics: {
    title: "Аналитика и данные (Analytics)",
    icon: BarChart3,
    colorClass: "text-emerald-400 bg-emerald-500/10",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30",
    desc: "Вы прирожденный исследователь. Вам нравится находить скрытые закономерности, исследовать аномалии в данных и превращать хаос в ценные выводы."
  },
  management: {
    title: "Управление и организация (Management)",
    icon: Users,
    colorClass: "text-amber-400 bg-amber-500/10",
    bgClass: "bg-amber-500",
    borderClass: "border-amber-500/30",
    desc: "Ваша суперсила — лидерство, организация командной работы, распределение зон ответственности и нахождение оптимальных путей достижения целей."
  },
  creative: {
    title: "Креатив и дизайн (Creative)",
    icon: Palette,
    colorClass: "text-rose-400 bg-rose-500/10",
    bgClass: "bg-rose-500",
    borderClass: "border-rose-500/30",
    desc: "Вы мыслите нестандартно. Создание концепций, проработка визуальной идентичности, генерация креативных идей и эмоциональная подача проектов — ваша стихия."
  }
};

// Extremely robust and simple custom markdown formatter to render bold, bullet points, and headings perfectly
function renderCustomMarkdown(text: string) {
  if (!text) return null;
  
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    
    // Header 3
    if (cleanLine.startsWith("###")) {
      return (
        <h4 key={idx} className="text-lg font-bold text-slate-100 mt-6 mb-2 tracking-tight">
          {cleanLine.replace("###", "").trim()}
        </h4>
      );
    }
    // Header 2
    if (cleanLine.startsWith("##")) {
      return (
        <h3 key={idx} className="text-xl font-bold text-indigo-300 mt-8 mb-3 tracking-tight border-b border-slate-800 pb-2">
          {cleanLine.replace("##", "").trim()}
        </h3>
      );
    }
    // Header 1
    if (cleanLine.startsWith("#")) {
      return (
        <h2 key={idx} className="text-2xl font-bold text-white mt-10 mb-4 tracking-tight">
          {cleanLine.replace("#", "").trim()}
        </h2>
      );
    }
    // Bullet list item
    if (cleanLine.startsWith("*") || cleanLine.startsWith("-")) {
      const content = cleanLine.substring(1).trim();
      return (
        <li key={idx} className="text-slate-300 text-sm md:text-base mb-2.5 list-disc ml-5 leading-relaxed">
          {parseInlineFormatting(content)}
        </li>
      );
    }
    
    // Empty line
    if (!cleanLine) {
      return <div key={idx} className="h-4" />;
    }
    
    // Regular paragraph
    return (
      <p key={idx} className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
        {parseInlineFormatting(cleanLine)}
      </p>
    );
  });
}

function parseInlineFormatting(text: string) {
  const parts = [];
  let currentIdx = 0;
  
  // Basic helper to render **bold** statements
  while (currentIdx < text.length) {
    const boldStart = text.indexOf("**", currentIdx);
    if (boldStart === -1) {
      parts.push(text.substring(currentIdx));
      break;
    }
    
    if (boldStart > currentIdx) {
      parts.push(text.substring(currentIdx, boldStart));
    }
    
    const boldEnd = text.indexOf("**", boldStart + 2);
    if (boldEnd === -1) {
      parts.push(text.substring(boldStart));
      break;
    }
    
    parts.push(
      <strong key={boldStart} className="font-bold text-white">
        {text.substring(boldStart + 2, boldEnd)}
      </strong>
    );
    
    currentIdx = boldEnd + 2;
  }
  
  return parts;
}

function renderLegacyPrettyProfile(text: string) {
  if (!text) return null;

  // Clean up initial quotes if any
  let cleanText = text.replace(/^["'«\s]+|["'»\s]+$/g, '').trim();
  if (cleanText.startsWith("Профессиональный профиль")) {
    cleanText = cleanText.replace("Профессиональный профиль", "").trim();
  }

  // Split into sentences using a regex that handles Russian punctuation
  const rawSentences = cleanText.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);

  // Deduplicate sentences (normalized comparison)
  const sentences: string[] = [];
  const seen = new Set<string>();
  for (const s of rawSentences) {
    const norm = s.toLowerCase().replace(/[^a-zа-я0-9]/g, "");
    if (!seen.has(norm)) {
      seen.add(norm);
      sentences.push(s);
    }
  }

  const portrait: string[] = [];
  const strengths: string[] = [];
  const advice: string[] = [];
  const motivation: string[] = [];

  const strengthKeywords = ["сила", "сильные стороны", "сильной стороной", "ценят", "умеете", "способность", "способны", "склонны", "склонность", "отличает", "преимущество", "баланс", "сочетает", "талант"];
  const adviceKeywords = ["рекомендуется", "рекомендация", "совет", "фокусироваться", "направьте", "развитие", "развивайте", "инвестирование", "изменяйте", "изучайте", "стремитесь", "ориентируетесь", "важно понимать", "проектируйте", "создавайте", "стройте", "улучшайте", "оптимизируйте", "используйте", "начните", "начинайте"];
  const motivationKeywords = ["желаем", "удачи", "успехов", "побед", "свершений", "верим", "получится", "действуйте", "смело", "вперед", "шедевр", "лучший", "верьте", "счастливы", "вдохновляйтесь", "поздравляем", "верны", "гордитесь", "растите", "преодолевайте", "экспертом", "доверяйте", "лидером", "призвание", "судьбы", "высоте", "звездам", "легендарным", "профессионалом", "поздравляем"];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const isShortExclamation = sentence.endsWith("!") && sentence.length < 50;

    if (motivationKeywords.some(kw => lower.includes(kw)) || isShortExclamation) {
      motivation.push(sentence);
    } else if (adviceKeywords.some(kw => lower.includes(kw))) {
      advice.push(sentence);
    } else if (strengthKeywords.some(kw => lower.includes(kw))) {
      strengths.push(sentence);
    } else {
      portrait.push(sentence);
    }
  }

  // Cap lengths for perfect UI aesthetics & to prevent visual clutter
  const cappedPortrait = portrait.slice(0, 4).join(" ");
  const cappedStrengths = strengths.slice(0, 5);
  const cappedAdvice = advice.slice(0, 5);
  const cappedMotivation = motivation.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Психологический портрет */}
      {cappedPortrait && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Профессиональный портрет
          </div>
          <p className="text-slate-200 text-base md:text-lg leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 py-1">
            "{cappedPortrait}"
          </p>
        </motion.div>
      )}

      {/* 2. Ключевые сильные стороны */}
      {cappedStrengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 mb-5 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
            <Target className="w-4 h-4" />
            Ваши сильные стороны
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cappedStrengths.map((strength, idx) => (
              <div key={idx} className="p-4 bg-slate-950/30 border border-slate-800/40 rounded-xl flex items-start gap-3 hover:border-slate-800 transition">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-relaxed">{strength}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Советы по развитию и шаги */}
      {cappedAdvice.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 mb-5 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
            <Lightbulb className="w-4 h-4" />
            Рекомендации по развитию
          </div>
          <div className="space-y-4">
            {cappedAdvice.map((adv, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-950/20 rounded-xl border border-slate-800/20 hover:border-slate-800/50 transition">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">{adv}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. Вдохновение и мотивация */}
      {cappedMotivation.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 md:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900/40 via-indigo-950/5 to-slate-900/40 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="flex items-center gap-2.5 mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
            <Compass className="w-4 h-4" />
            Вдохновение и мотивация
          </div>
          <div className="flex flex-wrap gap-2.5">
            {cappedMotivation.map((mot, idx) => (
              <span
                key={idx}
                className="px-4 py-2.5 bg-indigo-500/5 border border-indigo-500/10 text-indigo-200 text-sm font-medium rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/20 transition duration-200"
              >
                {mot}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ResultView({ result, onRestart, onLogout }: ResultViewProps) {
  const meta = CATEGORY_META[result.primaryCategory] || CATEGORY_META.tech;
  const ActiveIcon = meta.icon;

  // Find max possible scores for normalizing visual progress bars
  const totalPoints = result.scores.tech + result.scores.analytics + result.scores.management + result.scores.creative;
  const getPercentage = (val: number) => {
    if (totalPoints === 0) return 0;
    return Math.round((val / totalPoints) * 100);
  };

  const formattedDate = new Date(result.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Helper to extract fields safely supporting both snake_case and camelCase
  const getSafeField = (obj: any, keys: string[]) => {
    if (!obj) return null;
    for (const key of keys) {
      if (obj[key] !== undefined) return obj[key];
    }
    return null;
  };

  // Try to parse aiExplanation as JSON
  let parsedExplanation: any = null;
  try {
    if (result.aiExplanation && typeof result.aiExplanation === "string") {
      const trimmed = result.aiExplanation.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        parsedExplanation = JSON.parse(trimmed);
      }
    }
  } catch (err) {
    console.warn("Could not parse aiExplanation as JSON, falling back to markdown", err);
  }

  const isJson = parsedExplanation !== null;

  // Extracted structured fields
  const leadingSphere = isJson
    ? (parsedExplanation.summary?.leading_sphere || parsedExplanation.summary?.leadingSphere || meta.title)
    : meta.title;

  const profileDescription = isJson
    ? (getSafeField(parsedExplanation.summary || parsedExplanation, ["profile_description", "profileDescription", "description"]) || "")
    : "";

  const strengths = isJson
    ? (getSafeField(parsedExplanation, ["strengths", "strength", "strong_points", "strongPoints"]) || [])
    : [];

  const idealRoles = isJson
    ? (getSafeField(parsedExplanation, ["ideal_roles", "idealRoles", "roles"]) || [])
    : [];

  const topProfessions = isJson
    ? (getSafeField(parsedExplanation, ["top_5_professions", "top5Professions", "top_professions", "professions", "jobs"]) || [])
    : [];

  const devAdvice = isJson
    ? (getSafeField(parsedExplanation, ["development_advice", "developmentAdvice", "advice", "recommendations"]) || [])
    : [];

  const actionPlan = isJson
    ? (getSafeField(parsedExplanation, ["action_plan", "actionPlan", "steps", "plan"]) || [])
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
      {/* Background glow effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-20 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Profile Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-8 mb-10">
        <div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-2 font-mono">
            <Calendar className="w-4 h-4 text-slate-500" />
            Отчет от {formattedDate}
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight leading-none">
            Ваш карьерный разбор
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти заново
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-rose-950/20 hover:bg-rose-900/20 border border-rose-900/30 hover:border-rose-900/50 text-rose-300 px-5 py-3 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Scoring Panels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Category Banner Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-6 rounded-2xl border ${meta.borderClass} bg-slate-900/30 backdrop-blur-md relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3.5 rounded-xl ${meta.colorClass}`}>
                <ActiveIcon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Ведущее направление</span>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {isJson ? leadingSphere : meta.title}
                </h2>
              </div>
            </div>
            
            <p className="text-sm md:text-base text-slate-300 leading-relaxed mt-4">
              {meta.desc}
            </p>
          </motion.div>

          {/* Scores Breakdown Meters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 font-mono">
              Разбивка по направлениям
            </h3>

            <div className="space-y-6">
              {/* Tech */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    <span className="text-slate-300">Технологии</span>
                  </div>
                  <span className="text-white font-mono font-bold">{result.scores.tech} баллов ({getPercentage(result.scores.tech)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/40">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${getPercentage(result.scores.tech)}%` }}
                  />
                </div>
              </div>

              {/* Analytics */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Аналитика</span>
                  </div>
                  <span className="text-white font-mono font-bold">{result.scores.analytics} баллов ({getPercentage(result.scores.analytics)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/40">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${getPercentage(result.scores.analytics)}%` }}
                  />
                </div>
              </div>

              {/* Management */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">Управление</span>
                  </div>
                  <span className="text-white font-mono font-bold">{result.scores.management} баллов ({getPercentage(result.scores.management)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/40">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                    style={{ width: `${getPercentage(result.scores.management)}%` }}
                  />
                </div>
              </div>

              {/* Creative */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-rose-400" />
                    <span className="text-slate-300">Креатив</span>
                  </div>
                  <span className="text-white font-mono font-bold">{result.scores.creative} баллов ({getPercentage(result.scores.creative)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/40">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: `${getPercentage(result.scores.creative)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Insights & Next Steps */}
        <div className="lg:col-span-7 space-y-6">
          {isJson ? (
            // BEAUTIFULLY STYLED RICH DASHBOARD FOR PARSED JSON RESULTS
            <div className="space-y-6">
              {/* Profile Description Section */}
              {profileDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md relative overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                    <Sparkles className="w-4 h-4" />
                    Профессиональный профиль
                  </div>
                  <div className="text-slate-200 text-base leading-relaxed italic border-l-2 border-indigo-500/60 pl-4 py-1">
                    "{profileDescription}"
                  </div>
                </motion.div>
              )}

              {/* Strengths Grid */}
              {strengths && strengths.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 mb-5 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                    <Target className="w-4 h-4" />
                    Ключевые сильные стороны
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strengths.map((strength: string, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-950/30 border border-slate-800/40 rounded-xl flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 leading-relaxed">{strength}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Ideal Roles Chips */}
              {idealRoles && idealRoles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                    <Compass className="w-4 h-4" />
                    Ролевой паттерн
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {idealRoles.map((role: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-slate-950/50 border border-slate-800/80 text-slate-200 text-sm font-medium rounded-full hover:border-slate-700 transition"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Top 5 Professions Cards */}
              {topProfessions && topProfessions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 mb-5 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                    <Briefcase className="w-4 h-4" />
                    Подходящие профессии (Топ-5)
                  </div>
                  <div className="space-y-3">
                    {topProfessions.map((prof: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/60 hover:border-indigo-500/20 rounded-xl transition-all duration-200 flex items-start gap-4 group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-200 text-sm md:text-base font-semibold">
                            {prof}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 transition" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Development Advice */}
              {devAdvice && devAdvice.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 mb-5 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                    <Lightbulb className="w-4 h-4" />
                    Рекомендации по развитию
                  </div>
                  <div className="space-y-3.5">
                    {devAdvice.map((advice: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 animate-pulse" />
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">{advice}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step-by-Step Action Plan (Visual Timeline) */}
              {actionPlan && actionPlan.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 mb-8 text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                    <Users className="w-4 h-4" />
                    Пошаговый план действий
                  </div>
                  
                  <div className="relative pl-6 md:pl-8 border-l border-slate-800/80 space-y-8 py-2">
                    {actionPlan.map((stepItem: any, idx: number) => {
                      const stepNum = stepItem.step || (idx + 1);
                      const title = stepItem.title || stepItem.step_name || `Этап ${stepNum}`;
                      const description = stepItem.description || stepItem.desc || "";

                      return (
                        <div key={idx} className="relative">
                          {/* Circle indicator on line */}
                          <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-full border border-slate-950 bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 text-[10px] md:text-xs font-bold shadow-lg shadow-indigo-500/20">
                            {stepNum}
                          </div>
                          
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-white tracking-tight mb-2">
                              {title}
                            </h4>
                            {description && (
                              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // GRACEFUL FALLBACK TO PRETTY STRUCTURED RENDERER FOR RAW TEXT / LEGACY ANSWERS
            renderLegacyPrettyProfile(result.aiExplanation)
          )}
        </div>
      </div>
    </div>
  );
}
