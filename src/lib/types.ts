export interface UserProfile {
  age: number;
  weight: number;
  targetWeight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'maintain' | 'office_health';
  dietPreference?: 'all' | 'vegetarian' | 'vegan' | 'low_carb' | 'high_protein';
  stepGoal?: number; // e.g. 6000 instead of 10000
  onboardingCompleted?: boolean;
  weightHistory: Array<{ date: string; weight: number }>;
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  hours: number;
  quality: 'good' | 'average' | 'poor';
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'office' | 'strength' | 'cardio' | 'flexibility';
  targetMuscles: string;
  description: string;
  defaultRepsOrDuration: string;
  equipment: 'none' | 'chair' | 'dumbbells' | 'gym';
}

export interface PlannedWorkoutDay {
  dayName: string;
  focus: string;
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
  healthScore: number;
  scoreReasoning: string;
  healthTip: string;
  imageUrl?: string;
  timestamp: string;
  date: string;
}

export interface Habit {
  id: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'mindset' | 'lifestyle';
  icon?: string;
  targetPerWeek: number;
  completedDates: string[];
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
  date: string;
  timestamp: string;
  notes?: string;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeeklyReport {
  id: string;
  generatedAt: string;
  startDate: string;
  endDate: string;
  summary: {
    avgDailyCalories: number;
    totalWorkouts: number;
    habitConsistencyRate: number;
    avgNutritionScore: number;
  };
  narrative: string;
  tips: string[];
}
