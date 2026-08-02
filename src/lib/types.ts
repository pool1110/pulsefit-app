export interface UserProfile {
  age: number;
  weight: number; // in kg
  targetWeight?: number;
  height?: number; // in cm
  gender?: 'male' | 'female' | 'other';
  weightHistory: Array<{ date: string; weight: number }>;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'office' | 'strength' | 'cardio' | 'flexibility';
  targetMuscles: string;
  description: string;
  defaultRepsOrDuration: string; // e.g. "3 Sätze x 15 Wdh." or "45 Sekunden"
  equipment: 'none' | 'chair' | 'dumbbells' | 'gym';
}

export interface PlannedWorkoutDay {
  dayName: string; // e.g. "Montag", "Dienstag"...
  focus: string; // e.g. "Oberkörper & Büro-Snacks"
  isRestDay: boolean;
  exercises: Array<{
    name: string;
    setsAndReps: string;
    notes?: string;
  }>;
}

export interface WeeklyWorkoutPlan {
  id: string;
  createdAt: string;
  title: string;
  goal: string;
  days: PlannedWorkoutDay[];
}

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
