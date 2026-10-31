import React, { useState } from 'react';
import { SavedTrip } from '../types/travel';
import {
  Sliders,
  X,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Wallet,
  Leaf,
  Users,
  CloudRain,
  Check,
} from 'lucide-react';

interface WhatIfSimulatorModalProps {
  trip: SavedTrip;
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (updatedTrip: SavedTrip) => void;
}

interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  costDiffINR: number;
  timeDiffHours: number;
  crowdLevel: string;
  ecoScoreDelta: number;
  intensity: 'More Relaxed' | 'Balanced' | 'More Packed';
  keyChanges: string[];
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  trip,
  isOpen,
  onClose,
  onApplyScenario,
}) => {
  if (!isOpen) return null;

  const scenarios: ScenarioOption[] = [
    {
      id: 'extra_day',
      title: 'What if I add +1 Extra Day?',
      description: 'Expands the trip with an additional night in the Western Ghats or Karavali coast, reducing daily driving rush.',
      costDiffINR: 3800,
      timeDiffHours: 4,
      crowdLevel: 'Moderate',
      ecoScoreDelta: 0,
      intensity: 'More Relaxed',
      keyChanges: [
        'Adds peaceful morning in a plantation estate',
        'Stretches 40 km/day travel pace to a gentle cadence',
        'Includes sunset coracle ride',
      ],
    },
    {
      id: 'budget_rescue_3k',
      title: 'What if my total budget is ₹3,000 less?',
      description: 'Optimizes accommodation to traditional homestays and utilizes state KSRTC buses instead of full-day private cabs.',
      costDiffINR: -3200,
      timeDiffHours: 1.5,
      crowdLevel: 'Moderate',
      ecoScoreDelta: +15,
      intensity: 'Balanced',
      keyChanges: [
        'Switches private SUV to express KSRTC Rajahamsa bus',
        'Replaces upscale resort with authentic Malnad homestay',
        'Saves ~₹3,200 without skipping any primary heritage site',
      ],
    },
    {
      id: 'monsoon_rain',
      title: 'What if it rains heavily tomorrow?',
      description: 'Swaps steep outdoor rock/boulder climbing with indoor Hoysala stone galleries, spice plantation kitchens, and tea masterclasses.',
      costDiffINR: -200,
      timeDiffHours: -1,
      crowdLevel: 'Low',
      ecoScoreDelta: 0,
      intensity: 'More Relaxed',
      keyChanges: [
        'Replaces slippery Matanga Hill climb with indoor Archaeological Museum',
        'Replaces waterfall swimming with sheltered coffee tasting deck',
        'Zero risk of mountain road closures',
      ],
    },
    {
      id: 'train_transit',
      title: 'What if I travel by Scenic Train instead of Car?',
      description: 'Board the historic Yesvantpur-Mangaluru Green Route train through the Western Ghats tunnels and viaducts.',
      costDiffINR: -1800,
      timeDiffHours: 1,
      crowdLevel: 'Moderate',
      ecoScoreDelta: +35,
      intensity: 'More Relaxed',
      keyChanges: [
        'Spectacular panoramic train window views over Sakleshpur bridges',
        'Cuts trip carbon emissions by 45%',
        'Local taxis used only for short last-mile connections',
      ],
    },
    {
      id: 'travelling_children',
      title: 'What if travelling with young children?',
      description: 'Caps daily road travel at 3.5 hours, prioritizes wildlife safaris, elephant camps, and interactive toy workshops.',
      costDiffINR: +1200,
      timeDiffHours: -2,
      crowdLevel: 'Moderate',
      ecoScoreDelta: 0,
      intensity: 'More Relaxed',
      keyChanges: [
        'Adds Dubare Elephant interaction & Channapatna wooden toy crafting',
        'Builds in afternoon 2-hour rest break at hotel/homestay',
        'Selects child-friendly non-spicy meal venues',
      ],
    },
  ];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleApply = () => {
    // Generate modified trip based on scenario
    let updatedCost = trip.totalEstimatedCostINR + currentScenario.costDiffINR;
    let updatedTitle = `${trip.tripTitle} (${currentScenario.title.replace('What if ', '')})`;

    const updatedTrip: SavedTrip = {
      ...trip,
      tripTitle: updatedTitle,
      totalEstimatedCostINR: Math.max(3000, updatedCost),
      summary: `${trip.summary} [Simulated adjustment: ${currentScenario.description}]`,
    };

    onApplyScenario(updatedTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">What-If Trip Simulator</h3>
              <p className="text-xs text-stone-500">Test alternative travel scenarios with live metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selection Chips */}
        <div className="mt-5">
          <label className="text-xs font-bold text-stone-700 block mb-2">Select a Scenario to Simulate:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  selectedScenarioId === s.id
                    ? 'bg-emerald-900 text-amber-300 border-emerald-950 shadow-md'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold text-xs">{s.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5 line-clamp-1">{s.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="mt-6 p-5 rounded-2xl bg-stone-50 border border-stone-200">
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
            Current Plan vs. Simulated Scenario
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Current */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-400">Current Trip Plan</span>
              <div className="font-extrabold text-stone-900 text-base mt-1">
                ₹{trip.totalEstimatedCostINR.toLocaleString('en-IN')}
              </div>
              <div className="text-stone-600 mt-2 space-y-1 text-[11px]">
                <div>⏱️ {trip.days.length} Days</div>
                <div>⚡ Pace: {trip.preferences.travelPace}</div>
                <div>🚗 Transit: {trip.preferences.transportPreference.replace('_', ' ')}</div>
              </div>
            </div>

            {/* Simulated */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-300 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Simulated Outcome</span>
              <div className="font-extrabold text-emerald-900 text-base mt-1 flex items-center gap-1.5">
                <span>₹{(trip.totalEstimatedCostINR + currentScenario.costDiffINR).toLocaleString('en-IN')}</span>
                <span className={`text-xs font-bold px-1.5 py-0.2 rounded ${currentScenario.costDiffINR <= 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'}`}>
                  {currentScenario.costDiffINR > 0 ? `+₹${currentScenario.costDiffINR}` : `-₹${Math.abs(currentScenario.costDiffINR)}`}
                </span>
              </div>
              <div className="text-emerald-950 mt-2 space-y-1 text-[11px]">
                <div>⚡ Pace: {currentScenario.intensity}</div>
                <div>🌱 Eco Impact: {currentScenario.ecoScoreDelta >= 0 ? `+${currentScenario.ecoScoreDelta}% Greener` : 'Normal'}</div>
                <div>👥 Crowd Level: {currentScenario.crowdLevel}</div>
              </div>
            </div>
          </div>

          {/* Key Changes List */}
          <div className="mt-4 pt-3 border-t border-stone-200">
            <span className="text-xs font-bold text-stone-700 block mb-1.5">What changes:</span>
            <ul className="space-y-1 text-xs text-stone-600">
              {currentScenario.keyChanges.map((change, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-800 text-xs font-semibold"
          >
            Discard
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply This Scenario to Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
