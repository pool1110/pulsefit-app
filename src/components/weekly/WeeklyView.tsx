'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Calendar, Dumbbell, Flame, Target, Lightbulb, Heart, CheckCircle } from 'lucide-react';
import { NutritionLog, Habit, Workout, DailyGoals, WeeklyReport } from '@/lib/types';

interface WeeklyViewProps {
  meals: NutritionLog[];
  habits: Habit[];
  workouts: Workout[];
  goals: DailyGoals;
  reports: WeeklyReport[];
  geminiApiKey: string;
  onAddReport: (report: Omit<WeeklyReport, 'id'>) => void;
}

export function WeeklyView({
  meals,
  habits,
  workouts,
  goals,
  reports,
  geminiApiKey,
  onAddReport,
}: WeeklyViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate 7-day stats
  const today = new Date();
  const last7DaysDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  const last7DaysMeals = meals.filter((m) => last7DaysDates.includes(m.date));
  const last7DaysWorkouts = workouts.filter((w) => last7DaysDates.includes(w.date));

  const avgCalories = last7DaysMeals.length > 0
    ? Math.round(last7DaysMeals.reduce((acc, m) => acc + m.calories, 0) / 7)
    : 0;

  const avgProtein = last7DaysMeals.length > 0
    ? Math.round(last7DaysMeals.reduce((acc, m) => acc + m.protein, 0) / 7)
    : 0;

  const avgHealthScore = last7DaysMeals.length > 0
    ? Number((last7DaysMeals.reduce((acc, m) => acc + (m.healthScore || 8), 0) / last7DaysMeals.length).toFixed(1))
    : 8.5;

  // Habit consistency: percentage of total habit targets completed in last 7 days
  let totalHabitOpportunities = habits.length * 7;
  let totalHabitsCompleted = 0;
  habits.forEach((h) => {
    last7DaysDates.forEach((d) => {
      if (h.completedDates.includes(d)) totalHabitsCompleted++;
    });
  });
  const habitConsistencyPercent = totalHabitOpportunities > 0
    ? Math.round((totalHabitsCompleted / totalHabitOpportunities) * 100)
    : 0;

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);

    const statsData = {
      avgCalories,
      targetCalories: goals.calories,
      avgProtein,
      targetProtein: goals.protein,
      avgScore: avgHealthScore,
      workoutCount: last7DaysWorkouts.length,
      habitConsistencyPercent,
    };

    try {
      const response = await fetch('/api/gemini/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: statsData,
          userApiKey: geminiApiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen des Wochenberichts');
      }

      onAddReport({
        generatedAt: new Date().toISOString(),
        startDate: last7DaysDates[6],
        endDate: last7DaysDates[0],
        summary: {
          avgDailyCalories: avgCalories,
          totalWorkouts: last7DaysWorkouts.length,
          habitConsistencyRate: habitConsistencyPercent,
          avgNutritionScore: avgHealthScore,
        },
        narrative: data.narrative,
        tips: data.tips || [],
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verbindung zur KI fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const latestReport = reports[0];

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900/40 via-emerald-900/30 to-cyan-900/40 border border-emerald-500/30 shadow-xl">
        <div className="flex items-center space-x-2 text-xs uppercase font-extrabold text-emerald-400 tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Wöchentliches KI-Coaching</span>
        </div>
        <h2 className="text-xl font-bold text-white">7-Tage Wochenrückblick</h2>
        <p className="text-xs text-zinc-300 mt-1">
          Analysiere deinen Fortschritt und erhalte von Gemini 3 persönliche Optimierungstipps.
        </p>
      </div>

      {/* 7-Day Stats Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-zinc-900/80 border-zinc-800 p-4">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Ø Kalorien / Tag</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white">{avgCalories}</span>
            <span className="text-xs text-zinc-500">kcal</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Ziel: {goals.calories} kcal</p>
        </Card>

        <Card className="bg-zinc-900/80 border-zinc-800 p-4">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Habit Konsistenz</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400">{habitConsistencyPercent}%</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">{totalHabitsCompleted} Erfüllungen</p>
        </Card>

        <Card className="bg-zinc-900/80 border-zinc-800 p-4">
          <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Workouts absolviert</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-cyan-400">{last7DaysWorkouts.length}</span>
            <span className="text-xs text-zinc-500">Einheiten</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Letzte 7 Tage</p>
        </Card>

        <Card className="bg-zinc-900/80 border-zinc-800 p-4">
          <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Ø Ernährungsscore</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-400">{avgHealthScore}</span>
            <span className="text-xs text-zinc-500">/ 10</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Nährwertqualität</p>
        </Card>
      </div>

      {/* Trigger AI Weekly Report Button */}
      <Button
        variant="gradient"
        onClick={handleGenerateReport}
        disabled={isLoading}
        className="w-full h-13 text-base shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Gemini generiert Wochenanalyse...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Neuen KI-Wochenbericht generieren
          </>
        )}
      </Button>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Latest Report Display */}
      {latestReport ? (
        <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-emerald-500/40 shadow-2xl">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="text-[10px] uppercase">
                Aktueller KI Wochenbericht
              </Badge>
              <span className="text-xs text-zinc-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {latestReport.startDate} bis {latestReport.endDate}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-white mt-2">
              Deine Wochenauswertung & Coaching
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 pt-4">
            {/* Narrative text block */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 text-sm text-zinc-200 leading-relaxed space-y-2">
              <p>{latestReport.narrative}</p>
            </div>

            {/* 3 Actionable Tips */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-emerald-400" />
                3 Konkrete Tipps für nächste Woche:
              </h4>

              <div className="space-y-2.5">
                {latestReport.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs font-medium text-emerald-100/90 leading-normal">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 text-zinc-500 text-sm">
          Klicke oben auf den Button, um deinen ersten KI-Wochenbericht zu generieren!
        </div>
      )}
    </div>
  );
}
