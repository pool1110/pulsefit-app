'use client';

import React, { useState } from 'react';
import { CalorieRing } from './CalorieRing';
import { HabitQuickCheck } from './HabitQuickCheck';
import { WeightChartCard } from './WeightChartCard';
import { NutritionLog, Habit, Workout, DailyGoals, UserProfile } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Dumbbell, Sparkles, Scale, Check } from 'lucide-react';

interface DashboardViewProps {
  meals: NutritionLog[];
  habits: Habit[];
  workouts: Workout[];
  goals: DailyGoals;
  profile: UserProfile;
  todayDate: string;
  onToggleHabit: (id: string) => void;
  onNavigateTab: (tab: 'nutrition' | 'habits' | 'weekly') => void;
  onAddWeightLog: (weight: number) => void;
}

export function DashboardView({
  meals,
  habits,
  workouts,
  goals,
  profile,
  todayDate,
  onToggleHabit,
  onNavigateTab,
  onAddWeightLog,
}: DashboardViewProps) {
  const [weightInput, setWeightInput] = useState(profile.weight?.toString() || '81');
  const [isSaved, setIsSaved] = useState(false);

  const todayMeals = meals.filter((m) => m.date === todayDate);
  const todayWorkouts = workouts.filter((w) => w.date === todayDate);

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

  return (
    <div className="space-y-6 pb-24">
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

      {/* Today Workouts Summary */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center space-x-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Heutige Workouts ({todayWorkouts.length})</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab('habits')}
            className="text-xs text-zinc-400 hover:text-cyan-400 p-1 h-auto"
          >
            + Eintragen
          </Button>
        </CardHeader>

        <CardContent className="space-y-2">
          {todayWorkouts.length === 0 ? (
            <div className="text-center py-4 text-zinc-500 text-xs">
              Noch kein Training für heute eingetragen.
            </div>
          ) : (
            todayWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{workout.title}</h4>
                  <p className="text-xs text-zinc-400">
                    {workout.durationMinutes} Min • {workout.caloriesBurned} kcal verbrannt
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {workout.type}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
