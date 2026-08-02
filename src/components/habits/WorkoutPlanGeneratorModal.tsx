'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2, Dumbbell, Check, Calendar, Zap, AlertCircle } from 'lucide-react';
import { EXERCISE_LIBRARY } from '@/lib/exercises';
import { UserProfile, WeeklyWorkoutPlan } from '@/lib/types';

interface WorkoutPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  geminiApiKey: string;
  onSavePlan: (plan: WeeklyWorkoutPlan) => void;
}

export function WorkoutPlanGeneratorModal({
  isOpen,
  onClose,
  profile,
  geminiApiKey,
  onSavePlan,
}: WorkoutPlanGeneratorModalProps) {
  const [goal, setGoal] = useState('Büro-Fitness & Energiekick');
  const [trainingDays, setTrainingDays] = useState(4);
  const [environment, setEnvironment] = useState('office'); // 'office' | 'gym' | 'hybrid'
  const [selectedExercises, setSelectedExercises] = useState<string[]>(
    EXERCISE_LIBRARY.filter((e) => e.category === 'office').map((e) => e.id)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyWorkoutPlan | null>(null);

  if (!isOpen) return null;

  const toggleExerciseSelect = (id: string) => {
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/generate-workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          trainingDaysPerWeek: trainingDays,
          environment,
          userProfile: profile,
          selectedExerciseIds: selectedExercises,
          userApiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler beim Erstellen des Plans');

      setGeneratedPlan({
        id: 'plan_' + Date.now(),
        createdAt: new Date().toISOString(),
        title: data.title || 'Dein KI-Trainingsplan',
        goal: data.goal || goal,
        days: data.days || [],
      });
    } catch (err: any) {
      setError(err.message || 'Verbindung zu Gemini fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPlan = () => {
    if (!generatedPlan) return;
    onSavePlan(generatedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
          <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>KI-Trainingsplan Generator</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
          {!generatedPlan ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                Profil: <strong className="text-white">{profile.age} Jahre • {profile.weight} kg</strong>.
                Gemini erstellt deinen perfekten Wochentrainingsplan!
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Hauptziel des Trainingsplans
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Büro-Fitness & Energiekick">Büro-Fitness & Energiekick (gegen Müdigkeit)</option>
                  <option value="Rückengesundheit & Haltung">Rückengesundheit & Haltung verbessern</option>
                  <option value="Fettverbrennung & Gewichtsverlust">Fettverbrennung & Abnehmen (Ziel: {profile.targetWeight || 78} kg)</option>
                  <option value="Muskelaufbau & Kraft">Muskelaufbau & Kraft</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Trainingstage / Woche
                  </label>
                  <select
                    value={trainingDays}
                    onChange={(e) => setTrainingDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value={3}>3 Tage / Woche</option>
                    <option value={4}>4 Tage / Woche</option>
                    <option value={5}>5 Tage / Woche</option>
                    <option value={6}>6 Tage / Woche</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Umgebung
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="office">Büro / Ohne Geräte</option>
                    <option value="gym">Fitnessstudio / Gym</option>
                    <option value="hybrid">Kombination (Büro + Gym)</option>
                  </select>
                </div>
              </div>

              {/* Pre-selection Exercise checklist */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Bevorzugte Übungen auswählen (Vorauswahl)
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {EXERCISE_LIBRARY.map((ex) => {
                    const isSelected = selectedExercises.includes(ex.id);
                    return (
                      <button
                        type="button"
                        key={ex.id}
                        onClick={() => toggleExerciseSelect(ex.id)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-white'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <strong className="block text-zinc-200">{ex.name}</strong>
                          <span className="text-[10px] text-zinc-400">{ex.targetMuscles} • {ex.defaultRepsOrDuration}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="gradient"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-12 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gemini erstellt Trainingsplan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    7-Tage-Trainingsplan generieren
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/40">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">KI-Generierter Plan</span>
                <h4 className="text-lg font-bold text-white mt-0.5">{generatedPlan.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Ziel: {generatedPlan.goal}</p>
              </div>

              {/* 7 Days Preview */}
              <div className="space-y-3">
                {generatedPlan.days.map((day, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-xs font-bold text-emerald-400 uppercase">{day.dayName}</strong>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        day.isRestDay ? 'bg-zinc-800 text-zinc-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {day.focus}
                      </span>
                    </div>

                    <ul className="text-xs text-zinc-300 space-y-1 pt-1">
                      {day.exercises.map((ex, i) => (
                        <li key={i} className="flex justify-between items-center text-[11px] border-b border-zinc-900 pb-1">
                          <span className="font-semibold text-zinc-200">{ex.name}</span>
                          <span className="text-zinc-400">{ex.setsAndReps}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <Button variant="outline" onClick={() => setGeneratedPlan(null)} className="w-1/3">
                  Neu versuchen
                </Button>
                <Button variant="default" onClick={handleApplyPlan} className="w-2/3">
                  <Check className="w-4 h-4 mr-2" />
                  Als Wochentrainingsplan speichern
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
