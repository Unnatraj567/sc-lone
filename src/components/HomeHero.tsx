import React from 'react';
import { ArrowRight, ShieldCheck, Percent, Users, UserCheck, Calculator, MapPin, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface HomeHeroProps {
  currentLang: Language;
  onNavigateTab: (tab: 'recommender' | 'calculator' | 'locator' | 'assistant' | 'user_dashboard' | 'admin_dashboard') => void;
  onOpenSchemeWizard: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onNavigateTab,
  onOpenSchemeWizard
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Card Container */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Your Right Scheme.<br />
                <span className="text-[#0d5c46]">Your Bright Future.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Financial assistance and educational loans for SC beneficiaries — easily, transparently, and near you.
              </p>
            </div>

            {/* 3 Metric Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs sm:text-sm font-medium text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[#0d5c46]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Up to 90% Project Cost</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs sm:text-sm font-medium text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[#0d5c46]">
                  <Percent className="w-4 h-4" />
                </div>
                <span>Interest Rate 6.5% – 8%</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs sm:text-sm font-medium text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[#0d5c46]">
                  <Users className="w-4 h-4" />
                </div>
                <span>Family Income Up to ₹5 Lakhs</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={onOpenSchemeWizard}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer group"
                id="btn-hero-get-started"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Hero Visual (Mountain sunrise landscape with hiker traveler silhouette) */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-slate-200/70 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-900">
              {/* Stylized Vector Landscape Artwork */}
              <svg viewBox="0 0 400 320" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dbeafe" />
                    <stop offset="50%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fed7aa" />
                  </linearGradient>
                  <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#064e3b" />
                    <stop offset="100%" stopColor="#022c22" />
                  </linearGradient>
                </defs>

                {/* Sky */}
                <rect width="400" height="320" fill="url(#skyGrad)" />
                
                {/* Sun */}
                <circle cx="200" cy="130" r="42" fill="url(#sunGrad)" opacity="0.8" />
                <circle cx="200" cy="130" r="70" fill="#fef08a" opacity="0.25" />

                {/* Distant Mountain Ridges */}
                <path d="M-20 230 L70 160 L160 210 L240 140 L340 220 L420 170 L420 320 L-20 320 Z" fill="url(#mountain1)" opacity="0.65" />
                <path d="M-10 250 L90 190 L180 240 L280 180 L390 260 L420 240 L420 320 L-10 320 Z" fill="url(#mountain2)" opacity="0.85" />
                
                {/* Foreground Ridge */}
                <path d="M-10 270 Q140 230 420 275 L420 320 L-10 320 Z" fill="url(#groundGrad)" />

                {/* Backpacker Traveler Silhouette */}
                <g transform="translate(195, 175) scale(0.85)">
                  {/* Head & Hat */}
                  <circle cx="20" cy="18" r="7.5" fill="#0f172a" />
                  {/* Cap visor */}
                  <path d="M22 13 Q30 14 31 16 Z" fill="#0f172a" />
                  {/* Neck */}
                  <rect x="18" y="24" width="4" height="4" fill="#0f172a" />
                  {/* Torso */}
                  <path d="M12 28 Q20 26 28 28 L27 62 Q20 64 13 62 Z" fill="#0f172a" />
                  {/* Backpack */}
                  <rect x="6" y="30" width="10" height="24" rx="4" fill="#1e293b" />
                  <path d="M7 28 Q11 25 15 28 Z" fill="#334155" />
                  {/* Left Leg */}
                  <path d="M14 62 L13 100 L18 100 L19 63 Z" fill="#0f172a" />
                  {/* Right Leg */}
                  <path d="M21 62 L22 100 L27 100 L26 63 Z" fill="#0f172a" />
                  {/* Boots */}
                  <path d="M12 98 L20 98 L20 103 L11 103 Z" fill="#020617" />
                  <path d="M21 98 L29 98 L29 103 L20 103 Z" fill="#020617" />
                </g>
              </svg>

              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Action Cards Grid (Exactly as in collage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Find My Scheme (Mint Green) */}
        <div
          onClick={onOpenSchemeWizard}
          className="group p-5 rounded-2xl bg-[#EAF7EE] border border-[#d3ebd9] hover:border-[#b1debc] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          id="card-action-find-scheme"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#d5f0dd] flex items-center justify-center text-[#0d5c46]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d5c46] transition-colors">
                Find My Scheme
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Get personalized recommendations
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end text-[#0d5c46]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 2: EMI Calculator (Soft Sky Blue) */}
        <div
          onClick={() => onNavigateTab('calculator')}
          className="group p-5 rounded-2xl bg-[#EBF5FF] border border-[#cfe5fc] hover:border-[#b3d7fa] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          id="card-action-emi-calculator"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#dbeefe] flex items-center justify-center text-[#1d4ed8]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1d4ed8] transition-colors">
                EMI Calculator
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Calculate your loan repayment
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end text-[#1d4ed8]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 3: Find Nearby Partner (Warm Peach) */}
        <div
          onClick={() => onNavigateTab('locator')}
          className="group p-5 rounded-2xl bg-[#FEF3E9] border border-[#fadec6] hover:border-[#f7cca8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          id="card-action-nearby-partner"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#fde3cc] flex items-center justify-center text-[#c2410c]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#c2410c] transition-colors">
                Find Nearby Partner
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Locate authorized channel partners
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end text-[#c2410c]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 4: Learn More (Soft Lavender) */}
        <div
          onClick={() => onNavigateTab('assistant')}
          className="group p-5 rounded-2xl bg-[#F3E8FF] border border-[#e6d0fc] hover:border-[#d4b0fa] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          id="card-action-learn-more"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#ebd5fd] flex items-center justify-center text-[#7e22ce]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#7e22ce] transition-colors">
                Learn More
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                About schemes & eligibility
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end text-[#7e22ce]">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Subtle Language Indicator Line (matching collage bottom right) */}
      <div className="flex justify-end items-center gap-2 text-xs text-slate-500 font-medium px-2">
        <span className="text-slate-700 font-semibold">English</span>
        <span>|</span>
        <span className="hover:text-slate-700 cursor-pointer">हिंदी</span>
        <span>|</span>
        <span className="hover:text-slate-700 cursor-pointer">ગુજરાતી</span>
      </div>
    </div>
  );
};
