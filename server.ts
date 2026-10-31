import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini SDK on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(ai),
    serverTime: new Date().toISOString(),
  });
});

// 1. AI ITINERARY GENERATION
app.post('/api/gemini/plan', async (req: Request, res: Response) => {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ error: 'Preferences are required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Falling back to local smart engine.',
        fallback: true,
      });
    }

    const prompt = `
You are an expert Karnataka travel planning AI with deep knowledge of Karnataka's history, roads, culture, food, geography, and monsoon patterns.
Plan a detailed, realistic, and practical itinerary based strictly on the traveller's preferences:
${JSON.stringify(preferences, null, 2)}

Requirements:
- Plan exactly ${preferences.durationDays || 3} days.
- Ensure travel between destinations is realistic (Karnataka road travel is ~40-60 km/h in Ghats/hilly roads).
- Include genuine local cuisine recommendations (e.g. Mangalore buns, Mysore pak, Neer dosa, Jolada rotti, Kodava curry).
- Provide realistic approximate cost estimates in INR.
- Include opening hour warnings, crowd advice, and accessibility notes.
- Format the response as a clean JSON object matching the requested schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tripTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            assumptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            totalEstimatedCostINR: { type: Type.NUMBER },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  stayLocation: { type: Type.STRING },
                  mealRecommendations: {
                    type: Type.OBJECT,
                    properties: {
                      breakfast: { type: Type.STRING },
                      lunch: { type: Type.STRING },
                      dinner: { type: Type.STRING },
                    },
                  },
                  stops: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        destinationId: { type: Type.STRING },
                        category: { type: Type.STRING },
                        timeSlot: { type: Type.STRING },
                        durationHours: { type: Type.NUMBER },
                        description: { type: Type.STRING },
                        approxCostINR: { type: Type.NUMBER },
                        travelFromPrevious: {
                          type: Type.OBJECT,
                          properties: {
                            mode: { type: Type.STRING },
                            durationMinutes: { type: Type.NUMBER },
                            distanceKm: { type: Type.NUMBER },
                          },
                        },
                        tip: { type: Type.STRING },
                        verified: { type: Type.BOOLEAN },
                      },
                      required: ['name', 'timeSlot', 'durationHours', 'description', 'approxCostINR'],
                    },
                  },
                  dailyEstimatedBudgetINR: { type: Type.NUMBER },
                },
                required: ['dayNumber', 'title', 'stayLocation', 'stops', 'dailyEstimatedBudgetINR'],
              },
            },
            seasonalAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                transportINR: { type: Type.NUMBER },
                stayINR: { type: Type.NUMBER },
                foodINR: { type: Type.NUMBER },
                activitiesINR: { type: Type.NUMBER },
                contingencyINR: { type: Type.NUMBER },
              },
            },
            ecoTip: { type: Type.STRING },
          },
          required: ['tripTitle', 'summary', 'days', 'totalEstimatedCostINR'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response received from Gemini');
    }

    const parsed = JSON.parse(resultText);
    res.json({ success: true, itinerary: parsed });
  } catch (err: any) {
    console.error('Plan API error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate itinerary' });
  }
});

// 2. LIVE ADAPTIVE REPLANNING AI
app.post('/api/gemini/adapt', async (req: Request, res: Response) => {
  try {
    const { currentItinerary, condition, dayNumber } = req.body;
    if (!currentItinerary || !condition) {
      return res.status(400).json({ error: 'currentItinerary and condition are required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API not configured.',
        fallback: true,
      });
    }

    const prompt = `
A traveller is currently on a Karnataka trip:
Current trip: "${currentItinerary.tripTitle || 'Karnataka Discovery'}"
Day being affected: Day ${dayNumber || 1}
Condition / Disruption reported: "${condition.type}" - Details: "${condition.details || condition.description}"

