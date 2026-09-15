import React, { useState } from 'react';
import {
  LayoutDashboard,
  Coins,
  Building2,
  Users,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';

export const SaarthiAdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar (Screen 9 Left) */}
        <div className="lg:col-span-3 border-r border-slate-200/80 p-4 sm:p-5 bg-slate-50/50 space-y-1.5">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'dashboard'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#0d5c46]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveMenu('schemes')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'schemes'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-4 h-4 text-slate-500" />
            <span>Schemes</span>
          </button>

          <button
            onClick={() => setActiveMenu('partners')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'partners'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Channel Partners</span>
          </button>

          <button
            onClick={() => setActiveMenu('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'users'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveMenu('applications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'applications'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Applications</span>
          </button>

          <button
            onClick={() => setActiveMenu('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'reports'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeMenu === 'settings'
                ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>
        </div>

        {/* Main Content (Screen 9 Right) */}
        <div className="lg:col-span-9 p-6 sm:p-8 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Admin Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Overview of platform statistics and partner performance.
              </p>
            </div>

            {/* Date Range Selector (Exact as in collage) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Apr 1, 2025 – Apr 30, 2025</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* 4 Stat Metric Cards (Exact as in collage Screen 9) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Total Users</span>
                <span className="text-[#0d5c46] flex items-center font-bold">
                  +10% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                12,430
              </div>
            </div>

            {/* Scheme Recommendations */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Scheme Recommendations</span>
                <span className="text-[#0d5c46] flex items-center font-bold">
                  +18% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                8,932
              </div>
            </div>

            {/* Applications */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Applications</span>
                <span className="text-[#0d5c46] flex items-center font-bold">
                  +25% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                4,821
              </div>
            </div>

            {/* Active Partners */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Active Partners</span>
                <span className="text-[#0d5c46] flex items-center font-bold">
                  +5% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                96
              </div>
            </div>
          </div>

          {/* Bottom Analytics Row: 3 Panels (Collage Screen 9) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 1. Top Requested Scheme (Donut Chart) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <span className="block text-xs font-bold text-slate-800">
                Top Requested Scheme
              </span>

              <div className="flex items-center justify-center py-2">
                <svg width="120" height="120" viewBox="0 0 100 100">
                  {/* Micro Finance 42% (Green) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#0d5c46" strokeWidth="18" strokeDasharray="100 138" strokeDashoffset="25" />
                  {/* Term Loan 28% (Emerald light) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#34d399" strokeWidth="18" strokeDasharray="67 171" strokeDashoffset="163" />
                  {/* Education Loan 18% (Sky) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="18" strokeDasharray="43 195" strokeDashoffset="96" />
                  {/* Other 12% (Amber) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="18" strokeDasharray="28 210" strokeDashoffset="53" />
                </svg>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0d5c46]" /> Micro Finance</span>
                  <span className="font-semibold text-slate-900">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#34d399]" /> Term Loan</span>
                  <span className="font-semibold text-slate-900">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> Education Loan</span>
                  <span className="font-semibold text-slate-900">18%</span>
                </div>
              </div>
            </div>

            {/* 2. Top Districts (Horizontal Bars) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <span className="block text-xs font-bold text-slate-800">
                Top Districts
              </span>

              <div className="space-y-2.5 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Vadodara</span>
                    <span className="font-bold text-slate-900">18%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0d5c46] rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Ahmedabad</span>
                    <span className="font-bold text-slate-900">12%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0d5c46] rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Surat</span>
                    <span className="font-bold text-slate-900">10%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0d5c46] rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Rajkot</span>
                    <span className="font-bold text-slate-900">7%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0d5c46] rounded-full" style={{ width: '7%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Others</span>
                    <span className="font-bold text-slate-900">53%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: '53%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Partner Utilization (Gauge) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <span className="block text-xs font-bold text-slate-800">
                Partner Utilization
              </span>

              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-28 h-16 flex items-end justify-center">
                  <svg viewBox="0 0 100 55" className="w-full h-full">
                    {/* Background Arc */}
                    <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                    {/* Active Utilization Arc (82%) */}
                    <path d="M10 50 A40 40 0 0 1 76 18" fill="none" stroke="#0d5c46" strokeWidth="12" strokeLinecap="round" />
                  </svg>
                  <span className="absolute bottom-0 text-lg font-extrabold text-slate-900">
                    82%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                <div className="flex items-center justify-between">
                  <span>Total Partners</span>
                  <span className="font-bold text-slate-900">96</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Partners</span>
                  <span className="font-bold text-[#0d5c46]">78</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
