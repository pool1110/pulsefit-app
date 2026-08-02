'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Barcode, Loader2, Check, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { NutritionLog } from '@/lib/types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: Omit<NutritionLog, 'id'>) => void;
}

export function BarcodeScannerModal({ isOpen, onClose, onAddMeal }: BarcodeScannerModalProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen && isCameraActive) {
      const html5QrCode = new Html5Qrcode('barcode-reader');
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText) => {
            html5QrCode.stop().then(() => {
              setIsCameraActive(false);
              fetchProductFromOpenFoodFacts(decodedText);
            });
          },
          () => {}
        )
        .catch((err) => {
          console.error('Camera barcode error:', err);
          setError('Kamera-Zugriff nicht möglich. Bitte Barcode manuell eingeben.');
          setIsCameraActive(false);
        });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isOpen, isCameraActive]);

  if (!isOpen) return null;

  const fetchProductFromOpenFoodFacts = async (code: string) => {
    setIsLoading(true);
    setError(null);
    setScannedProduct(null);

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();

      if (data.status !== 1 || !data.product) {
        throw new Error('Produkt nicht in der OpenFoodFacts-Datenbank gefunden.');
      }

      const p = data.product;
      const nutriments = p.nutriments || {};

      const calories = Math.round(
        nutriments['energy-kcal_100g'] || nutriments['energy-kcal_value'] || 150
      );
      const protein = Math.round(nutriments['proteins_100g'] || nutriments['proteins_value'] || 5);
      const carbs = Math.round(nutriments['carbohydrates_100g'] || nutriments['carbohydrates_value'] || 15);
      const fat = Math.round(nutriments['fat_100g'] || nutriments['fat_value'] || 4);

      let score = 7;
      if (protein > 15) score += 1.5;
      if (carbs > 40 && protein < 5) score -= 1.5;
      score = Math.min(10, Math.max(1, Math.round(score * 10) / 10));

      setScannedProduct({
        name: p.product_name || p.product_name_de || 'Scanned Produkt',
        calories,
        protein,
        carbs,
        fat,
        healthScore: score,
        scoreReasoning: `Nährwertdaten pro 100g laut OpenFoodFacts (Nutri-Score: ${p.nutriscore_grade?.toUpperCase() || 'B'}).`,
        healthTip: 'Achte auf die Portionsgröße bei abgepackten Lebensmitteln.',
        barcode: code,
      });
    } catch (err: any) {
      setError(err.message || 'Fehler beim Abrufen der Produktdaten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      fetchProductFromOpenFoodFacts(manualBarcode.trim());
    }
  };

  const handleSaveProduct = () => {
    if (!scannedProduct) return;
    onAddMeal({
      name: scannedProduct.name,
      calories: scannedProduct.calories,
      protein: scannedProduct.protein,
      carbs: scannedProduct.carbs,
      fat: scannedProduct.fat,
      healthScore: scannedProduct.healthScore,
      scoreReasoning: scannedProduct.scoreReasoning,
      healthTip: scannedProduct.healthTip,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800">
          <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
            <Barcode className="w-5 h-5 text-emerald-400" />
            <span>Barcode Scanner</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
          {!scannedProduct && (
            <>
              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 h-64 flex flex-col items-center justify-center">
                  <div id="barcode-reader" className="w-full h-full"></div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCameraActive(false)}
                    className="absolute bottom-3 bg-zinc-950/80 text-xs"
                  >
                    Kamera abbrechen
                  </Button>
                </div>
              ) : (
                <Button
                  variant="gradient"
                  onClick={() => setIsCameraActive(true)}
                  className="w-full h-12 text-sm"
                >
                  <Barcode className="w-5 h-5 mr-2" />
                  Kamera-Scanner starten
                </Button>
              )}

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-3 text-xs text-zinc-500 font-semibold uppercase">oder Strichcode eingeben</span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <form onSubmit={handleManualSubmit} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="z.B. 4008400401829 (Nutella, Riegel...)"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500"
                />
                <Button type="submit" disabled={isLoading} className="shrink-0">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suchen'}
                </Button>
              </form>
            </>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {scannedProduct && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/40">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">OpenFoodFacts Produkt</span>
                <h4 className="text-lg font-bold text-white mt-0.5">{scannedProduct.name}</h4>
                <p className="text-xs text-zinc-400 mt-1">Barcode: {scannedProduct.barcode}</p>

                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 block">Kcal</span>
                    <span className="text-sm font-black text-white">{scannedProduct.calories}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 block">Prot</span>
                    <span className="text-sm font-black text-white">{scannedProduct.protein}g</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[9px] uppercase font-bold text-cyan-400 block">Carb</span>
                    <span className="text-sm font-black text-white">{scannedProduct.carbs}g</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[9px] uppercase font-bold text-amber-400 block">Fett</span>
                    <span className="text-sm font-black text-white">{scannedProduct.fat}g</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button variant="outline" onClick={() => setScannedProduct(null)} className="w-1/3">
                  Erneut scannen
                </Button>
                <Button variant="default" onClick={handleSaveProduct} className="w-2/3">
                  <Check className="w-4 h-4 mr-2" />
                  Ins Protokoll übernehmen
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
