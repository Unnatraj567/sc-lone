import React from 'react';
import { Language } from '../types';
import {
  Globe,
  Sparkles,
  User,
  LogIn,
  LayoutDashboard,
  Calculator,
  MapPin,
  FileSearch,
  BarChart3,
  Home,
  ShieldCheck
} from 'lucide-react';
import { AshokaEmblem } from './AshokaEmblem';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: string;
  onSelectView: (view: string) => void;
  isLoggedIn: boolean;
  userName: string;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeView,
  onSelectView,
  isLoggedIn,
  userName,
  onOpenLogin,
  onLogout
}) => {
  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
  ];

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-2xs">
      {/* Top Tiranga Subtle Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & Branding (Matching collage) */}
        <div
          onClick={() => onSelectView('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
            <AshokaEmblem size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                Saarthi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#0d5c46] font-semibold border border-[#c3ebcb]">
                Govt of India
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Financial Support for a Stronger Tomorrow
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onSelectView('home')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectView('schemes')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'schemes'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Schemes</span>
          </button>

          <button
            onClick={() => onSelectView('calculator')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'calculator'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculator</span>
          </button>

          <button
            onClick={() => onSelectView('partners')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'partners'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Partners</span>
          </button>

          <button
            onClick={() => onSelectView('assistant')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'assistant'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0d5c46]" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => onSelectView('user_dashboard')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'user_dashboard'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectView('tracker')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'tracker'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Track Application</span>
          </button>

          <button
            onClick={() => onSelectView('admin_dashboard')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'admin_dashboard'
                ? 'bg-[#EAF7EE] text-[#0d5c46]'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right Controls: Language Selector + Login/User */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs text-slate-700 transition-colors">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </div>

          {/* User Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectView('user_dashboard')}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#0d5c46] text-white flex items-center justify-center text-[10px] font-bold">
                  {userName[0]}
                </div>
                <span>{userName}</span>
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              id="btn-header-login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
