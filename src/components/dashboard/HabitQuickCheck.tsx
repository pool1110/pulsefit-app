'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Flame, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/lib/types';
import confetti from 'canvas-confetti';

interface HabitQuickCheckProps {
  habits: Habit[];
  todayDate: string;
  onToggleHabit: (id: string) => void;
  onGoToHabitsTab: () => void;
}

export function HabitQuickCheck({
  habits,
  todayDate,
  onToggleHabit,
  onGoToHabitsTab,
}: HabitQuickCheckProps) {
  const handleToggle = (id: string, isCurrentlyDone: boolean) => {
    onToggleHabit(id);
    if (!isCurrentlyDone) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });
    }
  };

  const completedCount = habits.filter((h) => h.completedDates.includes(todayDate)).length;

  return (
    <Card className="bg-zinc-900/90 border-zinc-800/80">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold flex items-center space-x-2">
            <span>Tägliche Habits</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {completedCount} / {habits.length}
            </span>
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoToHabitsTab}
          className="text-xs text-zinc-400 hover:text-emerald-400 p-1 h-auto"
        >
          Alle anzeigen
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {habits.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-sm">
            Noch keine Habits angelegt. Erstelle deine erste Gewohnheit!
          </div>
        ) : (
          habits.slice(0, 4).map((habit) => {
            const isDone = habit.completedDates.includes(todayDate);

            return (
              <button
                key={habit.id}
                onClick={() => handleToggle(habit.id, isDone)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-zinc-200'
                    : 'bg-zinc-950/50 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isDone ? 'line-through text-zinc-400' : 'text-zinc-100'
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>

                {habit.currentStreak > 0 && (
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{habit.currentStreak}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
