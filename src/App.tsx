import React, { useState } from 'react';
import { Language, Scheme, ChannelPartner, ApplicationRecord } from './types';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { SchemeFinderWizard } from './components/SchemeFinderWizard';
import { SaarthiCalculator } from './components/SaarthiCalculator';
import { SaarthiPartnerLocator } from './components/SaarthiPartnerLocator';
import { SaarthiAiAssistant } from './components/SaarthiAiAssistant';
import { SaarthiUserDashboard } from './components/SaarthiUserDashboard';
import { SaarthiLoginModal } from './components/SaarthiLoginModal';
import { SaarthiAdminDashboard } from './components/SaarthiAdminDashboard';
import { VerificationModule } from './components/VerificationModule';
import { ApplicationTracker } from './components/ApplicationTracker';
import { SCHEMES_DATA } from './data/schemes';
import { PARTNERS_DATA } from './data/partners';
import { CheckCircle2, PhoneCall, ShieldCheck, Landmark, Eye } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  // activeView can be: 'home' | 'schemes' | 'calculator' | 'partners' | 'assistant' | 'user_dashboard' | 'admin_dashboard' | 'verify' | 'tracker'
  const [activeView, setActiveView] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('Aditya');

  // Selected scheme / parameters passed between views
  const [calcParams, setCalcParams] = useState({
    schemeId: 'micro-credit',
    amount: 100000,
    rate: 6.5,
    tenure: 3,
    moratorium: 3
  });

  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner>(PARTNERS_DATA[0]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme>(SCHEMES_DATA[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default mock applications
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: "SC-CF-2026-8841",
      beneficiaryName: "Aditya Kumar",
      phone: "9876543210",
      annualIncome: 240000,
      schemeId: "micro-credit",
      schemeName: "Micro Finance Scheme",
      projectCost: 100000,
      requestedLoan: 90000,
      promoterShare: 10000,
      tenureYears: 3,
      projectType: "Small Retail and Mobile Electronics Center",
      state: "Gujarat",
      district: "Vadodara",
      routedPartnerId: "psb-axis-vadodara",
      partnerName: "Axis Bank - Vadodara Branch",
      status: "ROUTED_TO_PARTNER",
      casteCertVerified: true,
      incomeCertVerified: true,
      bankAccountVerified: true,
      submissionDate: "2026-03-12",
      updatedDate: "2026-03-14",
      remarks: "Application routed to Axis Bank Vadodara. Document e-KYC verified.",
      aadhaarMasked: "XXXX-XXXX-8841",
      bankName: "Axis Bank",
      accountMasked: "XXXXXX2819"
    }
  ]);

  const [activeApplicationId, setActiveApplicationId] = useState<string>("SC-CF-2026-8841");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectSchemeForCalc = (
    scheme: Scheme,
    loanAmount: number,
    interestRate: number,
    tenure: number,
    moratorium: number
  ) => {
    setSelectedScheme(scheme);
    setCalcParams({
      schemeId: scheme.id,
      amount: loanAmount,
      rate: interestRate,
      tenure,
      moratorium
    });
    setActiveView('calculator');
    showToast(`Loaded "${scheme.name}" into EMI Calculator.`);
  };

  const handleSelectPartnerForApplication = (partner: ChannelPartner) => {
    setSelectedPartner(partner);
    setActiveView('verify');
    showToast(`Selected "${partner.name}". Proceed with digital verification.`);
  };

  const handleApplicationDispatched = (newApp: ApplicationRecord) => {
    setApplications(prev => [newApp, ...prev]);
    setActiveApplicationId(newApp.id);
    setActiveView('tracker');
    showToast(`Application ${newApp.id} dispatched to ${newApp.partnerName}!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#0d5c46] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-500/40 flex items-center gap-2.5 text-xs max-w-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Saarthi Branding */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => { setIsLoggedIn(false); showToast('Logged out successfully.'); }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Screen 1: Home Hero */}
        {activeView === 'home' && (
          <HomeHero
            currentLang={currentLang}
            onNavigateTab={(tab) => setActiveView(tab)}
            onOpenSchemeWizard={() => setActiveView('schemes')}
          />
        )}

        {/* Screen 2 & 3: Scheme Finder & Recommendation Result */}
        {activeView === 'schemes' && (
          <SchemeFinderWizard
            onSelectSchemeForCalc={handleSelectSchemeForCalc}
            onSelectSchemeForPartner={(scheme) => {
              setSelectedScheme(scheme);
              setActiveView('partners');
            }}
          />
        )}

        {/* Screen 4: EMI Calculator */}
        {activeView === 'calculator' && (
          <SaarthiCalculator
            initialSchemeId={calcParams.schemeId}
            initialAmount={calcParams.amount}
            initialRate={calcParams.rate}
            initialTenure={calcParams.tenure}
            initialMoratorium={calcParams.moratorium}
            onNavigateToPartners={() => setActiveView('partners')}
          />
        )}

        {/* Screen 5: Nearby Channel Partners */}
        {activeView === 'partners' && (
          <SaarthiPartnerLocator
            onSelectPartnerForApplication={handleSelectPartnerForApplication}
          />
        )}

        {/* Screen 6: AI Assistant */}
        {activeView === 'assistant' && (
          <SaarthiAiAssistant
            onNavigateHome={() => setActiveView('home')}
            onNavigateProfile={() => setActiveView('user_dashboard')}
          />
        )}

        {/* Screen 7: User Dashboard */}
        {activeView === 'user_dashboard' && (
          <SaarthiUserDashboard
            onNavigateTab={(tab) => setActiveView(tab)}
          />
        )}

        {/* Screen 9: Admin Dashboard */}
        {activeView === 'admin_dashboard' && (
          <SaarthiAdminDashboard />
        )}

        {/* Verification & KYC (Integrated with Channel Routing) */}
        {activeView === 'verify' && (
          <VerificationModule
            currentLang={currentLang}
            selectedScheme={selectedScheme}
            selectedPartner={selectedPartner}
            projectCost={calcParams.amount}
            onApplicationDispatched={handleApplicationDispatched}
          />
        )}

        {/* Application Tracking View */}
        {activeView === 'tracker' && (
          <ApplicationTracker
            currentLang={currentLang}
            applications={applications}
            activeApplicationId={activeApplicationId}
            onSelectApplication={(app) => setActiveApplicationId(app.id)}
          />
        )}
      </main>

      {/* Screen 8: Login Modal */}
      <SaarthiLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(name) => {
          setIsLoggedIn(true);
          setUserName(name);
          showToast(`Welcome back, ${name}!`);
        }}
      />

      {/* Statutory Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Saarthi – Financial Support for a Stronger Tomorrow</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Scheduled Caste Concessional Loan Channel Finance Network | Ministry of Social Justice & Empowerment
            </p>
            <p className="text-slate-500 text-[10px]">
              Statutory Ceiling: Annual family income up to ₹5.00 Lakhs | Up to 90% Project Cost at 6.5% – 8.0% p.a.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-300 text-[11px]">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toll-Free Helpline: 1800-11-2035</span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>100+ Authorized Channel Partners (SCAs / PSBs / RRBs / MFIs)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
