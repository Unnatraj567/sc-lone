import React, { useState } from 'react';
import { ApplicationRecord, Language, ApplicationStatus } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CheckCircle2, Clock, Building2, User, Phone, FileText, Download, Printer, ShieldCheck, IndianRupee, ArrowRight, Sparkles } from 'lucide-react';

interface ApplicationTrackerProps {
  currentLang: Language;
  applications: ApplicationRecord[];
  activeApplicationId?: string;
  onSelectApplication: (app: ApplicationRecord) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  currentLang,
  applications,
  activeApplicationId,
  onSelectApplication
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedId, setSelectedId] = useState<string>(activeApplicationId || applications[0]?.id || "SC-CF-2026-8841");
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  const currentApp = applications.find(a => a.id === selectedId) || applications[0];

  // Pipeline stages definition
  const stages: { key: ApplicationStatus; title: string; desc: string }[] = [
    { key: 'VERIFIED', title: '1. e-KYC & Verification', desc: 'Aadhaar, Caste & Bank Account validated' },
    { key: 'ROUTED_TO_PARTNER', title: '2. Routed to Channel Partner', desc: 'Dossier dispatched to authorized bank/SCA' },
    { key: 'UNDER_REVIEW_SCA', title: '3. Field & Feasibility Review', desc: 'Nodal Officer desk inspection & site verification' },
    { key: 'SANCTIONED', title: '4. Credit Committee Sanction', desc: 'Sanction order and interest subsidy released' },
    { key: 'DISBURSED', title: '5. Direct Benefit Transfer (DBT)', desc: 'Funds credited to verified DBT bank account' }
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'DRAFT': return 0;
      case 'VERIFIED': return 0;
      case 'ROUTED_TO_PARTNER': return 1;
      case 'UNDER_REVIEW_SCA': return 2;
      case 'SANCTIONED': return 3;
      case 'DISBURSED': return 4;
      default: return 1;
    }
  };

  const currentStageIndex = currentApp ? getStageIndex(currentApp.status) : 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Search and Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Lifecycle Tracking</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Channel Finance Application Status & Tracking
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Monitor the exact progress of your concessional loan application across the Channelizing Agency and Banking Network.
            </p>
          </div>

          {/* Selector if multiple applications */}
          {applications.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Select Application:</span>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-indigo-900"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.id} - {app.beneficiaryName} ({app.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Status & Pipeline Display */}
      {currentApp && (
        <div className="space-y-6">
          {/* Status Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">APPLICATION REFERENCE:</span>
                  <span className="font-mono text-base font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                    {currentApp.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {currentApp.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {currentApp.schemeName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Beneficiary: <strong>{currentApp.beneficiaryName}</strong> | Dispatched: {currentApp.submissionDate}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setShowSlipModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Official Routing Slip</span>
                </button>
              </div>
            </div>

            {/* 5-Step Visual Timeline Pipeline */}
            <div className="py-8">
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {stages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isUpcoming = idx > currentStageIndex;

                    return (
                      <div key={stage.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                        {/* Circle Indicator */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : isCurrent
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <span className={`text-xs font-bold block ${
                            isCurrent ? 'text-indigo-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {stage.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block sm:max-w-[140px] mt-0.5">
                            {stage.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Current Stage Nodal Updates & Remarks */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Latest Status Remark (Updated {currentApp.updatedDate}):</span>
                </span>
                <p className="text-slate-600 leading-relaxed pl-5">
                  {currentApp.remarks}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">ROUTED CHANNEL PARTNER</span>
                <span className="font-bold text-slate-800 block">{currentApp.partnerName}</span>
              </div>
            </div>

            {/* Detailed Financial & Dossier Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Project Cost</span>
                <span className="font-bold text-slate-900 text-base">
                  ₹{currentApp.projectCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Requested Loan (90%)</span>
                <span className="font-bold text-emerald-700 text-base">
                  ₹{currentApp.requestedLoan.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Promoter Contribution</span>
                <span className="font-bold text-amber-700 text-base">
                  ₹{currentApp.promoterShare.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Repayment Tenure</span>
                <span className="font-bold text-slate-900 text-base">
                  {currentApp.tenureYears} Years
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Routing Slip Modal */}
      {showSlipModal && currentApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6 border border-slate-200">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-4">
              <div className="inline-block w-8 h-8 rounded-full bg-slate-900 text-amber-300 font-bold leading-8 text-center mb-1">
                🏛️
              </div>
              <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide font-display">
                National Scheduled Castes Finance & Development Corporation
              </h4>
              <p className="text-xs text-slate-500">
                Official Concessional Channel Credit Routing Slip & e-Receipt
              </p>
              <span className="inline-block mt-2 font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded border border-indigo-200">
                APPLICATION REF: {currentApp.id}
              </span>
            </div>

            {/* Slip Details Table */}
            <div className="text-xs space-y-2.5 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Beneficiary Name:</span>
                <span className="font-bold">{currentApp.beneficiaryName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Selected Scheme:</span>
                <span className="font-bold">{currentApp.schemeName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Channel Partner:</span>
                <span className="font-bold text-indigo-700">{currentApp.partnerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sanction Ceiling / Cost:</span>
                <span className="font-bold">₹{currentApp.projectCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Channel Financing (90%):</span>
                <span className="font-bold text-emerald-700">₹{currentApp.requestedLoan.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Promoter Share (10%):</span>
                <span className="font-bold text-amber-700">₹{currentApp.promoterShare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Aadhaar e-KYC:</span>
                <span className="font-bold text-emerald-600">✓ Verified (UIDAI)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">SC Caste Certificate:</span>
                <span className="font-bold text-emerald-600">✓ Verified (State e-District)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bank Account & DBT:</span>
                <span className="font-bold text-emerald-600">✓ Penny-Drop Match Verified</span>
              </div>
            </div>

            {/* QR Simulation & Seal */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-800">Digitally Certified Routing Token</p>
                <p>Present this acknowledgment slip at your local Channel Partner branch.</p>
                <p className="text-[10px] text-slate-400">SHA-256 Hash: 991a-8f3b-ec81-2026</p>
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center text-center text-[9px] font-mono text-slate-700">
                [QR VALID]
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
