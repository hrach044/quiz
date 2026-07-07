import { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Представьте, что вам дали совершенно новый проект. Что вам интереснее сделать в первую очередь?",
    options: [
      {
        text: "Сначала понять, как всё устроено и из каких частей состоит.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Поговорить с участниками и выяснить, чего каждый ожидает.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      },
      {
        text: "Попробовать придумать необычный подход или свежую идею.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Собрать максимум информации, прежде чем делать выводы.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      }
    ]
  },
  {
    id: 2,
    text: "Вам предстоит провести целый день над одной задачей. Какая работа принесёт больше удовольствия?",
    options: [
      {
        text: "Создать понятный порядок действий, чтобы всё работало без лишних усилий.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Разобраться, почему результаты отличаются друг от друга.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Организовать людей так, чтобы работа шла быстрее.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 4,
        creative_points: 2
      },
      {
        text: "Сделать так, чтобы итог выглядел интересно и запоминался.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      }
    ]
  },
  {
    id: 3,
    text: "В группе никто не знает, с чего начать. Что вы, скорее всего, предложите?",
    options: [
      {
        text: "Разделить обязанности между всеми.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      },
      {
        text: "Выяснить, какой способ будет наиболее эффективным.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Предложить несколько оригинальных вариантов решения.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Разобраться, как можно упростить весь процесс.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      }
    ]
  },
  {
    id: 4,
    text: "Вы участвуете в подготовке большого мероприятия. Чем вам было бы интереснее заняться?",
    options: [
      {
        text: "Продумать, как всё будет выглядеть и восприниматься.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Следить, чтобы все вовремя выполняли свои задачи.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      },
      {
        text: "Продумать последовательность действий и устранить лишние шаги.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Оценить, что может пойти не так, ещё до начала.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      }
    ]
  },
  {
    id: 5,
    text: "Представьте, что вы получили незнакомую настольную игру. Что сделаете первым?",
    options: [
      {
        text: "Попробую сыграть по-своему и посмотреть, что получится.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Изучу правила и пойму, как всё взаимосвязано.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Посмотрю, какие стратегии обычно приводят к лучшему результату.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Соберу компанию и предложу распределить роли.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      }
    ]
  },
  {
    id: 6,
    text: "Если вам дали возможность улучшить привычный процесс, что было бы наиболее интересно?",
    options: [
      {
        text: "Найти закономерности, которые раньше никто не замечал.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Предложить совершенно новый способ сделать то же самое.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Сделать процесс проще и понятнее.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Договориться со всеми участниками о новых правилах.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      }
    ]
  },
  {
    id: 7,
    text: "Вы можете выбрать роль в небольшом совместном проекте. Что вам ближе?",
    options: [
      {
        text: "Следить, чтобы работа всех двигалась в одном направлении.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      },
      {
        text: "Предлагать идеи, которые сделают результат необычным.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Проверять, какие решения работают лучше остальных.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Продумывать устройство всей системы работы.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      }
    ]
  },
  {
    id: 8,
    text: "Представьте, что вы начинаете новое хобби. Что обычно приносит больше удовольствия?",
    options: [
      {
        text: "Разобраться, как всё устроено изнутри.",
        tech_points: 4,
        analytics_points: 2,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Найти собственный стиль и экспериментировать.",
        tech_points: 1,
        analytics_points: 1,
        management_points: 2,
        creative_points: 4
      },
      {
        text: "Понять, какие подходы дают лучший результат.",
        tech_points: 2,
        analytics_points: 4,
        management_points: 1,
        creative_points: 1
      },
      {
        text: "Найти единомышленников и заниматься вместе.",
        tech_points: 1,
        analytics_points: 2,
        management_points: 4,
        creative_points: 1
      }
    ]
  },
  {
    id: 9,
    text: "Представьте, что привычный процесс стал работать заметно хуже. Что вам интереснее сделать сначала?",
    options: [
      {
        text: "Разобраться, какие признаки указывают на причину проблемы.",
        tech_points: 3,
        analytics_points: 4,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Проверить, какой элемент перестал работать так, как должен.",
        tech_points: 4,
        analytics_points: 3,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Сравнить, когда изменения начали появляться.",
        tech_points: 3,
        analytics_points: 4,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Попробовать изменить устройство процесса, чтобы проблема исчезла.",
        tech_points: 4,
        analytics_points: 3,
        management_points: 0,
        creative_points: 0
      }
    ]
  },
  {
    id: 10,
    text: "Перед вами сложная задача, решение которой пока неизвестно. Что кажется более естественным?",
    options: [
      {
        text: "Разложить её на небольшие взаимосвязанные части.",
        tech_points: 4,
        analytics_points: 3,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Сначала найти повторяющиеся закономерности.",
        tech_points: 3,
        analytics_points: 4,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Определить, какие элементы влияют друг на друга.",
        tech_points: 4,
        analytics_points: 3,
        management_points: 0,
        creative_points: 0
      },
      {
        text: "Проверить несколько объяснений и сравнить результаты.",
        tech_points: 3,
        analytics_points: 4,
        management_points: 0,
        creative_points: 0
      }
    ]
  },
  {
    id: 11,
    text: "Вам поручили улучшить работу небольшой группы. Что вы сделаете первым?",
    options: [
      {
        text: "Подумаю, как изменить порядок действий, чтобы всё происходило проще.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Обсужу с людьми, что мешает им работать комфортно.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 4,
        creative_points: 0
      },
      {
        text: "Уберу лишние этапы в процессе.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Сначала договорюсь, кто за что отвечает.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 4,
        creative_points: 0
      }
    ]
  },
  {
    id: 12,
    text: "Команда несколько раз подряд не достигла нужного результата. Что вам интереснее выяснить?",
    options: [
      {
        text: "Какие обстоятельства повторяются чаще всего.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Как участники распределяли обязанности между собой.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 4,
        creative_points: 0
      },
      {
        text: "Какие решения чаще приводили к успеху.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Как изменить взаимодействие людей.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 4,
        creative_points: 0
      }
    ]
  },
  {
    id: 13,
    text: "Вы хотите улучшить уже существующую идею. Что вам интереснее сделать?",
    options: [
      {
        text: "Посмотреть, какие варианты раньше оказывались наиболее удачными.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Придумать неожиданную новую версию.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 0,
        creative_points: 4
      },
      {
        text: "Найти закономерность между успешными решениями.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Попробовать совершенно другой подход.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 0,
        creative_points: 4
      }
    ]
  },
  {
    id: 14,
    text: "Вам поручили подготовить небольшое совместное мероприятие. Что приносит больше удовольствия?",
    options: [
      {
        text: "Придумать атмосферу и общее настроение.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 3,
        creative_points: 4
      },
      {
        text: "Следить, чтобы каждый вовремя сделал свою часть.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 4,
        creative_points: 3
      },
      {
        text: "Найти необычную идею, которую все запомнят.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 3,
        creative_points: 4
      },
      {
        text: "Организовать работу так, чтобы всё прошло без задержек.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 4,
        creative_points: 3
      }
    ]
  },
  {
    id: 15,
    text: "Ситуация: нужно улучшить работу небольшой команды, которая регулярно срывает сроки. Что важнее сделать в первую очередь?",
    options: [
      {
        text: "Перестроить сам порядок выполнения шагов, чтобы убрать лишние действия.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Разобраться, где именно возникает задержка у отдельных людей.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 4,
        creative_points: 0
      },
      {
        text: "Упростить структуру взаимодействия между участниками.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Обсудить с командой, что именно мешает укладываться в сроки.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 4,
        creative_points: 0
      }
    ]
  },
  {
    id: 16,
    text: "Ситуация: есть привычный способ решения задачи, но он кажется скучным и ограничивающим. Что интереснее?",
    options: [
      {
        text: "Пересобрать процесс так, чтобы он работал иначе, но логично.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Придумать вариант, который выглядит необычно, даже если он непривычен.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 0,
        creative_points: 4
      },
      {
        text: "Сделать систему более структурированной и предсказуемой.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Сделать итог более выразительным и запоминающимся.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 0,
        creative_points: 4
      }
    ]
  },
  {
    id: 17,
    text: "Ситуация: команда приняла решение, но результат получился слабым. Что интереснее выяснить?",
    options: [
      {
        text: "Какие закономерности привели к такому результату.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Как распределялись роли и ответственность.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 4,
        creative_points: 0
      },
      {
        text: "Какие повторяющиеся факторы влияли на итог.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 3,
        creative_points: 0
      },
      {
        text: "Как можно улучшить взаимодействие между участниками.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 4,
        creative_points: 0
      }
    ]
  },
  {
    id: 18,
    text: "Ситуация: нужно улучшить существующее решение, которое уже работает, но не идеально. Что важнее?",
    options: [
      {
        text: "Найти устойчивые причины, почему оно работает именно так.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Предложить новый вариант, который может выглядеть иначе.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 0,
        creative_points: 4
      },
      {
        text: "Проверить, какие элементы чаще всего дают лучший результат.",
        tech_points: 0,
        analytics_points: 4,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Попробовать радикально изменить форму решения.",
        tech_points: 0,
        analytics_points: 3,
        management_points: 0,
        creative_points: 4
      }
    ]
  },
  {
    id: 19,
    text: "Ситуация: готовится публичное событие с ограниченными сроками. Что для вас важнее?",
    options: [
      {
        text: "Сделать так, чтобы всё прошло чётко и без сбоев.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 4,
        creative_points: 3
      },
      {
        text: "Создать необычное впечатление у участников.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 3,
        creative_points: 4
      },
      {
        text: "Убедиться, что каждый знает свою задачу и время.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 4,
        creative_points: 3
      },
      {
        text: "Сделать событие визуально и эмоционально выразительным.",
        tech_points: 0,
        analytics_points: 0,
        management_points: 3,
        creative_points: 4
      }
    ]
  },
  {
    id: 20,
    text: "Ситуация: нужно доработать проект, который уже готов, но выглядит слишком стандартно. Что интереснее сделать?",
    options: [
      {
        text: "Пересобрать логику так, чтобы всё работало более чётко.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Добавить нестандартные визуальные или творческие детали.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 0,
        creative_points: 4
      },
      {
        text: "Оптимизировать структуру, убрав лишние элементы.",
        tech_points: 4,
        analytics_points: 0,
        management_points: 0,
        creative_points: 3
      },
      {
        text: "Изменить подачу так, чтобы это выглядело смелее и оригинальнее.",
        tech_points: 3,
        analytics_points: 0,
        management_points: 0,
        creative_points: 4
      }
    ]
  }
];
