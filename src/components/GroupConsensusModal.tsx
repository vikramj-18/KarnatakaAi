import React, { useState } from 'react';
import { GroupMember } from '../types/travel';
import { generateGroupConsensus } from '../services/api';
import {
  Users,
  X,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Split,
  ArrowRight,
} from 'lucide-react';

interface GroupConsensusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConsensusToTrip?: (hub: string) => void;
}

export const GroupConsensusModal: React.FC<GroupConsensusModalProps> = ({
  isOpen,
  onClose,
  onApplyConsensusToTrip,
}) => {
  if (!isOpen) return null;

  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: 'm1',
      name: 'Priya',
      preferredActivities: ['Mullayanagiri Trek', 'Coffee Tasting', 'Waterfalls'],
      maxBudgetINR: 9000,
      foodPreference: 'Vegetarian',
      pace: 'packed',
      mustVisit: ['Chikkamagaluru Peaks'],
    },
    {
      id: 'm2',
      name: 'Rahul',
      preferredActivities: ['Belur Hoysala Temples', 'Photography', 'Heritage'],
      maxBudgetINR: 14000,
      foodPreference: 'Non-Vegetarian',
      pace: 'relaxed',
      mustVisit: ['Belur Chennakeshava'],
    },
    {
      id: 'm3',
      name: 'Ananya',
      preferredActivities: ['Ayurvedic Spa', 'Quiet Homestay', 'Local Cuisine'],
      maxBudgetINR: 10000,
      foodPreference: 'Vegan',
      pace: 'relaxed',
      mustVisit: ['Western Ghats Homestay'],
    },
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consensusResult, setConsensusResult] = useState<any | null>(null);

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: GroupMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      preferredActivities: ['Nature', 'Local Food'],
      maxBudgetINR: 10000,
      foodPreference: 'Vegetarian',
      pace: 'balanced',
      mustVisit: [],
    };
    setMembers([...members, newMember]);
    setNewMemberName('');
    setConsensusResult(null);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 2) {
      alert('Need at least 2 members for group consensus.');
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
    setConsensusResult(null);
  };

  const handleRunConsensus = async () => {
    setIsLoading(true);
    try {
      const result = await generateGroupConsensus(members, 3);
      setConsensusResult(result);
    } catch (err) {
      console.error('Consensus error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Group Consensus AI</h3>
              <p className="text-xs text-stone-500">
                Reconcile competing travel paces, diets, and budgets into a harmonious compromise
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

        {/* Members List */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Group Travellers ({members.length})
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Add friend's name"
                className="p-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none"
              />
              <button
                onClick={handleAddMember}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 text-amber-300 text-xs font-bold"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {members.map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs relative group">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{m.name}</span>
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="text-stone-400 hover:text-red-600"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-stone-600 mt-2 space-y-0.5 text-[11px]">
                  <div>💰 Max Budget: ₹{m.maxBudgetINR}</div>
                  <div>⚡ Pace: {m.pace}</div>
                  <div>🍛 Food: {m.foodPreference}</div>
                  <div className="text-emerald-800 font-semibold truncate">
                    ❤️ {m.preferredActivities.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleRunConsensus}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-amber-300 font-bold text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Group Agreement & Subgroups...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Group Compromise Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Results Box */}
        {consensusResult && (
          <div className="mt-6 p-5 rounded-3xl bg-purple-50/70 border border-purple-200 text-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-800 uppercase">Consensus Verdict</span>
                <h4 className="text-base font-extrabold text-stone-900 mt-0.5">
                  Suggested Base Hub: {consensusResult.suggestedDestinationHub}
                </h4>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-purple-200 text-purple-950 font-bold text-xs">
                Satisfaction: {consensusResult.overallSatisfactionScore}%
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed font-normal">
              {consensusResult.consensusSummary}
            </p>

            <div className="p-3 rounded-xl bg-white border border-purple-200 space-y-2">
              <div className="text-emerald-800 font-bold">
                ✓ What Everyone Agrees On: {consensusResult.sharedInterests.join(', ')}
              </div>
              <div className="text-amber-800 font-medium">
                ⚠️ Key Differences: {consensusResult.keyConflicts.join(', ')}
              </div>
              <div className="text-stone-800 font-semibold pt-1 border-t border-stone-100">
                💡 Compromise Strategy: {consensusResult.compromiseStrategy}
              </div>
            </div>

            {/* Subgroup Breakaway Options */}
            {consensusResult.subgroupBreakawayIdeas && consensusResult.subgroupBreakawayIdeas.length > 0 && (
              <div>
                <span className="font-bold text-stone-800 block mb-1">
                  Suggested Subgroup Breakaway Sessions:
                </span>
                {consensusResult.subgroupBreakawayIdeas.map((sub: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-purple-200 text-stone-700 space-y-1 mb-2">
                    <div>
                      <strong>Subgroup A ({sub.forMembersA}):</strong> {sub.activityA}
                    </div>
                    <div>
                      <strong>Subgroup B ({sub.forMembersB}):</strong> {sub.activityB}
                    </div>
                    <div className="text-[11px] text-purple-900 font-bold pt-1">
                      📍 Meetup Point: {sub.meetupLocation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-between">
              <span>Fair Shared Cost Estimate:</span>
              <strong className="text-sm">₹{consensusResult.suggestedSharedBudgetPerPersonINR} / person</strong>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-stone-900 text-amber-300 font-bold text-xs shadow"
              >
                Close Consensus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
