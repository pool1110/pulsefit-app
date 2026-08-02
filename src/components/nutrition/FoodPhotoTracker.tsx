'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Sparkles, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { NutritionLog } from '@/lib/types';
import { MealAnalysisResult } from './MealAnalysisResult';

interface FoodPhotoTrackerProps {
  onAddMeal: (meal: Omit<NutritionLog, 'id'>) => void;
  geminiApiKey: string;
}

export function FoodPhotoTracker({ onAddMeal, geminiApiKey }: FoodPhotoTrackerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          userApiKey: geminiApiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Analyse');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verbindung zur KI fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMeal = () => {
    if (!analysisResult) return;

    onAddMeal({
      name: analysisResult.name,
      calories: Math.round(analysisResult.calories),
      protein: Math.round(analysisResult.protein),
      carbs: Math.round(analysisResult.carbs),
      fat: Math.round(analysisResult.fat),
      healthScore: Number(analysisResult.healthScore),
      scoreReasoning: analysisResult.scoreReasoning,
      healthTip: analysisResult.healthTip,
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    });

    // Reset view
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Foto-Ernährungstracker</h3>
                <p className="text-xs text-zinc-400">Gemini KI analysiert Nährwerte & Score</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Vision AI
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-zinc-950/50 hover:bg-zinc-900/50 flex flex-col items-center justify-center space-y-3 group"
            >
              <div className="p-4 rounded-full bg-zinc-900 text-emerald-400 group-hover:scale-110 transition-transform border border-zinc-800">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Foto aufnehmen oder hochladen
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Tippe hier, um eine Mahlzeit zu fotografieren
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden max-h-64 border border-zinc-800 bg-zinc-950">
                <img
                  src={selectedImage}
                  alt="Mahlzeit Vorschau"
                  className="w-full h-64 object-cover object-center"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                  }}
                  className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-zinc-300 border border-zinc-700"
                >
                  Neues Foto
                </Button>
              </div>

              {!analysisResult && (
                <Button
                  variant="gradient"
                  onClick={handleAnalyzePhoto}
                  disabled={isLoading}
                  className="w-full h-12 text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analysiere Mahlzeit mit Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Mahlzeit von KI analysieren lassen
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Show Analysis Result */}
      {analysisResult && (
        <MealAnalysisResult
          result={analysisResult}
          onSave={handleSaveMeal}
          onCancel={() => setAnalysisResult(null)}
        />
      )}
    </div>
  );
}
