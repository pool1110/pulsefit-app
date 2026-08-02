'use client';

import { useState, useEffect } from 'react';
import { NutritionLog, Habit, Workout, DailyGoals, WeeklyReport } from './types';

const STORAGE_KEYS = {
  MEALS: 'fit_app_meals',
  HABITS: 'fit_app_habits',
  WORKOUTS: 'fit_app_workouts',
  GOALS: 'fit_app_goals',
  REPORTS: 'fit_app_weekly_reports',
  API_KEY: 'fit_app_gemini_key',
};

const DEFAULT_GOALS: DailyGoals = {
  calories: 2200,
  protein: 140,
  carbs: 220,
  fat: 70,
};

const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    title: '2L Wasser trinken',
    category: 'nutrition',
    icon: 'Droplet',
    targetPerWeek: 7,
    completedDates: [getTodayString(0), getTodayString(1), getTodayString(2), getTodayString(3)],
    currentStreak: 4,
    bestStreak: 7,
    createdAt: getTodayString(10),
  },
  {
    id: 'h2',
    title: '10.000 Schritte',
    category: 'fitness',
    icon: 'Footprints',
    targetPerWeek: 7,
    completedDates: [getTodayString(0), getTodayString(1), getTodayString(2)],
    currentStreak: 3,
    bestStreak: 12,
    createdAt: getTodayString(10),
  },
  {
    id: 'h3',
    title: '8h erholsamer Schlaf',
    category: 'lifestyle',
    icon: 'Moon',
    targetPerWeek: 7,
    completedDates: [getTodayString(0), getTodayString(2)],
    currentStreak: 1,
    bestStreak: 5,
    createdAt: getTodayString(10),
  },
  {
    id: 'h4',
    title: 'Dehnen / Mobilität (15 Min)',
    category: 'fitness',
    icon: 'Activity',
    targetPerWeek: 5,
    completedDates: [getTodayString(1), getTodayString(3)],
    currentStreak: 0,
    bestStreak: 4,
    createdAt: getTodayString(10),
  },
];

const INITIAL_MEALS: NutritionLog[] = [
  {
    id: 'm1',
    name: 'Haferflocken mit Beeren & Whey',
    calories: 450,
    protein: 35,
    carbs: 55,
    fat: 8,
    healthScore: 9,
    scoreReasoning: 'Hervorragende Kombination aus komplexen Kohlenhydraten, hochwertigem Protein und Antioxidantien.',
    healthTip: 'Füge noch einen Löffel Chiasamen für gesunde Omega-3 Fettsäuren hinzu.',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    date: getTodayString(0),
  },
  {
    id: 'm2',
    name: 'Hähnchenbrust mit Reis & Brokkoli',
    calories: 620,
    protein: 52,
    carbs: 68,
    fat: 12,
    healthScore: 10,
    scoreReasoning: 'Klassisches, nährstoffdichtes Fitness-Gericht. Hoher Proteingehalt und gute Ballaststoffversorgung.',
    healthTip: 'Nutze etwas Olivenöl für gesunde ungesättigte Fettsäuren.',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    date: getTodayString(0),
  },
  {
    id: 'm3',
    name: 'Lachsfilet mit Süßkartoffeln & Avocado',
    calories: 680,
    protein: 42,
    carbs: 45,
    fat: 28,
    healthScore: 9.5,
    scoreReasoning: 'Reich an gesunden Omega-3 Fettsäuren, hochwertigem Protein und Mikronährstoffen.',
    healthTip: 'Perfekt ausbalanciertes Abendessen für die Muskelregeneration.',
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    date: getTodayString(1),
  }
];

const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    title: 'Oberkörper & Rumpf Krafttraining',
    type: 'strength',
    durationMinutes: 55,
    caloriesBurned: 420,
    date: getTodayString(0),
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    notes: 'Bankdrücken 4x8 @ 80kg, Klimmzüge 4x10, Schulterdrücken',
  },
  {
    id: 'w2',
    title: 'Intervall-Lauf (HIIT)',
    type: 'hiit',
    durationMinutes: 30,
    caloriesBurned: 310,
    date: getTodayString(1),
    timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    notes: '8x 400m Sprints mit 1 Min Gehpause',
  }
];

export function useAppStore() {
  const [meals, setMeals] = useState<NutritionLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from LocalStorage on client mount
  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
      const storedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
      const storedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      const storedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);

      setMeals(storedMeals ? JSON.parse(storedMeals) : INITIAL_MEALS);
      setHabits(storedHabits ? JSON.parse(storedHabits) : INITIAL_HABITS);
      setWorkouts(storedWorkouts ? JSON.parse(storedWorkouts) : INITIAL_WORKOUTS);
      setGoals(storedGoals ? JSON.parse(storedGoals) : DEFAULT_GOALS);
      setWeeklyReports(storedReports ? JSON.parse(storedReports) : []);
      if (storedKey) setGeminiApiKey(storedKey);
    } catch (e) {
      console.error('Failed to load local data', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to LocalStorage
  const addMeal = (meal: Omit<NutritionLog, 'id'>) => {
    const newMeal: NutritionLog = { ...meal, id: 'm_' + Date.now() };
    const updated = [newMeal, ...meals];
    setMeals(updated);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
    return newMeal;
  };

  const deleteMeal = (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
  };

  const toggleHabit = (id: string, date: string = getTodayString(0)) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const isDone = h.completedDates.includes(date);
      let newDates = isDone
        ? h.completedDates.filter(d => d !== date)
        : [...h.completedDates, date];

      // Calculate streak
      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (newDates.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (dateStr === date && !isDone) {
          // just added today
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        ...h,
        completedDates: newDates,
        currentStreak: streak,
        bestStreak: Math.max(h.bestStreak, streak),
      };
    });
    setHabits(updated);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(updated));
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'bestStreak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'h_' + Date.now(),
      completedDates: [],
      currentStreak: 0,
      bestStreak: 0,
      createdAt: getTodayString(0),
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(updated));
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(updated));
  };

  const addWorkout = (workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = { ...workoutData, id: 'w_' + Date.now() };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
  };

  const updateGoals = (newGoals: DailyGoals) => {
    setGoals(newGoals);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(newGoals));
  };

  const saveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  };

  const addWeeklyReport = (report: Omit<WeeklyReport, 'id'>) => {
    const newReport: WeeklyReport = { ...report, id: 'rep_' + Date.now() };
    const updated = [newReport, ...weeklyReports];
    setWeeklyReports(updated);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return newReport;
  };

  return {
    isLoaded,
    meals,
    habits,
    workouts,
    goals,
    weeklyReports,
    geminiApiKey,
    addMeal,
    deleteMeal,
    toggleHabit,
    addHabit,
    deleteHabit,
    addWorkout,
    deleteWorkout,
    updateGoals,
    saveApiKey,
    addWeeklyReport,
    getTodayString,
  };
}
