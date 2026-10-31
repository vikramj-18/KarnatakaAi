import React, { useState } from 'react';
import { LOCAL_EXPERIENCES } from '../data/experiences';
import { LocalExperienceListing } from '../types/travel';
import {
  ShoppingBag,
  Star,
  Clock,
  Users,
  MapPin,
  ShieldCheck,
  Check,
  X,
  MessageCircle,
  ExternalLink,
  Info,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<LocalExperienceListing | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [travelerName, setTravelerName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [preferredDate, setPreferredDate] = useState('');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setSelectedExperience(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold mb-2">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Community & Verified Local Experiences</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Verified Local Experiences & Artisan Workshops
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Support local Karnataka coffee growers, coracle navigators, toy artisans, and certified heritage storytellers with fair-trade direct host connections.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LOCAL_EXPERIENCES.map((exp) => (
          <div
            key={exp.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 backdrop-blur-sm">
                    {exp.district}
                  </span>
                  {exp.verified && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-900/90 text-emerald-300 backdrop-blur-sm flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-stone-900/90 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
                  ₹{exp.priceINR} / person
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {exp.rating} ({exp.reviewsCount} reviews)
                  </span>
                  <span className="text-stone-400">⏱️ {exp.duration}</span>
                </div>

                <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                  {exp.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {exp.description}
                </p>

                {/* Host snippet */}
                <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                    {exp.hostName.charAt(0)}
                  </div>
                  <div className="truncate">
                    <span className="font-bold block truncate">{exp.hostName}</span>
                    <span className="text-[10px] text-stone-500 block truncate">{exp.hostRole}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedExperience(exp)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs shadow-sm transition-colors"
              >
                View Details & Inquire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Experience Details & Booking Inquiry Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {selectedExperience.category} • {selectedExperience.district}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                  {selectedExperience.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedExperience(null);
                  setBookingSubmitted(false);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-stone-700">
              <img
                src={selectedExperience.imageUrl}
                alt={selectedExperience.title}
                className="w-full h-52 object-cover rounded-2xl"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-emerald-800">
                  Host: {selectedExperience.hostName} ({selectedExperience.hostRole})
                </span>
                <span className="font-extrabold text-amber-800 text-sm">
                  ₹{selectedExperience.priceINR} INR / person
                </span>
              </div>

              <p className="leading-relaxed text-stone-800 font-normal">
                {selectedExperience.description}
              </p>

              {/* Highlights */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <span className="font-bold text-amber-900 block">Experience Highlights:</span>
                {selectedExperience.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-amber-950">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 space-y-1">
                <div>🗣️ <strong>Languages:</strong> {selectedExperience.languages.join(', ')}</div>
                <div>♿ <strong>Accessibility:</strong> {selectedExperience.accessibilityDetails}</div>
                <div>👥 <strong>Group Limit:</strong> Max {selectedExperience.groupSizeLimit} participants</div>
              </div>

              {/* Simulated Booking Form */}
              <div className="pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
                  Request Booking Inquiry
                </h4>

                {bookingSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-center">
                    🎉 Booking Inquiry Sent to {selectedExperience.hostName}!
                    <p className="text-[11px] font-normal mt-1">
                      The host will contact you with availability and meeting point coordinates.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={travelerName}
                        onChange={(e) => setTravelerName(e.target.value)}
                        placeholder="Your Name"
                        className="p-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="p-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                      <select
                        value={partySize}
                        onChange={(e) => setPartySize(Number(e.target.value))}
                        className="p-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} Person{n > 1 ? 's' : ''} (₹{n * selectedExperience.priceINR})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-[10px] text-stone-400 italic">
                      ℹ️ {selectedExperience.contactNote}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedExperience(null)}
                        className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow"
                      >
                        Send Inquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
