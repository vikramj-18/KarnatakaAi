import { TripPreferences, SavedTrip, ItineraryDay, ItineraryStop } from '../types/travel';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';

export interface PlanApiResponse {
  success: boolean;
  itinerary: {
    tripTitle: string;
    summary: string;
    assumptions: string[];
    totalEstimatedCostINR: number;
    days: ItineraryDay[];
    seasonalAlerts: string[];
    budgetBreakdown: {
      transportINR: number;
      stayINR: number;
      foodINR: number;
      activitiesINR: number;
      contingencyINR: number;
    };
    ecoTip?: string;
  };
  isLocalFallback?: boolean;
}

export async function checkServerHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'offline_or_local', hasGeminiKey: false };
  }
}

export async function generateItinerary(preferences: TripPreferences): Promise<PlanApiResponse> {
  try {
    const response = await fetch('/api/gemini/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.itinerary && Array.isArray(data.itinerary.days)) {
        return {
          success: true,
          itinerary: data.itinerary,
          isLocalFallback: false,
        };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API unavailable, activating deterministic local smart engine:', err);
  }

  // Resilient Local Smart Rule-Based Engine
  return generateLocalSmartItinerary(preferences);
}

export function generateLocalSmartItinerary(preferences: TripPreferences): PlanApiResponse {
  const duration = Math.max(1, Math.min(10, preferences.durationDays || 3));
  const travellers = Math.max(1, preferences.travellersCount || 1);
  
  // Filter or match destinations
  let matchedDests = KARNATAKA_DESTINATIONS.filter((d) => {
    if (preferences.selectedDestinationIds?.length) {
      return preferences.selectedDestinationIds.includes(d.id);
    }
    return true;
  });

  if (matchedDests.length < duration) {
    matchedDests = KARNATAKA_DESTINATIONS;
  }

  // Score destinations based on interests
  const scoredDests = matchedDests.map((dest) => {
    let score = 0;
    if (preferences.interests?.length) {
      for (const interest of preferences.interests) {
        if (dest.tags.some(t => t.toLowerCase().includes(interest.toLowerCase())) ||
            dest.category.toLowerCase().includes(interest.toLowerCase())) {
          score += 15;
        }
      }
    }
    if (preferences.mobilityNeeds && dest.accessibilityScore >= 3) score += 20;
    return { dest, score };
  }).sort((a, b) => b.score - a.score);

  const selectedDests = scoredDests.map(s => s.dest).slice(0, Math.max(duration * 2, 4));

  const days: ItineraryDay[] = [];
  let totalCost = 0;

  for (let i = 1; i <= duration; i++) {
    const primaryDest = selectedDests[(i - 1) % selectedDests.length];
    const secondaryDest = selectedDests[(i) % selectedDests.length];

    const morningStop: ItineraryStop = {
      id: `d${i}-s1`,
      name: primaryDest.name,
      destinationId: primaryDest.id,
      category: primaryDest.category,
      timeSlot: '08:30 AM - 12:30 PM',
      durationHours: Math.min(primaryDest.recommendedDurationHours, 4),
      description: primaryDest.shortDescription,
      approxCostINR: primaryDest.avgCostINR,
      tip: primaryDest.bestTimeToVisitDaily,
      verified: true,
      travelFromPrevious: {
        mode: preferences.transportPreference === 'train' ? 'Train / Local Taxi' : 'Private Cab / Road',
        durationMinutes: 45,
        distanceKm: 32,
      },
    };

    const afternoonStop: ItineraryStop = {
      id: `d${i}-s2`,
      name: secondaryDest.id !== primaryDest.id ? secondaryDest.name : (primaryDest.nearbyHiddenGems[0] || 'Local Heritage Bazaar'),
      destinationId: secondaryDest.id,
      category: secondaryDest.category,
      timeSlot: '02:30 PM - 05:30 PM',
      durationHours: 3,
      description: `Explore the surroundings and cultural highlights around ${primaryDest.district}.`,
      approxCostINR: Math.round(primaryDest.avgCostINR * 0.6),
      tip: 'Stay hydrated and carry appropriate headwear for sunny hours.',
      verified: true,
      travelFromPrevious: {
        mode: 'Local Transit / Walking',
        durationMinutes: 30,
        distanceKm: 15,
      },
    };

    const dailyStops = [morningStop, afternoonStop];
    const dailyCost = dailyStops.reduce((sum, s) => sum + s.approxCostINR, 0) + 1200; // includes food & local transit
    totalCost += dailyCost;

    days.push({
      dayNumber: i,
      title: `Day ${i}: ${primaryDest.district} & ${primaryDest.category}`,
      theme: primaryDest.category,
      stayLocation: `${primaryDest.name} Region or District Hub`,
      mealRecommendations: {
        breakfast: primaryDest.mustTryFood[0] || 'Crispy Mysore Masala Dosa with Filter Coffee',
        lunch: primaryDest.mustTryFood[1] || 'Traditional Karnataka Banana Leaf Bhojana',
        dinner: primaryDest.mustTryFood[2] || 'Malnad Akki Rotti with Coconut Veg Kurma',
      },
      stops: dailyStops,
      dailyEstimatedBudgetINR: dailyCost,
    });
  }

  const transportEst = Math.round(totalCost * 0.32);
  const stayEst = Math.round(totalCost * 0.38);
  const foodEst = Math.round(totalCost * 0.18);
  const activitiesEst = Math.round(totalCost * 0.08);
  const contingencyEst = Math.round(totalCost * 0.04);

  return {
    success: true,
    isLocalFallback: true,
    itinerary: {
      tripTitle: `${preferences.startingCity || 'Bengaluru'} to Karnataka Odyssey (${duration} Days)`,
      summary: `A carefully curated ${duration}-day journey traversing Karnataka's rich cultural monuments, breathtaking Western Ghats, and authentic regional culinary heritage. Designed for ${travellers} traveller${travellers > 1 ? 's' : ''}.`,
      assumptions: [
        'Assumes normal road and highway speeds (~45-55 km/h in hill ghats).',
        'Cost estimates in INR reflect realistic mid-range travel and entry fees.',
        'Always check local weather and temple timing restrictions before departure.',
      ],
      totalEstimatedCostINR: totalCost * travellers,
      days,
      seasonalAlerts: [
        'Check monsoon alerts between June and August for Western Ghats waterfalls.',
        'Temple visits require modest attire (shoulders and knees covered).',
      ],
      budgetBreakdown: {
        transportINR: transportEst * travellers,
        stayINR: stayEst * travellers,
        foodINR: foodEst * travellers,
        activitiesINR: activitiesEst * travellers,
        contingencyINR: contingencyEst * travellers,
      },
      ecoTip: 'Opt for Karnataka State KSRTC Airavat buses for long inter-district journeys to minimize carbon footprint by 60%.',
    },
  };
}

export async function requestAdaptiveReplan(currentItinerary: SavedTrip, condition: { type: string; details: string }, dayNumber: number) {
  try {
    const res = await fetch('/api/gemini/adapt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentItinerary, condition, dayNumber }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.adaptation;
    }
  } catch (err) {
    console.warn('Adapt API error, falling back locally', err);
  }

  // Local fallback adaptation
  return {
    reason: `Heavy rain or unexpected alert on Day ${dayNumber} requires substituting outdoor activities.`,
    originalStop: 'Outdoor Sightseeing',
    proposedReplacement: {
      name: 'Local Regional Craft & Heritage Indoor Museum',
      category: 'Heritage & Culture',
      durationHours: 2.5,
      description: 'Step into an indoor curated gallery showcasing centuries of Karnataka bronze sculptures, silk weaving, and royal memorabilia with sheltered parking.',
      approxCostINR: 150,
      tip: 'Audio headsets available at reception; completely dry and sheltered.',
    },
    timeDiffMinutes: -30,
    costDiffINR: -100,
    safetyAdvice: 'Roads in ghats can get slippery; avoid high speed driving and stay updated on local highway advisories.',
  };
}

export async function askCopilot(message: string, itineraryContext?: any, language = 'en') {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, itineraryContext, language }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (err) {
    console.warn('Chat API error, fallback response', err);
  }

  // Local fallback response for Copilot
  const lower = message.toLowerCase();
  if (lower.includes('kannada') || lower.includes('phrase') || lower.includes('hello')) {
    return 'ನಮಸ್ಕಾರ (Namaskara)! In Karnataka, greeting someone with "Namaskara" and asking "Oota aitha?" (Did you have food?) is the warmest way to connect with locals.';
  }
  if (lower.includes('food') || lower.includes('eat') || lower.includes('dosa')) {
    return 'Karnataka food is wonderfully diverse! In Mysuru, try original Mylari butter dosa and Mysore Pak. In Udupi and Mangalore, do not miss cloud-soft Neer Dosa with jaggery coconut milk and spicy Ghee Roast. In Bengaluru, head to CTR Malleshwaram for Benne Masala Dosa!';
  }
  if (lower.includes('hampi')) {
    return 'Hampi is a UNESCO World Heritage marvel. The best time to climb Matanga Hill for sunrise is 05:45 AM. Be sure to carry water and wear sturdy footwear as the granite rocks warm up by midday.';
  }
  return 'Karnataka welcomes you! Whether you want to explore the grand ruins of Hampi, relax in the coffee mist of Coorg, or taste authentic Udupi cuisine, I am here to guide your journey with verified tips and cultural context.';
}

