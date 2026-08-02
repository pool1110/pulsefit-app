'use client';

import React, { useState } from 'react';
import { FoodPhotoTracker } from './FoodPhotoTracker';
import { NutritionLog } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Utensils, Heart, Barcode, ChefHat } from 'lucide-react';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { RecipeGeneratorModal } from './RecipeGeneratorModal';

interface NutritionViewProps {
  meals: NutritionLog[];
  todayDate: string;
  targetCalories: number;
  targetProtein: number;
  onAddMeal: (meal: Omit<NutritionLog, 'id'>) => void;
  onDeleteMeal: (id: string) => void;
  geminiApiKey: string;
}

export function NutritionView({
  meals,
  todayDate,
  targetCalories,
  targetProtein,
  onAddMeal,
  onDeleteMeal,
  geminiApiKey,
}: NutritionViewProps) {
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);

  const todayMeals = meals.filter((m) => m.date === todayDate);

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = todayMeals.reduce((sum, m) => sum + m.fat, 0);

  const remainingCalories = Math.max(0, targetCalories - totalCalories);
  const remainingProtein = Math.max(0, targetProtein - totalProtein);

  return (
    <div className="space-y-6 pb-24">
      {/* Quick Tool Row */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => setIsBarcodeOpen(true)}
          className="h-12 border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800"
        >
          <Barcode className="w-4 h-4 mr-2 text-emerald-400" />
          Barcode scannen
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsRecipeOpen(true)}
          className="h-12 border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800"
        >
          <ChefHat className="w-4 h-4 mr-2 text-cyan-400" />
          KI-Rezept Koch
        </Button>
      </div>

      {/* Photo Tracker AI Upload */}
      <FoodPhotoTracker onAddMeal={onAddMeal} geminiApiKey={geminiApiKey} />

      {/* Today's logged meals */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>Heute protokollierte Mahlzeiten</span>
            </CardTitle>
            <p className="text-xs text-zinc-400 mt-0.5">
              Gesamt: <strong className="text-emerald-400">{totalCalories} kcal</strong> | {totalProtein}g P | {totalCarbs}g C | {totalFat}g F
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {todayMeals.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Noch keine Mahlzeiten für heute erfasst. Fotografiere dein Essen oben oder scanne den Barcode!
            </div>
          ) : (
            todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between transition-all hover:border-zinc-700"
              >
                <div className="flex items-center space-x-3">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-12 h-12 rounded-lg object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {meal.calories}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {meal.name}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                    </p>
                    {meal.healthScore && (
                      <div className="flex items-center space-x-1 text-[10px] text-emerald-400 mt-0.5">
                        <Heart className="w-3 h-3 fill-emerald-400/20" />
                        <span>Score: {meal.healthScore}/10</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteMeal(meal.id)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onAddMeal={onAddMeal}
      />

      <RecipeGeneratorModal
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
        onAddMeal={onAddMeal}
        remainingMacros={{ calories: remainingCalories, protein: remainingProtein }}
        geminiApiKey={geminiApiKey}
      />
    </div>
  );
}
