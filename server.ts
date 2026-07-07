import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  hashPassword,
  initDatabase,
  getUserByEmail,
  getUserById,
  createUser,
  getQuizResult,
  saveQuizResult,
  deleteQuizResult,
} from "./src/server/db";
import { QUESTIONS } from "./src/data/questions";
import { SEPARATOR_QUESTIONS, checkAndGetSeparatorQuestion } from "./src/data/separator_questions";
import { CareerResult } from "./src/types";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Auth Middleware
async function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Неавторизован" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = await getUserById(token);
    if (!user) {
      res.status(401).json({ error: "Сессия устарела или недействительна" });
      return;
    }
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Ошибка сервера авторизации" });
  }
}

// Helper to look up questions from either standard list or separator list
function getQuestionById(id: number) {
  if (id >= 100) {
    return Object.values(SEPARATOR_QUESTIONS).find(q => q.id === id);
  }
  return QUESTIONS.find(q => q.id === id);
}

// --- API ROUTES ---

// 1. Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Введите email и пароль" });
    return;
  }

  try {
    const exists = await getUserByEmail(email);
    if (exists) {
      res.status(400).json({ error: "Пользователь с таким email уже зарегистрирован" });
      return;
    }

    const userId = "usr_" + Math.random().toString(36).substr(2, 9);
    const passHash = hashPassword(password);
    const user = await createUser(userId, email, passHash);

    res.json({
      user: { id: userId, email: user.email },
      token: userId,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Ошибка сервера при регистрации" });
  }
});

// 2. Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Введите email и пароль" });
    return;
  }

  try {
    const user = await getUserByEmail(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(400).json({ error: "Неверный email или пароль" });
      return;
    }

    res.json({
      user: { id: user.id, email: user.email },
      token: user.id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Ошибка сервера при входе" });
  }
});

// 3. Get Me
app.get("/api/auth/me", authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ user: { id: user.id, email: user.email } });
});

// 4. Get Questions
app.get("/api/quiz/questions", authenticate, (req, res) => {
  // Shuffle the pool of 20 questions and select exactly 6 of them
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 6);

  // Strip points on the frontend for security, calculate only on the backend
  const publicQuestions = selected.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options.map(opt => ({ text: opt.text })),
  }));
  res.json({ questions: publicQuestions });
});

// 5. Get Quiz State / Results
app.get("/api/quiz/state", authenticate, async (req, res) => {
  const user = (req as any).user;
  try {
    const result = await getQuizResult(user.id);
    res.json({
      hasResult: !!result,
      result,
    });
  } catch (error) {
    console.error("Get state error:", error);
    res.status(500).json({ error: "Ошибка сервера при получении результатов" });
  }
});

// 6. Delete Result (Restart quiz)
app.post("/api/quiz/restart", authenticate, async (req, res) => {
  const user = (req as any).user;
  try {
    await deleteQuizResult(user.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Restart error:", error);
    res.status(500).json({ error: "Ошибка сервера при перезапуске теста" });
  }
});

// 6.5 Check if separator question is needed
app.post("/api/quiz/check-separator", authenticate, (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({ error: "Answers array is required" });
    return;
  }

  // Calculate scores on the standard questions answered so far
  const scores = { tech: 0, analytics: 0, management: 0, creative: 0 };
  for (const ans of answers) {
    const question = getQuestionById(ans.questionId);
    if (!question) continue;
    const option = question.options[ans.optionIndex];
    if (!option) continue;
    scores.tech += option.tech_points || 0;
    scores.analytics += option.analytics_points || 0;
    scores.management += option.management_points || 0;
    scores.creative += option.creative_points || 0;
  }

  const separatorInfo = checkAndGetSeparatorQuestion(scores);
  if (separatorInfo) {
    const publicSeparator = {
      id: separatorInfo.question.id,
      text: separatorInfo.question.text,
      options: separatorInfo.question.options.map(opt => ({ text: opt.text })),
    };
    res.json({ needsSeparator: true, separatorQuestion: publicSeparator });
  } else {
    res.json({ needsSeparator: false });
  }
});

