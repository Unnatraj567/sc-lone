import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily / safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Database of National & State SC Concessional Schemes
const SCHEMES = [
  {
    id: "micro-credit",
    name: "Mahila Samriddhi & Micro Credit Scheme",
    hindiName: "महिला समृद्धि एवं माइक्रो क्रेडिट योजना",
    category: "Micro Finance",
    maxLoan: 140000,
    concessionalRate: 6.5,
    commercialMarketRate: 14.5,
    promoterSharePercent: 5,
    scContributionPercent: 95,
    maxMoratoriumMonths: 6,
    maxRepaymentYears: 3,
    targetAudience: "Micro entrepreneurs, women self-help groups, small retail, vegetable/fruit vendors, tailoring",
    incomeLimit: 500000,
    educationReq: "No formal education required",
    description: "Tailored micro-finance assistance up to ₹1.40 Lakh for quick setup of micro-enterprises with low interest rates and flexible quarterly installments."
  },
  {
    id: "term-loan-small",
    name: "Term Loan Scheme (Small Business & Services)",
    hindiName: "सावधि ऋण योजना (लघु व्यवसाय एवं सेवा क्षेत्र)",
    category: "Term Loan",
    maxLoan: 500000,
    concessionalRate: 7.0,
    commercialMarketRate: 13.0,
    promoterSharePercent: 5,
    scContributionPercent: 90,
    maxMoratoriumMonths: 6,
    maxRepaymentYears: 5,
    targetAudience: "Kirana stores, electronics repair, dairy units, auto services, salon/beauty wellness",
    incomeLimit: 500000,
    educationReq: "8th Pass / Basic Literacy",
    description: "Financial assistance up to ₹5.00 Lakhs covering up to 90% project cost for viable self-employment ventures in service, retail, and agro-allied sectors."
  },
  {
    id: "term-loan-large",
    name: "High Value Term Loan & Industrial Project Scheme",
    hindiName: "उच्च मूल्य सावधि ऋण एवं औद्योगिक परियोजना योजना",
    category: "Term Loan",
    maxLoan: 5000000,
    concessionalRate: 8.0,
    commercialMarketRate: 12.5,
    promoterSharePercent: 10,
    scContributionPercent: 90,
    maxMoratoriumMonths: 12,
    maxRepaymentYears: 7,
    targetAudience: "Small manufacturing, processing plants, logistics & commercial vehicles, warehousing, solar energy",
    incomeLimit: 500000,
    educationReq: "10th / 12th / Diploma / ITI preferred",
    description: "Major financial backing up to ₹50.00 Lakhs for modern capital-intensive machinery, fleet transport, cold storage, and manufacturing plants."
  },
  {
    id: "education-domestic",
    name: "Concessional Education Loan (Inland Higher Studies)",
    hindiName: "रियायती शिक्षा ऋण (भारत में उच्च शिक्षा)",
    category: "Educational Loan",
    maxLoan: 2000000,
    concessionalRate: 6.5,
    commercialMarketRate: 11.5,
    promoterSharePercent: 0,
    scContributionPercent: 100,
    maxMoratoriumMonths: 12, // Course duration + 1 year
    maxRepaymentYears: 10,
    targetAudience: "SC students pursuing Engineering, Medical, MBA, Law, MCA, Polytechnic in UGC/AICTE accredited institutes",
    incomeLimit: 500000,
    educationReq: "12th / Graduation admission cleared",
    description: "Comprehensive financial support up to ₹20.00 Lakhs covering 100% admission fees, hostel boarding, textbooks, and laptop with 0.5% special rebate for female students."
  },
  {
    id: "education-foreign",
    name: "Overseas Education Loan for SC Scholars",
    hindiName: "विदेश में उच्च अध्ययन हेतु ऋण योजना",
    category: "Educational Loan",
    maxLoan: 3000000,
    concessionalRate: 7.0,
    commercialMarketRate: 12.0,
    promoterSharePercent: 5,
    scContributionPercent: 95,
    maxMoratoriumMonths: 12,
    maxRepaymentYears: 10,
    targetAudience: "Post-graduate, Masters, PhD candidates in top global QS-ranked universities abroad",
    incomeLimit: 500000,
    educationReq: "Bachelor's Degree + Foreign University Admit Letter",
    description: "Subsidized credit up to ₹30.00 Lakhs for tuition, airfare, visa, medical insurance, and living expenses for world-class foreign university programs."
  },
  {
    id: "green-business",
    name: "Green Business Scheme (Solar & Eco-Enterprises)",
    hindiName: "हरित व्यवसाय योजना (सौर ऊर्जा एवं ई-रिक्शा)",
    category: "Green Credit",
    maxLoan: 3000000,
    concessionalRate: 6.75,
    commercialMarketRate: 13.5,
    promoterSharePercent: 5,
    scContributionPercent: 90,
    maxMoratoriumMonths: 9,
    maxRepaymentYears: 7,
    targetAudience: "Battery operated E-Rickshaws, Solar rooftop installations, bio-fertilizer units, waste recycling",
    incomeLimit: 500000,
    educationReq: "Basic technical awareness",
    description: "Promoting sustainable green livelihood ventures with concessional rates and expedited channel finance routing."
  }
];

