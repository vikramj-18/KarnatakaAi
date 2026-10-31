import React from 'react';
import { KARNATAKA_SEASONAL_INTELLIGENCE, KARNATAKA_EMERGENCY_CONTACTS } from '../data/kannadaCulture';
import {
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Sun,
  Compass,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export const SeasonalIntelligenceView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold mb-2">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Karnataka Monsoon & Seasonal Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Seasonal Weather Windows & Travel Safety Radar
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Karnataka spans coastal tropical seas, rainforest Western Ghats crests, and arid northern plains. Plan with authoritative seasonal guidelines and road safety intelligence.
        </p>
      </div>

      {/* Emergency Contacts Directory */}
      <div className="mt-6 bg-red-950 text-white rounded-3xl p-6 shadow-xl border border-red-900">
        <div className="flex items-center gap-2 mb-3">
          <PhoneCall className="w-5 h-5 text-red-400" />
          <h3 className="font-extrabold text-base">Verified Karnataka Traveller Emergency Numbers</h3>
        </div>
        <p className="text-xs text-red-200 mb-4">
          Save these verified 24x7 helpline numbers offline before heading into deep Western Ghats valleys or remote trails.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {KARNATAKA_EMERGENCY_CONTACTS.map((contact, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-red-900/60 border border-red-800">
              <span className="text-[10px] uppercase font-bold text-red-300 block">{contact.name}</span>
              <a
                href={`tel:${contact.number.replace(/\s+/g, '')}`}
                className="text-base font-extrabold text-amber-300 hover:underline block mt-0.5"
              >
                {contact.number}
              </a>
              <span className="text-[10px] text-red-200 block mt-0.5">{contact.notes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Breakdown Cards */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-bold text-stone-900">
          Regional Seasonal Guidelines & Trekking Protocols
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {KARNATAKA_SEASONAL_INTELLIGENCE.map((season, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">{season.months}</span>
                    <h4 className="font-extrabold text-stone-900 text-base mt-0.5">{season.seasonName}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    season.status === 'Peak Best Window'
                      ? 'bg-emerald-100 text-emerald-800'
                      : season.status === 'Monsoon Adventure'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {season.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs text-stone-700">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <strong className="text-emerald-900 block mb-0.5">🌲 Western Ghats (Malenadu):</strong>
                    <span className="text-stone-600 leading-relaxed">{season.westernGhatsAdvice}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <strong className="text-blue-900 block mb-0.5">🏖️ Coastal (Karavali):</strong>
                    <span className="text-stone-600 leading-relaxed">{season.coastalAdvice}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <strong className="text-amber-900 block mb-0.5">🏛️ Heritage Plains (Hampi / Badami):</strong>
                    <span className="text-stone-600 leading-relaxed">{season.heritagePlainsAdvice}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-950 border border-purple-200">
                    <strong className="block mb-0.5">🥾 Forest Dept Trekking Permits:</strong>
                    <span>{season.trekkingPermitStatus}</span>
                  </div>
                </div>
              </div>

              {/* Cautions */}
              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="font-bold text-amber-900 text-[11px] block mb-1">
                  ⚠️ Safety Precautions:
                </span>
                <ul className="space-y-0.5 text-[11px] text-stone-600">
                  {season.safetyCautions.map((c, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
