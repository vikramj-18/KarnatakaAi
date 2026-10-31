import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/travel';
import {
  Compass,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Heart,
  Loader2,
} from 'lucide-react';

interface AuthPortalProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [travelStyle, setTravelStyle] = useState('Heritage & Architecture');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Loading animation state after successful submit
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStepText, setLoadingStepText] = useState('Creating your traveller profile...');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // Slow loading sequence with animated loading symbol
  useEffect(() => {
    if (!isLoadingAnimation || !pendingUser) return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onAuthSuccess(pendingUser);
          }, 400);
          return 100;
        }

        const next = prev + 1;

        if (next < 25) {
          setLoadingStepText('Creating your secure Karnataka traveller pass...');
        } else if (next < 50) {
          setLoadingStepText('Loading Western Ghats, Karavali, & Hoysala heritage datasets...');
        } else if (next < 75) {
          setLoadingStepText('Calibrating monsoon weather radar & verified local homestays...');
        } else if (next < 95) {
          setLoadingStepText('Initializing your bilingual Kannada & English AI Copilot...');
        } else {
          setLoadingStepText('Welcome to Karnataka! Opening your journey...');
        }

        return next;
      });
    }, 35); // Takes ~3.5 seconds total for a smooth, slow, cinematic progression

    return () => clearInterval(interval);
  }, [isLoadingAnimation, pendingUser, onAuthSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: mode === 'signup' ? name.trim() : email.split('@')[0],
      email: email.trim(),
      travelStyle,
      joinedDate: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      }),
    };

    setPendingUser(user);
    setIsLoadingAnimation(true);
  };

  const handleQuickDemoAccess = () => {
    const demoUser: UserProfile = {
      id: 'demo_traveller',
      name: 'Vikram J (Traveller)',
      email: 'vikram.j@karnatakatourism.ai',
      travelStyle: 'Western Ghats & Heritage Explorer',
      joinedDate: 'Oct 2026',
    };

    setPendingUser(demoUser);
    setIsLoadingAnimation(true);
  };

  // CINEMATIC SLOW LOADING SCREEN
  if (isLoadingAnimation) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Ambient Karnataka background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full text-center space-y-8">
          {/* Majestic Animated Loading Symbol */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {/* Outer Slow Spinning Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/40 animate-[spin_8s_linear_infinite]" />

            {/* Middle Reverse Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-emerald-500/60 border-t-transparent border-b-transparent animate-[spin_4s_linear_infinite_reverse]" />

            {/* Inner Glow Core */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 via-emerald-600/30 to-teal-700/30 backdrop-blur-md flex items-center justify-center border border-amber-400/50 shadow-2xl">
              <Compass className="w-10 h-10 text-amber-300 animate-[pulse_2s_ease-in-out_infinite]" />
            </div>

            {/* Orbiting Sparkle */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-300 rounded-full shadow-[0_0_12px_#f59e0b] animate-ping"
              style={{ animationDuration: '3s' }}
            />
          </div>

          {/* Title & Animated Status */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-stone-100 tracking-tight">
              Unlocking Karnataka Journey
            </h2>
            <p className="text-sm text-emerald-400 font-semibold min-h-[24px] transition-all duration-300">
              {loadingStepText}
            </p>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="space-y-2 max-w-xs mx-auto">
            <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_#10b981]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>EXPLORER PROFILE</span>
              <span className="text-amber-300 font-bold text-xs">{loadingProgress}%</span>
            </div>
          </div>

          {/* Karnataka Cultural Quote */}
          <div className="pt-4 border-t border-stone-900 text-xs text-stone-500 italic max-w-sm mx-auto">
            "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"
            <span className="block not-italic text-[10px] text-stone-600 mt-0.5">
              One State. Many Worlds. Powered by AI.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN & SIGNUP PORTAL
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/20 text-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Subtle Radial Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-700 to-emerald-950 flex items-center justify-center mx-auto shadow-2xl border border-amber-400/40 mb-3">
          <Compass className="w-7 h-7 text-amber-200" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800/80 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Karnataka AI Travel Planner</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Discover Karnataka Your Way
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-400">
          Sign up to unlock personalized AI itineraries, monsoon intelligence, and offline guides.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-stone-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-stone-800">
          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-stone-950 p-1 mb-6 border border-stone-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name field (Only in Sign Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram J"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Travel Vibe Selector (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Primary Karnataka Travel Interest
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:border-amber-400 text-xs"
                >
                  <option value="Western Ghats & Coffee Hills">🌲 Western Ghats & Coffee Hills</option>
                  <option value="Heritage & Architecture">🏛️ Hoysala & Vijayanagara Heritage</option>
                  <option value="Karavali Coast & Beaches">🏖️ Karavali Coast & Beaches</option>
                  <option value="Wildlife Safari & Nature">🐅 Wildlife Safari & Elephant Reserves</option>
                  <option value="Culinary & Coffee Tasting">☕ Karnataka Culinary Trail & Coffee</option>
                  <option value="Offbeat Hidden Gems">💎 Offbeat & Hidden Waterfalls</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-xl transition-all"
            >
              <span>{mode === 'signup' ? 'Complete Sign Up' : 'Sign In to My Planner'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="mt-6 pt-5 border-t border-stone-800 text-center">
            <span className="text-[11px] text-stone-400 block mb-3">Or explore immediately:</span>

            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 font-bold text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Click Explorer Demo Sign In</span>
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Protected with local traveller session encryption</span>
        </div>
      </div>
    </div>
  );
};
