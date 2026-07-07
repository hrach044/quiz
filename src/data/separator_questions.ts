import { Question } from "../types";

export const SEPARATOR_QUESTIONS: Record<string, Question> = {
  "analytics-tech": {
    id: 101,
    text: "Если бы вам пришлось выбирать между созданием надежной технической системы и глубинным анализом её данных, что бы вы выбрали?",
    options: [
      {
        text: "Написать чистый, оптимизированный код и настроить стабильную инфраструктуру.",
        tech_points: 5,
        analytics_points: 0,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Исследовать массивы полученных данных, найти скрытые аномалии и составить прогноз.",
        tech_points: 0,
        analytics_points: 5,
        management_points: 0,
        creative_points: 0
      }
    ]
  },
  "management-tech": {
    id: 102,
    text: "Что для вас важнее при запуске нового ИТ-продукта?",
    options: [
      {
        text: "Безупречная техническая реализация, высокая производительность и архитектура без багов.",
        tech_points: 5,
        analytics_points: 0,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Сплоченность команды разработки, соблюдение дедлайнов и ценность продукта для рынка.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 5,
        creative_points: 0
      }
    ]
  },
  "creative-tech": {
    id: 103,
    text: "Представьте, что вы создаете мобильное приложение. В какую часть процесса вам приятнее погрузиться?",
    options: [
      {
        text: "В программирование логики, работу с API, базами данных и оптимизацию бэкенда.",
        tech_points: 5,
        analytics_points: 0,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "В разработку визуального стиля, анимаций интерфейса и создание уникального пользовательского опыта (UX).",
        tech_points: 0,
        analytics_points: 0,
        management_points: 0,
        creative_points: 5
      }
    ]
  },
  "analytics-management": {
    id: 104,
    text: "При решении проблемы в бизнесе, на что вы в первую очередь будете опираться?",
    options: [
      {
        text: "На детальные отчеты, статистические исследования и точные графики показателей.",
        tech_points: 0,
        analytics_points: 5,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "На переговоры с людьми, мотивацию команды и оперативное перераспределение ресурсов.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 5,
        creative_points: 0
      }
    ]
  },
  "analytics-creative": {
    id: 105,
    text: "Что вас больше привлекает в процессе исследования аудитории?",
    options: [
      {
        text: "Поиск числовых закономерностей, сегментация по метрикам и построение математических моделей поведения.",
        tech_points: 0,
        analytics_points: 5,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Понимание глубинных эмоций, визуализация инсайтов и придумывание ярких креативных концепций.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 0,
        creative_points: 5
      }
    ]
  },
  "creative-management": {
    id: 106,
    text: "Если бы вы руководили творческим проектом, какая задача была бы вам ближе?",
    options: [
      {
        text: "Координация участников, планирование бюджета, сроков и организация рабочего процесса.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 5,
        creative_points: 0
      },
      {
        text: "Генерация идей, определение эстетического видения проекта и разработка дизайна.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 0,
        creative_points: 5
      }
    ]
  }
};

/**
 * Returns the sorted key for two categories.
 */
export function getSeparatorKey(cat1: string, cat2: string): string {
  return [cat1, cat2].sort().join("-");
}

/**
 * Checks current scores and returns a separator question if a tie or close scores (difference <= 2)
 * is detected between the top two leading categories.
 */
export function checkAndGetSeparatorQuestion(scores: {
  tech: number;
  analytics: number;
  management: number;
  creative: number;
}): { question: Question; key: string } | null {
  const items = Object.entries(scores).map(([category, score]) => ({
    category,
    score,
  }));

  // Sort categories descending by score
  items.sort((a, b) => b.score - a.score);

  const top = items[0];
  const second = items[1];

  // We ask a separator question if:
  // 1. There is an exact tie: top.score === second.score
  // 2. OR the difference is very close (e.g. <= 2 points) and they are leading.
  const isTieOrClose = (top.score - second.score) <= 2;

  if (isTieOrClose) {
    const key = getSeparatorKey(top.category, second.category);
    const question = SEPARATOR_QUESTIONS[key];
    if (question) {
      return { question, key };
    }
  }

  return null;
}