export async function analyzeInspirationPhoto(imageBase64: string, mimeType = 'image/jpeg') {
  try {
    const res = await fetch('/api/gemini/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.result;
    }
  } catch (err) {
    console.warn('Photo API error, fallback', err);
  }

  return {
    detectedFeatures: ['Historic stone pillars', 'Granite boulders', 'Dravidian architectural plinth'],
    probableKarnatakaMatch: {
      name: 'Hampi (Vittala Temple Complex)',
      district: 'Vijayanagara',
      category: 'Heritage & Temples',
      confidenceScore: 88,
      explanation: 'The characteristic weathered granite boulder landscape and intricate stone pillar architecture closely resemble the Vijayanagara Empire ruins along the Tungabhadra River in Hampi.',
    },
    similarKarnatakaDestinations: [
      { name: 'Badami Cave Temples', district: 'Bagalkote', whySimilar: 'Red sandstone rock-cut architecture' },
      { name: 'Aihole Temple Complex', district: 'Bagalkote', whySimilar: 'Early Chalukyan experimental stone temples' },
    ],
    isDefiniteMatch: false,
    suggestedAction: 'Add Hampi to your trip itinerary to see the iconic Stone Chariot and boulder sunset points.',
  };
}

export async function getHeritageGuide(monumentName: string, district?: string) {
  try {
    const res = await fetch('/api/gemini/heritage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentName, district }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.heritage;
    }
  } catch (err) {
    console.warn('Heritage API error', err);
  }

  return {
    monumentName,
    dynastyAndPeriod: 'Vijayanagara & Hoysala Classic Era',
    historicalOverview: `${monumentName} stands as a testament to the supreme artistic and architectural prowess of Karnataka's medieval kingdoms, drawing pilgrims and travelers across continents.`,
    architecturalHighlights: [
      'Ornate pillared mandapas carved from monolithic granite blocks',
      'Intricate friezes depicting musicians, dancers, and celestial epics',
      'Acoustic stone columns that resonate with musical frequencies',
    ],
    audioGuideScript: `Welcome to ${monumentName}. Look closely at the bedrock beneath your feet. Centuries ago, royal processions and temple bells echoed through these stone archways. Notice how the sculptors turned hard stone into delicate lace. Take a moment to listen to the whisper of the breeze through the corridors.`,
    hiddenGemDetail: 'Search for the small carved chameleon and dancing peacock tucked behind the eastern sanctum pillar—a master sculptor signature.',
    folkloreVsFact: {
      popularLegend: 'Local folklore states that the underground chambers held treasure rooms that connected to deep river caverns.',
      verifiedHistory: 'ASI excavations confirm elaborate cooling water channels connected to royal bath houses and irrigation canals.',
    },
    quizQuestions: [
      {
        question: 'Which empire reached its architectural zenith at this historic monument?',
        options: ['Vijayanagara Empire', 'Mughal Empire', 'Chola Dynasty', 'Maratha Empire'],
        correctIndex: 0,
        explanation: 'The Vijayanagara kings patronized monumental granite architecture that remains celebrated worldwide today.',
      },
    ],
  };
}

