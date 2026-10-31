import React, { useState } from 'react';
import { SavedTrip } from '../types/travel';
import { requestAdaptiveReplan } from '../services/api';
import {
  CloudRain,
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  DollarSign,
} from 'lucide-react';

interface LiveAdaptiveModalProps {
  trip: SavedTrip;
  dayNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onAcceptAdaptation: (updatedTrip: SavedTrip) => void;
}

export const LiveAdaptiveModal: React.FC<LiveAdaptiveModalProps> = ({
  trip,
  dayNumber,
  isOpen,
  onClose,
  onAcceptAdaptation,
}) => {
  if (!isOpen) return null;

  const [conditionType, setConditionType] = useState<string>('Heavy Rain / Waterlogging');
  const [conditionDetails, setConditionDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adaptationResult, setAdaptationResult] = useState<any | null>(null);

  const sampleConditions = [
    { type: 'Heavy Rain / Waterlogging', label: '🌧️ Heavy Rain / Wet Ghats', desc: 'Slippery rocks & outdoor fog' },
    { type: 'Attraction Closed', label: '🔒 Attraction Closed Today', desc: 'Temple ritual or weekly maintenance' },
    { type: 'Highway Traffic Delay', label: '⏳ 2-Hour Travel Delay', desc: 'Need to compress afternoon timetable' },
    { type: 'Completed Early', label: '⚡ Finished 2 Hours Early', desc: 'Looking for a nearby hidden gem spot' },
    { type: 'Budget Emergency', label: '💸 Need to Cut Costs Today', desc: 'Replace paid activities with free vistas' },
  ];

  const handleRunAdaptation = async () => {
    setIsLoading(true);
    try {
      const result = await requestAdaptiveReplan(
        trip,
        { type: conditionType, details: conditionDetails || conditionType },
        dayNumber
      );
      setAdaptationResult(result);
    } catch (err) {
      console.error('Failed to adapt', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!adaptationResult) return;

    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      const updatedStops = d.stops.map((s, idx) => {
        if (idx === 0 || s.name.includes(adaptationResult.originalStop)) {
          return {
            ...s,
            name: adaptationResult.proposedReplacement.name,
            category: adaptationResult.proposedReplacement.category || s.category,
            description: adaptationResult.proposedReplacement.description,
            approxCostINR: adaptationResult.proposedReplacement.approxCostINR,
            tip: adaptationResult.proposedReplacement.tip || s.tip,
          };
        }
        return s;
      });
      return { ...d, stops: updatedStops };
    });

    const updatedTrip: SavedTrip = {
      ...trip,
      days: updatedDays,
      totalEstimatedCostINR: trip.totalEstimatedCostINR + (adaptationResult.costDiffINR || 0),
    };

    onAcceptAdaptation(updatedTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Live Adaptive Itinerary AI</h3>
              <p className="text-xs text-stone-500">Day {dayNumber} • Real-time disruption replanner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Condition Picker */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">
              What situation occurred today?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleConditions.map((sc) => (
                <button
                  key={sc.type}
                  type="button"
                  onClick={() => {
                    setConditionType(sc.type);
                    setAdaptationResult(null);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    conditionType === sc.type
                      ? 'bg-amber-950 text-amber-300 border-amber-800 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold text-xs">{sc.label}</div>
                  <div className="text-[11px] opacity-75 mt-0.5">{sc.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Additional Details (Optional)
            </label>
            <input
              type="text"
              value={conditionDetails}
              onChange={(e) => setConditionDetails(e.target.value)}
              placeholder="e.g. Heavy fog on Mullayanagiri peak, or temple closed for pooja until 4pm"
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunAdaptation}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing Safe Karnataka Replanning Alternative...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Adaptive Replacement</span>
              </>
            )}
          </button>
        </div>

        {/* Adaptation Result Box */}
        {adaptationResult && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-50/70 border border-amber-300 text-xs text-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Proposed Replacement Alternative</span>
            </div>

            <p className="text-stone-700 leading-relaxed font-medium">
              <strong>Why:</strong> {adaptationResult.reason}
            </p>

            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-semibold text-[10px] uppercase">New Stop</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {adaptationResult.proposedReplacement.name}
                </span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {adaptationResult.proposedReplacement.description}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <span>⏱️ Time diff: <strong>{adaptationResult.timeDiffMinutes} mins</strong></span>
                <span>💰 Cost diff: <strong>{adaptationResult.costDiffINR > 0 ? `+₹${adaptationResult.costDiffINR}` : `-₹${Math.abs(adaptationResult.costDiffINR)}`}</strong></span>
              </div>
            </div>

            {adaptationResult.safetyAdvice && (
              <div className="p-2.5 rounded-lg bg-amber-100/70 text-amber-950 text-[11px] flex items-start gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                <span><strong>Safety Advice:</strong> {adaptationResult.safetyAdvice}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setAdaptationResult(null)}
                className="px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-700 text-xs font-semibold"
              >
                Keep Original
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs shadow transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept & Update Trip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
