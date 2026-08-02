import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { goal, trainingDaysPerWeek, environment, userProfile, selectedExerciseIds, userApiKey } = await req.json();

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        title: '7-Tage Büro- & Fitnessplan',
        goal: goal || 'Büro-Fitness & Fettverbrennung',
        days: [
          {
            dayName: 'Montag',
            focus: 'Oberkörper & Pre-Meal Exercise Snacks',
            isRestDay: false,
            exercises: [
              { name: 'Schreibtisch-Kniebeugen', setsAndReps: '3 Sätze x 15 Wdh. vor dem Essen' },
              { name: 'Tischkanten-Liegestütze', setsAndReps: '3 Sätze x 12 Wdh.' },
              { name: 'Wandsitz (Wall Sit)', setsAndReps: '3 Sätze x 45 Sekunden' }
            ]
          },
          {
            dayName: 'Dienstag',
            focus: 'Aktive Regeneration & Mobility',
            isRestDay: true,
            exercises: [
              { name: 'Brustöffnung & Schulterkreisen', setsAndReps: '5 Minuten im Büro' },
              { name: '10.000 Schritte Spaziergang', setsAndReps: 'Tagesziel' }
            ]
          },
          {
            dayName: 'Mittwoch',
            focus: 'Unterkörper & Rumpf',
            isRestDay: false,
            exercises: [
              { name: 'Ausfallschritte (Lunges)', setsAndReps: '3 Sätze x 12 Wdh. je Bein' },
              { name: 'Wadenheben im Stehen', setsAndReps: '3 Sätze x 20 Wdh.' },
              { name: 'Stuhl-Dips', setsAndReps: '3 Sätze x 10 Wdh.' }
            ]
          },
          {
            dayName: 'Donnerstag',
            focus: 'Regeneration & Haltungstraining',
            isRestDay: true,
            exercises: [
              { name: 'Dehnen & Rücken-Entlastung', setsAndReps: '10 Minuten' }
            ]
          },
          {
            dayName: 'Freitag',
            focus: 'Ganzkörper-HIIT / Ausdauer',
            isRestDay: false,
            exercises: [
              { name: 'Hampelmänner (Jumping Jacks)', setsAndReps: '3 Sätze x 45 Sekunden' },
              { name: 'Mountain Climbers', setsAndReps: '3 Sätze x 40 Sekunden' },
              { name: 'Schreibtisch-Kniebeugen', setsAndReps: '3 Sätze x 20 Wdh.' }
            ]
          },
          {
            dayName: 'Samstag',
            focus: 'Wochenend-Workout / Outdoor',
            isRestDay: false,
            exercises: [
              { name: 'Zügiges Gehen / Laufen', setsAndReps: '30-45 Minuten' },
              { name: 'Liegestütze & Rumpf', setsAndReps: '3 Sätze x 15 Wdh.' }
            ]
          },
          {
            dayName: 'Sonntag',
            focus: 'Ruhetag & Erholung',
            isRestDay: true,
            exercises: [
              { name: 'Spaziergang & Meditation', setsAndReps: 'Entspannt' }
            ]
          }
        ],
        isMock: true,
        note: 'Demo-Trainingsplan (Kein Gemini API-Schlüssel hinterlegt)'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `Du bist ein erfahrener Personal Trainer und Sportwissenschaftler.
Erstelle für einen Nutzer einen maßgeschneiderten 7-Tage-Trainingsplan (Montag bis Sonntag) auf Deutsch.
Nutzerdaten:
- Alter: ${userProfile?.age || 37} Jahre
- Gewicht: ${userProfile?.weight || 81} kg
- Ziel: ${goal || 'Büro-Fitness, Muskelaufbau & Fettverbrennung'}
- Gewünschte Trainingstage/Woche: ${trainingDaysPerWeek || 4} Tage
- Trainingsumgebung: ${environment || 'Büro & Zuhause (ohne/wenig Geräte)'}

Antworte AUSSCHLIESSLICH im JSON-Format mit exakt folgender Struktur:
{
  "title": "Name des Trainingsplans",
  "goal": "Kurze Zusammenfassung des Ziels",
  "days": [
    {
      "dayName": "Montag",
      "focus": "Fokus des Tages (z.B. Oberkörper & Pre-Meal Snacks)",
      "isRestDay": false,
      "exercises": [
        { "name": "Name der Übung", "setsAndReps": "Sätze & Wdh. (z.B. 3 Sätze x 15 Wdh.)", "notes": "Optionaler Tipp" }
      ]
    }, ... (Montag bis Sonntag, also genau 7 Tage)
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            goal: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayName: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  isRestDay: { type: Type.BOOLEAN },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        setsAndReps: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                      required: ['name', 'setsAndReps']
                    }
                  }
                },
                required: ['dayName', 'focus', 'isRestDay', 'exercises']
              }
            }
          },
          required: ['title', 'goal', 'days']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error('Keine Antwort von Gemini erhalten');

    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Gemini Workout Plan API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Fehler bei der Erstellung des Trainingsplans' },
      { status: 500 }
    );
  }
}
