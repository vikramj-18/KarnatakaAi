import React, { useState, useEffect } from 'react';
import { JournalEntry, SavedTrip } from '../types/travel';
import { getJournalEntries, saveJournalEntry, deleteJournalEntry } from '../services/storage';
import {
  BookOpen,
  Plus,
  Star,
  Sparkles,
  Camera,
  Trash2,
  Calendar,
  Heart,
  Smile,
  CheckCircle2,
} from 'lucide-react';

interface TravelJournalViewProps {
  activeTrip?: SavedTrip | null;
}

export const TravelJournalView: React.FC<TravelJournalViewProps> = ({ activeTrip }) => {
  const tripId = activeTrip?.id || 'demo_trip';
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [destinationName, setDestinationName] = useState('Hampi Boulder Sunset');
  const [dayNumber, setDayNumber] = useState(1);
  const [rating, setRating] = useState(5);
  const [highlight, setHighlight] = useState('Watched golden hour light wash over the monolithic granite ruins.');
  const [notes, setNotes] = useState('Climbed Hemakuta hill with tender coconuts. Temple breeze was unbelievable.');
  const [aiRecap, setAiRecap] = useState<string | null>(null);

  useEffect(() => {
    const list = getJournalEntries(tripId);
    if (list.length === 0 && activeTrip) {
      const initial: JournalEntry = {
        id: 'j-1',
        tripId,
        dayNumber: 1,
        destinationName: 'Mysuru Palace Illumination',
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        highlight: 'Nearly 100,000 golden bulbs turned on simultaneously at 7 PM sharp.',
        notes: 'The Mysore brass band was performing Carnatic melodies in the courtyard. Grabbed melt-in-mouth original Mysore Pak from Guru Sweet Mart right after.',
        photos: ['https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80'],
      };
      saveJournalEntry(initial);
      setEntries([initial]);
    } else {
      setEntries(list);
    }
  }, [tripId, activeTrip]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      tripId,
      dayNumber,
      destinationName,
      date: new Date().toISOString().split('T')[0],
      rating,
      highlight,
      notes,
      photos: ['https://images.unsplash.com/photo-1600100397608-f010f443b784?auto=format&fit=crop&w=600&q=80'],
    };

    saveJournalEntry(newEntry);
    setEntries(getJournalEntries(tripId));
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    setEntries(getJournalEntries(tripId));
  };

  const handleGenerateAiRecap = () => {
    if (entries.length === 0) return;
    const summary = `Your Karnataka journey was marked by moments of wonder—from ${entries.map(e => e.destinationName).join(' to ')}. Highlights included ${entries.map(e => `"${e.highlight}"`).join(' and ')}. An unforgettable expedition across Karnataka's royal stone corridors and verdant countryside!`;
    setAiRecap(summary);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Travel Memory Journal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Karnataka Trip Memories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Capture daily moments, local tastes, and reflections with AI-generated trip summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAiRecap}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors border border-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Generate AI Recap</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* AI Recap Box */}
      {aiRecap && (
        <div className="mt-6 p-5 rounded-3xl bg-amber-50 border border-amber-300 text-xs leading-relaxed text-amber-950 relative">
          <div className="flex items-center gap-2 font-bold mb-1 text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Trip Retrospective</span>
          </div>
          <p className="font-medium">{aiRecap}</p>
        </div>
      )}

      {/* Add Entry Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="mt-6 p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4 text-xs">
          <h3 className="font-extrabold text-stone-900 text-sm">Record a Karnataka Travel Memory</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Place / Destination</label>
              <input
                type="text"
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Trip Day #</label>
              <input
                type="number"
                min="1"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full p-2 border border-stone-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Rating (1-5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 border border-stone-300 rounded-xl focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars {'⭐'.repeat(r)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Biggest Highlight of the Day</label>
            <input
              type="text"
              required
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="e.g. Sipping fresh filter coffee looking at Jog Falls rainbow"
              className="w-full p-2 border border-stone-300 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Personal Notes & Impressions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold"
            >
              Save Memory
            </button>
          </div>
        </form>
      )}

      {/* Memory Timeline Cards */}
      <div className="mt-8 space-y-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-5"
          >
            {entry.photos && entry.photos[0] && (
              <img
                src={entry.photos[0]}
                alt={entry.destinationName}
                className="w-full sm:w-44 h-40 object-cover rounded-2xl shrink-0"
              />
            )}

            <div className="flex-1 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Day {entry.dayNumber} • {entry.date}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  {'⭐'.repeat(entry.rating)}
                </div>
              </div>

              <h4 className="text-base font-extrabold text-stone-900 mt-1">
                {entry.destinationName}
              </h4>

              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50 text-amber-950 font-medium italic">
                "{entry.highlight}"
              </div>

              <p className="text-stone-700 leading-relaxed font-normal">
                {entry.notes}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-stone-400 hover:text-red-600 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
            No memories saved yet. Click "+ Add Memory" to write your first travel log!
          </div>
        )}
      </div>
    </div>
  );
};
