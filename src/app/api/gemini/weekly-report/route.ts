import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { stats, userApiKey } = await req.json();

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response if API key is not configured
      return NextResponse.json({
        narrative: `Starke Woche! Du hast im Schnitt ${stats.avgCalories || 2150} kcal pro Tag zu dir genommen und ${stats.workoutCount || 3} Trainingseinheiten absolviert. Deine Habit-Konsistenz lag bei hervorragenden ${stats.habitConsistencyPercent || 82}%. Weiter so!`,
        tips: [
          'Erhöhe deine Proteinzufuhr beim Frühstück, um Heißhunger am Nachmittag zu vermeiden.',
          'Versuche mindestens 30 Minuten vor dem Schlafen auf Bildschirme zu verzichten.',
          'Halte deine Regenerationstage ein – Muskelaufbau findet in der Ruhephase statt.'
        ],
        isMock: true,
        note: 'Demo-Wochenbericht (Kein Gemini API-Schlüssel hinterlegt)',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Du bist ein professioneller, empathischer Fitness- & Ernährungscoach.
Erstelle auf Basis der folgenden 7-Tage-Daten eines Nutzers einen motivierenden, persönlichen Wochenbericht auf Deutsch:
Zusammenfassung der letzten 7 Tage:
- Durchschnittliche Kalorien pro Tag: ${stats.avgCalories} kcal (Tagesziel: ${stats.targetCalories} kcal)
- Durchschnittlicher Proteinwert: ${stats.avgProtein}g (Tagesziel: ${stats.targetProtein}g)
- Durchschnittlicher Ernährungsscore: ${stats.avgScore} / 10
- Absolvierte Workouts: ${stats.workoutCount} Einheiten
- Habit-Konsistenz: ${stats.habitConsistencyPercent}% der Gewohnheiten abgehakt

Antworte AUSSCHLIESSLICH im folgenden JSON-Format:
1. "narrative": Ein persönlicher, motivierender Textabschnitt (3-5 Sätze) mit Lobe & Zusammenfassung.
2. "tips": Ein Array von exakt 3 konkreten, umsetzbaren Verbesserungstipps für die nächste Woche.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['narrative', 'tips']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Keine Antwort von Gemini erhalten');
    }

    const parsedData = JSON.parse(resultText);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Gemini Weekly Report API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Fehler beim Erstellen des Wochenberichts' },
      { status: 500 }
    );
  }
}
