import React, { useState, useEffect } from 'react';
import { ExpenseItem, SavedTrip } from '../types/travel';
import { getExpenses, addExpense, deleteExpense, exportExpensesToCSV } from '../services/storage';
import {
  Wallet,
  Plus,
  Trash2,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  CheckCircle2,
} from 'lucide-react';

interface ExpenseTrackerViewProps {
  activeTrip?: SavedTrip | null;
}

export const ExpenseTrackerView: React.FC<ExpenseTrackerViewProps> = ({ activeTrip }) => {
  const tripId = activeTrip?.id || 'demo_trip';
  const tripTitle = activeTrip?.tripTitle || 'Karnataka Trip';

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('Food');
  const [amountINR, setAmountINR] = useState<number>(350);
  const [paidBy, setPaidBy] = useState('Me');
  const [splitBetween, setSplitBetween] = useState('All Travellers');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const list = getExpenses(tripId);
    if (list.length === 0 && activeTrip) {
      // Seed initial sample expenses for realistic experience
      const initial: ExpenseItem[] = [
        {
          id: 'exp-1',
          tripId,
          date: new Date().toISOString().split('T')[0],
          title: 'Mysore Mylari Butter Masala Dosa Breakfast',
          category: 'Food',
          amountINR: 320,
          paidBy: 'Me',
          splitBetween: ['All Travellers'],
          notes: 'Authentic benne dose and filter coffee',
        },
        {
          id: 'exp-2',
          tripId,
          date: new Date().toISOString().split('T')[0],
          title: 'Mysuru Palace Entry & Audio Headsets',
          category: 'Attraction',
          amountINR: 200,
          paidBy: 'Me',
          splitBetween: ['All Travellers'],
          notes: 'Ramps and palace entrance tickets',
        },
      ];
      initial.forEach((e) => addExpense(e));
      setExpenses(initial);
    } else {
      setExpenses(list);
    }
  }, [tripId, activeTrip]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amountINR <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      tripId,
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      category,
      amountINR: Number(amountINR),
      paidBy: paidBy.trim() || 'Me',
      splitBetween: splitBetween.split(',').map((s) => s.trim()),
      notes: notes.trim(),
    };

    addExpense(newItem);
    setExpenses(getExpenses(tripId));
    setTitle('');
    setAmountINR(350);
    setNotes('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setExpenses(getExpenses(tripId));
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amountINR, 0);
  const plannedBudget = activeTrip?.totalEstimatedCostINR || 18000;
  const remainingBudget = plannedBudget - totalSpent;

  // Breakdown by category
  const categoriesList: ExpenseItem['category'][] = [
    'Transport',
    'Stay',
    'Food',
    'Attraction',
    'Activities',
    'Shopping',
    'Misc',
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>Smart Trip Expense Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Track Real Spends: {tripTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Log expenses in INR, split across group members, and track remaining budget in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportExpensesToCSV(tripId, tripTitle)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-stone-400 text-xs font-semibold">Total Logged Spend</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {expenses.length} expense items recorded
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-stone-400 text-xs font-semibold">Planned Budget</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            ₹{plannedBudget.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Estimated mid-range itinerary target
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-stone-400 text-xs font-semibold">Remaining Budget</span>
          <div className={`text-2xl font-extrabold mt-1 ${remainingBudget >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            ₹{remainingBudget.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {remainingBudget >= 0 ? 'Within target budget' : '⚠️ Over planned budget'}
          </span>
        </div>
      </div>

      {/* Add Expense Form Modal/Drawer */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="mt-6 p-6 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 space-y-4">
          <h3 className="font-extrabold text-amber-300 text-sm">Add New Karnataka Expense</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">Expense Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Coorg Coffee Beans, Fuel, Tolls"
                className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Amount (₹ INR)</label>
              <input
                type="number"
                required
                min="1"
                value={amountINR}
                onChange={(e) => setAmountINR(Number(e.target.value))}
                className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">Paid By</label>
              <input
                type="text"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                placeholder="e.g. Rahul, Priya, Me"
                className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Notes / Receipt details</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Expenses Table */}
      <div className="mt-8 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h4 className="font-extrabold text-stone-900 text-sm">Expenses Log</h4>
          <span className="text-xs text-stone-500">{expenses.length} records</span>
        </div>

        <div className="divide-y divide-stone-100">
          {expenses.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between text-xs hover:bg-stone-50 transition-colors">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{item.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-[10px]">
                    {item.category}
                  </span>
                </div>
                <div className="text-stone-500 text-[11px] mt-0.5">
                  Paid by <strong>{item.paidBy}</strong> • {item.date} {item.notes && `• ${item.notes}`}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-extrabold text-stone-900 text-sm">
                  ₹{item.amountINR.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-400">
              No expenses added yet. Click "+ Add Expense" above to start tracking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
