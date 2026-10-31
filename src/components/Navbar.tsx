import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Wallet,
  BookOpen,
  ShoppingBag,
  CloudRain,
  UtensilsCrossed,
  Map,
  Menu,
  X,
  Bot,
  ShieldCheck,
} from 'lucide-react';

import { UserProfile } from '../types/travel';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeTripTitle?: string;
  hasActiveTrip?: boolean;
  user?: UserProfile | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeTripTitle,
  hasActiveTrip,
  user,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'plan', label: 'Plan My Trip', icon: Calendar, highlight: true },
    { id: 'explore', label: 'Explore Karnataka', icon: MapPin },
    { id: 'itineraries', label: 'My Itinerary', icon: Calendar, badge: hasActiveTrip ? 'Active' : undefined },
    { id: 'map', label: 'Map Explorer', icon: Map },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, isAi: true },
    { id: 'budget', label: 'Budget Tracker', icon: Wallet },
    { id: 'journal', label: 'Travel Journal', icon: BookOpen },
    { id: 'experiences', label: 'Local Marketplace', icon: ShoppingBag },
    { id: 'culture', label: 'Culture & Food', icon: UtensilsCrossed },
    { id: 'monsoon', label: 'Monsoon Radar', icon: CloudRain },
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleSelect('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-emerald-700 to-emerald-900 flex items-center justify-center shadow-lg border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-stone-100">
                  Karnataka<span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                  ಪ್ರವಾಸ
                </span>
              </div>
              <p className="text-[10px] text-stone-400 tracking-wide font-medium">
                Discover Karnataka Your Way
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-800/80 text-amber-300 shadow-sm border border-emerald-600/50'
                      : item.highlight
                      ? 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-600/40'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.isAi ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-emerald-500 text-stone-950 font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelect('copilot')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-amber-200 border border-emerald-500/40 text-xs font-bold shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>Voice Copilot</span>
            </button>

            <button
              onClick={() => handleSelect('plan')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>

            {/* Logged in User Profile & Sign Out */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-stone-800">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-800 border border-stone-700 text-xs"
                  title={`Logged in as ${user.name} (${user.email})`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 text-stone-950 font-extrabold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-stone-200 truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-1">
          {activeTripTitle && (
            <div className="mb-2 p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs flex items-center justify-between">
              <span className="text-stone-400">Active trip:</span>
              <span className="font-bold text-amber-300 truncate max-w-[200px]">{activeTripTitle}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-amber-300 border border-emerald-600'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
