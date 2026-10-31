import React, { useState } from 'react';
import { TravelDNAProfile } from '../types/travel';
import { getTravelDNA, saveTravelDNA, DEFAULT_TRAVEL_DNA } from '../services/storage';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  Compass,
  RotateCcw,
  Heart,
  TrendingUp,
} from 'lucide-react';

export const TripDNAView: React.FC = () => {
  const [profile, setProfile] = useState<TravelDNAProfile>(getTravelDNA());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key: keyof TravelDNAProfile, value: number) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveTravelDNA(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    setProfile(DEFAULT_TRAVEL_DNA);
    saveTravelDNA(DEFAULT_TRAVEL_DNA);
  };

  const dnaSliders: {
    key: keyof TravelDNAProfile;
    title: string;
    leftLabel: string;
    rightLabel: string;
    description: string;
  }[] = [
    {
      key: 'natureVsCulture',
      title: 'Landscape Preference',
      leftLabel: 'Western Ghats Nature',
      rightLabel: 'Hoysala Heritage',
      description: 'Balances rainforests & waterfalls vs. centuries of temple architecture and royal palaces.',
    },
    {
      key: 'adventureVsRelaxation',
      title: 'Activity Vibe',
      leftLabel: 'Peaceful Relaxation',
      rightLabel: 'River Rafting & Treks',
      description: 'Determines whether your itinerary favors coffee estate hammocks or Kali River rapids.',
    },
    {
      key: 'budgetVsLuxury',
      title: 'Comfort Threshold',
      leftLabel: 'Rustic Backpacker',
      rightLabel: 'Heritage Boutique Luxury',
      description: 'Shapes recommendations between local homestays and royal estate bungalows.',
    },
    {
      key: 'popularVsOffbeat',
      title: 'Discovery Style',
      leftLabel: 'Iconic Must-Sees',
      rightLabel: 'Untold Hidden Gems',
      description: 'Controls weighting of world-famous sights vs. quiet village ruins and secret cascades.',
    },
    {
      key: 'foodEnthusiasm',
      title: 'Culinary Curiosity',
      leftLabel: 'Familiar Comfort Meals',
      rightLabel: 'Adventurous Regional Food',
      description: 'Enables deep-dive food stops for Mangalore Ghee Roast, Dharwad Peda, and authentic Udupi meals.',
    },
    {
      key: 'travelPace',
      title: 'Daily Cadence',
      leftLabel: 'Slow & Gentle (1-2 stops)',
      rightLabel: 'Energetic & Packed (4+ stops)',
      description: 'Sets daily activity density and allowed travel duration.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Trip DNA Personalization Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Your Karnataka Travel Personality Profile
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Fine-tune your personal travel instincts. Our recommendation engine uses this DNA to personalize route recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Profile Saved!' : 'Save Travel DNA'}</span>
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="mt-8 space-y-6">
        {dnaSliders.map((slider) => {
          const val = profile[slider.key];
          return (
            <div
              key={slider.key}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-stone-900 text-sm">{slider.title}</h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {val}%
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                {slider.description}
              </p>

              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => handleChange(slider.key, Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />

                <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mt-1">
                  <span>← {slider.leftLabel}</span>
                  <span>{slider.rightLabel} →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
