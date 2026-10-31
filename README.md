# Karnataka AI Travel Planner — Discover Karnataka Your Way

An intelligent, full-stack travel planning web application designed specifically for Karnataka. It combines Google Gemini AI capabilities with verified regional geography, seasonal monsoon intelligence, authentic culinary routes, and local heritage guides.

---

## 🌟 Key Capabilities & Differentiators

1. **Smart Multi-Step Trip Builder**:
   - 5-step wizard capturing starting city, selected destinations, flexible dates, group size, interests, budget category in INR, transport mode, pace, dietary preferences, and mobility requirements.

2. **AI & Deterministic Itinerary Engine**:
   - Integrates server-side `gemini-3.8-flash` via `@google/genai` with structured JSON schema validation.
   - Built-in resilient local rule-based smart planning engine ensuring 100% availability even when offline or without external API keys.
   - Day tabs, timeline view, and GPS map view with real coordinates.

3. **Interactive Karnataka GPS Map**:
   - Vector canvas map with authentic coordinates for 30+ destinations across Western Ghats (Malenadu), Coastal Karavali, Heritage Plains, and Southern Mysore corridor.
   - Category filters, route line connectors, and destination details drawer.

4. **Live Adaptive Itinerary AI**:
   - Report unexpected weather, closed monuments, or highway delays to immediately generate safe indoor or nearby alternatives with time and cost difference calculations.

5. **Budget Rescue AI**:
   - Detailed cost breakdown (Transport, Stay, Food, Activities, Contingency).
   - Generates 3 tailored rescue plans (Cheapest Feasible, Best Balanced Value, and Most Comfortable within Budget) with trade-off explanations.

6. **What-If Trip Simulator**:
   - Side-by-side metric comparison: "What if I add +1 day?", "What if budget is ₹3,000 less?", "What if it pours rain?", "What if by scenic train instead of car?".

7. **Kannada Voice & Text Travel Copilot**:
   - Conversational assistant with bilingual support for English and Kannada (ಕನ್ನಡ).
   - Browser microphone speech recognition and Web Speech audio playback.

8. **AI Heritage Companion**:
   - Architectural and historical guides for Hampi, Mysuru Palace, Belur, Halebidu, and Badami.
   - 2-minute audio guide script with voice playback, folklore vs. verified history, and interactive quizzes.

9. **Karnataka Seasonal & Monsoon Radar**:
   - Authoritative regional seasonal windows, waterfall access warnings, forest trekking permit rules, and 24x7 Karnataka emergency contacts directory (112, Tourism Police 080-22200034, 108 Ambulance, Forest Rescue 1926).

10. **Culture & Food Intelligence with Audio Phrasebook**:
    - Regional culinary trails (Karavali/Udupi, Malenadu/Coorg, Old Mysore, North Karnataka).
    - Interactive audio Kannada phrasebook with click-to-listen pronunciation for greetings, shopping, and dining.

11. **Verified Local Experience Marketplace**:
    - Fair-trade community tours including coffee plantation cupping, Hampi coracle rides, Udupi temple kitchen cooking, Channapatna toy making, and Agumbe rainforest walks.

12. **Smart Expense Tracker & Travel Journal**:
    - Log real INR spends, split between travellers, compare actual vs. planned budgets, and export to CSV.
    - Day-by-day memory logs with ratings, highlights, and AI-generated trip retrospectives.

13. **Photo-to-Trip AI**:
    - Upload travel inspiration screenshots or select landmark photos to match Karnataka destinations via Gemini Vision.

14. **Group Consensus AI**:
    - Reconcile competing group preferences, budgets, and travel paces into a compromise itinerary with subgroup breakaway sessions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Speech API (Synthesis & Recognition).
- **Backend**: Express server running on port 3000 (`server.ts`), Vite middleware in development.
- **AI Integration**: Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` SDK on the server side.
- **Storage**: LocalStorage repository layer for trips, expenses, journal entries, and travel DNA.

---

## 🚀 Running the Application

- **Development**:
  ```bash
  npm run dev
  ```
  Starts the Express server with Vite middlewares on `http://0.0.0.0:3000`.

- **Production Build**:
  ```bash
  npm run build
  npm run start
  ```
