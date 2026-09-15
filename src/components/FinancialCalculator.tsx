import React, { useState, useEffect, useId } from 'react';
import { Scheme, Language } from '../types';
import { SCHEMES_DATA } from '../data/schemes';
import { TRANSLATIONS } from '../data/translations';
import { Calculator, ArrowRight, ShieldCheck, Sparkles, TrendingDown, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FinancialCalculatorProps {
  currentLang: Language;
  initialScheme?: Scheme | null;
  initialAmount?: number;
  onRouteToPartner: (scheme: Scheme, loanAmount: number) => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  currentLang,
  initialScheme,
  initialAmount,
  onRouteToPartner
}) => {
  const t = TRANSLATIONS[currentLang];

  const schemeSelectId = useId();
  const loanAmountInputId = useId();
  const interestRateInputId = useId();
  const tenureYearsInputId = useId();
  const moratoriumMonthsInputId = useId();
  const femaleRebateInputId = useId();

  const [selectedScheme, setSelectedScheme] = useState<Scheme>(initialScheme || SCHEMES_DATA[0]);
  const [loanAmount, setLoanAmount] = useState<number>(initialAmount || 120000);
  const [interestRate, setInterestRate] = useState<number>(selectedScheme.concessionalRate);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(6);
  const [hasFemaleRebate, setHasFemaleRebate] = useState<boolean>(false);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Sync when initialScheme changes from outside
  useEffect(() => {
    if (initialScheme) {
      setSelectedScheme(initialScheme);
      setInterestRate(initialScheme.concessionalRate);
      if (initialAmount) setLoanAmount(Math.min(initialAmount, initialScheme.maxLoan));
      setMoratoriumMonths(Math.min(6, initialScheme.maxMoratoriumMonths));
      setTenureYears(Math.min(5, initialScheme.maxRepaymentYears));
    }
  }, [initialScheme, initialAmount]);

  // Adjust rate if female rebate toggled
  const effectiveRate = Math.max(2, hasFemaleRebate ? interestRate - 0.5 : interestRate);
  const commercialMarketRate = selectedScheme.commercialMarketRate || 14.5;

  // Repayment Calculation
  // Standard EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEmi = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    if (monthlyRate === 0) return principal / totalMonths;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  };

  const concessionalEmi = calculateEmi(loanAmount, effectiveRate, tenureYears);
  const commercialEmi = calculateEmi(loanAmount, commercialMarketRate, tenureYears);

  // Moratorium interest calculation (Simple interest during grace phase)
  const moratoriumMonthlyInterest = Math.round((loanAmount * (effectiveRate / 100)) / 12);
  const totalMoratoriumInterest = moratoriumMonthlyInterest * moratoriumMonths;

  // Total repayment calculations
  const totalConcessionalRepayment = (concessionalEmi * tenureYears * 12) + totalMoratoriumInterest;
  const totalCommercialRepayment = commercialEmi * tenureYears * 12;
  const lifetimeSavings = Math.max(0, totalCommercialRepayment - totalConcessionalRepayment);

  // Promoter share vs SC Channel funding
  const promoterMarginPercent = selectedScheme.promoterSharePercent;
  const estimatedTotalProjectCost = Math.round(loanAmount / (selectedScheme.scContributionPercent / 100));
  const promoterMarginRupees = estimatedTotalProjectCost - loanAmount;

  // Generate Year-by-Year Amortization Schedule
  const generateAmortization = () => {
    const schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
    let balance = loanAmount;
    const monthlyRate = effectiveRate / 12 / 100;

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yrPrincipal = 0;
      let yrInterest = 0;

      for (let m = 1; m <= 12; m++) {
        const interestForMonth = balance * monthlyRate;
        const principalForMonth = Math.min(balance, concessionalEmi - interestForMonth);
        yrInterest += interestForMonth;
        yrPrincipal += principalForMonth;
        balance = Math.max(0, balance - principalForMonth);
      }

      schedule.push({
        year: yr,
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        balance: Math.round(balance)
      });
    }

    return schedule;
  };

  const schedule = generateAmortization();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Concessional Interest & Moratorium Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {t.calcTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {t.calcDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-xl text-indigo-900 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Government Subsidized Concession: <strong>{effectiveRate}% p.a.</strong></span>
          </div>
        </div>

        {/* Inputs & Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 pt-6 border-t border-slate-100">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Scheme Selector */}
            <div>
              <label htmlFor={schemeSelectId} className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Concessional Scheme Guidelines
              </label>
              <select
                id={schemeSelectId}
                value={selectedScheme.id}
                onChange={(e) => {
                  const s = SCHEMES_DATA.find(item => item.id === e.target.value) || SCHEMES_DATA[0];
                  setSelectedScheme(s);
                  setInterestRate(s.concessionalRate);
                  setLoanAmount(Math.min(loanAmount, s.maxLoan));
                  setMoratoriumMonths(Math.min(moratoriumMonths, s.maxMoratoriumMonths));
                  setTenureYears(Math.min(tenureYears, s.maxRepaymentYears));
                }}
                className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {SCHEMES_DATA.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Ceiling: ₹{(s.maxLoan / 100000).toFixed(1)}L | Base: {s.concessionalRate}% p.a.)
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor={loanAmountInputId} className="text-xs font-semibold text-slate-700">
                  {t.loanAmount}
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400">/ Max ₹{(selectedScheme.maxLoan / 100000).toFixed(1)}L</span>
                </div>
              </div>
              <input
                id={loanAmountInputId}
                type="range"
                min={20000}
                max={selectedScheme.maxLoan}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹20,000</span>
                <span>₹{(selectedScheme.maxLoan / 200000).toFixed(1)} Lakh</span>
                <span>₹{(selectedScheme.maxLoan / 100000).toFixed(1)} Lakh (Ceiling)</span>
              </div>
            </div>

            {/* Interest Rate & Female Rebate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={interestRateInputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.interestRateLabel}
                </label>
                <div className="relative">
                  <input
                    id={interestRateInputId}
                    type="number"
                    step="0.25"
                    min="3"
                    max="15"
                    value={effectiveRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-indigo-900"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">% p.a.</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Statutory rate for {selectedScheme.category}: {selectedScheme.concessionalRate}%
                </span>
              </div>

              <div>
                <label htmlFor={tenureYearsInputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.tenureYearsLabel}
                </label>
                <select
                  id={tenureYearsInputId}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-800"
                >
                  {Array.from({ length: selectedScheme.maxRepaymentYears }, (_, i) => i + 1).map(y => (
                    <option key={y} value={y}>
                      {y} Years ({y * 12} Monthly Installments)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Max allowed under scheme: {selectedScheme.maxRepaymentYears} years
                </span>
              </div>
            </div>

            {/* Moratorium Grace Period Slider */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <label htmlFor={moratoriumMonthsInputId} className="text-xs font-bold text-amber-950">
                    {t.moratoriumLabel}
                  </label>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                  {moratoriumMonths} Months Grace
                </span>
              </div>
              <input
                id={moratoriumMonthsInputId}
                type="range"
                min={0}
                max={selectedScheme.maxMoratoriumMonths}
                step={1}
                value={moratoriumMonths}
                onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-amber-800/80 mt-1">
                <span>0 Months</span>
                <span>3 Months</span>
                <span>6 Months</span>
                <span>{selectedScheme.maxMoratoriumMonths} Months (Max)</span>
              </div>
              <p className="text-[11px] text-amber-900/90 mt-2 leading-relaxed">
                {t.moratoriumNote}
              </p>
            </div>

            {/* Female Applicant Rebate Toggle */}
            <label htmlFor={femaleRebateInputId} className="flex items-center gap-2.5 p-3 rounded-lg border border-pink-200 bg-pink-50/50 cursor-pointer hover:bg-pink-50 transition-colors">
              <input
                id={femaleRebateInputId}
                type="checkbox"
                checked={hasFemaleRebate}
                onChange={(e) => setHasFemaleRebate(e.target.checked)}
                className="rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-pink-900">Apply 0.5% Female Scholar / Entrepreneur Rebate</span>
                <span className="text-pink-700 block text-[11px]">Special concession under Mahila Samriddhi and National Education Guidelines.</span>
              </div>
            </label>
          </div>

          {/* Results Summary Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Primary Concessional Result Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-5">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  {t.monthlyEmi}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-display">
                    ₹{concessionalEmi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  vs ₹{commercialEmi.toLocaleString('en-IN')}/mo in commercial private finance
                </span>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{t.totalInterestPayable}</span>
                  <span className="font-bold text-white text-sm">
                    ₹{(totalConcessionalRepayment - loanAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Moratorium Interest</span>
                  <span className="font-bold text-amber-300 text-sm">
                    ₹{totalMoratoriumInterest.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">₹{moratoriumMonthlyInterest}/mo</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Promoter Margin (Cash)</span>
                  <span className="font-bold text-white text-sm">
                    ₹{promoterMarginRupees.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-indigo-300 block">{promoterMarginPercent}% Beneficiary Share</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Channel Loan (Up to 90%)</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{selectedScheme.scContributionPercent}% Gov/Channel Share</span>
                </div>
              </div>

              {/* Massive Lifetime Savings Contrast Pill */}
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>{t.totalSavings}</span>
                </div>
                <div className="text-2xl font-bold text-emerald-200">
                  ₹{lifetimeSavings.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-emerald-300/80 mt-1">
                  By routing through official State Channelizing Agencies instead of commercial lenders at 14.5% interest.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onRouteToPartner(selectedScheme, loanAmount)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 transition-all shadow-md cursor-pointer"
              >
                <span>Find & Route to Nearest Solvent Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Amortization Schedule */}
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{showAmortization ? "Hide Amortization Schedule" : "View Complete Repayment Amortization Schedule"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Drawer / Table */}
      {showAmortization && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs overflow-hidden">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Year-by-Year Projected Amortization Schedule</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-4 font-bold">Year</th>
                  <th className="py-2.5 px-4 font-bold">Principal Paid (₹)</th>
                  <th className="py-2.5 px-4 font-bold">Interest Paid (₹)</th>
                  <th className="py-2.5 px-4 font-bold">Total Annual Outflow (₹)</th>
                  <th className="py-2.5 px-4 font-bold">Closing Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-medium">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 text-amber-700">₹{row.interestPaid.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">₹{(row.principalPaid + row.interestPaid).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">₹{row.balance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 italic">
            * Note: During the initial {moratoriumMonths} months moratorium, installments cover only monthly interest (₹{moratoriumMonthlyInterest}/mo), followed by regular amortized EMIs.
          </p>
        </div>
      )}
    </div>
  );
};
