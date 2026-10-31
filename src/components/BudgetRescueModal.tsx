import React from 'react';
import { SavedTrip } from '../types/travel';
import {
  Wallet,
  X,
  Sparkles,
  TrendingDown,
  Car,
  Home,
  Utensils,
  Ticket,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface BudgetRescueModalProps {
  trip: SavedTrip;
  isOpen: boolean;
  onClose: () => void;
  onApplySavings: (newTotalCost: number, strategySummary: string) => void;
}

export const BudgetRescueModal: React.FC<BudgetRescueModalProps> = ({
  trip,
  isOpen,
  onClose,
  onApplySavings,
}) => {
  if (!isOpen) return null;

  const total = trip.totalEstimatedCostINR;
  const transport = trip.budgetBreakdown.transportINR;
  const stay = trip.budgetBreakdown.stayINR;
  const food = trip.budgetBreakdown.foodINR;
  const activities = trip.budgetBreakdown.activitiesINR;
  const contingency = trip.budgetBreakdown.contingencyINR;

  const rescuePlans = [
    {
      id: 'cheapest',
      title: 'Cheapest Feasible Trip',
      badge: 'Save ~38%',
      savingsINR: Math.round(total * 0.38),
      newCostINR: Math.round(total * 0.62),
      color: 'border-emerald-300 bg-emerald-50/50',
      actions: [
        'Shift long legs to KSRTC Airavat / Rajahamsa express buses',
        'Book verified family-run homestays or budget lodges (₹1,000-1,500/night)',
        'Enjoy legendary darshini meals and khanavali thalis (₹120-180/meal)',
        'Focus on naturally free waterfalls, sunset hills, and ASI free-access sites',
      ],
      tradeOffs: 'Slightly fixed bus schedules and shared public transport.',
    },
    {
      id: 'balanced',
      title: 'Best Balanced Value Trip',
      badge: 'Recommended • Save ~22%',
      savingsINR: Math.round(total * 0.22),
      newCostINR: Math.round(total * 0.78),
      color: 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-300',
      actions: [
        'Use scenic train for primary city connector; hire local autorickshaws/cabs',
        'Stay in authentic coffee estate homestays with home-cooked breakfast included',
        'Enjoy a blend of local heritage eateries and scenic café dinners',
        'Preserve all primary museum and wildlife safari bookings',
      ],
      tradeOffs: 'Ideal balance with zero loss of comfort or key attractions.',
    },
    {
      id: 'comfortable',
      title: 'Comfortable within Budget',
      badge: 'Save ~12%',
      savingsINR: Math.round(total * 0.12),
      newCostINR: Math.round(total * 0.88),
      color: 'border-stone-300 bg-stone-50',
      actions: [
        'Carpool or choose compact sedan rental instead of heavy SUV',
        'Book mid-tier heritage boutique hotels with pre-booked online rates',
        'Slightly trim contingency allowance by adhering to scheduled routes',
      ],
      tradeOffs: 'Retains 90% of luxury comforts with smarter advance booking.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Budget Rescue AI</h3>
              <p className="text-xs text-stone-500">
                Actionable cost-cutting strategies without sacrificing core travel experiences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Cost Breakdown */}
        <div className="mt-5 p-4 rounded-2xl bg-stone-900 text-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-semibold">Current Total Trip Cost:</span>
            <span className="text-lg font-extrabold text-amber-300">₹{total.toLocaleString('en-IN')} INR</span>
          </div>

          {/* Mini Category Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-[11px]">
            <div className="p-2 rounded-xl bg-stone-800">
              <span className="text-stone-400 block">🚗 Transit</span>
              <span className="font-bold text-stone-200">₹{transport}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-800">
              <span className="text-stone-400 block">🏨 Stay</span>
              <span className="font-bold text-stone-200">₹{stay}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-800">
              <span className="text-stone-400 block">🍛 Food</span>
              <span className="font-bold text-stone-200">₹{food}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-800">
              <span className="text-stone-400 block">🎟️ Tickets</span>
              <span className="font-bold text-stone-200">₹{activities}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-800">
              <span className="text-stone-400 block">🛡️ Buffer</span>
              <span className="font-bold text-stone-200">₹{contingency}</span>
            </div>
          </div>
        </div>

        {/* 3 Concrete Rescue Plans */}
        <div className="mt-6 space-y-4">
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Choose a Savings Strategy:
          </h4>

          {rescuePlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${plan.color}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-stone-900 text-sm">{plan.title}</h5>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                      {plan.badge}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 mt-1">
                    New Estimated Cost: <strong className="text-emerald-900 font-extrabold text-sm">₹{plan.newCostINR.toLocaleString('en-IN')}</strong> (Save ₹{plan.savingsINR.toLocaleString('en-IN')})
                  </div>
                </div>

                <button
                  onClick={() => {
                    onApplySavings(plan.newCostINR, plan.title);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold transition-colors shrink-0 shadow-sm"
                >
                  Apply Strategy
                </button>
              </div>

              {/* Action Bullets */}
              <ul className="mt-3 space-y-1 text-xs text-stone-700">
                {plan.actions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>

              {/* Trade-off notice */}
              <div className="mt-2 text-[11px] text-stone-500 italic">
                <strong>Trade-off:</strong> {plan.tradeOffs}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
