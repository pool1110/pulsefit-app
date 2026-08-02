'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Habit, Workout } from '@/lib/types';
import { CheckCircle2, Circle, Flame, Plus, Dumbbell, Trash2, Trophy, Calendar, Timer } from 'lucide-react';
import { AddHabitModal } from './AddHabitModal';
import { AddWorkoutModal } from './AddWorkoutModal';
import { WorkoutTimerModal } from './WorkoutTimerModal';
import confetti from 'canvas-confetti';

interface HabitsViewProps {
  habits: Habit[];
  workouts: Workout[];
  todayDate: string;
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'bestStreak' | 'createdAt'>) => void;
  onDeleteHabit: (id: string) => void;
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
  onDeleteWorkout: (id: string) => void;
}

export function HabitsView({
  habits,
  workouts,
  todayDate,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onAddWorkout,
  onDeleteWorkout,
}: HabitsViewProps) {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleToggle = (id: string, isCurrentlyDone: boolean) => {
    onToggleHabit(id);
    if (!isCurrentlyDone) {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    }
  };

  const filteredHabits = filterCategory === 'all'
    ? habits
    : habits.filter((h) => h.category === filterCategory);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Habits & Workouts</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTimerModalOpen(true)}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            title="Pausen- & Exercise-Timer"
          >
            <Timer className="w-4 h-4 mr-1" />
            Timer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWorkoutModalOpen(true)}
            className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            <Dumbbell className="w-4 h-4 mr-1 text-cyan-400" />
            + Workout
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsHabitModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            + Habit
          </Button>
        </div>
      </div>

      {/* Habits Section */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader className="pb-3 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Tägliche Gewohnheiten</span>
            </CardTitle>
            <span className="text-xs text-zinc-400">
              {habits.filter((h) => h.completedDates.includes(todayDate)).length} von {habits.length} erfüllt
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'fitness', 'nutrition', 'lifestyle', 'mindset'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Alle Habits' : cat}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredHabits.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Keine Gewohnheiten in dieser Kategorie vorhanden.
            </div>
          ) : (
            filteredHabits.map((habit) => {
              const isDone = habit.completedDates.includes(todayDate);

              return (
                <div
                  key={habit.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <button
                    onClick={() => handleToggle(habit.id, isDone)}
                    className="flex items-center space-x-3 text-left flex-1"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600 shrink-0" />
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-semibold ${
                            isDone ? 'line-through text-zinc-400' : 'text-zinc-100'
                          }`}
                        >
                          {habit.title}
                        </span>
                        <Badge variant="secondary" className="text-[9px] py-0">
                          {habit.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Ziel: {habit.targetPerWeek}x / Woche • Bestes Streak: {habit.bestStreak} Tage
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center space-x-2">
                    {habit.currentStreak > 0 && (
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{habit.currentStreak}d</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteHabit(habit.id)}
                      className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Workouts Log Section */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center space-x-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Trainingsprotokoll</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsWorkoutModalOpen(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            + Eintragen
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {workouts.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-sm">
              Noch keine Workouts eingetragen. Leg heute los!
            </div>
          ) : (
            workouts.map((workout) => (
              <div
                key={workout.id}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{workout.title}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {workout.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    <Calendar className="w-3 h-3 inline mr-1 text-zinc-500" />
                    {workout.date} • {workout.durationMinutes} Min • <strong className="text-amber-400">{workout.caloriesBurned} kcal</strong> verbrannt
                  </p>
                  {workout.notes && (
                    <p className="text-xs text-zinc-500 italic mt-1">{workout.notes}</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteWorkout(workout.id)}
                  className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddHabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onAddHabit={onAddHabit}
      />
      <AddWorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        onAddWorkout={onAddWorkout}
      />
      <WorkoutTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
    </div>
  );
}
