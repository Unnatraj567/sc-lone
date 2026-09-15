import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Building2,
  User,
  Settings,
  Coins,
  ChevronRight,
  Calculator,
  MapPin,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface SaarthiUserDashboardProps {
  onNavigateTab: (tab: 'recommender' | 'calculator' | 'locator' | 'assistant') => void;
}

export const SaarthiUserDashboard: React.FC<SaarthiUserDashboardProps> = ({
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'schemes' | 'partners' | 'profile' | 'settings'>('dashboard');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar (Screen 7 Left) */}
        <div className="lg:col-span-3 border-r border-slate-200/80 p-4 sm:p-5 bg-slate-50/50 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#0d5c46]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>My Applications</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'schemes'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>Saved Schemes</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'partners'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Saved Partners</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>
        </div>

        {/* Main Content (Screen 7 Right) */}
        <div className="lg:col-span-9 p-6 sm:p-8 space-y-6">
          {/* Welcome Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, Aditya!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Here's a quick overview of your journey.
            </p>
          </div>

          {/* 4 Stat Metric Cards (Exact as in collage Screen 7) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Recommended Schemes */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#0d5c46] flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-500">
                  Recommended Schemes
                </span>
                <span className="block text-xl font-bold text-slate-900">
                  3
                </span>
              </div>
            </div>

            {/* Metric 2: Applications */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] text-[#1d4ed8] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-500">
                  Applications
                </span>
                <span className="block text-xl font-bold text-slate-900">
                  1
                </span>
              </div>
            </div>

            {/* Metric 3: Saved Partners */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3E9] text-[#c2410c] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-500">
                  Saved Partners
                </span>
                <span className="block text-xl font-bold text-slate-900">
                  2
                </span>
              </div>
            </div>

            {/* Metric 4: Profile Complete */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7e22ce] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>Profile Complete</span>
                  <span className="font-bold text-slate-900">80%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-[#0d5c46] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Lower 2-Column Section (Collage Screen 7) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left Card: Recent Scheme Recommendation */}
            <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recent Scheme Recommendation
              </span>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Micro Finance Scheme
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ₹1,40,000 | 6.5% – 8% | 3 – 6 months
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('calculator')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d5c46] hover:bg-[#0a4635] text-white text-xs font-medium shrink-0 cursor-pointer transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Application Status Summary */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Application <strong>SC-CF-2026-8841</strong>: Under SCA Review</span>
                </div>
                <span className="font-semibold">Delhi DSFDC</span>
              </div>
            </div>

            {/* Right Card: Quick Actions */}
            <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Actions
              </span>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab('recommender')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#0d5c46] hover:bg-slate-50/60 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-slate-500" />
                    <span>Find Another Scheme</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('calculator')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#0d5c46] hover:bg-slate-50/60 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Calculator className="w-4 h-4 text-slate-500" />
                    <span>Calculate EMI</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('locator')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#0d5c46] hover:bg-slate-50/60 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Find Nearby Partner</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
