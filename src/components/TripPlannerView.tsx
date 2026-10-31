import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Heart,
  Car,
  Utensils,
  Leaf,
  Shield,
  Loader2,
} from 'lucide-react';
import { TripPreferences } from '../types/travel';
import { KARNATAKA_DESTINATIONS, DISTRICT_LIST } from '../data/destinations';

interface TripPlannerViewProps {
  onPlanGenerated: (preferences: TripPreferences) => void;
  isLoading: boolean;
  onCancel?: () => void;
  initialPreferences?: Partial<TripPreferences>;
}

const ALL_INTERESTS = [
  { id: 'Nature & hill stations', label: 'Nature & Hill Stations', icon: '🌲' },
  { id: 'Waterfalls', label: 'Cascading Waterfalls', icon: '🌊' },
  { id: 'Beaches', label: 'Coastal Karavali Beaches', icon: '🏖️' },
  { id: 'Heritage & architecture', label: 'Heritage & Hoysala Architecture', icon: '🏛️' },
  { id: 'Temples & spiritual travel', label: 'Temples & Spiritual Sites', icon: '🛕' },
  { id: 'Wildlife & birdwatching', label: 'Wildlife & Jungle Safaris', icon: '🐅' },
  { id: 'Adventure & trekking', label: 'Trekking & River Rafting', icon: '🧗' },
  { id: 'Food & culinary experiences', label: 'Local Food & Coffee Tasting', icon: '☕' },
  { id: 'Hidden gems', label: 'Offbeat & Hidden Gems', icon: '💎' },
  { id: 'Rural & village tourism', label: 'Rural & Village Homestays', icon: '🏡' },
  { id: 'Shopping & traditional crafts', label: 'Channapatna Toys & Mysore Silk', icon: '🛍️' },
  { id: 'Photography', label: 'Landscape & Architecture Photo', icon: '📸' },
  { id: 'Relaxation & wellness', label: 'Ayurveda & Peaceful Relaxation', icon: '🧘' },
  { id: 'Family attractions', label: 'Family & Child Friendly', icon: '👨‍👩‍👧‍👦' },
];

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  onPlanGenerated,
  isLoading,
  onCancel,
  initialPreferences,
}) => {
  const [step, setStep] = useState(1);

  // Form State with sensible defaults
  const [startingCity, setStartingCity] = useState(initialPreferences?.startingCity || 'Bengaluru');
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>(
    initialPreferences?.selectedDestinationIds || ['hampi', 'mysuru-palace']
  );
  const [durationDays, setDurationDays] = useState<number>(initialPreferences?.durationDays || 3);
  const [startDate, setStartDate] = useState<string>(initialPreferences?.startDate || '');
  const [flexibleDates, setFlexibleDates] = useState(initialPreferences?.flexibleDates ?? true);
  const [adultsCount, setAdultsCount] = useState<number>(initialPreferences?.adultsCount || 2);
  const [childrenCount, setChildrenCount] = useState<number>(initialPreferences?.childrenCount || 0);

  const [interests, setInterests] = useState<string[]>(
    initialPreferences?.interests || ['Heritage & architecture', 'Food & culinary experiences', 'Nature & hill stations']
  );

  const [totalBudgetINR, setTotalBudgetINR] = useState<number>(initialPreferences?.totalBudgetINR || 18000);
  const [budgetType, setBudgetType] = useState<'total' | 'perPerson'>(initialPreferences?.budgetType || 'total');
  const [budgetCategory, setBudgetCategory] = useState<'backpacker' | 'budget' | 'mid-range' | 'premium' | 'luxury'>(
    initialPreferences?.budgetCategory || 'mid-range'
  );

  const [transportPreference, setTransportPreference] = useState<
    'bus' | 'train' | 'private_car' | 'rental_car' | 'bike' | 'mixed'
  >(initialPreferences?.transportPreference || 'private_car');
  const [travelPace, setTravelPace] = useState<'relaxed' | 'balanced' | 'packed'>(
    initialPreferences?.travelPace || 'balanced'
  );
  const [maxDailyTravelHours, setMaxDailyTravelHours] = useState<number>(
    initialPreferences?.maxDailyTravelHours || 5
  );
  const [dietaryPreference, setDietaryPreference] = useState<
    'vegetarian' | 'vegan' | 'non_vegetarian' | 'jain' | 'halal'
  >(initialPreferences?.dietaryPreference || 'vegetarian');
  const [mobilityNeeds, setMobilityNeeds] = useState(initialPreferences?.mobilityNeeds || false);
  const [accommodationType, setAccommodationType] = useState<
    'homestay' | 'resort' | 'heritage_hotel' | 'budget_lodge' | 'camp'
  >(initialPreferences?.accommodationType || 'homestay');
  const [ecoImpactPreference, setEcoImpactPreference] = useState<
    'low_carbon' | 'standard' | 'unrestricted'
  >(initialPreferences?.ecoImpactPreference || 'low_carbon');

  // Toggle interest
  const handleToggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((i) => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  // Toggle destination
  const handleToggleDestination = (id: string) => {
    if (selectedDestinationIds.includes(id)) {
      setSelectedDestinationIds(selectedDestinationIds.filter((d) => d !== id));
    } else {
      setSelectedDestinationIds([...selectedDestinationIds, id]);
    }
  };

  // Submit
  const handleGenerate = () => {
    const preferences: TripPreferences = {
      startingCity,
      selectedDestinationIds,
      durationDays,
      startDate: startDate || undefined,
      flexibleDates,
      travellersCount: adultsCount + childrenCount,
      adultsCount,
      childrenCount,
      interests,
      totalBudgetINR,
      budgetType,
      budgetCategory,
      includeTravelToStart: true,
      transportPreference,
      travelPace,
      maxDailyTravelHours,
      dietaryPreference,
      languages: ['Kannada', 'English'],
      mobilityNeeds,
      ecoImpactPreference,
      accommodationType,
    };
    onPlanGenerated(preferences);
  };

  // Budget validation helper
  const travellers = adultsCount + childrenCount;
  const minRecommendedPerPersonDay = budgetCategory === 'backpacker' ? 1200 : budgetCategory === 'budget' ? 2000 : 3500;
  const minRecommendedTotal = minRecommendedPerPersonDay * durationDays * travellers;
  const budgetWarning = totalBudgetINR < minRecommendedTotal;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Wizard Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 font-semibold text-xs border border-emerald-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Multi-Objective Planning Wizard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Design Your Ideal Karnataka Journey
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Step {step} of 5 — {step === 1 ? 'Trip Basics' : step === 2 ? 'Interests & Vibe' : step === 3 ? 'Budget Planning' : step === 4 ? 'Travel Logistics' : 'Review & Confirm'}
        </p>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-center gap-2 mt-4 max-w-md mx-auto">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => s <= step && setStep(s)}
              className={`flex-1 h-2 rounded-full transition-all ${
                s === step
                  ? 'bg-amber-500 ring-2 ring-amber-300'
                  : s < step
                  ? 'bg-emerald-700'
                  : 'bg-stone-200'
              }`}
              title={`Step ${s}`}
            />
          ))}
        </div>
      </div>

      {/* Wizard Card Body */}
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 sm:p-8 transition-all">
        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                Where does your journey begin?
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Starting hub for your Karnataka road/rail connectivity.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Shivamogga', 'Goa Border', 'Other'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setStartingCity(city)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      startingCity === city
                        ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                Trip Duration & Dates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Days: <span className="text-amber-700 font-bold">{durationDays} Days</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>1 Day Weekend Trip</span>
                    <span>5 Days Classic</span>
                    <span>10 Days Grand Tour</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Approximate Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flexibleDates}
                      onChange={(e) => setFlexibleDates(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>My dates are flexible (recommended for best weather)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                Who is travelling?
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-3 max-w-sm">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Adults (12+ yrs)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                      className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 font-bold text-stone-700 hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-stone-800">{adultsCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount(adultsCount + 1)}
                      className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 font-bold text-stone-700 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Children (under 12)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 font-bold text-stone-700 hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-stone-800">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 font-bold text-stone-700 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Destinations to include */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                Any specific Karnataka destinations you definitely want to include?
              </h3>
              <p className="text-xs text-stone-500 mb-2">
                Leave unselected to let AI pick the best route, or select your must-visit spots:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {KARNATAKA_DESTINATIONS.slice(0, 10).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleToggleDestination(d.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selectedDestinationIds.includes(d.id)
                        ? 'bg-amber-100 text-amber-900 border-amber-400 font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {selectedDestinationIds.includes(d.id) && '✓ '}
                    {d.name.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: INTERESTS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                Select Your Travel Interests
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Select everything that excites you. Gemini AI matches authentic Karnataka destinations to your DNA.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-4">
                {ALL_INTERESTS.map((item) => {
                  const isChecked = interests.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleInterest(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm'
                          : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{item.label}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-emerald-700"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-700" />
                Budget & Spending Style
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                We use genuine local Karnataka rates (homestays, petrol, state buses, meal prices in INR).
              </p>

              {/* Total vs Per Person */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setBudgetType('total')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    budgetType === 'total'
                      ? 'bg-stone-900 text-amber-300 border-stone-900'
                      : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  Total Group Budget
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType('perPerson')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    budgetType === 'perPerson'
                      ? 'bg-stone-900 text-amber-300 border-stone-900'
                      : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  Budget Per Person
                </button>
              </div>

              {/* Budget Input */}
              <div className="mt-4 max-w-sm">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Budget Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="1000"
                    min="2000"
                    value={totalBudgetINR}
                    onChange={(e) => setTotalBudgetINR(Math.max(1000, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2 text-base font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Approx. ₹{Math.round(totalBudgetINR / (durationDays * travellers))} per person per day
                </div>
              </div>

              {/* Budget Warning */}
              {budgetWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2 mt-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Budget Advice:</span> For a {durationDays}-day trip with {travellers} people, ₹{totalBudgetINR} may require budget KSRTC buses and budget lodges. Our Budget Rescue AI will find optimal cost-saving options!
                  </div>
                </div>
              )}

              {/* Tier Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
                {[
                  { id: 'backpacker', label: 'Backpacker', desc: 'Hostels, local buses & messes', approx: '₹1.2k/day' },
                  { id: 'budget', label: 'Budget', desc: 'Budget lodges & shared cabs', approx: '₹2.2k/day' },
                  { id: 'mid-range', label: 'Mid-Range', desc: 'Cozy homestays & private car', approx: '₹3.8k/day' },
                  { id: 'premium', label: 'Premium', desc: 'Heritage boutique & private SUV', approx: '₹6.5k/day' },
                  { id: 'luxury', label: 'Luxury', desc: 'Luxury resort villas & chauffeured', approx: '₹12k+/day' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBudgetCategory(tier.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      budgetCategory === tier.id
                        ? 'bg-emerald-900 text-amber-300 border-emerald-950 shadow'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{tier.label}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{tier.approx}</div>
                    <div className="text-[10px] text-stone-500 mt-1 line-clamp-1">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LOGISTICS */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-700" />
                Transport & Travel Logistics
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
                {[
                  { id: 'private_car', label: 'Private Car / Cab', desc: 'Best for Western Ghats flexibility' },
                  { id: 'train', label: 'Scenic Train + Taxi', desc: 'Green Route & low emissions' },
                  { id: 'bus', label: 'KSRTC State Bus', desc: 'Budget friendly & vast network' },
                  { id: 'rental_car', label: 'Self-Drive Rental', desc: 'Freedom on your schedule' },
                  { id: 'bike', label: 'Motorcycle Tour', desc: 'Adventurous hill ghat riding' },
                  { id: 'mixed', label: 'Mixed Transit', desc: 'Train for long legs, cabs locally' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTransportPreference(t.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      transportPreference === t.id
                        ? 'bg-stone-900 text-amber-300 border-stone-900 shadow'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{t.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Travel Pace: <span className="text-emerald-800 font-bold capitalize">{travelPace}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['relaxed', 'balanced', 'packed'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTravelPace(p)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border ${
                        travelPace === p
                          ? 'bg-emerald-800 text-white border-emerald-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dietary Preference
                </label>
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value as any)}
                  className="w-full p-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="vegetarian">Pure Vegetarian (Sattvic / South Indian)</option>
                  <option value="non_vegetarian">Non-Vegetarian (Coastal seafood, Kodava pork/chicken)</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain (No root vegetables/onion/garlic)</option>
                  <option value="halal">Halal</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mobilityNeeds}
                  onChange={(e) => setMobilityNeeds(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>Traveller with Senior Citizens / Mobility & Wheelchair Needs</span>
              </label>
              <p className="text-[11px] text-stone-500 pl-6 mt-0.5">
                Prioritizes step-free monuments (e.g. Mysore Palace ramps, Malpe Sea Walk) over steep rocky boulder climbs.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                Review Your Trip Blueprint
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Verify your selections. Gemini will construct a feasible day-by-day timetable and budget breakdown.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium">Starting Point & Duration:</span>
                  <div className="font-bold text-stone-800 text-sm mt-0.5">
                    {startingCity} • {durationDays} Days ({travellers} Traveller{travellers > 1 ? 's' : ''})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium">Budget:</span>
                  <div className="font-bold text-stone-800 text-sm mt-0.5">
                    ₹{totalBudgetINR.toLocaleString('en-IN')} ({budgetCategory})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium">Key Interests ({interests.length}):</span>
                  <div className="font-semibold text-emerald-800 mt-0.5 line-clamp-2">
                    {interests.join(', ')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium">Transit & Dietary:</span>
                  <div className="font-bold text-stone-800 mt-0.5 capitalize">
                    {transportPreference.replace('_', ' ')} • {travelPace} pace • {dietaryPreference}
                  </div>
                </div>
              </div>

              {/* Eco tip */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 mt-4">
                <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Eco-Intelligence:</strong> We optimize your route to minimize backtracking along the Western Ghats, reducing fuel emissions by up to 25%.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold shadow transition-colors"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-sm font-extrabold shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Synthesizing Karnataka Route with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Generate AI Itinerary</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
