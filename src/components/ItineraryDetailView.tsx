import React, { useState } from 'react';
import {
  SavedTrip,
  ItineraryDay,
  ItineraryStop,
  Destination,
} from '../types/travel';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Wallet,
  Car,
  Sparkles,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Sliders,
  DollarSign,
  CloudRain,
  Compass,
  ArrowRight,
  Info,
  Volume2,
} from 'lucide-react';
import { KarnatakaMap } from './KarnatakaMap';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';

interface ItineraryDetailViewProps {
  trip: SavedTrip;
  onSaveTrip: (trip: SavedTrip) => void;
  onUpdateTrip: (trip: SavedTrip) => void;
  onOpenWhatIf: () => void;
  onOpenBudgetRescue: () => void;
  onOpenAdaptiveReplan: (dayNumber: number) => void;
  onOpenHeritageGuide?: (monumentName: string) => void;
}

export const ItineraryDetailView: React.FC<ItineraryDetailViewProps> = ({
  trip,
  onSaveTrip,
  onUpdateTrip,
  onOpenWhatIf,
  onOpenBudgetRescue,
  onOpenAdaptiveReplan,
  onOpenHeritageGuide,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [selectedMapDest, setSelectedMapDest] = useState<Destination | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const activeDay: ItineraryDay | undefined = trip.days[activeDayIndex];

  // Toggle stop completion
  const handleToggleStopComplete = (dayNum: number, stopId: string) => {
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber !== dayNum) return d;
      return {
        ...d,
        stops: d.stops.map((s) => (s.id === stopId ? { ...s, isCompleted: !s.isCompleted } : s)),
      };
    });
    const updatedTrip = { ...trip, days: updatedDays };
    onUpdateTrip(updatedTrip);
  };

  // Safe Share
  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out my Karnataka Trip: "${trip.tripTitle}" - ${trip.days.length} Days across Karnataka with estimated budget ₹${trip.totalEstimatedCostINR} INR!`
    );
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Regenerate single day locally
  const handleRegenerateDay = (dayNum: number) => {
    const randomGems = KARNATAKA_DESTINATIONS.filter((d) => d.isOffbeat);
    const gem = randomGems[Math.floor(Math.random() * randomGems.length)];
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber !== dayNum) return d;
      const newStop: ItineraryStop = {
        id: `reg-${Date.now()}`,
        name: gem.name,
        destinationId: gem.id,
        category: gem.category,
        timeSlot: '02:00 PM - 05:00 PM',
        durationHours: gem.recommendedDurationHours,
        description: gem.shortDescription,
        approxCostINR: gem.avgCostINR,
        tip: gem.bestTimeToVisitDaily,
        verified: true,
        travelFromPrevious: {
          mode: 'Scenic Cab / Transit',
          durationMinutes: 40,
          distanceKm: 28,
        },
      };
      return {
        ...d,
        title: `Day ${dayNum}: ${gem.district} (Fresh Recommendation)`,
        stops: [d.stops[0] || newStop, newStop],
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Trip Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800/80 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified AI Karnataka Plan</span>
              <span className="text-stone-400">•</span>
              <span>{trip.days.length} Days</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight leading-tight">
              {trip.tripTitle}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              {trip.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300">
              <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Est. Total: <strong className="text-amber-300">₹{trip.totalEstimatedCostINR.toLocaleString('en-IN')}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                From {trip.preferences.startingCity || 'Bengaluru'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 capitalize flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-teal-400" />
                {trip.preferences.transportPreference.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? 'Link Copied!' : 'Share Trip'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => onOpenAdaptiveReplan(activeDayIndex + 1)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
            >
              <CloudRain className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Replan</span>
            </button>

            <button
              onClick={onOpenBudgetRescue}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budget Rescue</span>
            </button>

            <button
              onClick={onOpenWhatIf}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>What-If Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warnings & Alerts Banner */}
      {trip.seasonalAlerts && trip.seasonalAlerts.length > 0 && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Monsoon & Travel Safety Advisories:</span>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {trip.seasonalAlerts.map((alert, idx) => (
                <li key={idx}>{alert}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* View Switcher & Day Tabs */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
        {/* Day Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {trip.days.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeDayIndex === idx
                  ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-emerald-700/50'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-end">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            GPS Map View
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="mt-6">
          <KarnatakaMap
            destinations={KARNATAKA_DESTINATIONS}
            activeItineraryDays={trip.days}
            highlightedDayNumber={activeDay ? activeDay.dayNumber : null}
            selectedDestination={selectedMapDest}
            onSelectDestination={(d) => setSelectedMapDest(d)}
            onOpenHeritageGuide={onOpenHeritageGuide}
            heightClass="h-[620px]"
          />
        </div>
      ) : activeDay ? (
        <div className="mt-6 space-y-6">
          {/* Day Summary Card */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                {activeDay.theme}
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                {activeDay.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                <span>📍 Stay: <strong>{activeDay.stayLocation}</strong></span>
                <span>💰 Daily Budget: <strong>₹{activeDay.dailyEstimatedBudgetINR}</strong></span>
              </div>
            </div>

            <button
              onClick={() => handleRegenerateDay(activeDay.dayNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition-colors shrink-0"
              title="Replace day stops with fresh alternative spots"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Day</span>
            </button>
          </div>

          {/* Timeline of Stops */}
          <div className="space-y-4">
            {activeDay.stops.map((stop, sIdx) => {
              const matchedDest = KARNATAKA_DESTINATIONS.find(
                (d) => d.id === stop.destinationId || d.name === stop.name
              );

              return (
                <div
                  key={stop.id || sIdx}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all relative ${
                    stop.isCompleted ? 'border-emerald-300 bg-emerald-50/30' : 'border-stone-200'
                  }`}
                >
                  {/* Transit from previous indicator */}
                  {stop.travelFromPrevious && sIdx > 0 && (
                    <div className="mb-4 pb-3 border-b border-stone-100 flex items-center gap-2 text-xs text-stone-500">
                      <Car className="w-4 h-4 text-amber-600" />
                      <span>
                        Travel ~{stop.travelFromPrevious.durationMinutes} mins ({stop.travelFromPrevious.distanceKm} km) via {stop.travelFromPrevious.mode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-xs">
                          {stop.timeSlot}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          ⏱️ {stop.durationHours} hrs
                        </span>
                        {stop.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-stone-900 mt-1 flex items-center gap-2">
                        <span>{stop.name}</span>
                        {matchedDest?.isOffbeat && (
                          <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                            Hidden Gem
                          </span>
                        )}
                      </h4>

                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {stop.description}
                      </p>

                      {stop.tip && (
                        <div className="mt-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span>
                            <strong>Pro Tip:</strong> {stop.tip}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Completion and Heritage Guide Trigger */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleStopComplete(activeDay.dayNumber, stop.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          stop.isCompleted
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{stop.isCompleted ? 'Completed' : 'Mark Visited'}</span>
                      </button>

                      {onOpenHeritageGuide && stop.category.includes('Heritage') && (
                        <button
                          onClick={() => onOpenHeritageGuide(stop.name)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>AI Audio Guide</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Category: <strong>{stop.category}</strong></span>
                    <span>Approx Entry/Activity: <strong className="text-stone-800">₹{stop.approxCostINR}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Authentic Meals Strip */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800">
            <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-amber-400" />
              Day {activeDay.dayNumber} Authentic Karnataka Culinary Trail
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">Breakfast</span>
                <span className="font-bold text-stone-200 mt-1 block">{activeDay.mealRecommendations.breakfast}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">Lunch</span>
                <span className="font-bold text-stone-200 mt-1 block">{activeDay.mealRecommendations.lunch}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">Dinner</span>
                <span className="font-bold text-stone-200 mt-1 block">{activeDay.mealRecommendations.dinner}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