// Channel Partners with Live Fund Utilization & NPA Health Data
const CHANNEL_PARTNERS = [
  {
    id: "sca-delhi-dsfdc",
    name: "Delhi SC/ST/OBC/Min. Financial Development Corp (DSFDC)",
    type: "SCA",
    category: "State Channelizing Agency",
    state: "Delhi",
    district: "Central Delhi",
    city: "New Delhi",
    address: "Ambedkar Bhawan, Sector 16, Rohini, New Delhi - 110085",
    pincode: "110085",
    phone: "011-27863412",
    nodalOfficer: "Sh. Rajeshwar Meena",
    email: "nodal.dsfdc@delhi.gov.in",
    supportedSchemes: ["micro-credit", "term-loan-small", "term-loan-large", "education-domestic", "green-business"],
    npaPercentage: 2.8,
    healthStatus: "HEALTHY", // HEALTHY (<5%), MODERATE (5-8%), CRITICAL (>8% - blocked)
    disbursementEligible: true,
    allocatedQuotaCrores: 18.5,
    utilizedCrores: 14.8,
    avgProcessingDays: 14,
    latitude: 28.7166,
    longitude: 77.1126
  },
  {
    id: "psb-sbi-delhi",
    name: "State Bank of India (Lead District Office & SME Center)",
    type: "PSB",
    category: "Public Sector Bank",
    state: "Delhi",
    district: "South Delhi",
    city: "New Delhi",
    address: "SBI Building, Parliament Street, Connaught Place, New Delhi - 110001",
    pincode: "110001",
    phone: "011-23374900",
    nodalOfficer: "Mrs. Sunita Priyadarshini",
    email: "sme.cpdelhi@sbi.co.in",
    supportedSchemes: ["term-loan-small", "term-loan-large", "education-domestic", "education-foreign"],
    npaPercentage: 3.1,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 45.0,
    utilizedCrores: 38.2,
    avgProcessingDays: 18,
    latitude: 28.6289,
    longitude: 77.2144
  },
  {
    id: "psb-pnb-noida",
    name: "Punjab National Bank - Special Social Banking Hub",
    type: "PSB",
    category: "Public Sector Bank",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar",
    city: "Noida",
    address: "Sector 29, Arun Vihar, Noida, UP - 201301",
    pincode: "201301",
    phone: "0120-2458900",
    nodalOfficer: "Mr. Alok Verma",
    email: "pnb.socialcredit.noida@pnb.co.in",
    supportedSchemes: ["micro-credit", "term-loan-small", "term-loan-large", "education-domestic"],
    npaPercentage: 4.2,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 25.0,
    utilizedCrores: 19.5,
    avgProcessingDays: 16,
    latitude: 28.5672,
    longitude: 77.3342
  },
  {
    id: "rrb-sarva-haryana",
    name: "Sarva Haryana Gramin Bank (Lead Channel Partner)",
    type: "RRB",
    category: "Regional Rural Bank",
    state: "Haryana",
    district: "Gurugram",
    city: "Gurugram",
    address: "Railway Road, Near Post Office, Gurugram, Haryana - 122001",
    pincode: "122001",
    phone: "0124-2321445",
    nodalOfficer: "Ch. Dharamvir Singh",
    email: "shgb.lead.ggn@shgb.co.in",
    supportedSchemes: ["micro-credit", "term-loan-small", "green-business"],
    npaPercentage: 3.9,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 12.0,
    utilizedCrores: 9.4,
    avgProcessingDays: 12,
    latitude: 28.4595,
    longitude: 77.0266
  },
  {
    id: "sca-up-sfdf",
    name: "UP Scheduled Castes Finance & Development Corp (UPSFDC)",
    type: "SCA",
    category: "State Channelizing Agency",
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Lucknow",
    address: "Prag Narain Road, Butler Colony, Lucknow, UP - 226001",
    pincode: "226001",
    phone: "0522-2208754",
    nodalOfficer: "Dr. Arvind Gautam",
    email: "upsfdc.nodal@up.gov.in",
    supportedSchemes: ["micro-credit", "term-loan-small", "term-loan-large", "education-domestic"],
    npaPercentage: 4.8,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 60.0,
    utilizedCrores: 51.2,
    avgProcessingDays: 20,
    latitude: 26.8467,
    longitude: 80.9462
  },
  {
    id: "nbfc-mfi-nabfins",
    name: "NABFINS Limited (NABARD MFI Micro Lending Center)",
    type: "NBFC-MFI",
    category: "Micro Finance Institution",
    state: "Delhi",
    district: "North West Delhi",
    city: "Delhi",
    address: "Community Centre, Wazirpur Industrial Area, Delhi - 110052",
    pincode: "110052",
    phone: "011-45098711",
    nodalOfficer: "Ms. Shalini Saxena",
    email: "nabfins.delhi@nabfins.org",
    supportedSchemes: ["micro-credit"],
    npaPercentage: 1.9,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 10.0,
    utilizedCrores: 8.6,
    avgProcessingDays: 7,
    latitude: 28.6948,
    longitude: 77.1642
  },
  {
    id: "psb-canara-bengaluru",
    name: "Canara Bank Specialized MSME & SC-ST Cell",
    type: "PSB",
    category: "Public Sector Bank",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    address: "JC Road, Head Office, Bengaluru - 560002",
    pincode: "560002",
    phone: "080-22221581",
    nodalOfficer: "K. Raghunath",
    email: "canara.scstcell@canarabank.com",
    supportedSchemes: ["term-loan-small", "term-loan-large", "education-domestic", "education-foreign"],
    npaPercentage: 3.4,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 35.0,
    utilizedCrores: 28.5,
    avgProcessingDays: 15,
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    id: "sca-maharashtra-mpbcdc",
    name: "Mahatma Phule Backward Class Development Corp (MPBCDC)",
    type: "SCA",
    category: "State Channelizing Agency",
    state: "Maharashtra",
    district: "Mumbai",
    city: "Mumbai",
    address: "Supreme Shopping Centre, Gulmohar Cross Rd 9, Juhu, Mumbai - 400049",
    pincode: "400049",
    phone: "022-26207851",
    nodalOfficer: "Sanjay Shinde",
    email: "nodal@mpbcdc.maharashtra.gov.in",
    supportedSchemes: ["micro-credit", "term-loan-small", "term-loan-large", "education-domestic", "green-business"],
    npaPercentage: 4.1,
    healthStatus: "HEALTHY",
    disbursementEligible: true,
    allocatedQuotaCrores: 55.0,
    utilizedCrores: 46.7,
    avgProcessingDays: 17,
    latitude: 19.1075,
    longitude: 72.8263
  },
  {
    id: "bank-flagged-overdue",
    name: "Aadarsh Regional Cooperative Society (Flagged Overdue)",
    type: "RRB",
    category: "Cooperative / MFI Partner",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    city: "Ghaziabad",
    address: "Navyug Market, Ghaziabad, UP - 201001",
    pincode: "201001",
    phone: "0120-2856100",
    nodalOfficer: "O.P. Sharma",
    email: "opsharma@flaggedbank.org",
    supportedSchemes: ["micro-credit", "term-loan-small"],
    npaPercentage: 11.4, // High NPA > 8%
    healthStatus: "CRITICAL",
    disbursementEligible: false, // Disqualified so applicants aren't trapped!
    disqualificationReason: "High Overdues (NPA 11.4% exceeds central ceiling of 8%). Routing blocked to safeguard beneficiary application timeline.",
    allocatedQuotaCrores: 8.0,
    utilizedCrores: 2.1,
    avgProcessingDays: 60,
    latitude: 28.6692,
    longitude: 77.4538
  }
];

