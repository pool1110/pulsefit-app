import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, ingredientsText, remainingMacros, userApiKey } = await req.json();

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response if no API Key
      return NextResponse.json({
        recipes: [
          {
            title: 'Schnelles Puten-Gemüse-Stirfry',
            prepTimeMinutes: 15,
            calories: Math.min(550, remainingMacros?.calories || 550),
            protein: 42,
            carbs: 35,
            fat: 12,
            ingredients: ['200g Putenbrust', '1 Zucchini', '1 Paprika', '1 EL Sojasauce', '1/2 Tasse Basmatireis'],
            instructions: [
              'Putenbrust in Streifen schneiden und in einer heißen Pfanne anbraten.',
              'Gemüse würfeln und dazugeben, 5 Min. knackig braten.',
              'Mit Sojasauce abschmecken und mit gekochtem Reis servieren.'
            ]
          },
          {
            title: 'Proteinhaltige Hüttenkäse-Bowl mit Beeren',
            prepTimeMinutes: 5,
            calories: 320,
            protein: 30,
            carbs: 28,
            fat: 6,
            ingredients: ['250g Körniger Frischkäse (Löffelkäse)', '100g Beeren-Mix', '15g Nüsse', '1 TL Honig'],
            instructions: [
              'Frischkäse in eine Schüssel geben.',
              'Beeren und Nüsse darüber geben und mit etwas Honig verfeinern.'
            ]
          }
        ],
        isMock: true,
        note: 'Demo-Rezepte (Kein Gemini API-Schlüssel hinterlegt)'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents: any[] = [];
    let promptText = `Du bist ein erstklassiger Fitness-Chefkoch. 
Erstelle 2 gesunde, leckere Rezepte auf Deutsch basierend auf den verfügbaren Zutaten des Nutzers.
Verbleibendes Nährstoffbudget des Nutzers für heute:
- Kalorien: ca. ${remainingMacros?.calories || 600} kcal
- Protein: ca. ${remainingMacros?.protein || 40}g

Antworte AUSSCHLIESSLICH im JSON-Format mit folgendem Schema.`;

    if (ingredientsText) {
      promptText += `\nVerfügbare Zutaten vom Nutzer: ${ingredientsText}`;
    }

    const parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        }
      });
    }

    contents.push({ role: 'user', parts });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  prepTimeMinutes: { type: Type.NUMBER },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['title', 'prepTimeMinutes', 'calories', 'protein', 'carbs', 'fat', 'ingredients', 'instructions']
              }
            }
          },
          required: ['recipes']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error('Keine Antwort von Gemini erhalten');

    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Gemini Recipe API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Fehler bei der Rezeptgenerierung' },
      { status: 500 }
    );
  }
}
