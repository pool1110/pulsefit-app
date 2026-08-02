'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Activity, Zap } from 'lucide-react';

interface CalorieRingProps {
  currentCalories: number;
  targetCalories: number;
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
  caloriesBurned: number;
}

export function CalorieRing({
  currentCalories,
  targetCalories,
  protein,
  carbs,
  fat,
  caloriesBurned,
}: CalorieRingProps) {
  const remaining = Math.max(0, targetCalories - currentCalories + caloriesBurned);
  const percentage = Math.min(100, Math.round((currentCalories / targetCalories) * 100));

  return (
    <Card className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-zinc-800/80 shadow-2xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Tagesfortschritt
            </span>
            <h2 className="text-lg font-bold text-white">Kalorien & Makros</h2>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>{percentage}% Ziel</span>
          </div>
        </div>

        {/* Circular Progress & Stat grid */}
        <div className="grid grid-cols-3 gap-3 mb-5 items-center">
          {/* Main Calorie Circle display */}
          <div className="col-span-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 text-center">
            <span className="text-2xl font-black text-white tracking-tight">
              {currentCalories}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-400">
              von {targetCalories} kcal
            </span>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40">
              <div className="flex items-center text-xs text-amber-400 mb-0.5">
                <Zap className="w-3 h-3 mr-1" />
                <span>Verbleibend</span>
              </div>
              <span className="text-base font-bold text-zinc-100">{remaining} kcal</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40">
              <div className="flex items-center text-xs text-cyan-400 mb-0.5">
                <Activity className="w-3 h-3 mr-1" />
                <span>Verbrannt</span>
              </div>
              <span className="text-base font-bold text-zinc-100">{caloriesBurned} kcal</span>
            </div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="space-y-3">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-emerald-400">Protein</span>
              <span className="text-zinc-400">
                <strong className="text-white">{protein.current}g</strong> / {protein.target}g
              </span>
            </div>
            <Progress
              value={protein.current}
              max={protein.target}
              indicatorColor="bg-gradient-to-r from-emerald-500 to-teal-400"
            />
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-cyan-400">Kohlenhydrate</span>
              <span className="text-zinc-400">
                <strong className="text-white">{carbs.current}g</strong> / {carbs.target}g
              </span>
            </div>
            <Progress
              value={carbs.current}
              max={carbs.target}
              indicatorColor="bg-gradient-to-r from-cyan-500 to-blue-400"
            />
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-amber-400">Fett</span>
              <span className="text-zinc-400">
                <strong className="text-white">{fat.current}g</strong> / {fat.target}g
              </span>
            </div>
            <Progress
              value={fat.current}
              max={fat.target}
              indicatorColor="bg-gradient-to-r from-amber-500 to-yellow-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
