import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userApiKey } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Kein Bild bereitgestellt' }, { status: 400 });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return realistic mock response if API Key is not set yet
      return NextResponse.json({
        name: 'Gegrilltes Hähnchen mit Süßkartoffel & Salat',
        calories: 580,
        protein: 45,
        carbs: 52,
        fat: 14,
        healthScore: 9.2,
        scoreReasoning: 'Sehr ausgewogene Mahlzeit mit magerem Eiweiß, komplexen Kohlenhydraten und reichlich Ballaststoffen.',
        healthTip: 'Füge noch einen Spritzer Olivenöl hinzu, um die Aufnahme fettlöslicher Vitamine zu optimieren.',
        isMock: true,
        note: 'Kein Gemini API-Schlüssel hinterlegt. (Demo-Ergebnis angezeigt)',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Remove data:image/...;base64, prefix if present
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analysiere dieses Foto einer Mahlzeit für eine Fitness-App. 
Gib eine genaue Nährwertschätzung im Folgenden Format zurück. Antworte AUSSCHLIESSLICH auf Deutsch:
1. Name der Mahlzeit (name)
2. Geschätzte Kalorien in kcal (calories)
3. Proteine in Gram (protein)
4. Kohlenhydrate in Gram (carbs)
5. Fett in Gram (fat)
6. Gesundheitsscore von 1.0 bis 10.0 (healthScore)
7. Kurze wissenschaftlich fundierte Begründung des Scores (scoreReasoning)
8. Ein konkreter, praktischer Gesundheitstipp (healthTip)`
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            healthScore: { type: Type.NUMBER },
            scoreReasoning: { type: Type.STRING },
            healthTip: { type: Type.STRING },
          },
          required: ['name', 'calories', 'protein', 'carbs', 'fat', 'healthScore', 'scoreReasoning', 'healthTip']
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
    console.error('Gemini Vision API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Fehler bei der KI-Fotoanalyse' },
      { status: 500 }
    );
  }
}
