import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripPlannerView } from './components/TripPlannerView';
import { ItineraryDetailView } from './components/ItineraryDetailView';
import { ExploreKarnatakaView } from './components/ExploreKarnatakaView';
import { KarnatakaMap } from './components/KarnatakaMap';
import { CopilotChatView } from './components/CopilotChatView';
import { ExpenseTrackerView } from './components/ExpenseTrackerView';
import { TravelJournalView } from './components/TravelJournalView';
import { MarketplaceView } from './components/MarketplaceView';
import { CultureFoodView } from './components/CultureFoodView';
import { SeasonalIntelligenceView } from './components/SeasonalIntelligenceView';
import { TripDNAView } from './components/TripDNAView';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { BudgetRescueModal } from './components/BudgetRescueModal';
import { LiveAdaptiveModal } from './components/LiveAdaptiveModal';
import { PhotoToTripModal } from './components/PhotoToTripModal';
import { HeritageCompanionModal } from './components/HeritageCompanionModal';
import { GroupConsensusModal } from './components/GroupConsensusModal';
import { AuthPortal } from './components/AuthPortal';
import { SavedTrip, TripPreferences, Destination, UserProfile } from './types/travel';
import {
  getSavedTrips,
  saveTrip,
  getActiveTrip,
  setActiveTripId,
  getUserSession,
  saveUserSession,
  clearUserSession,
} from './services/storage';
import { generateItinerary } from './services/api';
import { KARNATAKA_DESTINATIONS, TRIP_THEMES } from './data/destinations';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Leaf,
  Sliders,
  DollarSign,
  CloudRain,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [userSession, setUserSession] = useState<UserProfile | null>(() => getUserSession());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeTrip, setActiveTrip] = useState<SavedTrip | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [budgetRescueOpen, setBudgetRescueOpen] = useState(false);
  const [adaptiveModalDay, setAdaptiveModalDay] = useState<number | null>(null);
  const [photoToTripOpen, setPhotoToTripOpen] = useState(false);
  const [heritageMonument, setHeritageMonument] = useState<string | null>(null);
  const [groupConsensusOpen, setGroupConsensusOpen] = useState(false);
  const [exploreInitialSearch, setExploreInitialSearch] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    saveUserSession(user);
    setUserSession(user);
    setCurrentTab('home');
    showToast(`Namaskara, ${user.name}! Welcome to Karnataka AI Planner.`);
  };

  const handleSignOut = () => {
    clearUserSession();
    setUserSession(null);
    showToast('Signed out successfully.');
  };

  // Load or seed default trip on first mount
  useEffect(() => {
    let trip = getActiveTrip();
    if (!trip) {
      // Seed a starter trip: 3-day classic Karnataka discovery
      const starterTrip: SavedTrip = {
        id: 'starter_karnataka_trip',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tripTitle: 'Bengaluru to Hampi & Western Ghats Classic (3 Days)',
        summary:
          'A journey through Karnataka’s UNESCO boulder kingdom in Hampi, mist-draped coffee hills in Chikkamagaluru, and Hoysala architectural marvels in Belur.',
        preferences: {
          startingCity: 'Bengaluru',
          selectedDestinationIds: ['hampi', 'chikkamagaluru', 'belur-halebidu'],
          durationDays: 3,
          flexibleDates: true,
          travellersCount: 2,
          adultsCount: 2,
          childrenCount: 0,
          interests: ['Heritage & architecture', 'Nature & hill stations', 'Food & culinary experiences'],
          totalBudgetINR: 19500,
          budgetType: 'total',
          budgetCategory: 'mid-range',
          includeTravelToStart: true,
          transportPreference: 'private_car',
          travelPace: 'balanced',
          maxDailyTravelHours: 4.5,
          dietaryPreference: 'vegetarian',
          languages: ['Kannada', 'English'],
          mobilityNeeds: false,
          ecoImpactPreference: 'low_carbon',
          accommodationType: 'homestay',
        },
        days: [
          {
            dayNumber: 1,
            title: 'Day 1: Royal Ruins & Sunset Boulders of Hampi',
            theme: 'Heritage & Temples',
            stayLocation: 'Hampi Heritage Zone or Kamalapura',
            mealRecommendations: {
              breakfast: 'Filter Coffee and Thatte Idli on highway stop',
              lunch: 'Traditional Karnataka Bhojana with Kosambari and Sambar',
              dinner: 'Mango Tree Garden Restaurant wood-fired dishes',
            },
            dailyEstimatedBudgetINR: 6200,
            stops: [
              {
                id: 'd1-s1',
                name: 'Virupaksha Temple & Hampi Bazaar',
                destinationId: 'hampi',
                category: 'Heritage & Temples',
                timeSlot: '08:30 AM - 11:30 AM',
                durationHours: 3,
                description: 'Explore the 7th-century functioning temple with its towering 160-foot Gopura and ancient bazaar colonnade.',
                approxCostINR: 100,
                tip: 'Remove footwear at outer gate. Photography permitted.',
                verified: true,
              },
              {
                id: 'd1-s2',
                name: 'Vittala Temple & Iconic Stone Chariot',
                destinationId: 'hampi',
                category: 'Heritage & Temples',
                timeSlot: '03:00 PM - 05:30 PM',
                durationHours: 2.5,
                description: 'Marvel at the 16th-century monolithic stone chariot and 56 musical acoustic pillars carved from granite.',
                approxCostINR: 400,
                tip: 'Electric buggies available from parking for comfortable access.',
                verified: true,
                travelFromPrevious: {
                  mode: 'Electric buggy & walk',
                  durationMinutes: 15,
                  distanceKm: 4,
                },
              },
            ],
          },
          {
            dayNumber: 2,
            title: 'Day 2: Hoysala Stellate Masterpieces in Belur & Halebidu',
            theme: 'Heritage & Hoysala Craft',
            stayLocation: 'Chikkamagaluru Foothills Estate',
            mealRecommendations: {
              breakfast: 'Hassan Crispy Benne Dosa',
              lunch: 'Authentic South Karnataka Thali with Payasa',
              dinner: 'Malnad Akki Rotti with Veg Kurma',
            },
            dailyEstimatedBudgetINR: 6800,
            stops: [
              {
                id: 'd2-s1',
                name: 'Chennakeshava Temple Belur',
                destinationId: 'belur-halebidu',
                category: 'Heritage & Temples',
                timeSlot: '09:00 AM - 12:30 PM',
                durationHours: 3.5,
                description: 'Admire the star-shaped platform with 42 exquisite Madanika dancer sculptures carved in chloritic schist soapstone.',
                approxCostINR: 250,
                tip: 'Engage a certified ASI guide for architectural symbolism decoding.',
                verified: true,
              },
              {
                id: 'd2-s2',
                name: 'Halebidu Hoysaleshwara Temple',
                destinationId: 'belur-halebidu',
                category: 'Heritage & Temples',
                timeSlot: '03:00 PM - 05:30 PM',
                durationHours: 2.5,
                description: 'Twin temple dedicated to Shiva featuring 20,000 intricately carved war elephants and mythological epics along its friezes.',
                approxCostINR: 150,
                tip: 'Quiet sunset hours on the lakefront temple lawns.',
                verified: true,
              },
            ],
          },
          {
            dayNumber: 3,
            title: 'Day 3: Chikkamagaluru Coffee Peaks & Mullayanagiri',
            theme: 'Hill Station & Nature',
            stayLocation: 'Return Drive to Bengaluru',
            mealRecommendations: {
              breakfast: 'Fresh Estate Filter Coffee and Steamed Kadubu',
              lunch: 'Estate homestyle meal with bamboo shoot pickle',
              dinner: 'Bengaluru Darshini dinner at CTR Malleshwaram',
            },
            dailyEstimatedBudgetINR: 6500,
            stops: [
              {
                id: 'd3-s1',
                name: 'Mullayanagiri Sunrise Peak',
                destinationId: 'chikkamagaluru',
                category: 'Hill Station & Nature',
                timeSlot: '06:00 AM - 09:30 AM',
                durationHours: 3.5,
                description: 'Ascend Karnataka’s highest summit (1,930m) for sweeping views over rolling Shola valleys and morning cloud inversions.',
                approxCostINR: 200,
                tip: 'Wear a windbreaker as early morning winds on the peak are brisk.',
                verified: true,
              },
              {
                id: 'd3-s2',
                name: 'Artisan Coffee Estate Cupping Tour',
                destinationId: 'chikkamagaluru',
                category: 'Culinary & Markets',
                timeSlot: '11:00 AM - 02:00 PM',
                durationHours: 3,
                description: 'Walk through shade-grown coffee plants and sample single-origin Arabica roasts in Bababudangiri foothills.',
                approxCostINR: 800,
                tip: 'Buy freshly roasted estate beans directly from growers.',
                verified: true,
              },
            ],
          },
        ],
        totalEstimatedCostINR: 19500,
        budgetBreakdown: {
          transportINR: 6500,
          stayINR: 7500,
          foodINR: 3600,
          activitiesINR: 1200,
          contingencyINR: 700,
        },
        seasonalAlerts: [
          'High altitude peak drives can have sudden morning fog; drive at moderate speeds with headlights on.',
          'Temple interiors require modest clothing covering shoulders and knees.',
        ],
        ecoTip: 'Opt for reusable water bottles; filter refill stations are available at ASI ticket counters.',
      };

      saveTrip(starterTrip);
      trip = starterTrip;
    }
    setActiveTrip(trip);
  }, []);

  // Handle plan generation from form
  const handleGeneratePlan = async (preferences: TripPreferences) => {
    setIsGeneratingPlan(true);
    try {
      const response = await generateItinerary(preferences);
      if (response.success && response.itinerary) {
        const newTrip: SavedTrip = {
          id: `trip_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tripTitle: response.itinerary.tripTitle,
          summary: response.itinerary.summary,
          preferences,
          days: response.itinerary.days,
          totalEstimatedCostINR: response.itinerary.totalEstimatedCostINR,
          budgetBreakdown: response.itinerary.budgetBreakdown,
          seasonalAlerts: response.itinerary.seasonalAlerts,
          ecoTip: response.itinerary.ecoTip,
        };

        saveTrip(newTrip);
        setActiveTrip(newTrip);
        setCurrentTab('itineraries');
        showToast(
          response.isLocalFallback
            ? 'Karnataka Itinerary Generated (Smart local engine)'
            : 'Karnataka Itinerary Generated with Gemini AI!'
        );
      }
    } catch (err) {
      console.error('Plan generation failed', err);
      showToast('Error generating plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleUpdateActiveTrip = (updatedTrip: SavedTrip) => {
    saveTrip(updatedTrip);
    setActiveTrip(updatedTrip);
    showToast('Trip itinerary updated & saved!');
  };

  const handleAddDestinationToPlan = (dest: Destination) => {
    if (!activeTrip) {
      setCurrentTab('plan');
      return;
    }

    // Add destination stop to Day 1 or Day 2
    const targetDayIndex = 0;
    const updatedDays = activeTrip.days.map((d, idx) => {
      if (idx !== targetDayIndex) return d;
      return {
        ...d,
        stops: [
          ...d.stops,
          {
            id: `stop-${Date.now()}`,
            name: dest.name,
            destinationId: dest.id,
            category: dest.category,
            timeSlot: '04:00 PM - 06:00 PM',
            durationHours: dest.recommendedDurationHours,
            description: dest.shortDescription,
            approxCostINR: dest.avgCostINR,
            tip: dest.bestTimeToVisitDaily,
            verified: true,
          },
        ],
      };
    });

    const updatedTrip = { ...activeTrip, days: updatedDays };
    handleUpdateActiveTrip(updatedTrip);
    showToast(`Added ${dest.name} to Day 1 of your trip!`);
  };

  if (!userSession) {
    return (
      <div className="min-h-screen bg-stone-950 font-sans">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-stone-900 text-amber-300 px-4 py-2.5 rounded-2xl shadow-2xl border border-stone-700 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthPortal onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-amber-300 px-4 py-2.5 rounded-2xl shadow-2xl border border-stone-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        activeTripTitle={activeTrip?.tripTitle}
        hasActiveTrip={Boolean(activeTrip)}
        user={userSession}
        onSignOut={handleSignOut}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {/* 1. HOME TAB */}
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onStartPlanning={() => setCurrentTab('plan')}
              onExploreDestinations={(q) => {
                setExploreInitialSearch(q || '');
                setCurrentTab('explore');
              }}
              onLaunchCopilot={() => setCurrentTab('copilot')}
              onOpenPhotoToTrip={() => setPhotoToTripOpen(true)}
            />

            {/* Popular Trip Themes */}
            <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    Handpicked Karnataka Trails
                  </span>
                  <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-0.5">
                    Popular Travel Themes
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentTab('explore')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
                >
                  View All Places <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TRIP_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setExploreInitialSearch(theme.label.split(' ')[0]);
                      setCurrentTab('explore');
                    }}
                    className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base transition-colors">
                      ★
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base mt-3 group-hover:text-amber-800 transition-colors">
                      {theme.label}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {theme.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Destinations Showcase */}
            <section className="bg-stone-900 text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Verified Icons & Offbeat Marvels
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-0.5">
                      Featured Karnataka Destinations
                    </h2>
                  </div>

                  <button
                    onClick={() => setCurrentTab('explore')}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-stone-700 transition-colors"
                  >
                    Explore All 30+ Places
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {KARNATAKA_DESTINATIONS.slice(0, 4).map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setExploreInitialSearch(dest.name);
                        setCurrentTab('explore');
                      }}
                      className="rounded-3xl overflow-hidden bg-stone-800 border border-stone-700 hover:border-emerald-500 cursor-pointer transition-all group"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-950/80 text-amber-300">
                          {dest.district}
                        </span>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h4 className="font-extrabold text-stone-100 text-sm truncate">
                          {dest.name}
                        </h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2">
                          {dest.shortDescription}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400">
                          <span>⏱️ {dest.recommendedDurationHours}h</span>
                          <span className="text-amber-300 font-bold">~₹{dest.avgCostINR}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Interactive Features Grid */}
            <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div
                  onClick={() => setCurrentTab('copilot')}
                  className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 text-amber-200 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <div className="text-2xl">🎙️</div>
                  <h3 className="font-extrabold text-lg text-white mt-2">
                    Kannada Voice Travel Copilot
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    Chat in Kannada or English. Ask for road conditions, temple history, or food near your current stop.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 mt-4">
                    Open Voice Copilot →
                  </span>
                </div>

                <div
                  onClick={() => setGroupConsensusOpen(true)}
                  className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-950 text-purple-200 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <div className="text-2xl">👥</div>
                  <h3 className="font-extrabold text-lg text-white mt-2">
                    Group Consensus AI
                  </h3>
                  <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                    Reconcile friend groups with divergent budgets, paces, and diets into a seamless harmonious plan.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 mt-4">
                    Launch Consensus Builder →
                  </span>
                </div>

                <div
                  onClick={() => setCurrentTab('culture')}
                  className="p-6 rounded-3xl bg-gradient-to-br from-amber-800 to-stone-900 text-amber-100 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <div className="text-2xl">🍛</div>
                  <h3 className="font-extrabold text-lg text-white mt-2">
                    Culture & Audio Phrasebook
                  </h3>
                  <p className="text-xs text-amber-200 mt-1 leading-relaxed">
                    Hear authentic Kannada dining phrases and explore regional dishes like Neer Dosa, Mysore Pak, and Kori Rotti.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 mt-4">
                    Explore Food & Phrases →
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. PLAN MY TRIP TAB */}
        {currentTab === 'plan' && (
          <TripPlannerView
            isLoading={isGeneratingPlan}
            onPlanGenerated={handleGeneratePlan}
            onCancel={() => setCurrentTab('home')}
            initialPreferences={activeTrip?.preferences}
          />
        )}

        {/* 3. EXPLORE KARNATAKA TAB */}
        {currentTab === 'explore' && (
          <ExploreKarnatakaView
            initialQuery={exploreInitialSearch}
            onAddDestinationToPlan={handleAddDestinationToPlan}
            onOpenHeritageGuide={(monument) => setHeritageMonument(monument)}
          />
        )}

        {/* 4. ITINERARIES TAB */}
        {currentTab === 'itineraries' && activeTrip && (
          <ItineraryDetailView
            trip={activeTrip}
            onSaveTrip={handleUpdateActiveTrip}
            onUpdateTrip={handleUpdateActiveTrip}
            onOpenWhatIf={() => setWhatIfOpen(true)}
            onOpenBudgetRescue={() => setBudgetRescueOpen(true)}
            onOpenAdaptiveReplan={(dayNum) => setAdaptiveModalDay(dayNum)}
            onOpenHeritageGuide={(monument) => setHeritageMonument(monument)}
          />
        )}

        {/* 5. MAP EXPLORER TAB */}
        {currentTab === 'map' && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Geographic View</span>
              <h2 className="text-2xl font-extrabold text-stone-900">
                Karnataka Interactive GPS Map Explorer
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Accurate GPS markers for 30+ destinations across Western Ghats, Karavali coast, and northern plains.
              </p>
            </div>
            <KarnatakaMap
              destinations={KARNATAKA_DESTINATIONS}
              activeItineraryDays={activeTrip?.days}
              onAddStopToPlan={handleAddDestinationToPlan}
              onOpenHeritageGuide={(monument) => setHeritageMonument(monument)}
              heightClass="h-[720px]"
            />
          </div>
        )}

        {/* 6. AI COPILOT TAB */}
        {currentTab === 'copilot' && (
          <CopilotChatView
            activeTrip={activeTrip}
            onAddDestinationToTrip={(name) => {
              showToast(`Added ${name} suggestion to your plan!`);
            }}
          />
        )}

        {/* 7. BUDGET TRACKER TAB */}
        {currentTab === 'budget' && (
          <ExpenseTrackerView activeTrip={activeTrip} />
        )}

        {/* 8. TRAVEL JOURNAL TAB */}
        {currentTab === 'journal' && (
          <TravelJournalView activeTrip={activeTrip} />
        )}

        {/* 9. MARKETPLACE TAB */}
        {currentTab === 'experiences' && (
          <MarketplaceView />
        )}

        {/* 10. CULTURE & FOOD TAB */}
        {currentTab === 'culture' && (
          <CultureFoodView />
        )}

        {/* 11. MONSOON RADAR TAB */}
        {currentTab === 'monsoon' && (
          <SeasonalIntelligenceView />
        )}

        {/* 12. TRAVEL DNA TAB */}
        {currentTab === 'dna' && (
          <TripDNAView />
        )}
      </main>

      {/* Global Modals */}
      {activeTrip && (
        <>
          <WhatIfSimulatorModal
            trip={activeTrip}
            isOpen={whatIfOpen}
            onClose={() => setWhatIfOpen(false)}
            onApplyScenario={handleUpdateActiveTrip}
          />

          <BudgetRescueModal
            trip={activeTrip}
            isOpen={budgetRescueOpen}
            onClose={() => setBudgetRescueOpen(false)}
            onApplySavings={(newCost, strategy) => {
              handleUpdateActiveTrip({
                ...activeTrip,
                totalEstimatedCostINR: newCost,
                summary: `${activeTrip.summary} [Applied ${strategy}]`,
              });
            }}
          />

          <LiveAdaptiveModal
            trip={activeTrip}
            dayNumber={adaptiveModalDay || 1}
            isOpen={adaptiveModalDay !== null}
            onClose={() => setAdaptiveModalDay(null)}
            onAcceptAdaptation={handleUpdateActiveTrip}
          />
        </>
      )}

      <PhotoToTripModal
        isOpen={photoToTripOpen}
        onClose={() => setPhotoToTripOpen(false)}
        onAddDestinationToTrip={(name) => {
          showToast(`Identified and ready to add: ${name}`);
          setCurrentTab('explore');
        }}
      />

      <HeritageCompanionModal
        monumentName={heritageMonument || ''}
        isOpen={Boolean(heritageMonument)}
        onClose={() => setHeritageMonument(null)}
      />

      <GroupConsensusModal
        isOpen={groupConsensusOpen}
        onClose={() => setGroupConsensusOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-stone-800 text-xs mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-stone-200">
              Karnataka AI Travel Planner — Discover Karnataka Your Way
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <button onClick={() => setCurrentTab('dna')} className="hover:text-amber-300">
              Trip DNA
            </button>
            <button onClick={() => setCurrentTab('monsoon')} className="hover:text-amber-300">
              Monsoon Radar
            </button>
            <button onClick={() => setCurrentTab('culture')} className="hover:text-amber-300">
              Kannada Phrases
            </button>
            <button onClick={() => setPhotoToTripOpen(true)} className="hover:text-amber-300">
              Photo-to-Trip
            </button>
            <button onClick={() => setGroupConsensusOpen(true)} className="hover:text-amber-300">
              Group Consensus
            </button>
          </div>

          <div className="text-stone-500 text-[11px]">
            ಕನ್ನಡ ನಾಡು • Real GPS • 100% INR Estimates
          </div>
        </div>
      </footer>
    </div>
  );
}
