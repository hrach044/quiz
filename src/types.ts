export interface AnswerOption {
  text: string;
  tech_points: number;
  analytics_points: number;
  management_points: number;
  creative_points: number;
}

export interface Question {
  id: number;
  text: string;
  options: AnswerOption[];
}

export interface CategoryScores {
  tech: number;
  analytics: number;
  management: number;
  creative: number;
}

export interface User {
  id: string;
  email: string;
}

export interface CareerResult {
  userId: string;
  scores: CategoryScores;
  primaryCategory: string; // 'tech' | 'analytics' | 'management' | 'creative'
  aiExplanation: string;
  recommendations: string[];
  createdAt: string;
}

export interface QuizState {
  hasResult: boolean;
  result: CareerResult | null;
}