// Mock In-Memory Application Registry
const APPLICATIONS = [
  {
    id: "SC-CF-2026-8841",
    beneficiaryName: "Rameshwar Kumar",
    phone: "9876543210",
    annualIncome: 240000,
    schemeId: "term-loan-small",
    schemeName: "Term Loan Scheme (Small Business & Services)",
    projectCost: 350000,
    requestedLoan: 315000,
    promoterShare: 35000,
    tenureYears: 5,
    projectType: "Automotive Repair & Spare Parts Workshop",
    state: "Delhi",
    district: "Central Delhi",
    routedPartnerId: "sca-delhi-dsfdc",
    partnerName: "Delhi SC/ST/OBC/Min. Financial Development Corp (DSFDC)",
    status: "UNDER_REVIEW_SCA", // DRAFT, VERIFIED, ROUTED_TO_PARTNER, UNDER_REVIEW_SCA, SANCTIONED, DISBURSED
    casteCertVerified: true,
    incomeCertVerified: true,
    bankAccountVerified: true,
    submissionDate: "2026-09-10",
    updatedDate: "2026-09-12",
    remarks: "Income certificate verified via e-District Delhi. Field verification scheduled."
  },
  {
    id: "SC-CF-2026-7219",
    beneficiaryName: "Pooja Rani",
    phone: "9123456780",
    annualIncome: 180000,
    schemeId: "micro-credit",
    schemeName: "Mahila Samriddhi & Micro Credit Scheme",
    projectCost: 120000,
    requestedLoan: 114000,
    promoterShare: 6000,
    tenureYears: 3,
    projectType: "Women Handloom & Boutique Center",
    state: "Delhi",
    district: "North West Delhi",
    routedPartnerId: "nbfc-mfi-nabfins",
    partnerName: "NABFINS Limited (NABARD MFI Micro Lending Center)",
    status: "SANCTIONED",
    casteCertVerified: true,
    incomeCertVerified: true,
    bankAccountVerified: true,
    submissionDate: "2026-09-02",
    updatedDate: "2026-09-08",
    sanctionAmount: 114000,
    interestRate: 6.5,
    remarks: "Sanction letter generated. Fast-track micro-finance disbursal queued for direct DBT."
  }
];

