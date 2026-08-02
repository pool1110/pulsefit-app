'use client';

import { useState, useEffect } from 'react';
import { NutritionLog, Habit, Workout, DailyGoals, WeeklyReport, UserProfile, WeeklyWorkoutPlan } from './types';

export interface UserAccount {
  id: string;
  name: string;
  avatarColor: string;
}

const DEFAULT_USERS: UserAccount[] = [
  { id: 'u_default', name: 'Paul', avatarColor: 'emerald' },
  { id: 'u_family2', name: 'Familienmitglied', avatarColor: 'cyan' },
];

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

const DEFAULT_PROFILE: UserProfile = {
  age: 37,
  weight: 81,
  targetWeight: 78,
  height: 180,
  gender: 'male',
  weightHistory: [
    { date: getTodayString(14), weight: 82.5 },
    { date: getTodayString(7), weight: 81.7 },
    { date: getTodayString(0), weight: 81.0 },
  ],
};

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    title: '2L Wasser trinken',
    category: 'nutrition',
    targetPerWeek: 7,
    completedDates: [getTodayString(0), getTodayString(1)],
    currentStreak: 2,
    bestStreak: 7,
    createdAt: getTodayString(10),
  },
  {
    id: 'h2',
    title: 'Pre-Meal Exercise Snack',
    category: 'fitness',
    targetPerWeek: 7,
    completedDates: [getTodayString(0)],
    currentStreak: 1,
    bestStreak: 5,
    createdAt: getTodayString(10),
  },
];

export function useAppStore() {
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [activeUserId, setActiveUserId] = useState<string>('u_default');

  const [meals, setMeals] = useState<NutritionLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [workoutPlan, setWorkoutPlanState] = useState<WeeklyWorkoutPlan | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load user list
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('fit_app_users');
      const storedActiveId = localStorage.getItem('fit_app_active_user');
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedActiveId) setActiveUserId(storedActiveId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Load data for active user
  useEffect(() => {
    try {
      const prefix = `fit_app_${activeUserId}_`;
      const storedMeals = localStorage.getItem(prefix + 'meals');
      const storedHabits = localStorage.getItem(prefix + 'habits');
      const storedWorkouts = localStorage.getItem(prefix + 'workouts');
      const storedGoals = localStorage.getItem(prefix + 'goals');
      const storedReports = localStorage.getItem(prefix + 'reports');
      const storedProfile = localStorage.getItem(prefix + 'profile');
      const storedPlan = localStorage.getItem(prefix + 'plan');
      const storedKey = localStorage.getItem('fit_app_gemini_key');

      setMeals(storedMeals ? JSON.parse(storedMeals) : []);
      setHabits(storedHabits ? JSON.parse(storedHabits) : INITIAL_HABITS);
      setWorkouts(storedWorkouts ? JSON.parse(storedWorkouts) : []);
      setGoals(storedGoals ? JSON.parse(storedGoals) : DEFAULT_GOALS);
      setWeeklyReports(storedReports ? JSON.parse(storedReports) : []);
      setProfile(storedProfile ? JSON.parse(storedProfile) : DEFAULT_PROFILE);
      setWorkoutPlanState(storedPlan ? JSON.parse(storedPlan) : null);
      if (storedKey) setGeminiApiKey(storedKey);
    } catch (e) {
      console.error('Failed to load user data', e);
    } finally {
      setIsLoaded(true);
    }
  }, [activeUserId]);

  const switchUser = (userId: string) => {
    setActiveUserId(userId);
    localStorage.setItem('fit_app_active_user', userId);
  };

  const addUser = (name: string) => {
    const newUser: UserAccount = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      avatarColor: ['emerald', 'cyan', 'amber', 'purple', 'rose'][users.length % 5],
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('fit_app_users', JSON.stringify(updatedUsers));
    switchUser(newUser.id);
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return;
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('fit_app_users', JSON.stringify(updatedUsers));
    if (activeUserId === id) {
      switchUser(updatedUsers[0].id);
    }
  };

  const prefix = `fit_app_${activeUserId}_`;

  const setWorkoutPlan = (plan: WeeklyWorkoutPlan) => {
    setWorkoutPlanState(plan);
    localStorage.setItem(prefix + 'plan', JSON.stringify(plan));
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updatedProfile };
    setProfile(newProfile);
    localStorage.setItem(prefix + 'profile', JSON.stringify(newProfile));
  };

  const addWeightLog = (weight: number, dateStr: string = getTodayString(0)) => {
    const newHistory = [...profile.weightHistory.filter(w => w.date !== dateStr), { date: dateStr, weight }];
    newHistory.sort((a, b) => a.date.localeCompare(b.date));
    const newProfile: UserProfile = {
      ...profile,
      weight,
      weightHistory: newHistory,
    };
    setProfile(newProfile);
    localStorage.setItem(prefix + 'profile', JSON.stringify(newProfile));
  };

  const addMeal = (meal: Omit<NutritionLog, 'id'>) => {
    const newMeal: NutritionLog = { ...meal, id: 'm_' + Date.now() };
    const updated = [newMeal, ...meals];
    setMeals(updated);
    localStorage.setItem(prefix + 'meals', JSON.stringify(updated));
    return newMeal;
  };

  const deleteMeal = (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    localStorage.setItem(prefix + 'meals', JSON.stringify(updated));
  };

  const toggleHabit = (id: string, date: string = getTodayString(0)) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const isDone = h.completedDates.includes(date);
      let newDates = isDone
        ? h.completedDates.filter(d => d !== date)
        : [...h.completedDates, date];

      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (newDates.includes(dStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (dStr === date && !isDone) {
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
    localStorage.setItem(prefix + 'habits', JSON.stringify(updated));
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
    localStorage.setItem(prefix + 'habits', JSON.stringify(updated));
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorage.setItem(prefix + 'habits', JSON.stringify(updated));
  };

  const addWorkout = (workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = { ...workoutData, id: 'w_' + Date.now() };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    localStorage.setItem(prefix + 'workouts', JSON.stringify(updated));
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    localStorage.setItem(prefix + 'workouts', JSON.stringify(updated));
  };

  const updateGoals = (newGoals: DailyGoals) => {
    setGoals(newGoals);
    localStorage.setItem(prefix + 'goals', JSON.stringify(newGoals));
  };

  const saveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('fit_app_gemini_key', key);
  };

  const addWeeklyReport = (report: Omit<WeeklyReport, 'id'>) => {
    const newReport: WeeklyReport = { ...report, id: 'rep_' + Date.now() };
    const updated = [newReport, ...weeklyReports];
    setWeeklyReports(updated);
    localStorage.setItem(prefix + 'reports', JSON.stringify(updated));
    return newReport;
  };

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];

  return {
    isLoaded,
    users,
    activeUser,
    activeUserId,
    switchUser,
    addUser,
    deleteUser,
    meals,
    habits,
    workouts,
    goals,
    weeklyReports,
    profile,
    workoutPlan,
    geminiApiKey,
    setWorkoutPlan,
    updateProfile,
    addWeightLog,
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
