'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2, ChefHat, Check, Upload, Clock } from 'lucide-react';
import { NutritionLog, DailyGoals } from '@/lib/types';

interface RecipeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: Omit<NutritionLog, 'id'>) => void;
  remainingMacros: { calories: number; protein: number };
  geminiApiKey: string;
}

export function RecipeGeneratorModal({
  isOpen,
  onClose,
  onAddMeal,
  remainingMacros,
  geminiApiKey,
}: RecipeGeneratorModalProps) {
  const [ingredients, setIngredients] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientsText: ingredients,
          imageBase64: selectedImage,
          remainingMacros,
          userApiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler beim Generieren');
      setRecipes(data.recipes || []);
    } catch (err: any) {
      setError(err.message || 'Verbindung zur Gemini KI fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogRecipe = (recipe: any) => {
    onAddMeal({
      name: recipe.title,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      healthScore: 9.5,
      scoreReasoning: `KI-Rezept zubereitet in ${recipe.prepTimeMinutes} Min. Passt ideal zu deinen verbleibenden Makros!`,
      healthTip: 'Genieße dein frisches selbstgekochtes Essen!',
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
          <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-emerald-400" />
            <span>KI-Rezept-Generator</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
          {!recipes ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                Verbleibend heute: <strong className="text-white">{remainingMacros.calories} kcal</strong> | <strong className="text-white">{remainingMacros.protein}g Protein</strong>.
                Gemini erstellt passende Rezepte für deine Zutaten!
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Vorhandene Zutaten im Kühlschrank (optional)
                </label>
                <textarea
                  placeholder="z.B. Eier, Paprika, Brokkoli, Hähnchen, Hüttenkäse..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Oder Kühlschrank-Foto hochladen (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-emerald-400 hover:file:bg-zinc-700 cursor-pointer"
                />
                {selectedImage && (
                  <img src={selectedImage} alt="Kühlschrank" className="mt-2 h-28 w-full object-cover rounded-xl border border-zinc-800" />
                )}
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
                    Gemini kreiert Rezepte...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Rezepte generieren
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase">KI-Rezeptvorschläge ({recipes.length})</span>
                <Button variant="ghost" size="sm" onClick={() => setRecipes(null)} className="text-xs text-zinc-400">
                  Neu generieren
                </Button>
              </div>

              {recipes.map((recipe, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base">{recipe.title}</h4>
                      <span className="text-xs text-zinc-400 flex items-center mt-0.5">
                        <Clock className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        {recipe.prepTimeMinutes} Min. Zubereitung
                      </span>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {recipe.calories} kcal
                    </span>
                  </div>

                  <div className="flex space-x-2 text-[10px] font-bold text-zinc-300">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">P: {recipe.protein}g</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">C: {recipe.carbs}g</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">F: {recipe.fat}g</span>
                  </div>

                  <div>
                    <strong className="text-xs text-zinc-300 block mb-1">Zutaten:</strong>
                    <ul className="text-xs text-zinc-400 list-disc list-inside space-y-0.5">
                      {recipe.ingredients.map((ing: string, i: number) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="text-xs text-zinc-300 block mb-1">Zubereitung:</strong>
                    <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-1">
                      {recipe.instructions.map((inst: string, i: number) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>

                  <Button
                    variant="default"
                    onClick={() => handleLogRecipe(recipe)}
                    className="w-full mt-2 text-xs h-9"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Nachkochen & Ins Protokoll eintragen
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