Suggest an adaptive replanning option:
1. Explain why a change is needed (e.g. heavy rain makes waterfall or ghat road slippery/unsafe, or attraction is closed on Mondays).
2. Recommend an immediate indoor or safer, nearby alternative in Karnataka (e.g., local artisan museum, indoor palace gallery, spice plantation kitchen demo, coffee brewing workshop).
3. Compute time difference (minutes saved/added) and approximate cost difference in INR.
Return JSON matching schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reason: { type: Type.STRING },
            originalStop: { type: Type.STRING },
            proposedReplacement: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                durationHours: { type: Type.NUMBER },
                description: { type: Type.STRING },
                approxCostINR: { type: Type.NUMBER },
                tip: { type: Type.STRING },
              },
              required: ['name', 'description', 'approxCostINR'],
            },
            timeDiffMinutes: { type: Type.INTEGER },
            costDiffINR: { type: Type.INTEGER },
            safetyAdvice: { type: Type.STRING },
          },
          required: ['reason', 'originalStop', 'proposedReplacement', 'timeDiffMinutes', 'costDiffINR'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, adaptation: result });
  } catch (err: any) {
    console.error('Adapt API error:', err);
    res.status(500).json({ error: err.message || 'Adaptive replan failed' });
  }
});

// 3. KANNADA & ENGLISH VOICE / TEXT COPILOT
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, itineraryContext, language = 'en' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API not configured.',
        fallback: true,
      });
    }

    const systemInstruction = `
You are the "Karnataka AI Travel Copilot" (ಕರ್ನಾಟಕ AI ಪ್ರವಾಸ ಸಹಾಯಕ).
You are fluent in English and Kannada (ಕನ್ನಡ).
You are deeply knowledgeable about Karnataka:
- Geography: Western Ghats, Malenadu, Karavali coast, Bayaluseeme plains, Kalyana Karnataka.
- Food: Traditional Kannada dishes, Udupi vegetarian food, Kodava dishes, Mangalore seafood, North Karnataka Jolada Rotti meals.
- Heritage: Hoysala temples (Belur, Halebidu, Somanathapura), Vijayanagara empire (Hampi), Chalukyas (Badami, Aihole, Pattadakal), Wodeyars (Mysuru).
- Etiquette: Respectful temple dress codes, monsoon safety in Ghats, forest safari rules.
If the user asks in Kannada or asks for Kannada phrases, provide authentic Kannada with English transliteration and clear explanation.
Always be warm, helpful, culturally authentic, and realistic about travel times.
Active Trip Context: ${itineraryContext ? JSON.stringify(itineraryContext) : 'No active trip saved yet.'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reply: response.text,
      language,
    });
  } catch (err: any) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: err.message || 'Copilot chat failed' });
  }
});

// 4. PHOTO-TO-TRIP AI (Multimodal Vision)
app.post('/api/gemini/analyze-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API not configured.',
        fallback: true,
      });
    }

    // Strip data prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
Analyze this travel image and check if it matches a landmark, destination, or landscape in Karnataka, India.
Look for architectural features (Hoysala soapstone carvings, Vijayanagara granite boulders & pillars, Chalukyan cave temples, Indo-Saracenic Mysore Palace domes),
Western Ghats landscapes (Mullayanagiri, Coorg coffee hills, Agumbe rainforest, Jog falls, Dudhsagar border), or Karnataka beaches (Gokarna Om Beach, Murudeshwar Shiva statue, Karwar, Malpe).

Return a JSON object:
- detectedFeatures: array of visible visual cues
- probableKarnatakaMatch: { name, district, category, confidenceScore (0-100), explanation }
- similarKarnatakaDestinations: array of { name, district, whySimilar }
- isDefiniteMatch: boolean (be honest if uncertain!)
- suggestedAction: brief suggestion on how to visit this in Karnataka
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            probableKarnatakaMatch: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                district: { type: Type.STRING },
                category: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['name', 'confidenceScore', 'explanation'],
            },
            similarKarnatakaDestinations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  district: { type: Type.STRING },
                  whySimilar: { type: Type.STRING },
                },
                required: ['name', 'district', 'whySimilar'],
              },
            },
            isDefiniteMatch: { type: Type.BOOLEAN },
            suggestedAction: { type: Type.STRING },
          },
          required: ['detectedFeatures', 'probableKarnatakaMatch', 'isDefiniteMatch'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, result: parsed });
  } catch (err: any) {
    console.error('Photo analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze photo' });
  }
});

// 5. HERITAGE COMPANION (Audio guide script & historical narrative)
app.post('/api/gemini/heritage', async (req: Request, res: Response) => {
  try {
    const { monumentName, district } = req.body;
    if (!monumentName) {
      return res.status(400).json({ error: 'Monument name is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API not configured.',
        fallback: true,
      });
    }

    const prompt = `