// 1. API: Schemes List
app.get("/api/schemes", (req, res) => {
  res.json({ success: true, schemes: SCHEMES });
});

// 2. API: Channel Partners with NPA Screening
app.get("/api/partners", (req, res) => {
  const { state, district, schemeId, includeIneligible } = req.query;
  let filtered = [...CHANNEL_PARTNERS];

  if (state && typeof state === "string" && state !== "ALL") {
    filtered = filtered.filter(p => p.state.toLowerCase() === state.toLowerCase());
  }

  if (district && typeof district === "string" && district !== "ALL") {
    filtered = filtered.filter(p => p.district.toLowerCase() === district.toLowerCase());
  }

  if (schemeId && typeof schemeId === "string") {
    filtered = filtered.filter(p => p.supportedSchemes.includes(schemeId));
  }

  if (includeIneligible !== "true") {
    // Default to only routing to solvent, eligible channel partners
    filtered = filtered.filter(p => p.disbursementEligible === true);
  }

  res.json({
    success: true,
    count: filtered.length,
    partners: filtered,
    totalRegistered: CHANNEL_PARTNERS.length,
    eligibleCount: CHANNEL_PARTNERS.filter(p => p.disbursementEligible).length,
    blockedHighNpaCount: CHANNEL_PARTNERS.filter(p => !p.disbursementEligible).length
  });
});