// 7. Submit Quiz
app.post("/api/quiz/submit", authenticate, async (req, res) => {
  const user = (req as any).user;
  const { answers } = req.body; // Array of { questionId: number, optionIndex: number }

  if (!answers || !Array.isArray(answers) || answers.length < 6) {
    res.status(400).json({ error: "Необходимо ответить на все вопросы (минимум 6)" });
    return;
  }

  // Calculate scores
  const scores = { tech: 0, analytics: 0, management: 0, creative: 0 };
  for (const ans of answers) {
    const question = getQuestionById(ans.questionId);
    if (!question) continue;
    const option = question.options[ans.optionIndex];
    if (!option) continue;
    scores.tech += option.tech_points || 0;
    scores.analytics += option.analytics_points || 0;
    scores.management += option.management_points || 0;
    scores.creative += option.creative_points || 0;
  }

  // Find primary category
  let primaryCategory = "tech";
  let maxScore = -1;
  for (const [cat, val] of Object.entries(scores)) {
    if (val > maxScore) {
      maxScore = val;
      primaryCategory = cat;
    }
  }

  const categoryNames: Record<string, string> = {
    tech: "Технологии и инженерия (Tech)",
    analytics: "Аналитика и данные (Analytics)",
    management: "Управление и организация (Management)",
    creative: "Креатив и дизайн (Creative)"
  };

  try {
    // Check if GEMINI_API_KEY is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }

    const ai = getGeminiClient();
    const prompt = `Пользователь прошел тест по профориентации.
Результаты по категориям:
- Технологии (Tech): ${scores.tech} баллов
- Аналитика (Analytics): ${scores.analytics} баллов
- Управление (Management): ${scores.management} баллов
- Креатив (Creative): ${scores.creative} баллов

Преобладающая сфера: ${categoryNames[primaryCategory]}.

Детали ответов пользователя:
${answers.map(ans => {
  const q = getQuestionById(ans.questionId);
  if (!q) return "";
  const opt = q.options[ans.optionIndex];
  return `- Вопрос: "${q.text}"\n  Ответ пользователя: "${opt.text}"`;
}).join("\n")}

Пожалуйста, сделай глубокий психологический и карьерный анализ результатов и верни строго структурированный JSON-ответ на русском языке.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                leading_sphere: { type: Type.STRING, description: "Название ведущей сферы на русском языке" },
                profile_description: { type: Type.STRING, description: "Глубокий психологический портрет профессионального стиля пользователя на русском, объясняющий его сильные стороны и баланс других сфер" }
              },
              required: ["leading_sphere", "profile_description"]
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-5 ключевых сильных сторон пользователя"
            },
            ideal_roles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 подходящие роли (например, 'Организатор-координатор', 'Системный архитектор')"
            },
            top_5_professions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Ровно 5 конкретных названий подходящих профессий с коротким пояснением в одно предложение"
            },
            development_advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 практических совета по развитию"
            },
            action_plan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "Название шага" },
                  description: { type: Type.STRING, description: "Короткое руководство по реализации этого шага" }
                },
                required: ["step", "title", "description"]
              },
              description: "4 пошаговых действия для старта карьеры"
            }
          },
          required: ["summary", "strengths", "ideal_roles", "top_5_professions", "development_advice", "action_plan"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    const serializedJson = JSON.stringify(parsedResponse);

    const careerResult: CareerResult = {
      userId: user.id,
      scores,
      primaryCategory,
      aiExplanation: serializedJson,
      recommendations: parsedResponse.top_5_professions || ["Развивать системное мышление", "Пробовать новые технические проекты"],
      createdAt: new Date().toISOString(),
    };

    await saveQuizResult(user.id, careerResult);

    res.json(careerResult);
  } catch (error: any) {
    console.error("Gemini processing error:", error);

    // Provide a beautiful fallback structured JSON response if Gemini fails or key is missing
    const isMissingKey = error.message === "GEMINI_API_KEY_MISSING";
    const statusNote = isMissingKey
      ? "В настройках secrets не задан GEMINI_API_KEY. Отображается стандартный разбор."
      : "Произошла техническая ошибка генерации, показан стандартный детальный отчет.";

    const fallbackData = {
      summary: {
        leading_sphere: categoryNames[primaryCategory],
        profile_description: `Вы набрали максимальный балл в сфере "${categoryNames[primaryCategory]}". Вы демонстрируете выдающиеся способности к систематизации, структурированию и эффективному решению сложных междисциплинарных задач. Вы способны находить оптимальный баланс между техническими требованиями, анализом данных, менеджментом процессов и творческими решениями. (${statusNote})`
      },
      strengths: [
        "Умение структурировать сложные многофакторные процессы",
        "Сбалансированное сочетание логики и практического подхода к задачам",
        "Высокая адаптивность и ориентация на результат",
        "Способность эффективно координировать действия и ресурсы"
      ],
      ideal_roles: [
        "Системный интегратор",
        "Координатор междисциплинарных проектов",
        "Процессный оптимизатор"
      ],
      top_5_professions: [
        "Руководитель проектов в выбранной индустрии — координация команд и ресурсов",
        "Бизнес-аналитик — выявление потребностей и описание процессов",
        "Системный аналитик — интеграция программных и аппаратных систем",
        "Продуктовый менеджер — ведение продукта от идеи до релиза",
        "Консультант по процессам — аудит и реорганизация рабочих систем"
      ],
      development_advice: [
        "Изучайте современные методологии ведения проектов (Agile, Scrum, Kanban)",
        "Развивайте навыки межличностной коммуникации и фасилитации встреч",
        "Посещайте профессиональные семинары и хакатоны для расширения сети контактов",
        "Осваивайте инструменты бизнес-моделирования и визуализации данных"
      ],
      action_plan: [
        {
          step: 1,
          title: "Исследование рынка",
          description: "Определите 3 ключевых работодателя в вашей сфере и изучите требования к их вакансиям."
        },
        {
          step: 2,
          title: "Профессиональное обучение",
          description: "Запишитесь на вводный онлайн-курс или изучите бесплатные руководства по выбранному профилю."
        },
        {
          step: 3,
          title: "Первая практика",
          description: "Выполните небольшой тренировочный кейс или возьмите на себя организацию учебного/волонтерского проекта."
        },
        {
          step: 4,
          title: "Резюме и контакты",
          description: "Оформите профиль и резюме, акцентируя внимание на ваших сбалансированных сильных сторонах."
        }
      ]
    };

    const careerResult: CareerResult = {
      userId: user.id,
      scores,
      primaryCategory,
      aiExplanation: JSON.stringify(fallbackData),
      recommendations: fallbackData.top_5_professions,
      createdAt: new Date().toISOString(),
    };

    await saveQuizResult(user.id, careerResult);

    res.json(careerResult);
  }
});


// --- VITE MIDDLEWARE / STATIC ASSETS ---

async function startServer() {
  // Ensure database (Supabase or fallback) is initialized and tables exist
  await initDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
