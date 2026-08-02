'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, Heart, Lightbulb, Flame } from 'lucide-react';

interface MealAnalysisResultProps {
  result: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    healthScore: number;
    scoreReasoning: string;
    healthTip: string;
    isMock?: boolean;
    note?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

export function MealAnalysisResult({ result, onSave, onCancel }: MealAnalysisResultProps) {
  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (score >= 6) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-red-500/20 text-red-400 border-red-500/40';
  };

  return (
    <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-emerald-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="pb-3">
        {result.isMock && (
          <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
            {result.note}
          </div>
        )}
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-1 text-[10px] uppercase border-emerald-500/40 text-emerald-400">
              KI Analyse-Ergebnis
            </Badge>
            <CardTitle className="text-xl font-bold text-white">
              {result.name}
            </CardTitle>
          </div>
          <div className={`flex flex-col items-center px-3 py-1.5 rounded-2xl border ${getScoreBadgeColor(result.healthScore)}`}>
            <span className="text-xs uppercase font-extrabold tracking-wider">Score</span>
            <span className="text-2xl font-black">{result.healthScore}/10</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Macros summary row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Kalorien</span>
            <span className="text-base font-black text-white">{result.calories}</span>
            <span className="text-[9px] text-zinc-500 block">kcal</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Protein</span>
            <span className="text-base font-black text-white">{result.protein}g</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block">Carbs</span>
            <span className="text-base font-black text-white">{result.carbs}g</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Fett</span>
            <span className="text-base font-black text-white">{result.fat}g</span>
          </div>
        </div>

        {/* Health Score explanation */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
            <Heart className="w-4 h-4 fill-emerald-400" />
            <span>Bewertung & Nährstoffqualität</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {result.scoreReasoning}
          </p>
        </div>

        {/* KI Tip */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
            <Lightbulb className="w-4 h-4" />
            <span>KI-Ernährungstipp</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {result.healthTip}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="w-1/3">
          Verwerfen
        </Button>
        <Button variant="default" onClick={onSave} className="w-2/3">
          <Check className="w-4 h-4 mr-2" />
          Ins Protokoll eintragen
        </Button>
      </CardFooter>
    </Card>
  );
}