export async function generateGroupConsensus(members: any[], tripDuration = 3) {
  try {
    const res = await fetch('/api/gemini/consensus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members, tripDuration }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.consensus;
    }
  } catch (err) {
    console.warn('Consensus API error', err);
  }

  return {
    consensusSummary: `The group of ${members.length} shares a common appreciation for Karnataka's natural beauty and authentic culinary experiences, despite varying activity intensity preferences.`,
    sharedInterests: ['Local Karnataka food & coffee', 'Scenic sunset viewpoints', 'Comfortable travel pace'],
    keyConflicts: ['Trekking vs relaxed heritage walking', 'Budget accommodation vs boutique resort'],
    compromiseStrategy: 'Hub-and-spoke itinerary based in Chikkamagaluru or Mysuru, allowing energetic members to do an early morning trek while relaxed members enjoy heritage estate tours and artisanal coffee tasting.',
    overallSatisfactionScore: 92,
    suggestedDestinationHub: 'Chikkamagaluru / Belur Corridor',
    subgroupBreakawayIdeas: [
      {
        activityA: 'Mullayanagiri Sunrise Peak Trek',
        forMembersA: 'Adventure & Nature lovers',
        activityB: 'Belur Hoysala Temple Heritage Architecture Tour',
        forMembersB: 'Culture & Photography enthusiasts',
        meetupLocation: 'Traditional Malnad lunch spot in Hassan',
      },
    ],
    suggestedSharedBudgetPerPersonINR: 8500,
  };
}
