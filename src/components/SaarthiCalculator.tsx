import React, { useState, useId } from 'react';
import { ArrowRight, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';
import { SCHEMES_DATA } from '../data/schemes';

interface SaarthiCalculatorProps {
  initialSchemeId?: string;
  initialAmount?: number;
  initialRate?: number;
  initialTenure?: number;
  initialMoratorium?: number;
  onNavigateToPartners?: () => void;
}

export const SaarthiCalculator: React.FC<SaarthiCalculatorProps> = ({
  initialSchemeId = 'micro-credit',
  initialAmount = 100000,
  initialRate = 6.5,
  initialTenure = 3,
  initialMoratorium = 3,
  onNavigateToPartners
}) => {
  const schemeSelectId = useId();
  const loanAmountId = useId();
  const interestRateId = useId();
  const tenureYearsId = useId();
  const moratoriumMonthsId = useId();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId);
  const [loanAmount, setLoanAmount] = useState<number>(initialAmount);
  const [interestRate, setInterestRate] = useState<number>(initialRate);
  const [tenureYears, setTenureYears] = useState<number>(initialTenure);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(initialMoratorium);
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  // When scheme changes, auto-load standard concessional terms
  const handleSchemeChange = (id: string) => {
    setSelectedSchemeId(id);
    const found = SCHEMES_DATA.find(s => s.id === id);
    if (found) {
      setInterestRate(found.concessionalRate);
      setLoanAmount(Math.min(loanAmount, found.maxLoan));
      setTenureYears(found.maxRepaymentYears > 5 ? 5 : found.maxRepaymentYears);
      setMoratoriumMonths(found.maxMoratoriumMonths > 3 ? 3 : found.maxMoratoriumMonths);
    }
  };

  // Monthly Interest Rate and Amortization Calculation
  const r = (interestRate / 12) / 100;
  const n = tenureYears * 12; // Repayment months

  // Standard amortized monthly EMI calculation: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculatedEmi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) || 3193;

  // Moratorium simple interest during grace phase
  const monthlyMoratoriumInterest = Math.round(loanAmount * r);
  const totalMoratoriumInterest = monthlyMoratoriumInterest * moratoriumMonths;

  // Total Interest and Repayment
  const totalRepaymentDuringTenure = calculatedEmi * n;
  const totalInterest = (totalRepaymentDuringTenure - loanAmount) + totalMoratoriumInterest;
  const totalPayable = loanAmount + totalInterest;

  // Generate schedule rows
  const scheduleRows = [];
  let currentBalance = loanAmount;
  for (let m = 1; m <= Math.min(n, showFullSchedule ? n : 5); m++) {
    const interestPart = Math.round(currentBalance * r);
    const principalPart = Math.min(currentBalance, calculatedEmi - interestPart);
    currentBalance = Math.max(0, currentBalance - principalPart);
    scheduleRows.push({
      month: m,
      principal: principalPart,
      interest: interestPart,
      balance: currentBalance
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          EMI Calculator
        </h2>
        <p className="text-sm text-slate-500">
          Calculate your monthly installment based on the selected scheme.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (Screen 4 Left) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          {/* Scheme Select */}
          <div className="space-y-1.5">
            <label htmlFor={schemeSelectId} className="block text-xs font-semibold text-slate-700">
              Scheme
            </label>
            <select
              id={schemeSelectId}
              value={selectedSchemeId}
              onChange={(e) => handleSchemeChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
            >
              <option value="micro-credit">Micro Finance Scheme</option>
              <option value="term-loan-small">Term Loan Scheme (Small Business & Services)</option>
              <option value="term-loan-large">High Value Term Loan & Industrial Project</option>
              <option value="education-domestic">Concessional Education Loan (Inland Higher Studies)</option>
              <option value="education-foreign">Overseas Education Loan for SC Scholars</option>
              <option value="green-business">Green Business Scheme (Solar & Eco-Enterprises)</option>
            </select>
          </div>

          {/* Loan Amount */}
          <div className="space-y-1.5">
            <label htmlFor={loanAmountId} className="block text-xs font-semibold text-slate-700">
              Loan Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              id={loanAmountId}
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <label htmlFor={interestRateId} className="block text-xs font-semibold text-slate-700">
              Interest Rate (%) <span className="text-rose-500">*</span>
            </label>
            <input
              id={interestRateId}
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
            />
          </div>

          {/* Tenure (Years) */}
          <div className="space-y-1.5">
            <label htmlFor={tenureYearsId} className="block text-xs font-semibold text-slate-700">
              Tenure (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              id={tenureYearsId}
              type="number"
              min="1"
              max="15"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
            />
          </div>

          {/* Moratorium (Months) */}
          <div className="space-y-1.5">
            <label htmlFor={moratoriumMonthsId} className="block text-xs font-semibold text-slate-700">
              Moratorium (Months) <span className="text-rose-500">*</span>
            </label>
            <input
              id={moratoriumMonthsId}
              type="number"
              min="0"
              max="12"
              value={moratoriumMonths}
              onChange={(e) => setMoratoriumMonths(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
            />
          </div>

          {/* Calculate Button */}
          <div className="pt-2">
            <button
              type="button"
              className="w-full py-3 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
              id="btn-calculate-emi"
            >
              Calculate EMI
            </button>
          </div>
        </div>

        {/* Right Column: Loan Summary Card (Screen 4 Right) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Loan Summary
            </h3>
          </div>

          {/* Mint-Green Highlight Box (Exact as in collage) */}
          <div className="p-4 rounded-xl bg-[#EAF7EE] border border-[#c6ecd0] flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-[#0d5c46]">
              Monthly EMI
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0d5c46]">
              ₹ {calculatedEmi.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Summary Figures */}
          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="py-2.5 flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Total Interest</span>
              <span className="font-semibold text-slate-900">₹ {totalInterest.toLocaleString('en-IN')}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Total Amount Payable</span>
              <span className="font-bold text-slate-900">₹ {totalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Repayment Schedule (First 5 Months) */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Repayment Schedule ({showFullSchedule ? `All ${n} Months` : 'First 5 Months'})
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Month</th>
                    <th className="py-2 px-3">Principal</th>
                    <th className="py-2 px-3">Interest</th>
                    <th className="py-2 px-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {scheduleRows.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-medium text-slate-900">{row.month}</td>
                      <td className="py-2 px-3">₹{row.principal.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3">₹{row.interest.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 font-medium">₹{row.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Toggle Full Schedule Link */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="text-xs font-semibold text-[#0d5c46] hover:underline cursor-pointer"
              >
                {showFullSchedule ? 'Show Less' : 'View Full Schedule →'}
              </button>

              {onNavigateToPartners && (
                <button
                  type="button"
                  onClick={onNavigateToPartners}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d5c46] hover:underline cursor-pointer"
                >
                  <span>Find Nearby Partner →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
