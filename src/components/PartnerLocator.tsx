import React, { useState, useMemo, useId } from 'react';
import { ChannelPartner, Scheme, Language, PartnerType } from '../types';
import { PARTNERS_DATA } from '../data/partners';
import { TRANSLATIONS } from '../data/translations';
import { MapPin, Navigation, Phone, Mail, User, ShieldAlert, CheckCircle2, AlertTriangle, Building2, Search, Filter, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface PartnerLocatorProps {
  currentLang: Language;
  selectedScheme?: Scheme | null;
  onSelectPartnerForRouting: (partner: ChannelPartner) => void;
}

export const PartnerLocator: React.FC<PartnerLocatorProps> = ({
  currentLang,
  selectedScheme,
  onSelectPartnerForRouting
}) => {
  const t = TRANSLATIONS[currentLang];

  const searchInputId = useId();
  const stateFilterSelectId = useId();
  const partnerTypeSelectId = useId();
  const onlyActivePartnersCheckboxId = useId();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [onlyActivePartners, setOnlyActivePartners] = useState<boolean>(true);
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<ChannelPartner | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);

  // States available in directory
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(PARTNERS_DATA.map(p => p.state))).sort();
    return ["ALL", ...states];
  }, []);

  // Request browser geolocation
  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocatingUser(false);
      },
      (error) => {
        console.warn("Geolocation denied or unavailable:", error);
        // Default to Delhi NCT for demonstration
        setUserCoordinates({ lat: 28.6139, lng: 77.2090 });
        setLocatingUser(false);
      }
    );
  };

  // Calculate distance in kilometers using Haversine formula
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Filter and sort partners
  const filteredPartners = useMemo(() => {
    return PARTNERS_DATA.map(p => {
      let distance = undefined;
      if (userCoordinates) {
        distance = getDistanceKm(userCoordinates.lat, userCoordinates.lng, p.latitude, p.longitude);
      }
      return { ...p, distanceKm: distance };
    }).filter(p => {
      // 1. NPA Active check
      if (onlyActivePartners && !p.disbursementEligible) return false;

      // 2. State filter
      if (selectedState !== "ALL" && p.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // 3. Partner Type filter
      if (selectedType !== "ALL" && p.type !== selectedType) {
        return false;
      }

      // 4. Scheme compatibility
      if (selectedScheme && !p.supportedSchemes.includes(selectedScheme.id)) {
        return false;
      }

      // 5. Search query (name, city, pincode, district)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesDistrict = p.district.toLowerCase().includes(q);
        const matchesPin = p.pincode.includes(q);
        const matchesNodal = p.nodalOfficer.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesDistrict && !matchesPin && !matchesNodal) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // If user coordinates available, sort by distance
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      // Otherwise sort eligible first, then by lower NPA%
      if (a.disbursementEligible && !b.disbursementEligible) return -1;
      if (!a.disbursementEligible && b.disbursementEligible) return 1;
      return a.npaPercentage - b.npaPercentage;
    });
  }, [selectedState, selectedType, onlyActivePartners, selectedScheme, searchQuery, userCoordinates]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>Geo-Spatial Routing & NPA Sanitization Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {t.partnerTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {t.partnerDesc}
            </p>
          </div>

          <button
            onClick={handleFindNearMe}
            disabled={locatingUser}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-300" />
            <span>{locatingUser ? "Locating..." : "Find Nearest to My Location (GPS)"}</span>
          </button>
        </div>

        {/* NPA Screening Defense Banner */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Automated Safeguard Against Trapped Applications:</span>
              <span className="text-amber-800 text-[11px] leading-relaxed">
                Central guidelines prohibit dispatching beneficiary applications to Channel Partners with high Non-Performing Assets (NPAs &gt; 8.0%) or chronic overdues. Such institutions are automatically quarantined from new borrower routing.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              🟢 Healthy: &lt;5% NPA
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
              🔴 Blocked: &gt;8% NPA
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <label htmlFor={searchInputId} className="sr-only">Search Partner, District, or Pincode</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search Partner, District, or Pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* State Filter */}
          <div>
            <label htmlFor={stateFilterSelectId} className="sr-only">Filter by State</label>
            <select
              id={stateFilterSelectId}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-800"
            >
              <option value="ALL">All States & Territories</option>
              {availableStates.filter(s => s !== "ALL").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Partner Type Filter */}
          <div>
            <label htmlFor={partnerTypeSelectId} className="sr-only">Partner Type</label>
            <select
              id={partnerTypeSelectId}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-800"
            >
              <option value="ALL">All Partner Categories</option>
              <option value="SCA">State Channelizing Agency (SCA)</option>
              <option value="PSB">Public Sector Bank (PSB)</option>
              <option value="RRB">Regional Rural Bank (RRB)</option>
              <option value="NBFC-MFI">Micro Finance Institution (NBFC-MFI)</option>
            </select>
          </div>

          {/* Active / Solvent Toggle */}
          <div className="flex items-center">
            <label htmlFor={onlyActivePartnersCheckboxId} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                id={onlyActivePartnersCheckboxId}
                type="checkbox"
                checked={onlyActivePartners}
                onChange={(e) => setOnlyActivePartners(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>{t.activeOnly}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-display">
              National Channel Partner Geo-Spatial Distribution
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span>Showing <strong>{filteredPartners.length}</strong> Qualified Routing Points</span>
            {userCoordinates && (
              <span className="bg-indigo-600/50 px-2 py-0.5 rounded text-[11px] text-indigo-200">
                GPS Active ({userCoordinates.lat.toFixed(2)}, {userCoordinates.lng.toFixed(2)})
              </span>
            )}
          </div>
        </div>

        {/* Visual Map Canvas Representation */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Grid Lines and India Coordinates Matrix */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Interactive Geo Markers */}
          <div className="relative w-full h-full max-w-2xl max-h-full">
            {filteredPartners.map((partner, index) => {
              // Normalized projected position for India boundaries (approx. 8N-35N, 68E-92E)
              const topPercent = Math.max(10, Math.min(90, 100 - ((partner.latitude - 8) / (34 - 8)) * 85));
              const leftPercent = Math.max(10, Math.min(90, ((partner.longitude - 70) / (88 - 70)) * 80 + 10));

              const isHealthy = partner.healthStatus === "HEALTHY";
              const isBlocked = !partner.disbursementEligible;

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartnerDetail(partner)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                  title={`${partner.name} (${partner.city}) - NPA: ${partner.npaPercentage}%`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg border-2 ${
                    isBlocked
                      ? 'bg-rose-600 border-rose-300 animate-pulse'
                      : isHealthy
                        ? 'bg-emerald-600 border-emerald-300 ring-4 ring-emerald-500/20'
                        : 'bg-amber-600 border-amber-300'
                  }`}>
                    {partner.type[0]}
                  </div>
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white text-[10px] px-2 py-1 rounded shadow-lg border border-slate-700 z-30 pointer-events-none">
                    <p className="font-bold">{partner.name}</p>
                    <p className="text-slate-300">{partner.city}, {partner.state} | NPA: {partner.npaPercentage}%</p>
                  </div>
                </button>
              );
            })}

            {/* User GPS Pin */}
            {userCoordinates && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  top: `${Math.max(15, Math.min(85, 100 - ((userCoordinates.lat - 8) / (34 - 8)) * 85))}%`,
                  left: `${Math.max(15, Math.min(85, ((userCoordinates.lng - 70) / (88 - 70)) * 80 + 10))}%`
                }}
              >
                <div className="w-4 h-4 rounded-full bg-indigo-400 border-2 border-white ring-8 ring-indigo-500/30 animate-ping absolute"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white relative shadow-md"></div>
              </div>
            )}
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Healthy (&lt;5% NPA)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Caution Watchlist</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Blocked (High Overdues)</span>
          </div>
        </div>
      </div>

      {/* Partner Cards Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Authorized Channel Partners ({filteredPartners.length} Active in Region)</span>
          </h3>
          {selectedScheme && (
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium border border-indigo-100">
              Filtered for: {selectedScheme.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPartners.map((partner) => {
            const isHealthy = partner.healthStatus === "HEALTHY";
            const isBlocked = !partner.disbursementEligible;

            return (
              <div
                key={partner.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isBlocked
                    ? 'border-rose-200 bg-rose-50/20'
                    : isHealthy
                      ? 'border-slate-200 hover:border-emerald-400'
                      : 'border-amber-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                        {partner.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {partner.category}
                      </span>
                    </div>

                    {/* NPA / Health Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      isBlocked
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isHealthy
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {isBlocked ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>Blocked ({partner.npaPercentage}% NPA)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Solvent ({partner.npaPercentage}% NPA)</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Partner Name & Location */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {partner.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{partner.address}</span>
                    </p>
                  </div>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Quota Allocated</span>
                      <span className="font-bold text-slate-800">₹{partner.allocatedQuotaCrores} Cr</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Utilized</span>
                      <span className="font-bold text-indigo-700">₹{partner.utilizedCrores} Cr</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Avg Turnaround</span>
                      <span className="font-bold text-slate-800">{partner.avgProcessingDays} Days</span>
                    </div>
                  </div>

                  {/* Disqualification warning if blocked */}
                  {isBlocked && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-800">
                      <strong>Routing Quarantined:</strong> {partner.disqualificationReason}
                    </div>
                  )}

                  {/* Nodal Officer Contact */}
                  <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Nodal Officer: {partner.nodalOfficer}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{partner.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Routing Action */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {partner.distanceKm !== undefined ? (
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                      📍 {partner.distanceKm} km away
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">{partner.city}, {partner.state}</span>
                  )}

                  <button
                    disabled={isBlocked}
                    onClick={() => onSelectPartnerForRouting(partner)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isBlocked
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <span>{isBlocked ? "Routing Prohibited" : t.routeApplication}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
