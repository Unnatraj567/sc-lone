import React from 'react';
import { ApplicationRecord, Language } from '../types';
import { PARTNERS_DATA } from '../data/partners';
import { SCHEMES_DATA } from '../data/schemes';
import { TRANSLATIONS } from '../data/translations';
import { BarChart3, TrendingUp, ShieldAlert, CheckCircle2, Users, IndianRupee, PieChart, Landmark } from 'lucide-react';

interface AnalyticsReportsProps {
  currentLang: Language;
  applications: ApplicationRecord[];
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  currentLang,
  applications
}) => {
  const t = TRANSLATIONS[currentLang];

  const totalPartners = PARTNERS_DATA.length;
  const eligiblePartners = PARTNERS_DATA.filter(p => p.disbursementEligible).length;
  const quarantinedPartners = totalPartners - eligiblePartners;

  const totalAllocatedQuota = PARTNERS_DATA.reduce((sum, p) => sum + p.allocatedQuotaCrores, 0);
  const totalUtilizedQuota = PARTNERS_DATA.reduce((sum, p) => sum + p.utilizedCrores, 0);

  // Scheme distribution
  const schemeCounts: { [key: string]: number } = {};
  applications.forEach(a => {
    schemeCounts[a.schemeName] = (schemeCounts[a.schemeName] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>National Program Management & Analytics</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Channel Finance Performance & Oversight Dashboard
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Macro-level monitoring of concessional credit absorption, NPA governance, and Channel Partner solvency.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold">
            <Landmark className="w-4 h-4 text-amber-300" />
            <span>Ministry of Social Justice & Empowerment</span>
          </div>
        </div>

        {/* 4 High-Level National Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Channel Quota Allocated</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              ₹{totalAllocatedQuota.toFixed(1)} Cr
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
              ₹{totalUtilizedQuota.toFixed(1)} Cr Disbursed ({(totalUtilizedQuota / totalAllocatedQuota * 100).toFixed(1)}% Absorption)
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Solvent Channel Partners</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
              {eligiblePartners} / {totalPartners} Active
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              SCAs, PSBs, RRBs & Microfinance MFIs
            </span>
          </div>

          <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200">
            <span className="text-xs text-rose-800 block">Quarantined Partners (NPAs &gt; 8%)</span>
            <span className="text-2xl font-extrabold text-rose-950 mt-1 block">
              {quarantinedPartners} Quarantined
            </span>
            <span className="text-[11px] text-rose-700 mt-0.5 block">
              Prevented from receiving new borrowers
            </span>
          </div>

          <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-200">
            <span className="text-xs text-indigo-800 block">Avg Concessional Interest</span>
            <span className="text-2xl font-extrabold text-indigo-950 mt-1 block">
              7.1% p.a.
            </span>
            <span className="text-[11px] text-indigo-700 mt-0.5 block">
              vs 14.5% commercial market benchmark
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner Health & Solvency Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Channel Partner Solvency & NPA Audit</span>
            </h3>
            <span className="text-xs text-slate-500">Legal Quota Watchlist</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="pb-2 font-bold">Partner Institution</th>
                  <th className="pb-2 font-bold">Type</th>
                  <th className="pb-2 font-bold">NPA (%)</th>
                  <th className="pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {PARTNERS_DATA.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-2 font-medium">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-400 block">{p.city}, {p.state}</span>
                    </td>
                    <td className="py-2.5 pr-2">{p.type}</td>
                    <td className="py-2.5 pr-2 font-bold font-mono">{p.npaPercentage}%</td>
                    <td className="py-2.5">
                      {p.disbursementEligible ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ELIGIBLE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800" title={p.disqualificationReason}>
                          BLOCKED (&gt;8%)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheme Catalog & Credit Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Concessional Financial Products Overview</span>
            </h3>
            <span className="text-xs text-slate-500">6 Tailored Products</span>
          </div>

          <div className="space-y-3">
            {SCHEMES_DATA.map(s => (
              <div key={s.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[11px] text-slate-500">{s.category} | Moratorium: {s.maxMoratoriumMonths} Mos</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-indigo-700 block">{s.concessionalRate}% p.a.</span>
                  <span className="text-[10px] text-slate-400">Ceiling: ₹{(s.maxLoan / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
