import React, { useState } from 'react';
import { Destination } from '../types/travel';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  Calendar,
  Shield,
  Plus,
  Info,
  ExternalLink,
  X,
  Volume2,
} from 'lucide-react';

interface ExploreKarnatakaViewProps {
  onAddDestinationToPlan?: (dest: Destination) => void;
  onOpenHeritageGuide?: (monumentName: string) => void;
  initialQuery?: string;
}

export const ExploreKarnatakaView: React.FC<ExploreKarnatakaViewProps> = ({
  onAddDestinationToPlan,
  onOpenHeritageGuide,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [onlyOffbeat, setOnlyOffbeat] = useState(false);
  const [onlyMonsoonSafe, setOnlyMonsoonSafe] = useState(false);
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  const filteredDestinations = KARNATAKA_DESTINATIONS.filter((d) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.mustTryFood.some((f) => f.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Region filter
    if (selectedRegion !== 'all' && d.region !== selectedRegion) {
      return false;
    }

    // Offbeat hidden gem filter
    if (onlyOffbeat && !d.isOffbeat) return false;

    // Monsoon safe filter
    if (onlyMonsoonSafe && !d.monsoonSafe) return false;

    // Accessible filter
    if (onlyAccessible && d.accessibilityScore < 3) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Karnataka Destination Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Explore 30+ Verified Karnataka Destinations
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            From the UNESCO boulder capital of Hampi to emerald coffee estates in the Western Ghats and secluded Karavali beach coves.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
            {filteredDestinations.length} places shown
          </span>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="mt-6 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination name, district, or dish (e.g. Coorg, Hampi, Badami, Neer Dosa)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-stone-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'Heritage & Royal Karnataka', label: 'Heritage & Royal' },
            { id: 'Western Ghats & Malenadu', label: 'Western Ghats & Coffee' },
            { id: 'Coastal Karnataka (Karavali)', label: 'Coastal Karavali' },
            { id: 'Nature, Waterfalls & Wildlife', label: 'Waterfalls & Wildlife' },
            { id: 'Urban, Culture & Plains', label: 'Urban & Culture' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedRegion === r.id
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Checkbox Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700">
          <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              checked={onlyOffbeat}
              onChange={(e) => setOnlyOffbeat(e.target.checked)}
              className="rounded text-pink-600 focus:ring-pink-500"
            />
            <span className="font-semibold text-pink-900">💎 Hidden Gems Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              checked={onlyMonsoonSafe}
              onChange={(e) => setOnlyMonsoonSafe(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>🌧️ Monsoon Safe Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              checked={onlyAccessible}
              onChange={(e) => setOnlyAccessible(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>♿ Wheelchair / Step-Free Accessible</span>
          </label>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            {/* Image Header */}
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 backdrop-blur-sm border border-stone-700">
                  {dest.district}
                </span>
                {dest.isOffbeat && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-900/90 text-pink-200 backdrop-blur-sm border border-pink-700">
                    Hidden Gem
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-extrabold text-base leading-tight drop-shadow">
                  {dest.name}
                </h3>
                <span className="text-[11px] text-stone-300 font-medium">{dest.category}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {dest.shortDescription}
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <div>⏱️ <strong>{dest.recommendedDurationHours}h</strong> recommended</div>
                <div>💰 Est. <strong>₹{dest.avgCostINR}</strong></div>
                <div>👥 Crowd: <strong>{dest.crowdLevel}</strong></div>
                <div>🌱 Eco Score: <strong>{dest.ecoScore}/10</strong></div>
              </div>

              {/* Food Tag snippet */}
              {dest.mustTryFood.length > 0 && (
                <div className="text-[11px] bg-amber-50/80 p-2 rounded-xl text-amber-900 border border-amber-200/50">
                  <span className="font-bold">Must-Eat:</span> {dest.mustTryFood[0]}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalDest(dest)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  View Details
                </button>

                {onAddDestinationToPlan && (
                  <button
                    onClick={() => onAddDestinationToPlan(dest)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Plan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 mt-8">
          <p className="text-stone-500 text-sm">No destinations matched your search filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('all');
              setOnlyOffbeat(false);
              setOnlyMonsoonSafe(false);
              setOnlyAccessible(false);
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-800 text-amber-300 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Destination Detail Modal */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {activeModalDest.district} • {activeModalDest.region}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-1">{activeModalDest.name}</h3>
              </div>
              <button
                onClick={() => setActiveModalDest(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-stone-700">
              <img
                src={activeModalDest.imageUrl}
                alt={activeModalDest.name}
                className="w-full h-56 object-cover rounded-2xl"
              />

              <p className="leading-relaxed text-sm text-stone-800 font-normal">
                {activeModalDest.longDescription}
              </p>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div>⏰ <strong>Opening Hours:</strong> {activeModalDest.openingHours}</div>
                <div>☀️ <strong>Best Daily Window:</strong> {activeModalDest.bestTimeToVisitDaily}</div>
                <div>🗓️ <strong>Best Months:</strong> {activeModalDest.bestMonths.join(', ')}</div>
                <div>🌧️ <strong>Monsoon Condition:</strong> {activeModalDest.monsoonNotes}</div>
                <div>♿ <strong>Accessibility (Score {activeModalDest.accessibilityScore}/5):</strong> {activeModalDest.accessibilityDetails}</div>
              </div>

              {/* Must-Try Cuisine */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">🍛 Authentic Regional Specialties:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-950">
                  {activeModalDest.mustTryFood.map((food, idx) => (
                    <li key={idx}>{food}</li>
                  ))}
                </ul>
              </div>

              {/* Nearby Hidden Gems */}
              {activeModalDest.nearbyHiddenGems.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200">
                  <span className="font-bold text-pink-900 block mb-1">💎 Nearby Hidden Gems to Pair:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-pink-950">
                    {activeModalDest.nearbyHiddenGems.map((gem, idx) => (
                      <li key={idx}>{gem}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activeModalDest.name + ' Karnataka'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on Google Maps
              </a>

              <div className="flex items-center gap-2">
                {onOpenHeritageGuide && activeModalDest.category.includes('Heritage') && (
                  <button
                    onClick={() => {
                      onOpenHeritageGuide(activeModalDest.name);
                      setActiveModalDest(null);
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Audio Guide
                  </button>
                )}

                {onAddDestinationToPlan && (
                  <button
                    onClick={() => {
                      onAddDestinationToPlan(activeModalDest);
                      setActiveModalDest(null);
                    }}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to Trip
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
