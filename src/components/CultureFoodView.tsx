import React, { useState } from 'react';
import { REGIONAL_CUISINES, KANNADA_PHRASES, KannadaPhrase } from '../data/kannadaCulture';
import { speakText, stopSpeaking } from '../services/audio';
import {
  UtensilsCrossed,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  Coffee,
  Heart,
} from 'lucide-react';

export const CultureFoodView: React.FC = () => {
  const [selectedPhraseCategory, setSelectedPhraseCategory] = useState<string>('All');
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Vegetarian' | 'Vegan' | 'Non-Vegetarian'>('All');

  const handlePlayAudio = (phrase: KannadaPhrase) => {
    if (playingPhraseId === phrase.id) {
      stopSpeaking();
      setPlayingPhraseId(null);
      return;
    }

    setPlayingPhraseId(phrase.id);
    speakText(phrase.kannada, 'kn-IN').finally(() => {
      setPlayingPhraseId(null);
    });
  };

  const phraseCategories = ['All', 'Greetings', 'Directions & Travel', 'Dining & Food', 'Shopping & Bargaining', 'Emergencies'];

  const filteredPhrases = KANNADA_PHRASES.filter((p) => {
    if (selectedPhraseCategory === 'All') return true;
    return p.category === selectedPhraseCategory;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-xs font-semibold mb-2">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Karnataka Culture & Culinary Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Savor Karnataka: Regional Flavors & Spoken Kannada
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Discover how each region’s geography shapes its cuisine—from cloud-soft Neer Dosa along the Arabian Sea to smoky Jolada Rotti in the North and royal Mysore Pak.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE KANNADA AUDIO PHRASEBOOK */}
      <div className="mt-8 bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400">Audio Guide</span>
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2 mt-0.5">
              <span>Essential Spoken Kannada Phrasebook</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                ಕನ್ನಡ
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Tap the speaker icon on any card to hear authentic pronunciation. Locals cherish when travellers speak a few words!
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 text-xs">
          {phraseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedPhraseCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedPhraseCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Phrases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {filteredPhrases.map((phrase) => {
            const isPlaying = playingPhraseId === phrase.id;
            return (
              <div
                key={phrase.id}
                className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-lg font-bold text-amber-300 tracking-wide font-serif">
                      {phrase.kannada}
                    </span>
                    <button
                      onClick={() => handlePlayAudio(phrase)}
                      className={`p-2 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-stone-700 text-stone-300 hover:bg-amber-500 hover:text-stone-950'
                      }`}
                      title="Listen to pronunciation"
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-emerald-400 mt-1">
                    "{phrase.transliteration}"
                  </div>

                  <div className="text-xs text-stone-300 mt-1 font-normal">
                    {phrase.english}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-700/60 flex items-center justify-between text-[10px] text-stone-400">
                  <span>Phonetic: <i>{phrase.audioHint}</i></span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 font-mono">
                    {phrase.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: REGIONAL CUISINE SPECIALTIES */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">
              Regional Karnataka Cuisines & Must-Eat Dishes
            </h3>
            <p className="text-xs text-stone-500">
              Filtered for authentic iconic preparations and recommended heritage eateries
            </p>
          </div>

          {/* Dietary Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-stone-100 p-1 rounded-xl">
            {(['All', 'Vegetarian', 'Vegan', 'Non-Vegetarian'] as const).map((diet) => (
              <button
                key={diet}
                onClick={() => setDietaryFilter(diet)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  dietaryFilter === diet
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {REGIONAL_CUISINES.map((region, rIdx) => {
            const dishes = region.signatureDishes.filter((dish) => {
              if (dietaryFilter === 'All') return true;
              return dish.dietary === dietaryFilter;
            });

            if (dishes.length === 0) return null;

            return (
              <div key={rIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="border-b border-stone-100 pb-3 mb-4">
                  <h4 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    <span>{region.regionName}</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">{region.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishes.map((dish, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-stone-900 text-sm">{dish.name}</h5>
                          <span className="text-sm text-amber-900 font-serif font-bold">
                            {dish.kannadaName}
                          </span>
                        </div>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          dish.dietary === 'Vegetarian'
                            ? 'bg-green-100 text-green-800'
                            : dish.dietary === 'Vegan'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {dish.dietary}
                        </span>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-amber-200/50 text-[11px] text-amber-950 font-medium">
                        📍 <strong>Iconic Spot:</strong> {dish.bestPlaceToEat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
