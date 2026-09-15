import React, { useState } from 'react';
import { MapPin, Crosshair, ChevronRight, CheckCircle2, Building2, Landmark, Filter, Check } from 'lucide-react';
import { PARTNERS_DATA } from '../data/partners';
import { ChannelPartner } from '../types';

interface SaarthiPartnerLocatorProps {
  onSelectPartnerForApplication?: (partner: ChannelPartner) => void;
}

export const SaarthiPartnerLocator: React.FC<SaarthiPartnerLocatorProps> = ({
  onSelectPartnerForApplication
}) => {
  const [searchLocation, setSearchLocation] = useState<string>('Vadodara, Gujarat');
  const [partnerTypes, setPartnerTypes] = useState<Record<string, boolean>>({
    SCA: true,
    PSB: true,
    RRB: true,
    'NBFC-MFI': true
  });
  const [schemeFilter, setSchemeFilter] = useState<string>('All Schemes');
  const [distanceFilter, setDistanceFilter] = useState<string>('All');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('psb-axis-vadodara');

  // Toggle type checkbox
  const togglePartnerType = (type: string) => {
    setPartnerTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Filter partners
  const filteredPartners = PARTNERS_DATA.filter(partner => {
    if (!partnerTypes[partner.type]) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Find Nearby Channel Partners
        </h2>
        <p className="text-sm text-slate-500">
          We'll show you authorized partners who can process your application for the selected scheme.
        </p>
      </div>

      {/* Location Search Bar (Exact as in collage) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full flex items-center">
          <MapPin className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Enter city, district, or PIN code"
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setSearchLocation('Vadodara, Gujarat (GPS Active)')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer transition-colors"
        >
          <Crosshair className="w-4 h-4 text-[#0d5c46]" />
          <span>Use My Location</span>
        </button>
      </div>

      {/* Main Grid: Filter Sidebar + Map and Partners List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar (Collage screen 5) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
          {/* Filter by Partner Type */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter by Partner Type
            </span>
            <div className="space-y-2.5 text-xs text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={partnerTypes['SCA'] || false}
                  onChange={() => togglePartnerType('SCA')}
                  className="rounded text-[#0d5c46] focus:ring-[#0d5c46]"
                />
                <span>State Channeling Agency (SCA)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={partnerTypes['PSB'] || false}
                  onChange={() => togglePartnerType('PSB')}
                  className="rounded text-[#0d5c46] focus:ring-[#0d5c46]"
                />
                <span>Public Sector Bank (PSB)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={partnerTypes['RRB'] || false}
                  onChange={() => togglePartnerType('RRB')}
                  className="rounded text-[#0d5c46] focus:ring-[#0d5c46]"
                />
                <span>Regional Rural Bank (RRB)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={partnerTypes['NBFC-MFI'] || false}
                  onChange={() => togglePartnerType('NBFC-MFI')}
                  className="rounded text-[#0d5c46] focus:ring-[#0d5c46]"
                />
                <span>NBFC-MFI</span>
              </label>
            </div>
          </div>

          {/* Scheme Compatibility */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Scheme Compatibility
            </label>
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20"
            >
              <option value="All Schemes">All Schemes</option>
              <option value="micro-credit">Micro Finance Scheme</option>
              <option value="term-loan-small">Term Loan Scheme</option>
              <option value="education-domestic">Education Loan</option>
            </select>
          </div>

          {/* Distance (within) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Distance (within)
            </label>
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20"
            >
              <option value="All">All</option>
              <option value="5km">Within 5 km</option>
              <option value="10km">Within 10 km</option>
              <option value="25km">Within 25 km</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Right Section: Map View + Recommended Partners List */}
        <div className="lg:col-span-8 space-y-5">
          {/* Map Preview Card (Collage Screen 5) */}
          <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-[#f1f5f9]">
            {/* SVG Stylized Road & District Map */}
            <svg viewBox="0 0 600 240" className="w-full h-full object-cover">
              {/* Land background */}
              <rect width="600" height="240" fill="#f8fafc" />

              {/* Water / Vishwamitri River feature in Vadodara */}
              <path d="M220 0 Q240 80 210 140 T230 240" stroke="#bfdbfe" strokeWidth="14" fill="none" opacity="0.6" />

              {/* Road Network Grid */}
              <path d="M0 70 Q300 80 600 65" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <path d="M0 160 Q300 150 600 170" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <path d="M120 0 L150 240" stroke="#e2e8f0" strokeWidth="6" fill="none" />
              <path d="M380 0 L360 240" stroke="#e2e8f0" strokeWidth="6" fill="none" />
              <path d="M480 0 L510 240" stroke="#e2e8f0" strokeWidth="5" fill="none" />

              {/* Major Highway / Ring Road */}
              <circle cx="320" cy="120" r="70" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeDasharray="6 4" />

              {/* City Label */}
              <text x="315" y="165" fill="#94a3b8" fontSize="13" fontWeight="700" letterSpacing="1.5">VADODARA</text>

              {/* Interactive Marker 1: Axis Bank (2.8 km) */}
              <g transform="translate(300, 75)" className="cursor-pointer">
                <circle cx="0" cy="0" r="8" fill="#0d5c46" />
                <circle cx="0" cy="0" r="14" stroke="#0d5c46" strokeWidth="1.5" fill="none" opacity="0.4" />
                {/* Tooltip Pill */}
                <rect x="-65" y="-38" width="130" height="24" rx="12" fill="#ffffff" stroke="#0d5c46" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                <text x="0" y="-22" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="700">Axis Bank • 2.8 km</text>
              </g>

              {/* Interactive Marker 2: Gujarat Gramin Bank (4.5 km) */}
              <g transform="translate(420, 110)" className="cursor-pointer">
                <circle cx="0" cy="0" r="7" fill="#d97706" />
                <rect x="-60" y="-32" width="120" height="20" rx="10" fill="#ffffff" stroke="#d97706" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
                <text x="0" y="-18" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="600">Gujarat Gramin • 4.5 km</text>
              </g>

              {/* Interactive Marker 3: Swaraj Finance MFI (6.7 km) */}
              <g transform="translate(180, 160)" className="cursor-pointer">
                <circle cx="0" cy="0" r="6" fill="#2563eb" />
                <rect x="-55" y="-30" width="110" height="20" rx="10" fill="#ffffff" stroke="#2563eb" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
                <text x="0" y="-16" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="600">Swaraj MFI • 6.7 km</text>
              </g>
            </svg>
          </div>

          {/* Recommended Partners Section Header */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recommended Partners
            </span>

            {/* List of Partner Cards */}
            <div className="space-y-3">
              {filteredPartners.slice(0, 3).map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedPartnerId === partner.id
                      ? 'border-[#0d5c46] ring-2 ring-[#0d5c46]/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs">
                      {partner.type === 'PSB' ? '🏛️' : partner.type === 'RRB' ? '🌾' : '🤝'}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {partner.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {partner.type} • {partner.distanceKm || '3.5'} km
                        </span>
                      </div>

                      {/* Supported Schemes Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                          Micro Finance
                        </span>
                        {partner.type !== 'NBFC-MFI' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                            Term Loan
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                          Education Loan
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Eligible Badge + View Details Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF7EE] text-[#0d5c46] border border-[#c3ebcb]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Eligible</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPartnerForApplication) onSelectPartnerForApplication(partner);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d5c46] hover:bg-[#0a4635] text-white text-xs font-medium shadow-xs transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
