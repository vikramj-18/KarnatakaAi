import React, { useState, useEffect } from 'react';
import { Destination, ItineraryDay } from '../types/travel';
import {
  Search,
  Navigation,
  Compass,
  MapPin,
  Layers,
  Star,
  Clock,
  ExternalLink,
  Plus,
  Volume2,
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  Car,
  Train,
  Check,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface KarnatakaMapProps {
  destinations: Destination[];
  selectedDestination?: Destination | null;
  onSelectDestination?: (dest: Destination) => void;
  activeItineraryDays?: ItineraryDay[];
  highlightedDayNumber?: number | null;
  onAddStopToPlan?: (dest: Destination) => void;
  onOpenHeritageGuide?: (monumentName: string) => void;
  heightClass?: string;
}

export const KarnatakaMap: React.FC<KarnatakaMapProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  activeItineraryDays,
  highlightedDayNumber,
  onAddStopToPlan,
  onOpenHeritageGuide,
  heightClass = 'h-[720px]',
}) => {
  const [activePlace, setActivePlace] = useState<Destination>(
    selectedDestination || destinations[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = Roadmap, 'k' = Satellite
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDirectionsMode, setIsDirectionsMode] = useState(false);
  const [originCity, setOriginCity] = useState('Bengaluru, Karnataka');
  const [travelMode, setTravelMode] = useState<'driving' | 'transit'>('driving');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync selected destination from props
  useEffect(() => {
    if (selectedDestination) {
      setActivePlace(selectedDestination);
      setZoomLevel(14);
      setIsSidebarOpen(true);
    }
  }, [selectedDestination]);

  // Filtered destination list for the Google Maps left explorer sidebar
  const filteredDestinations = destinations.filter((d) => {
    if (filterCategory !== 'all' && d.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSelectPlace = (dest: Destination) => {
    setActivePlace(dest);
    setZoomLevel(14);
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
    setIsSidebarOpen(true);
  };

  // Build authentic Google Maps Embed URL
  const queryParam = isDirectionsMode
    ? `${encodeURIComponent(originCity)}+to+${encodeURIComponent(activePlace.name + ', Karnataka')}`
    : `${activePlace.latitude},${activePlace.longitude}`;

  const embedUrl = `https://maps.google.com/maps?q=${queryParam}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  // External Google Maps directions URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    originCity
  )}&destination=${encodeURIComponent(activePlace.name + ' ' + activePlace.district + ' Karnataka')}`;

  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activePlace.name + ' ' + activePlace.district + ' Karnataka'
  )}`;

  const handleShare = () => {
    navigator.clipboard.writeText(googleMapsViewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className={`relative w-full ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : `${heightClass} rounded-3xl`
      } overflow-hidden shadow-2xl border border-stone-300 bg-stone-100 flex flex-col font-sans select-none`}
    >
      {/* 1. GOOGLE MAPS FLOATING SEARCH & CONTROLS HEADER */}
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex flex-wrap items-start justify-between gap-3">
        {/* Left: Google Search Bar & Filter Strip */}
        <div className="pointer-events-auto flex flex-col gap-2 w-full sm:max-w-md">
          {/* Main Google Maps White Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 p-2 flex items-center gap-2">
            {/* Google Logo / Search Icon */}
            <div className="pl-1.5 flex items-center gap-1.5 text-stone-600">
              <span className="font-extrabold text-sm tracking-tight text-blue-600">G</span>
              <span className="font-extrabold text-sm tracking-tight text-red-500">o</span>
              <span className="font-extrabold text-sm tracking-tight text-amber-500">o</span>
              <span className="font-extrabold text-sm tracking-tight text-blue-600">g</span>
              <span className="font-extrabold text-sm tracking-tight text-green-600">l</span>
              <span className="font-extrabold text-sm tracking-tight text-red-500">e</span>
              <span className="text-xs font-semibold text-stone-500 ml-1">Maps</span>
            </div>

            <div className="h-4 w-px bg-stone-200 mx-1" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Karnataka places, temples, hills..."
              className="flex-1 bg-transparent border-none text-xs text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Directions Toggle Button (Google Blue Diamond) */}
            <button
              onClick={() => setIsDirectionsMode(!isDirectionsMode)}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isDirectionsMode
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
              title="Google Maps Turn-by-Turn Directions"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Directions Mode Inputs */}
          {isDirectionsMode && (
            <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-3 space-y-2 animate-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-700 text-[11px]">
                <span className="flex items-center gap-1 text-blue-600">
                  <Navigation className="w-3.5 h-3.5" /> Google Directions
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTravelMode('driving')}
                    className={`p-1 rounded-md ${
                      travelMode === 'driving' ? 'bg-blue-100 text-blue-800' : 'text-stone-400'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTravelMode('transit')}
                    className={`p-1 rounded-md ${
                      travelMode === 'transit' ? 'bg-blue-100 text-blue-800' : 'text-stone-400'
                    }`}
                  >
                    <Train className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsDirectionsMode(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-stone-400 bg-white inline-block" />
                  <input
                    type="text"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Starting point (e.g. Bengaluru)"
                    className="flex-1 p-1.5 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                  <input
                    type="text"
                    disabled
                    value={`${activePlace.name}, ${activePlace.district}`}
                    className="flex-1 p-1.5 border border-stone-200 rounded-lg text-xs bg-stone-50 font-bold text-stone-800"
                  />
                </div>
              </div>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
              >
                <span>Navigate in Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs">
            {[
              { id: 'all', label: 'All Sights' },
              { id: 'Heritage & Temples', label: '🏛️ Heritage' },
              { id: 'Hill Station & Nature', label: '🌲 Western Ghats' },
              { id: 'Beaches & Coastline', label: '🏖️ Karavali' },
              { id: 'Offbeat & Hidden Gem', label: '💎 Hidden Gems' },
              { id: 'Wildlife & Safari', label: '🐅 Safari' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap text-xs shadow-md transition-all ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : 'bg-white/95 hover:bg-white text-stone-700 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Action Stack: Toggle Sidebar, Layer, Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Layer switcher: Map vs Satellite */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 p-1 flex items-center gap-1 text-xs">
            <button
              onClick={() => setMapType('m')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                mapType === 'm'
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('k')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                mapType === 'k'
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Satellite
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-10 h-10 rounded-2xl bg-white/95 shadow-xl border border-stone-200 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href={googleMapsViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 hover:bg-white text-blue-600 font-bold text-xs shadow-xl border border-stone-200 transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. MAIN MAP VIEWPORT + COLLAPSIBLE GOOGLE PLACE SIDEBAR */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Left Google Place Detail & Explorer Panel */}
        {isSidebarOpen && (
          <aside className="absolute md:relative top-16 md:top-0 bottom-0 left-0 z-20 w-full sm:w-96 bg-white border-r border-stone-200/90 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Active Place Header Photo */}
            <div className="relative h-48 bg-stone-900 shrink-0 overflow-hidden">
              <img
                src={activePlace.imageUrl}
                alt={activePlace.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

              {/* Close / Minimize sidebar */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-stone-900"
                title="Collapse Panel"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                  {activePlace.district} • {activePlace.category}
                </span>
                <h3 className="font-extrabold text-lg leading-tight mt-1 text-white drop-shadow">
                  {activePlace.name}
                </h3>
              </div>
            </div>

            {/* Place Metadata & Google Actions Strip */}
            <div className="p-4 border-b border-stone-100 space-y-3 shrink-0">
              {/* Google Ratings & Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-extrabold text-amber-500 text-sm">4.8</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="text-stone-400">(18,420+ reviews)</span>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-stone-700">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex flex-col items-center gap-1 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Directions</span>
                </a>

                {onAddStopToPlan && (
                  <button
                    onClick={() => onAddStopToPlan(activePlace)}
                    className="p-2 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex flex-col items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-700" />
                    <span>Add to Trip</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="p-2 rounded-2xl bg-stone-50 hover:bg-stone-100 flex flex-col items-center gap-1 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-stone-600" />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>

                <a
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activePlace.latitude},${activePlace.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-2xl bg-amber-50 text-amber-800 hover:bg-amber-100 flex flex-col items-center gap-1 transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span>360° View</span>
                </a>
              </div>

              {/* Heritage audio guide action */}
              {onOpenHeritageGuide && activePlace.category.includes('Heritage') && (
                <button
                  onClick={() => onOpenHeritageGuide(activePlace.name)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Listen to Heritage Audio Guide</span>
                </button>
              )}
            </div>

            {/* Scrollable Place Details & Other Karnataka Sights */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-stone-600">
              <p className="leading-relaxed font-normal text-stone-700">
                {activePlace.longDescription}
              </p>

              <div className="space-y-2 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hours:</strong> {activePlace.openingHours}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>GPS Coordinates:</strong> {activePlace.latitude.toFixed(4)}° N,{' '}
                    {activePlace.longitude.toFixed(4)}° E
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-stone-400">💰</span>
                  <span>
                    <strong>Average Cost:</strong> ~₹{activePlace.avgCostINR} INR
                  </span>
                </div>
              </div>

              {/* Local Food Snippet */}
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-950 border border-amber-200">
                <strong className="block mb-1 text-amber-900">🍛 Nearby Must-Try Food:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {activePlace.mustTryFood.map((food, idx) => (
                    <li key={idx}>{food}</li>
                  ))}
                </ul>
              </div>

              {/* More Karnataka Places List */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between font-bold text-stone-800 mb-2">
                  <span>Explore Other Karnataka Places</span>
                  <span className="text-[10px] text-stone-400">
                    {filteredDestinations.length} available
                  </span>
                </div>

                <div className="space-y-2">
                  {filteredDestinations
                    .filter((d) => d.id !== activePlace.id)
                    .map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleSelectPlace(dest)}
                        className="p-2 rounded-xl border border-stone-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center gap-2.5"
                      >
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 truncate">
                          <span className="font-bold text-stone-800 block truncate">
                            {dest.name}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {dest.district} • {dest.category}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Collapsed Sidebar Toggle Pill */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-20 left-4 z-20 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-50 flex items-center gap-1.5 transition-all"
          >
            <ChevronRight className="w-4 h-4 text-blue-600" />
            <span>Show Place Details</span>
          </button>
        )}

        {/* 3. OFFICIAL GOOGLE MAPS EMBED LIVE ENGINE */}
        <div className="w-full h-full relative bg-stone-200 flex items-center justify-center">
          <iframe
            title="Official Google Maps View"
            src={embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Quick Zoom & Control Overlay (Bottom-Right) */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 18))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-stone-700 hover:bg-stone-100 transition-colors border-b border-stone-100"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 6))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                title="Zoom Out"
              >
                −
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