Create an engaging AI Heritage Guide for the monument: "${monumentName}" in ${district || 'Karnataka'}.
Provide:
1. Historical Overview (verified facts, dynasty, century built, rulers).
2. Architectural Highlights (style: Dravidian, Hoysala stellate star-shaped, Chalukya rock-cut, Indo-Saracenic; key sculptures or acoustics).
3. Audio Guide Script (2-minute spoken narrative that sounds immersive like a National Geographic guide).
4. Fascinating Secret / Detail most tourists miss.
5. Folklore vs Fact (distinguish popular legend from verified historical inscriptions).
6. 2 Quick Quiz questions for family/travellers with options and answers.
Format as JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            monumentName: { type: Type.STRING },
            dynastyAndPeriod: { type: Type.STRING },
            historicalOverview: { type: Type.STRING },
            architecturalHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            audioGuideScript: { type: Type.STRING },
            hiddenGemDetail: { type: Type.STRING },
            folkloreVsFact: {
              type: Type.OBJECT,
              properties: {
                popularLegend: { type: Type.STRING },
                verifiedHistory: { type: Type.STRING },
              },
            },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['monumentName', 'historicalOverview', 'audioGuideScript'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, heritage: parsed });
  } catch (err: any) {
    console.error('Heritage API error:', err);
    res.status(500).json({ error: err.message || 'Heritage API failed' });
  }
});

// 6. GROUP CONSENSUS ENGINE
app.post('/api/gemini/consensus', async (req: Request, res: Response) => {
  try {
    const { members, tripDuration = 3 } = req.body;
    if (!members || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ error: 'At least 2 group members are required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API not configured.',
        fallback: true,
      });
    }

    const prompt = `
A group of ${members.length} friends/travellers are planning a ${tripDuration}-day Karnataka trip.
Their individual preferences are:
${JSON.stringify(members, null, 2)}

Analyze their interests, budgets, paces, and must-sees:
1. Identify shared consensus (what everyone agrees on).
2. Identify conflicts (e.g., Member A wants high-energy trek, Member B wants relaxed heritage).
3. Synthesize a "Smart Compromise" itinerary strategy that maximizes group satisfaction.
4. Suggest dedicated subgroup breakaway options (e.g. while one subgroup does a morning café/temple walk, another does a sunrise viewpoint hike).
5. Recommend a fair shared expense split estimate.
Return JSON matching schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            consensusSummary: { type: Type.STRING },
            sharedInterests: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyConflicts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            compromiseStrategy: { type: Type.STRING },
            overallSatisfactionScore: { type: Type.INTEGER },
            suggestedDestinationHub: { type: Type.STRING },
            subgroupBreakawayIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  activityA: { type: Type.STRING },
                  forMembersA: { type: Type.STRING },
                  activityB: { type: Type.STRING },
                  forMembersB: { type: Type.STRING },
                  meetupLocation: { type: Type.STRING },
                },
              },
            },
            suggestedSharedBudgetPerPersonINR: { type: Type.NUMBER },
          },
          required: ['consensusSummary', 'sharedInterests', 'compromiseStrategy', 'overallSatisfactionScore'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, consensus: parsed });
  } catch (err: any) {
    console.error('Consensus API error:', err);
    res.status(500).json({ error: err.message || 'Consensus API failed' });
  }
});

// Setup Vite middlewares for development or serve built files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Karnataka AI Travel Planner running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
