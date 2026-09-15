import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Coins, Sparkles, AlertCircle } from 'lucide-react';
import { Scheme } from '../types';
import { SCHEMES_DATA } from '../data/schemes';

interface SchemeFinderWizardProps {
  onSelectSchemeForCalc: (scheme: Scheme, loanAmount: number, interestRate: number, tenure: number, moratorium: number) => void;
  onSelectSchemeForPartner: (scheme: Scheme) => void;
}

export const SchemeFinderWizard: React.FC<SchemeFinderWizardProps> = ({
  onSelectSchemeForCalc,
  onSelectSchemeForPartner
}) => {
  // Wizard step: 1 = Form, 2 = Recommendation / Results
  const [step, setStep] = useState<1 | 2>(1);

  // Form states matching collage exactly
  const [purpose, setPurpose] = useState<string>('Start a Small Business');
  const [costAmount, setCostAmount] = useState<number>(100000);
  const [costDisplay, setCostDisplay] = useState<string>('₹ 1,00,000');
  const [familyIncome, setFamilyIncome] = useState<string>('Up to ₹5,00,000');
  const [educationStatus, setEducationStatus] = useState<string>('Not Applicable');
  const [category, setCategory] = useState<string>('Scheduled Caste (SC)');
  const [preferredLang, setPreferredLang] = useState<string>('English');

  // Handle formatted currency input
  const handleCostChange = (val: string) => {
    const numeric = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    setCostAmount(numeric);
    setCostDisplay(`₹ ${numeric.toLocaleString('en-IN')}`);
  };

  // Selected or recommended scheme
  const recommendedScheme = SCHEMES_DATA.find(s => s.id === 'micro-credit') || SCHEMES_DATA[0];

  const handleGetRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper Header (Screens 2 & 3) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 1 ? 'bg-[#0d5c46] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              1
            </div>
            <span className={`text-xs sm:text-sm font-semibold ${step === 1 ? 'text-[#0d5c46]' : 'text-slate-600'}`}>
              Your Details
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200">
            <div className={`h-full bg-[#0d5c46] transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`} />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 2 ? 'bg-[#0d5c46] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              2
            </div>
            <span className={`text-xs sm:text-sm font-semibold ${step === 2 ? 'text-[#0d5c46]' : 'text-slate-600'}`}>
              Scheme Recommendation
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200">
            <div className={`h-full bg-[#0d5c46] transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`} />
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-[#0d5c46] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              3
            </div>
            <span className={`text-xs sm:text-sm font-semibold ${step === 2 ? 'text-[#0d5c46]' : 'text-slate-500'}`}>
              Results
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: FORM VIEW (Top Middle Screen in Collage) */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Let's find the best scheme for you
            </h2>
            <p className="text-sm text-slate-500">
              Tell us a little about your needs and we'll recommend the most suitable scheme.
            </p>
          </div>

          <form onSubmit={handleGetRecommendation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Field 1: Purpose of Loan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Purpose of Loan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                >
                  <option value="Start a Small Business">Start a Small Business</option>
                  <option value="Term Loan - Machinery / Capital Assets">Term Loan - Machinery / Capital Assets</option>
                  <option value="Higher Education (Domestic Colleges)">Higher Education (Domestic Colleges)</option>
                  <option value="Overseas Higher Studies Abroad">Overseas Higher Studies Abroad</option>
                  <option value="Green Energy / Solar / E-Rickshaw">Green Energy / Solar / E-Rickshaw</option>
                  <option value="Agriculture Allied & Dairy Units">Agriculture Allied & Dairy Units</option>
                </select>
              </div>

              {/* Field 2: Estimated Project Cost */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Estimated Project Cost / Loan Amount <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={costDisplay}
                  onChange={(e) => handleCostChange(e.target.value)}
                  placeholder="₹ 1,00,000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                />
              </div>

              {/* Field 3: Annual Family Income */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Annual Family Income <span className="text-rose-500">*</span>
                </label>
                <select
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                >
                  <option value="Up to ₹5,00,000">Up to ₹5,00,000</option>
                  <option value="₹5,00,001 to ₹8,00,000">₹5,00,001 to ₹8,00,000</option>
                  <option value="Above ₹8,00,000">Above ₹8,00,000</option>
                </select>
              </div>

              {/* Field 4: Education Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Education Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={educationStatus}
                  onChange={(e) => setEducationStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                >
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="8th Pass / Basic Literacy">8th Pass / Basic Literacy</option>
                  <option value="10th / 12th Pass">10th / 12th Pass</option>
                  <option value="Graduate / Professional Degree">Graduate / Professional Degree</option>
                  <option value="Post Graduate / PhD">Post Graduate / PhD</option>
                </select>
              </div>

              {/* Field 5: Your Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                >
                  <option value="Scheduled Caste (SC)">Scheduled Caste (SC)</option>
                  <option value="Other Categories">Other Categories</option>
                </select>
              </div>

              {/* Field 6: Preferred Language */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Preferred Language <span className="text-rose-500">*</span>
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                </select>
              </div>
            </div>

            {/* Income ceiling compliance note */}
            {familyIncome !== 'Up to ₹5,00,000' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: Central SC Concessional Lending rules prioritize families with annual income up to ₹5.00 Lakhs.</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                id="btn-get-recommendation"
              >
                <span>Get Recommendation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: RECOMMENDED SCHEME / RESULTS (Top Right Screen in Collage) */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Back to form link */}
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0d5c46] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to form</span>
          </button>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recommended Scheme
            </h2>
          </div>

          {/* Green Alert Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#EAF7EE] border border-[#bbf7d0] text-sm text-[#0d5c46] flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#0d5c46] shrink-0" />
            <span className="font-medium">
              Based on your details, we recommend the following scheme for you.
            </span>
          </div>

          {/* Large Scheme Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Top row: Icon + Title + Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                  <Coins className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Micro Finance Scheme
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    For small businesses & self-employment (up to ₹1.40 Lakhs)
                  </p>
                </div>
              </div>

              <div className="self-start sm:self-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF7EE] text-[#0d5c46] border border-[#c3ebcb]">
                  Most Suitable
                </span>
              </div>
            </div>

            {/* 3 Metric Tiles in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/70">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Max Loan Amount
                </span>
                <span className="block text-lg font-bold text-slate-900 mt-1">
                  ₹1,40,000
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/70">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Interest Rate
                </span>
                <span className="block text-lg font-bold text-slate-900 mt-1">
                  6.5% – 8% p.a.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/70">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Moratorium Period
                </span>
                <span className="block text-lg font-bold text-slate-900 mt-1">
                  3 – 6 months
                </span>
              </div>
            </div>

            {/* Why this scheme? */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-800">
                Why this scheme?
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0d5c46] shrink-0 mt-0.5" />
                  <span>Your income (₹5L) and project cost (₹1L) fall within the eligible range.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0d5c46] shrink-0 mt-0.5" />
                  <span>It is designed for small business and self-employment activities.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0d5c46] shrink-0 mt-0.5" />
                  <span>Low interest rate and flexible repayment options.</span>
                </div>
              </div>
            </div>

            {/* CTA Button to proceed directly to EMI Calculator */}
            <div className="pt-3 flex justify-end">
              <button
                onClick={() => onSelectSchemeForCalc(recommendedScheme, costAmount, 6.5, 3, 3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer group"
                id="btn-view-details-calculate-emi"
              >
                <span>View Details & Calculate EMI</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
