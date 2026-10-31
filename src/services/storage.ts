import { SavedTrip, ExpenseItem, JournalEntry, TravelDNAProfile, UserProfile } from '../types/travel';

const STORAGE_KEYS = {
  TRIPS: 'karnataka_trips_v1',
  ACTIVE_TRIP_ID: 'karnataka_active_trip_id_v1',
  EXPENSES: 'karnataka_expenses_v1',
  JOURNAL: 'karnataka_journal_v1',
  TRAVEL_DNA: 'karnataka_travel_dna_v1',
  THEME: 'karnataka_app_theme_v1',
  USER_SESSION: 'karnataka_user_session_v1',
};

// USER SESSION PERSISTENCE
export function getUserSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserSession(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving user session', err);
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  } catch (err) {
    console.error('Error clearing user session', err);
  }
}

// TRIPS PERSISTENCE
export function getSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading trips from storage', err);
    return [];
  }
}

export function saveTrip(trip: SavedTrip): void {
  try {
    const trips = getSavedTrips();
    const existingIndex = trips.findIndex((t) => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = { ...trip, updatedAt: new Date().toISOString() };
    } else {
      trips.unshift(trip);
    }
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    setActiveTripId(trip.id);
  } catch (err) {
    console.error('Error saving trip', err);
  }
}

export function deleteTrip(tripId: string): void {
  try {
    const trips = getSavedTrips().filter((t) => t.id !== tripId);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    if (getActiveTripId() === tripId) {
      setActiveTripId(trips[0]?.id || null);
    }
  } catch (err) {
    console.error('Error deleting trip', err);
  }
}

export function getActiveTripId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID);
}

export function setActiveTripId(id: string | null): void {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TRIP_ID);
  }
}

export function getActiveTrip(): SavedTrip | null {
  const activeId = getActiveTripId();
  const trips = getSavedTrips();
  if (activeId) {
    const found = trips.find((t) => t.id === activeId);
    if (found) return found;
  }
  return trips[0] || null;
}

// EXPENSES PERSISTENCE
export function getExpenses(tripId?: string): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const list: ExpenseItem[] = raw ? JSON.parse(raw) : [];
    if (tripId) {
      return list.filter((e) => e.tripId === tripId);
    }
    return list;
  } catch {
    return [];
  }
}

export function addExpense(expense: ExpenseItem): void {
  try {
    const expenses = getExpenses();
    expenses.unshift(expense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error('Error adding expense', err);
  }
}

export function deleteExpense(expenseId: string): void {
  try {
    const expenses = getExpenses().filter((e) => e.id !== expenseId);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error('Error deleting expense', err);
  }
}

export function exportExpensesToCSV(tripId: string, tripTitle: string): void {
  const list = getExpenses(tripId);
  if (list.length === 0) return;

  const headers = ['ID', 'Date', 'Title', 'Category', 'Amount_INR', 'PaidBy', 'SplitBetween', 'Notes'];
  const rows = list.map((item) => [
    item.id,
    item.date,
    `"${item.title.replace(/"/g, '""')}"`,
    item.category,
    item.amountINR,
    item.paidBy,
    `"${item.splitBetween.join(', ')}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${tripTitle.replace(/\s+/g, '_')}_Expenses.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// JOURNAL PERSISTENCE
export function getJournalEntries(tripId?: string): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    const list: JournalEntry[] = raw ? JSON.parse(raw) : [];
    if (tripId) {
      return list.filter((j) => j.tripId === tripId);
    }
    return list;
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry): void {
  try {
    const entries = getJournalEntries();
    const idx = entries.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      entries[idx] = entry;
    } else {
      entries.unshift(entry);
    }
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  } catch (err) {
    console.error('Error saving journal', err);
  }
}

export function deleteJournalEntry(entryId: string): void {
  try {
    const entries = getJournalEntries().filter((e) => e.id !== entryId);
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  } catch (err) {
    console.error('Error deleting journal entry', err);
  }
}

// TRAVEL DNA PROFILE
export const DEFAULT_TRAVEL_DNA: TravelDNAProfile = {
  natureVsCulture: 50,
  adventureVsRelaxation: 45,
  budgetVsLuxury: 40,
  popularVsOffbeat: 65,
  foodEnthusiasm: 85,
  travelPace: 40,
  socialVsSolitary: 50,
};

export function getTravelDNA(): TravelDNAProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAVEL_DNA);
    return raw ? JSON.parse(raw) : DEFAULT_TRAVEL_DNA;
  } catch {
    return DEFAULT_TRAVEL_DNA;
  }
}

export function saveTravelDNA(profile: TravelDNAProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRAVEL_DNA, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving travel DNA', err);
  }
}
