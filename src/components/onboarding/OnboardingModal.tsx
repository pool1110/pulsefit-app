'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Check, ArrowRight, ArrowLeft, Flame } from 'lucide-react';
import { UserProfile, DailyGoals } from '@/lib/types';

interface OnboardingModalProps {
  isOpen: boolean;
  userName: string;
  currentProfile: UserProfile;
  onCompleteOnboarding: (profile: Partial<UserProfile>, goals: DailyGoals) => void;
}

export function OnboardingModal({
  isOpen,
  userName,
  currentProfile,
  onCompleteOnboarding,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);

  // Step 1: Body Metrics
  const [age, setAge] = useState<number>(currentProfile.age || 37);
  const [weight, setWeight] = useState<number>(currentProfile.weight || 81);
  const [targetWeight, setTargetWeight] = useState<number>(currentProfile.targetWeight || 70);
  const [height, setHeight] = useState<number>(currentProfile.height || 180);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentProfile.gender || 'male');

  // Step 2: Goal
  const [fitnessGoal, setFitnessGoal] = useState<'weight_loss' | 'muscle_gain' | 'maintain' | 'office_health'>(
    currentProfile.fitnessGoal || 'weight_loss'
  );

  // Step 3: Diet
  const [dietPreference, setDietPreference] = useState<'all' | 'vegetarian' | 'vegan' | 'low_carb' | 'high_protein'>(
    currentProfile.dietPreference || 'high_protein'
  );

  if (!isOpen) return null;

  const calculateCalculatedGoals = (): DailyGoals => {
    const validWeight = Number(weight) || 81;
    const validHeight = Number(height) || 180;
    const validAge = Number(age) || 37;

    let bmr = 10 * validWeight + 6.25 * validHeight - 5 * validAge + (gender === 'male' ? 5 : -161);
    let tdee = bmr * 1.35;

    let targetCal = tdee;
    if (fitnessGoal === 'weight_loss') {
      targetCal = Math.max(1500, tdee - 500);
    } else if (fitnessGoal === 'muscle_gain') {
      targetCal = tdee + 300;
    }

    const finalCal = Math.round(targetCal) || 1900;
    const proteinGrams = Math.round((finalCal * 0.3) / 4) || 140;
    const carbsGrams = Math.round((finalCal * 0.4) / 4) || 190;
    const fatGrams = Math.round((finalCal * 0.3) / 9) || 60;

    return {
      calories: finalCal,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
    };
  };

  const calculatedGoals = calculateCalculatedGoals();

  const handleFinish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const validAge = Number(age) || 37;
    const validWeight = Number(weight) || 81;
    const validTargetWeight = Number(targetWeight) || 70;
    const validHeight = Number(height) || 180;

    onCompleteOnboarding(
      {
        age: validAge,
        weight: validWeight,
        targetWeight: validTargetWeight,
        height: validHeight,
        gender,
        fitnessGoal,
        dietPreference,
        onboardingCompleted: true,
      },
      calculatedGoals
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <Card className="w-full max-w-md bg-zinc-900 border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-emerald-950 to-teal-950 pb-4 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Erst-Einrichtung • Schritt {step} von 3
            </span>
            <span className="text-xs text-zinc-400 font-semibold">Hallo {userName}! 👋</span>
          </div>
          <CardTitle className="text-xl font-extrabold text-white mt-2">
            {step === 1 && 'Körperdaten & Abnehmziel'}
            {step === 2 && 'Dein Fitnessziel'}
            {step === 3 && 'Ernährung & Tagesziel'}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-5 space-y-4 overflow-y-auto flex-1">
          {/* Step 1: Body Metrics */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Damit deine <strong>Gemini 3.5 KI</strong> deinen Kalorienbedarf exakt berechnen kann, trage deine aktuellen Daten ein:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Aktuelles Gewicht (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight || ''}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center">
                    <Target className="w-3.5 h-3.5 mr-1" />
                    Zielgewicht (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight || ''}
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-emerald-500/50 text-emerald-400 font-black text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Alter</label>
                  <input
                    type="number"
                    value={age || ''}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Größe (cm)</label>
                  <input
                    type="number"
                    value={height || ''}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Geschlecht</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  >
                    <option value="male">Männlich</option>
                    <option value="female">Weiblich</option>
                    <option value="other">Divers</option>
                  </select>
                </div>
              </div>

              {weight > targetWeight && targetWeight > 0 && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Ziel: <strong>-{Math.round((weight - targetWeight) * 10) / 10} kg Fettabbau</strong> (von {weight} kg auf {targetWeight} kg).
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-300">
                Was ist dein vorrangiges Ziel für die nächsten Wochen?
              </p>

              {[
                { id: 'weight_loss', title: '🔥 Fettabbau & Abnehmen', desc: `Gesunder Fettabbau von ${weight} kg auf ${targetWeight} kg mit Kaloriendefizit.` },
                { id: 'office_health', title: '💼 Büro-Fitness & Vitalität', desc: 'Energie im Alltag steigern, Bewegung im Büro verankern.' },
                { id: 'muscle_gain', title: '💪 Muskelaufbau & Kraft', desc: 'Gezieltes Krafttraining & erhöhte Proteinzufuhr.' },
                { id: 'maintain', title: '⚖️ Gewicht halten & fit bleiben', desc: 'Ausgewogene Ernährung & regelmäßiges Training.' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFitnessGoal(item.id as any)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    fitnessGoal === item.id
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-lg'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <strong className="text-sm font-bold block text-white">{item.title}</strong>
                  <span className="text-xs text-zinc-400 mt-0.5 block">{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Diet & Calculated Targets */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Bevorzugte Ernährungsform
                </label>
                <select
                  value={dietPreference}
                  onChange={(e: any) => setDietPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                >
                  <option value="high_protein">High Protein (Optimal für Fettabbau & Muskeln)</option>
                  <option value="all">Allesesser / Ausgewogen</option>
                  <option value="low_carb">Low Carb (Kohlenhydratarm)</option>
                  <option value="vegetarian">Vegetarisch</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              {/* Calculated Daily Target Preview */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Berechnetes Tagesziel (Gemini 3.5 Basis)
                  </span>
                  <span className="text-xs font-black text-white">{calculatedGoals.calories} kcal / Tag</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Protein</span>
                    <span className="text-base font-black text-white">{calculatedGoals.protein}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block">Carbs</span>
                    <span className="text-base font-black text-white">{calculatedGoals.carbs}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Fett</span>
                    <span className="text-base font-black text-white">{calculatedGoals.fat}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer Navigation */}
        <CardFooter className="flex space-x-2 pt-3 border-t border-zinc-800 bg-zinc-950/50 shrink-0">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="w-28 text-xs shrink-0">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Zurück
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" variant="default" onClick={() => setStep(step + 1)} className="flex-1 text-xs font-bold">
              Weiter <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button type="button" variant="gradient" onClick={handleFinish} className="flex-1 text-xs font-bold px-2 whitespace-nowrap">
              <Check className="w-4 h-4 mr-1 shrink-0" />
              Ziel festlegen & Starten
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