// 3. API: Scheme Recommender Engine (Rule-based deterministic scoring + AI insights)
app.post("/api/recommender", async (req, res) => {
  const { projectType, estimatedCost, annualIncome, educationStatus, isWomanBeneficiary, state } = req.body;

  const cost = Number(estimatedCost) || 100000;
  const income = Number(annualIncome) || 200000;

  // Income eligibility check (central ceiling is ₹5.00 Lakh)
  const isIncomeEligible = income <= 500000;

  const recommendations = SCHEMES.map(scheme => {
    let score = 0;
    const reasons: string[] = [];

    // Cost match
    if (cost <= scheme.maxLoan) {
      score += 40;
      reasons.push(`Project cost (₹${cost.toLocaleString("en-IN")}) is within maximum ceiling of ₹${(scheme.maxLoan / 100000).toFixed(2)} Lakh`);
    } else {
      score -= 30;
      reasons.push(`Project cost exceeds scheme ceiling of ₹${(scheme.maxLoan / 100000).toFixed(2)} Lakh`);
    }

    // Category match
    const pType = (projectType || "").toLowerCase();
    if (pType.includes("study") || pType.includes("education") || pType.includes("b.tech") || pType.includes("m.tech") || pType.includes("degree") || pType.includes("college") || pType.includes("foreign") || pType.includes("masters")) {
      if (scheme.category === "Educational Loan") {
        score += 45;
        if (pType.includes("foreign") || pType.includes("abroad") || pType.includes("ms") || pType.includes("overseas")) {
          if (scheme.id === "education-foreign") score += 20;
        } else {
          if (scheme.id === "education-domestic") score += 20;
        }
      }
    } else if (pType.includes("solar") || pType.includes("rickshaw") || pType.includes("ev") || pType.includes("green") || pType.includes("eco")) {
      if (scheme.id === "green-business") {
        score += 50;
        reasons.push("Matches Green Energy & Eco-transport priority sector.");
      }
    } else if (cost <= 140000) {
      if (scheme.id === "micro-credit") {
        score += 40;
        reasons.push("Highly optimized for micro-businesses with minimal documentation and quickest turnaround.");
      }
    } else if (cost <= 500000) {
      if (scheme.id === "term-loan-small") {
        score += 40;
        reasons.push("Fits standard small commercial & service venture criteria.");
      }
    } else {
      if (scheme.id === "term-loan-large") {
        score += 40;
        reasons.push("Structured for capital acquisition & commercial enterprise expansion.");
      }
    }

    // Woman entrepreneur bonus
    if (isWomanBeneficiary && scheme.id === "micro-credit") {
      score += 15;
      reasons.push("Special priority & 0.5% interest concession for women under Mahila Samriddhi.");
    }

    // Financial calculations for this scheme
    const loanAmount = Math.min(cost * (scheme.scContributionPercent / 100), scheme.maxLoan);
    const promoterShare = cost - loanAmount;

    return {
      scheme,
      matchScore: Math.min(100, Math.max(10, score)),
      eligible: isIncomeEligible && cost <= scheme.maxLoan,
      calculatedLoanAmount: loanAmount,
      calculatedPromoterShare: promoterShare,
      reasons
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Check nearest partners for the top recommended scheme
  const topSchemeId = recommendations[0]?.scheme.id;
  const eligiblePartners = CHANNEL_PARTNERS.filter(p =>
    p.disbursementEligible &&
    (!state || state === "ALL" || p.state.toLowerCase() === state.toLowerCase()) &&
    p.supportedSchemes.includes(topSchemeId)
  );

  res.json({
    success: true,
    isIncomeEligible,
    incomeCeiling: 500000,
    recommendations,
    availableEligiblePartnersCount: eligiblePartners.length,
    eligiblePartners: eligiblePartners.slice(0, 5)
  });
});

// 4. API: Banking Verification Engine (Simulating core banking / DigiLocker / PFMS API)
app.post("/api/verify/banking", (req, res) => {
  const { aadhaarNumber, casteCertNumber, bankAccountNumber, ifscCode, applicantName } = req.body;

  // Validate format
  const isAadhaarValid = /^\d{12}$/.test(aadhaarNumber?.replace(/\s/g, "") || "");
  const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test((ifscCode || "").toUpperCase());
  const isAccountValid = (bankAccountNumber || "").length >= 9;
  const isCasteValid = (casteCertNumber || "").length >= 6;

  // Simulated latency
  setTimeout(() => {
    if (!isAadhaarValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid Aadhaar Number. Please provide 12-digit UID."
      });
    }

    if (!isIfscValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid IFSC Code. Must be 11 characters (e.g., SBIN0001234)."
      });
    }

    // Determine simulated bank name from IFSC
    let bankName = "Public Sector Bank";
    const ifscPrefix = (ifscCode || "").substring(0, 4).toUpperCase();
    if (ifscPrefix === "SBIN") bankName = "State Bank of India";
    else if (ifscPrefix === "PUNB") bankName = "Punjab National Bank";
    else if (ifscPrefix === "CNRB") bankName = "Canara Bank";
    else if (ifscPrefix === "BARB") bankName = "Bank of Baroda";
    else if (ifscPrefix === "UBIN") bankName = "Union Bank of India";

    // Automated Penny-drop & DigiLocker check result
    res.json({
      success: true,
      verifiedAt: new Date().toISOString(),
      applicantName: applicantName || "Rameshwar Kumar",
      verificationStatus: "VERIFIED_ELIGIBLE",
      badges: {
        aadhaarAuth: {
          verified: true,
          mode: "UIDAI e-KYC",
          maskedAadhaar: `XXXX-XXXX-${(aadhaarNumber || "8841").slice(-4)}`
        },
        casteCertificate: {
          verified: isCasteValid,
          issuingAuthority: "Tehsildar / Sub-Divisional Magistrate (Revenue Dept)",
          categoryConfirmed: "Scheduled Caste (SC)",
          certificateNumber: casteCertNumber || "SC/REV/2023/99104"
        },
        bankPennyDrop: {
          verified: isAccountValid,
          bankName,
          accountHolderMatch: "100% MATCH",
          accountStatus: "ACTIVE",
          dbtEnabled: true, // Direct Benefit Transfer ready
          accountNumberMasked: `XXXXXX${(bankAccountNumber || "123456").slice(-4)}`,
          ifsc: (ifscCode || "SBIN0000691").toUpperCase()
        },
        creditSanity: {
          scoreBand: "ELIGIBLE_FOR_CONCESSIONAL_CREDIT",
          bureauDefaultAlert: false,
          note: "No commercial default found; qualified for special SC priority sector lending."
        }
      }
    });
  }, 600);
});

