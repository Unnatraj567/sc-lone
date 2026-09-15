import React, { useState, useId } from 'react';
import { Scheme, SchemeRecommendation, Language } from '../types';
import { SCHEMES_DATA } from '../data/schemes';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Calculator, MapPin, IndianRupee, ShieldAlert, Award, FileText } from 'lucide-react';

interface SchemeRecommenderProps {
  currentLang: Language;
  onSelectSchemeForCalc: (scheme: Scheme, cost: number) => void;
  onSelectSchemeForLocator: (scheme: Scheme) => void;
}

export const SchemeRecommender: React.FC<SchemeRecommenderProps> = ({
  currentLang,
  onSelectSchemeForCalc,
  onSelectSchemeForLocator
}) => {
  const t = TRANSLATIONS[currentLang];

  const projectTypeSelectId = useId();
  const estimatedCostId = useId();
  const annualIncomeId = useId();
  const educationLevelId = useId();
  const womanBeneficiaryId = useId();
  const stateId = useId();

  const [projectType, setProjectType] = useState<string>("Small Retail & Kirana Store");
  const [estimatedCost, setEstimatedCost] = useState<number>(300000);
  const [annualIncome, setAnnualIncome] = useState<number>(240000);
  const [educationStatus, setEducationStatus] = useState<string>("10th Pass / Secondary");
  const [isWomanBeneficiary, setIsWomanBeneficiary] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>("Delhi");
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<Scheme | null>(null);

  // Determine income eligibility (Central limit ₹5.00 Lakhs)
  const isIncomeEligible = annualIncome <= 500000;

  // Rule-based deterministic recommendations
  const getRecommendations = (): SchemeRecommendation[] => {
    return SCHEMES_DATA.map(scheme => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Cost Ceiling Match
      if (estimatedCost <= scheme.maxLoan) {
        score += 40;
        reasons.push(`Project cost (₹${estimatedCost.toLocaleString("en-IN")}) is within maximum ceiling of ₹${(scheme.maxLoan / 100000).toFixed(1)} Lakh`);
      } else {
        score -= 25;
        reasons.push(`Cost exceeds maximum ceiling of ₹${(scheme.maxLoan / 100000).toFixed(1)} Lakh`);
      }

      // 2. Project Category affinity
      const p = projectType.toLowerCase();
      if (p.includes("education") || p.includes("study") || p.includes("college") || p.includes("foreign") || p.includes("overseas")) {
        if (scheme.category === "Educational Loan") {
          score += 45;
          if (p.includes("foreign") || p.includes("overseas")) {
            if (scheme.id === "education-foreign") {
              score += 20;
              reasons.push("Specialized overseas scholar loan covering tuition, foreign living expenses, and airfare.");
            }
          } else {
            if (scheme.id === "education-domestic") {
              score += 20;
              reasons.push("Comprehensive 100% inland educational funding with zero promoter margin.");
            }
          }
        }
      } else if (p.includes("green") || p.includes("solar") || p.includes("rickshaw") || p.includes("ev") || p.includes("electric")) {
        if (scheme.id === "green-business") {
          score += 55;
          reasons.push("Targeted under Green Business Scheme with 6.75% concessional green energy credit.");
        }
      } else if (estimatedCost <= 140000) {
        if (scheme.id === "micro-credit") {
          score += 45;
          reasons.push("Optimal micro-credit fit: zero collateral requirement and 3-6 months grace period.");
        }
      } else if (estimatedCost <= 500000) {
        if (scheme.id === "term-loan-small") {
          score += 45;
          reasons.push("Standard Term Loan (Small Business) allows quick SCA sanction with 5-10% promoter share.");
        }
      } else {
        if (scheme.id === "term-loan-large") {
          score += 45;
          reasons.push("Industrial term loan structured for capital machinery and commercial transport operations.");
        }
      }

      // 3. Women applicant priority
      if (isWomanBeneficiary) {
        if (scheme.id === "micro-credit") {
          score += 15;
          reasons.push("Eligible for Mahila Samriddhi priority processing & additional interest rebate.");
        } else if (scheme.category === "Educational Loan") {
          score += 10;
          reasons.push("0.5% special interest concession for female scholars.");
        }
      }

      const calculatedLoan = Math.min(estimatedCost * (scheme.scContributionPercent / 100), scheme.maxLoan);
      const promoterShare = estimatedCost - calculatedLoan;

      return {
        scheme,
        matchScore: Math.min(99, Math.max(15, score)),
        eligible: isIncomeEligible && estimatedCost <= scheme.maxLoan,
        calculatedLoanAmount: calculatedLoan,
        calculatedPromoterShare: promoterShare,
        reasons
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const recommendations = getRecommendations();
  const topMatch = recommendations[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI & Rule-Based Advisory Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {t.recommenderTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {t.recommenderDesc}
            </p>
          </div>

          {/* Statutory Income Checker Pill */}
          <div className={`p-4 rounded-xl border text-xs max-w-sm ${
            isIncomeEligible
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isIncomeEligible ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Statutory Income Eligible (≤ ₹5.00 Lakhs)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Exceeds Statutory Income Ceiling</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {isIncomeEligible
                ? `Your annual family income of ₹${annualIncome.toLocaleString('en-IN')} qualifies for 90% concessional credit at 6.5% - 8.0% interest rates.`
                : `Annual income of ₹${annualIncome.toLocaleString('en-IN')} exceeds the central limit of ₹5.00 Lakhs. Concessional SC credit is legally restricted to families below this ceiling.`}
            </p>
          </div>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
          {/* Project Type */}
          <div>
            <label htmlFor={projectTypeSelectId} className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.projectType}
            </label>
            <select
              id={projectTypeSelectId}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="Micro Vendor / Fruit / Vegetable / Hawkers">Micro Retail & Vendor (Under ₹1.40 Lakh)</option>
              <option value="Small Retail & Kirana Store">Small Retail & Grocery Store</option>
              <option value="Electric Auto / E-Rickshaw / Solar Setup">Electric Vehicle / Solar / Green Energy</option>
              <option value="Dairy / Poultry / Agro-Allied Unit">Dairy Farming / Animal Husbandry</option>
              <option value="Tailoring / Boutique / Handicraft">Tailoring & Apparel Unit (Mahila Samriddhi)</option>
              <option value="Automotive Workshop / Repair Shop">Automotive Workshop / Service Station</option>
              <option value="Commercial Transport / Cargo Fleet">Commercial Vehicle / Cargo Transport</option>
              <option value="Manufacturing / Processing Plant">Small Industrial Manufacturing Unit</option>
              <option value="Higher Education in India (B.Tech/MBBS/MBA/Law)">Higher Education in India (B.Tech, MBBS, MBA, Law)</option>
              <option value="Overseas Studies (Master/PhD in Foreign University)">Overseas Master / PhD Studies Abroad</option>
            </select>
          </div>

          {/* Estimated Cost */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor={estimatedCostId} className="text-xs font-semibold text-slate-700">
                {t.estimatedCost}
              </label>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                ₹{estimatedCost.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id={estimatedCostId}
              type="range"
              min={25000}
              max={5000000}
              step={25000}
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            {/* Presets */}
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <button onClick={() => setEstimatedCost(100000)} className="hover:text-indigo-600 underline">₹1.0L</button>
              <button onClick={() => setEstimatedCost(140000)} className="hover:text-indigo-600 underline">₹1.4L (Micro)</button>
              <button onClick={() => setEstimatedCost(500000)} className="hover:text-indigo-600 underline">₹5.0L (Small)</button>
              <button onClick={() => setEstimatedCost(2000000)} className="hover:text-indigo-600 underline">₹20L (Edu)</button>
              <button onClick={() => setEstimatedCost(5000000)} className="hover:text-indigo-600 underline">₹50L (Max)</button>
            </div>
          </div>

          {/* Annual Income */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor={annualIncomeId} className="text-xs font-semibold text-slate-700">
                {t.annualIncome} (Max ₹5 Lakh)
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                annualIncome <= 500000
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-rose-700 bg-rose-50 border-rose-200'
              }`}>
                ₹{annualIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id={annualIncomeId}
              type="range"
              min={50000}
              max={700000}
              step={10000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>₹50K</span>
              <span className="font-semibold text-amber-700">₹5.0L (Ceiling)</span>
              <span>₹7.0L</span>
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label htmlFor={educationLevelId} className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.educationLevel}
            </label>
            <select
              id={educationLevelId}
              value={educationStatus}
              onChange={(e) => setEducationStatus(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="No Formal Schooling / Literate">No Formal Schooling / Basic Literacy</option>
              <option value="8th Pass / Middle School">8th Pass / Middle School</option>
              <option value="10th Pass / Secondary">10th Pass (Matriculation)</option>
              <option value="12th Pass / Senior Secondary">12th Pass / Intermediate</option>
              <option value="ITI / Polytechnic Diploma">ITI / Polytechnic Diploma</option>
              <option value="Graduate / Professional Degree">Graduate (B.A./B.Com/B.Sc/B.Tech)</option>
              <option value="Post-Graduate / Doctorate">Post-Graduate / Professional</option>
            </select>
          </div>

          {/* State & District */}
          <div>
            <label htmlFor={stateId} className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.stateSelect} (For Nodal Partner Routing)
            </label>
            <select
              id={stateId}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="Delhi">Delhi NCT</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Haryana">Haryana</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Punjab">Punjab</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Bihar">Bihar</option>
            </select>
          </div>

          {/* Woman Beneficiary Priority */}
          <div className="flex items-center">
            <label htmlFor={womanBeneficiaryId} className="relative flex items-start gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors w-full">
              <input
                id={womanBeneficiaryId}
                type="checkbox"
                checked={isWomanBeneficiary}
                onChange={(e) => setIsWomanBeneficiary(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-amber-950 block">{t.womanBeneficiary}</span>
                <span className="text-[11px] text-amber-800">Activates Mahila Samriddhi Yojana fast-track queue & 0.5% interest rebate.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Recommended Scheme Results Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Scheme Matching Results ({recommendations.length} Tailored Products)</span>
          </h3>
          <span className="text-xs text-slate-500">Sorted by relevance and cost suitability</span>
        </div>

        {/* Top Recommendation Highlight Banner */}
        {topMatch && (
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-indigo-800/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    Top Match: {topMatch.matchScore}% Compatibility
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {topMatch.scheme.category}
                  </span>
                  {isWomanBeneficiary && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/30 text-pink-200 border border-pink-400/30">
                      Mahila Samriddhi Priority
                    </span>
                  )}
                </div>

                <h4 className="text-2xl font-bold font-display tracking-tight text-white">
                  {topMatch.scheme.name}
                </h4>
                <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                  {topMatch.scheme.description}
                </p>

                {/* Financial Structure Summary Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                    <span className="text-[11px] text-slate-300 block">{t.concessionalRate}</span>
                    <span className="text-lg font-bold text-amber-300">
                      {isWomanBeneficiary ? (topMatch.scheme.concessionalRate - 0.5).toFixed(1) : topMatch.scheme.concessionalRate}% <span className="text-xs font-normal text-slate-300">p.a.</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 block">vs {topMatch.scheme.commercialMarketRate}% market</span>
                  </div>

                  <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                    <span className="text-[11px] text-slate-300 block">Concessional Loan</span>
                    <span className="text-lg font-bold text-white">
                      ₹{topMatch.calculatedLoanAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-indigo-200 block">{topMatch.scheme.scContributionPercent}% funded</span>
                  </div>

                  <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                    <span className="text-[11px] text-slate-300 block">Promoter Share</span>
                    <span className="text-lg font-bold text-amber-300">
                      ₹{topMatch.calculatedPromoterShare.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-300 block">Only {topMatch.scheme.promoterSharePercent}% margin</span>
                  </div>

                  <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                    <span className="text-[11px] text-slate-300 block">{t.moratorium}</span>
                    <span className="text-lg font-bold text-white">
                      {topMatch.scheme.maxMoratoriumMonths} Months
                    </span>
                    <span className="text-[10px] text-slate-300 block">Zero principal pressure</span>
                  </div>
                </div>

                {/* Key matching reasons */}
                <div className="space-y-1 pt-1">
                  {topMatch.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-indigo-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 shrink-0 sm:w-64">
                <button
                  onClick={() => onSelectSchemeForCalc(topMatch.scheme, topMatch.calculatedLoanAmount)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{t.calcEmiBtn}</span>
                </button>

                <button
                  onClick={() => onSelectSchemeForLocator(topMatch.scheme)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors border border-indigo-400/40 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t.routePartnerBtn}</span>
                </button>

                <button
                  onClick={() => setSelectedSchemeDetail(topMatch.scheme)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-indigo-200 hover:text-white transition-colors py-1 underline cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Required Documents & Guidelines</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Scheme Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(1).map((rec) => (
            <div
              key={rec.scheme.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {rec.scheme.category}
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {rec.matchScore}% Match
                  </span>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {rec.scheme.name}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {rec.scheme.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Interest Rate</span>
                    <span className="font-bold text-slate-800">{rec.scheme.concessionalRate}% p.a.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Loan Ceiling</span>
                    <span className="font-bold text-slate-800">₹{(rec.scheme.maxLoan / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Promoter Share</span>
                    <span className="font-bold text-amber-700">{rec.scheme.promoterSharePercent}% margin</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Moratorium</span>
                    <span className="font-bold text-slate-800">{rec.scheme.maxMoratoriumMonths} Months</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSchemeDetail(rec.scheme)}
                  className="text-xs text-slate-600 hover:text-indigo-600 font-medium underline cursor-pointer"
                >
                  Guidelines
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectSchemeForCalc(rec.scheme, rec.calculatedLoanAmount)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                    title="Calculate EMI"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectSchemeForLocator(rec.scheme)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <span>Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheme Detail / Guidelines Modal */}
      {selectedSchemeDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedSchemeDetail.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 font-display">
                  {selectedSchemeDetail.name}
                </h3>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  {selectedSchemeDetail.hindiName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedSchemeDetail.description}
            </p>

            {/* Key Features */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Key Statutory Features
              </h5>
              <div className="space-y-1.5">
                {selectedSchemeDetail.keyFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Required Checklist */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Mandatory Documents Required for Channel Partner Routing</span>
              </h5>
              <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                {selectedSchemeDetail.documentsRequired.map((doc, idx) => (
                  <li key={idx} className="leading-relaxed">{doc}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectSchemeForCalc(selectedSchemeDetail, selectedSchemeDetail.maxLoan * 0.8);
                  setSelectedSchemeDetail(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold"
              >
                Calculate EMI
              </button>
              <button
                onClick={() => {
                  onSelectSchemeForLocator(selectedSchemeDetail);
                  setSelectedSchemeDetail(null);
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Route to Authorized Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
