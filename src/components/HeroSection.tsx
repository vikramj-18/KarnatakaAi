import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Search,
  Compass,
  ArrowRight,
  ShieldCheck,
  CloudSun,
  Camera,
  Coins,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { TRIP_THEMES } from '../data/destinations';

interface HeroSectionProps {
  onStartPlanning: () => void;
  onExploreDestinations: (searchQuery?: string) => void;
  onLaunchCopilot: (initialMessage?: string) => void;
  onOpenPhotoToTrip: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPlanning,
  onExploreDestinations,
  onLaunchCopilot,
  onOpenPhotoToTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onExploreDestinations(searchQuery.trim());
    }
  };

  const sampleSearchQueries = [
    'Hampi ruins & boulders',
    'Chikkamagaluru coffee peaks',
    'Vibhooti falls hidden gem',
    'Gokarna quiet beach trek',
    'Mysore palace illumination',
    'Pure veg Udupi food trail',
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/20 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
      {/* Background Subtle Karnataka Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* State Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>One State. Many Worlds. Powered by Google Gemini AI.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-100 max-w-4xl mx-auto leading-tight sm:leading-none">
          Your Karnataka. Your Journey.{' '}
          <span className="bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Powered by AI.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Craft adaptive, verified itineraries across misty Western Ghats coffee estates,
          coastal Karavali beaches, UNESCO stone temples, and untouched hidden gems.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-stone-800/95 border border-stone-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-amber-400 transition-all"
          >
            <div className="pl-3 text-stone-400">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations (e.g. Hampi, Coorg, Mirjan Fort, Neer Dosa)..."
              className="w-full bg-transparent border-none text-stone-100 placeholder-stone-400 px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs tracking-wide shrink-0 transition-colors shadow"
            >
              Search
            </button>
          </form>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-stone-400">
            <span className="font-semibold text-stone-400">Try searching:</span>
            {sampleSearchQueries.map((q) => (
              <button
                key={q}
                onClick={() => onExploreDestinations(q)}
                className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-[11px] transition-colors border border-stone-700/50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onStartPlanning}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-xl transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onExploreDestinations()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-sm shadow transition-all hover:text-white"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Explore 30+ Places</span>
          </button>

          <button
            onClick={onOpenPhotoToTrip}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-amber-300 border border-amber-500/30 font-semibold text-sm shadow transition-all"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Photo-to-Trip AI</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300">30+</div>
            <div className="text-xs text-stone-400 mt-0.5">Verified Destinations</div>
          </div>
          <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">100%</div>
            <div className="text-xs text-stone-400 mt-0.5">Real GPS & INR Costs</div>
          </div>
          <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="text-xl sm:text-2xl font-extrabold text-teal-300">Monsoon</div>
            <div className="text-xs text-stone-400 mt-0.5">Smart Safety Radar</div>
          </div>
          <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400">ಕನ್ನಡ</div>
            <div className="text-xs text-stone-400 mt-0.5">Voice Travel Copilot</div>
          </div>
        </div>
      </div>
    </div>
  );
};
