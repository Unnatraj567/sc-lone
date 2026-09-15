import React, { useState } from 'react';
import { ApplicationRecord, ChannelPartner, Language, ApplicationStatus } from '../types';
import { PARTNERS_DATA } from '../data/partners';
import { TRANSLATIONS } from '../data/translations';
import { Building2, ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText, User, ArrowUpRight, BarChart3, Download, Sparkles, Filter } from 'lucide-react';

interface NodalOfficerDashboardProps {
  currentLang: Language;
  applications: ApplicationRecord[];
  onUpdateStatus: (appId: string, newStatus: ApplicationStatus, remark: string) => void;
}

export const NodalOfficerDashboard: React.FC<NodalOfficerDashboardProps> = ({
  currentLang,
  applications,
  onUpdateStatus
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("delhi-sc-st-fdc");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const currentPartner = PARTNERS_DATA.find(p => p.id === selectedPartnerId) || PARTNERS_DATA[0];

  const partnerApplications = applications.filter(app => {
    if (selectedPartnerId !== "ALL" && app.routedPartnerId !== selectedPartnerId) return false;
    if (filterStatus !== "ALL" && app.status !== filterStatus) return false;
    return true;
  });

  // Calculate statistics
  const totalApplications = applications.length;
  const sanctionedCount = applications.filter(a => a.status === 'SANCTIONED' || a.status === 'DISBURSED').length;
  const pendingReviewCount = applications.filter(a => a.status === 'ROUTED_TO_PARTNER' || a.status === 'UNDER_REVIEW_SCA').length;
  const totalLoanVolume = applications.reduce((sum, a) => sum + a.requestedLoan, 0);

  const handleExportCSV = () => {
    const headers = "Application ID,Beneficiary Name,Phone,Income,Scheme,Project Cost,Requested Loan,Status,Partner Name\n";
    const rows = applications.map(a =>
      `"${a.id}","${a.beneficiaryName}","${a.phone}",${a.annualIncome},"${a.schemeName}",${a.projectCost},${a.requestedLoan},"${a.status}","${a.partnerName}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `channel_finance_audit_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>State Channelizing Agency & PSB Branch Administration</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Nodal Officer Workflow & Application Review Desk
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Verify pre-screened borrower applications, manage field inspection logs, and issue concessional credit sanction orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="text-xs font-bold border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 text-slate-800"
            >
              <option value="ALL">All Partner Branches (Consolidated)</option>
              {PARTNERS_DATA.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city}) - NPA: {p.npaPercentage}%
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Data (CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 Partner Health & Quota Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Pipeline Applications</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {totalApplications}
            </span>
            <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">
              ₹{(totalLoanVolume / 100000).toFixed(1)} Lakh Total Credit Demand
            </span>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200">
            <span className="text-xs text-amber-800 block">Pending Nodal Review</span>
            <span className="text-2xl font-extrabold text-amber-950 mt-1 block">
              {pendingReviewCount}
            </span>
            <span className="text-[11px] text-amber-700 mt-0.5 block">
              Turnaround benchmark: 14 Days
            </span>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200">
            <span className="text-xs text-emerald-800 block">Sanctioned & Disbursed</span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">
              {sanctionedCount}
            </span>
            <span className="text-[11px] text-emerald-700 mt-0.5 block">
              Direct Benefit Transfer (DBT) Active
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 block">Partner NPA Health</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
              {currentPartner.npaPercentage}% NPA
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Legal Quarantining Threshold: 8.0%
            </span>
          </div>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Incoming Channel Credit Queue ({partnerApplications.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Review verified applicant dossiers and trigger statutory approval stages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ROUTED_TO_PARTNER">Routed to Partner</option>
              <option value="UNDER_REVIEW_SCA">Under Review SCA</option>
              <option value="SANCTIONED">Sanctioned</option>
              <option value="DISBURSED">Disbursed</option>
            </select>
          </div>
        </div>

        {/* Application Cards / Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 font-bold">Ref ID & Beneficiary</th>
                <th className="py-3 px-4 font-bold">Scheme & Purpose</th>
                <th className="py-3 px-4 font-bold">Loan Amount (₹)</th>
                <th className="py-3 px-4 font-bold">e-KYC & Verification</th>
                <th className="py-3 px-4 font-bold">Workflow Status</th>
                <th className="py-3 px-4 font-bold text-right">Nodal Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {partnerApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-indigo-700 block">{app.id}</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{app.beneficiaryName}</span>
                    <span className="text-[11px] text-slate-400 block">{app.phone} | Inc: ₹{app.annualIncome.toLocaleString('en-IN')}</span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-semibold text-slate-900 block">{app.schemeName}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{app.projectType}</span>
                    <span className="text-[10px] text-indigo-600 font-medium block mt-0.5">{app.partnerName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700 block">
                      ₹{app.requestedLoan.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Margin: ₹{app.promoterShare.toLocaleString('en-IN')} (10%)
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Aadhaar e-KYC</span>
                      </span>
                      <br />
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>SC Caste Cert</span>
                      </span>
                      <br />
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Bank DBT Active</span>
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'DISBURSED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'SANCTIONED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Submitted: {app.submissionDate}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'ROUTED_TO_PARTNER' && (
                        <button
                          onClick={() => onUpdateStatus(app.id, 'UNDER_REVIEW_SCA', "Field officer deputed for premises verification.")}
                          className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold"
                        >
                          Start Review
                        </button>
                      )}

                      {app.status === 'UNDER_REVIEW_SCA' && (
                        <button
                          onClick={() => onUpdateStatus(app.id, 'SANCTIONED', "Credit committee sanction letter issued with 6.5% interest concession.")}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                        >
                          Sanction Loan
                        </button>
                      )}

                      {app.status === 'SANCTIONED' && (
                        <button
                          onClick={() => onUpdateStatus(app.id, 'DISBURSED', "Direct Benefit Transfer (DBT) credit processed to beneficiary's verified bank account.")}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold"
                        >
                          Disburse (DBT)
                        </button>
                      )}

                      {app.status === 'DISBURSED' && (
                        <span className="text-emerald-700 font-bold text-xs flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disbursed</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