// 5. API: Submit Application and Route to Partner
app.post("/api/applications/route", (req, res) => {
  const {
    beneficiaryName,
    phone,
    annualIncome,
    schemeId,
    projectCost,
    projectType,
    state,
    district,
    partnerId,
    verificationData
  } = req.body;

  const scheme = SCHEMES.find(s => s.id === schemeId) || SCHEMES[0];
  const partner = CHANNEL_PARTNERS.find(p => p.id === partnerId);

  if (!partner) {
    return res.status(400).json({ success: false, error: "Invalid Channel Partner selected." });
  }

  if (!partner.disbursementEligible) {
    return res.status(400).json({
      success: false,
      error: `Routing blocked: ${partner.name} is currently flagged for high overdues. Please route to a healthy partner.`
    });
  }

  const cost = Number(projectCost) || 100000;
  const loanAmount = Math.min(cost * (scheme.scContributionPercent / 100), scheme.maxLoan);
  const promoterShare = cost - loanAmount;

  const newApp = {
    id: `SC-CF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    beneficiaryName: beneficiaryName || "Beneficiary",
    phone: phone || "9876543210",
    annualIncome: Number(annualIncome) || 200000,
    schemeId: scheme.id,
    schemeName: scheme.name,
    projectCost: cost,
    requestedLoan: loanAmount,
    promoterShare: promoterShare,
    tenureYears: scheme.maxRepaymentYears,
    projectType: projectType || "Micro Enterprise",
    state: state || partner.state,
    district: district || partner.district,
    routedPartnerId: partner.id,
    partnerName: partner.name,
    status: "ROUTED_TO_PARTNER",
    casteCertVerified: true,
    incomeCertVerified: true,
    bankAccountVerified: true,
    submissionDate: new Date().toISOString().split("T")[0],
    updatedDate: new Date().toISOString().split("T")[0],
    remarks: `Application securely dispatched to ${partner.name}. Digital verification completed.`
  };

  APPLICATIONS.unshift(newApp);

  res.json({
    success: true,
    message: "Application successfully submitted and digitally routed to Channel Partner.",
    application: newApp
  });
});

// 6. API: Get Applications List & Analytics
app.get("/api/applications", (req, res) => {
  const { partnerId } = req.query;
  let list = [...APPLICATIONS];
  if (partnerId && typeof partnerId === "string") {
    list = list.filter(a => a.routedPartnerId === partnerId);
  }

  const totalSanctioned = APPLICATIONS.filter(a => a.status === "SANCTIONED" || a.status === "DISBURSED")
    .reduce((acc, curr) => acc + curr.requestedLoan, 0);

  res.json({
    success: true,
    applications: list,
    stats: {
      totalApplications: APPLICATIONS.length,
      underReviewCount: APPLICATIONS.filter(a => a.status === "UNDER_REVIEW_SCA" || a.status === "ROUTED_TO_PARTNER").length,
      sanctionedCount: APPLICATIONS.filter(a => a.status === "SANCTIONED" || a.status === "DISBURSED").length,
      totalRequestedAmount: APPLICATIONS.reduce((acc, c) => acc + c.requestedLoan, 0),
      totalSanctionedAmount: totalSanctioned
    }
  });
});

// 7. API: Update Application Status (For Channel Partner / SCA Nodal Dashboard)
app.patch("/api/applications/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  const appItem = APPLICATIONS.find(a => a.id === id);
  if (!appItem) {
    return res.status(404).json({ success: false, error: "Application not found." });
  }

  if (status) appItem.status = status;
  if (remarks) appItem.remarks = remarks;
  appItem.updatedDate = new Date().toISOString().split("T")[0];

  res.json({ success: true, application: appItem });
});

// 8. API: Gemini AI Multilingual Concessional Credit Advisor
app.post("/api/gemini/advisor", async (req, res) => {
  const { question, language, applicantContext } = req.body;

  const lang = language || "English";
  const gemini = getGeminiClient();

  if (!gemini) {
    // Return intelligent structured response if no API key provided
    return res.json({
      success: true,
      answer: `[Automated Concessional Advisory (${lang})]:
Under the National Scheduled Caste Concessional Finance framework, families with annual income up to ₹5.00 Lakh are entitled to up to 90% project funding at concessional rates of 6.5% - 8.0% p.a.
- For small trade/retail: Mahila Samriddhi / Micro Finance up to ₹1.40 Lakh (6.5% p.a.)
- For businesses/machinery: Term Loans up to ₹50.00 Lakh (7-8% p.a.)
- For college/abroad education: Inland loans up to ₹20 Lakh (6.5% p.a.) and Overseas up to ₹30 Lakh.
Applications must be routed through State Channelizing Agencies (SCAs), Public Sector Banks, or certified RRBs. Please verify your caste and income certificates using our automated tool to proceed.`,
      source: "KnowledgeBase_RuleEngine"
    });
  }

  try {
    const prompt = `You are the Official AI Advisory Specialist for the Scheduled Caste (SC) Concessional Channel Finance & Educational Loan Portal in India (NSFDC / State Channelizing Agencies).
Language requested: ${lang}.
Beneficiary context:
${JSON.stringify(applicantContext || {})}

Beneficiary Question:
"${question || "Which scheme is best for starting a grocery shop with 3 lakh budget?"}"

Instructions:
1. Respond warmly and authoritatively in ${lang}.
2. Explain the most suitable scheme (Micro Finance up to 1.4 Lakh, Term Loan up to 50 Lakh, or Educational Loan up to 20/30 Lakh).
3. Mention the concessional rate (6.5% to 8% p.a. vs commercial market rate of 12-16%) and the promoter contribution (only 5% to 10%).
4. Clarify that loans are routed through authorized Channel Partners (SCAs, PSBs, RRBs, NBFC-MFIs) with clean NPA track records, NOT central offices.
5. Provide actionable next steps (Aadhaar, Caste Certificate, Bank verification, and routing). Keep formatting clean with bullet points.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert government financial empowerment consultant for SC beneficiaries in India. Answer accurately, empathetically, and clearly in the requested Indian language.",
        temperature: 0.3,
      }
    });

    res.json({
      success: true,
      answer: response.text || "Advisory details generated.",
      source: "Gemini_3.8_Flash"
    });
  } catch (error: any) {
    console.error("Gemini advisor error:", error);
    res.json({
      success: true,
      answer: `Under SC Concessional Finance guidelines, applicants with income ≤ ₹5.00 Lakhs can access up to 90% loan assistance at 6.5% - 8% interest rate. Please use our Scheme Recommender and Partner Router to locate your nearest active bank or SCA.`,
      fallback: true
    });
  }
});

// Vite middleware in dev mode / static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SC Concessional Channel Finance Server running on http://localhost:${PORT}`);
  });
}

startServer();
