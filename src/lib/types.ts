export interface NutritionLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number; // 1-10
  scoreReasoning: string;
  healthTip: string;
  imageUrl?: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
}

export interface Habit {
  id: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'mindset' | 'lifestyle';
  icon?: string;
  targetPerWeek: number; // e.g. 7 days
  completedDates: string[]; // YYYY-MM-DD strings
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
}

export interface Workout {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'hiit' | 'other';
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  timestamp: string;
  notes?: string;
}

export interface DailyGoals {
  calories: number;
  protein: number; // in g
  carbs: number;   // in g
  fat: number;     // in g
}

export interface WeeklyReport {
  id: string;
  generatedAt: string;
  startDate: string;
  endDate: string;
  summary: {
    avgDailyCalories: number;
    totalWorkouts: number;
    habitConsistencyRate: number; // 0 - 100%
    avgNutritionScore: number; // 1 - 10
  };
  narrative: string;
  tips: string[];
}
