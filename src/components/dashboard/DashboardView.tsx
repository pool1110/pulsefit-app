'use client';

import React, { useState } from 'react';
import { CalorieRing } from './CalorieRing';
import { HabitQuickCheck } from './HabitQuickCheck';
import { WeightChartCard } from './WeightChartCard';
import { SleepTrackerWidget } from './SleepTrackerWidget';
import { NutritionLog, Habit, Workout, DailyGoals, UserProfile, SleepLog } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Dumbbell, Sparkles, Scale, Check, Footprints } from 'lucide-react';

interface DashboardViewProps {
  meals: NutritionLog[];
  habits: Habit[];
  workouts: Workout[];
  sleepLogs: SleepLog[];
  goals: DailyGoals;
  profile: UserProfile;
  todayDate: string;
  onToggleHabit: (id: string) => void;
  onNavigateTab: (tab: 'nutrition' | 'habits' | 'weekly') => void;
  onAddWeightLog: (weight: number) => void;
  onAddSleepLog: (hours: number, quality: 'good' | 'average' | 'poor') => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export function DashboardView({
  meals,
  habits,
  workouts,
  sleepLogs,
  goals,
  profile,
  todayDate,
  onToggleHabit,
  onNavigateTab,
  onAddWeightLog,
  onAddSleepLog,
  onUpdateProfile,
}: DashboardViewProps) {
  const [weightInput, setWeightInput] = useState(profile.weight?.toString() || '81');
  const [isSaved, setIsSaved] = useState(false);

  const todayMeals = meals.filter((m) => m.date === todayDate);
  const todayWorkouts = workouts.filter((w) => w.date === todayDate);
  const todaySleep = sleepLogs.find((s) => s.date === todayDate);

  const currentCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const currentProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0);
  const currentCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0);
  const currentFat = todayMeals.reduce((sum, m) => sum + m.fat, 0);
  const caloriesBurned = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    if (!isNaN(w) && w > 0) {
      onAddWeightLog(w);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleStepGoalChange = (newGoal: number) => {
    onUpdateProfile({ stepGoal: newGoal });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Morning Sleep Query Widget */}
      <SleepTrackerWidget
        todaySleepLog={todaySleep}
        onSaveSleep={onAddSleepLog}
      />

      {/* Calorie & Macro Progress */}
      <CalorieRing
        currentCalories={currentCalories}
        targetCalories={goals.calories}
        protein={{ current: currentProtein, target: goals.protein }}
        carbs={{ current: currentCarbs, target: goals.carbs }}
        fat={{ current: currentFat, target: goals.fat }}
        caloriesBurned={caloriesBurned}
      />

      {/* Weight Tracker Schnell-Eintrag */}
      <Card className="bg-zinc-900/90 border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-sm">Gewicht</h3>
                <span className="text-[10px] text-zinc-400">({profile.age} Jahre)</span>
              </div>
              <p className="text-xs text-zinc-400">
                Aktuell: <strong className="text-white">{profile.weight} kg</strong>
                {profile.targetWeight && (
                  <span> (Ziel: <strong className="text-emerald-400">{profile.targetWeight} kg</strong>)</span>
                )}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveWeight} className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-16 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs font-bold text-center focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs text-zinc-400 font-medium">kg</span>
            <Button type="submit" size="sm" className="h-8 px-2.5 text-xs">
              {isSaved ? <Check className="w-3.5 h-3.5" /> : 'Log'}
            </Button>
          </form>
        </div>
      </Card>

      {/* Step Goal Customizer Card (Alternative to 10k steps) */}
      <Card className="bg-zinc-900/90 border-zinc-800 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Schrittziel anpassen</h4>
          </div>

          <div className="flex space-x-1">
            {[5000, 6000, 7500, 10000].map((goalVal) => (
              <button
                key={goalVal}
                onClick={() => handleStepGoalChange(goalVal)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  (profile.stepGoal || 6000) === goalVal
                    ? 'bg-emerald-500 text-zinc-950 font-black'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {goalVal / 1000}k
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Visual Weight Trend Chart */}
      <WeightChartCard profile={profile} />

      {/* Quick Action CTA Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('nutrition')}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-950/60 border border-emerald-500/30 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500 text-zinc-950 w-fit mb-3 group-hover:rotate-6 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Foto-Tracker</h3>
          <p className="text-[11px] text-zinc-300 mt-0.5">Mahlzeit mit KI scannen</p>
        </button>

        <button
          onClick={() => onNavigateTab('weekly')}
          className="p-4 rounded-2xl bg-gradient-to-br from-teal-900/40 to-cyan-950/60 border border-cyan-500/30 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg group"
        >
          <div className="p-2.5 rounded-xl bg-cyan-500 text-zinc-950 w-fit mb-3 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Wochen-KI</h3>
          <p className="text-[11px] text-zinc-300 mt-0.5">Report & Tipps abrufen</p>
        </button>
      </div>

      {/* Today Habits Check-off */}
      <HabitQuickCheck
        habits={habits}
        todayDate={todayDate}
        onToggleHabit={onToggleHabit}
        onGoToHabitsTab={() => onNavigateTab('habits')}
      />
    </div>
  );
}
