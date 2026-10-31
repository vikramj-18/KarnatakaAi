export type Region = 
  | 'Western Ghats & Malenadu'
  | 'Heritage & Royal Karnataka'
  | 'Coastal Karnataka (Karavali)'
  | 'Nature, Waterfalls & Wildlife'
  | 'Urban, Culture & Plains';

export type Category = 
  | 'Heritage & Temples'
  | 'Hill Station & Nature'
  | 'Beaches & Coastline'
  | 'Wildlife & Safari'
  | 'Waterfalls & Treks'
  | 'Culinary & Markets'
  | 'Offbeat & Hidden Gem';

export interface Destination {
  id: string;
  name: string;
  district: string;
  region: Region;
  category: Category;
  latitude: number;
  longitude: number;
  shortDescription: string;
  longDescription: string;
  recommendedDurationHours: number;
  avgCostINR: number;
  openingHours: string;
  bestMonths: string[];
  monsoonSafe: boolean;
  monsoonNotes: string;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  bestTimeToVisitDaily: string;
  accessibilityScore: number; // 1 to 5
  accessibilityDetails: string;
  familyFriendly: boolean;
  isOffbeat: boolean;
  verified: boolean;
  imageUrl: string;
  tags: string[];
  mustTryFood: string[];
  nearbyHiddenGems: string[];
  ecoScore: number; // 1 to 10
}

export interface TripPreferences {
  startingCity: string;
  selectedDestinationIds: string[];
  durationDays: number;
  startDate?: string;
  flexibleDates: boolean;
  travellersCount: number;
  adultsCount: number;
  childrenCount: number;
  interests: string[];
  interestWeights?: Record<string, number>;
  totalBudgetINR: number;
  budgetType: 'total' | 'perPerson';
  budgetCategory: 'backpacker' | 'budget' | 'mid-range' | 'premium' | 'luxury';
  includeTravelToStart: boolean;
  transportPreference: 'bus' | 'train' | 'private_car' | 'rental_car' | 'bike' | 'mixed';
  travelPace: 'relaxed' | 'balanced' | 'packed';
  maxDailyTravelHours: number;
  dietaryPreference: 'vegetarian' | 'vegan' | 'non_vegetarian' | 'jain' | 'halal';
  languages: string[];
  mobilityNeeds: boolean;
  ecoImpactPreference: 'low_carbon' | 'standard' | 'unrestricted';
  accommodationType: 'homestay' | 'resort' | 'heritage_hotel' | 'budget_lodge' | 'camp';
}

export interface ItineraryStop {
  id: string;
  name: string;
  destinationId?: string;
  category: string;
  timeSlot: string; // e.g. "09:00 AM - 11:30 AM"
  durationHours: number;
  description: string;
  approxCostINR: number;
  travelFromPrevious?: {
    mode: string;
    durationMinutes: number;
    distanceKm: number;
  };
  tip: string;
  verified: boolean;
  isCompleted?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  theme: string;
  stayLocation: string;
  mealRecommendations: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  stops: ItineraryStop[];
  dailyEstimatedBudgetINR: number;
}

export interface SavedTrip {
  id: string;
  createdAt: string;
  updatedAt: string;
  tripTitle: string;
  summary: string;
  preferences: TripPreferences;
  days: ItineraryDay[];
  totalEstimatedCostINR: number;
  budgetBreakdown: {
    transportINR: number;
    stayINR: number;
    foodINR: number;
    activitiesINR: number;
    contingencyINR: number;
  };
  seasonalAlerts: string[];
  ecoTip?: string;
  isSavedOffline?: boolean;
}

export interface ExpenseItem {
  id: string;
  tripId: string;
  date: string;
  title: string;
  category: 'Transport' | 'Stay' | 'Food' | 'Attraction' | 'Activities' | 'Shopping' | 'Misc';
  amountINR: number;
  paidBy: string;
  splitBetween: string[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  tripId: string;
  dayNumber: number;
  destinationName: string;
  date: string;
  rating: number;
  notes: string;
  highlight: string;
  photos: string[]; // data URLs or image URLs
  aiSummary?: string;
}

export interface TravelDNAProfile {
  natureVsCulture: number; // 0 (pure nature) to 100 (pure culture/heritage)
  adventureVsRelaxation: number; // 0 (relaxation) to 100 (extreme adventure)
  budgetVsLuxury: number; // 0 (backpacker) to 100 (luxury)
  popularVsOffbeat: number; // 0 (famous landmarks) to 100 (hidden gems)
  foodEnthusiasm: number; // 0 to 100
  travelPace: number; // 0 (very slow) to 100 (intense)
  socialVsSolitary: number; // 0 (peaceful solo) to 100 (group & social)
}

export interface GroupMember {
  id: string;
  name: string;
  preferredActivities: string[];
  maxBudgetINR: number;
  foodPreference: string;
  pace: 'relaxed' | 'balanced' | 'packed';
  mustVisit: string[];
  accessibilityNeeds?: string;
}

export interface LocalExperienceListing {
  id: string;
  title: string;
  hostName: string;
  hostRole: string;
  location: string;
  district: string;
  category: string;
  duration: string;
  priceINR: number;
  groupSizeLimit: number;
  languages: string[];
  accessibilityDetails: string;
  rating: number;
  reviewsCount: number;
  description: string;
  highlights: string[];
  verified: boolean;
  imageUrl: string;
  isCommunityLed: boolean;
  contactNote: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  travelStyle: string;
  avatarSeed?: string;
  joinedDate: string;
}
