export type Language = 'en' | 'hi' | 'gu' | 'ta' | 'te' | 'mr' | 'pa';

export type UserRole = 'beneficiary' | 'nodal_officer' | 'admin_reports';

export interface Scheme {
  id: string;
  name: string;
  hindiName: string;
  category: 'Micro Finance' | 'Term Loan' | 'Educational Loan' | 'Green Credit';
  maxLoan: number; // in Rupees
  concessionalRate: number; // e.g., 6.5%
  commercialMarketRate: number; // e.g., 14.5%
  promoterSharePercent: number; // e.g., 5%
  scContributionPercent: number; // e.g., 90-95%
  maxMoratoriumMonths: number; // 3 to 12 months
  maxRepaymentYears: number; // 3 to 10 years
  targetAudience: string;
  incomeLimit: number; // 500000
  educationReq: string;
  description: string;
  keyFeatures: string[];
  documentsRequired: string[];
}

export type HealthStatus = 'HEALTHY' | 'MODERATE' | 'CRITICAL';
export type PartnerType = 'SCA' | 'PSB' | 'RRB' | 'NBFC-MFI';

export interface ChannelPartner {
  id: string;
  name: string;
  type: PartnerType;
  category: string;
  state: string;
  district: string;
  city: string;
  address: string;
  pincode: string;
  phone: string;
  nodalOfficer: string;
  email: string;
  supportedSchemes: string[];
  npaPercentage: number; // e.g. 2.8%
  healthStatus: HealthStatus;
  disbursementEligible: boolean; // false if NPA > 8% or severe overdues
  disqualificationReason?: string;
  allocatedQuotaCrores: number;
  utilizedCrores: number;
  avgProcessingDays: number;
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'VERIFIED'
  | 'ROUTED_TO_PARTNER'
  | 'UNDER_REVIEW_SCA'
  | 'SANCTIONED'
  | 'DISBURSED'
  | 'REJECTED';

export interface ApplicationRecord {
  id: string;
  beneficiaryName: string;
  phone: string;
  annualIncome: number;
  schemeId: string;
  schemeName: string;
  projectCost: number;
  requestedLoan: number;
  promoterShare: number;
  tenureYears: number;
  moratoriumMonths?: number;
  projectType: string;
  state: string;
  district: string;
  routedPartnerId: string;
  partnerName: string;
  status: ApplicationStatus;
  casteCertVerified: boolean;
  incomeCertVerified: boolean;
  bankAccountVerified: boolean;
  submissionDate: string;
  updatedDate: string;
  remarks: string;
  sanctionAmount?: number;
  interestRate?: number;
  aadhaarMasked?: string;
  bankName?: string;
  accountMasked?: string;
}

export interface VerificationBadges {
  aadhaarAuth: {
    verified: boolean;
    mode: string;
    maskedAadhaar: string;
  };
  casteCertificate: {
    verified: boolean;
    issuingAuthority: string;
    categoryConfirmed: string;
    certificateNumber: string;
  };
  bankPennyDrop: {
    verified: boolean;
    bankName: string;
    accountHolderMatch: string;
    accountStatus: string;
    dbtEnabled: boolean;
    accountNumberMasked: string;
    ifsc: string;
  };
  creditSanity: {
    scoreBand: string;
    bureauDefaultAlert: boolean;
    note: string;
  };
}

export interface RecommenderInput {
  projectType: string;
  estimatedCost: number;
  annualIncome: number;
  educationStatus: string;
  isWomanBeneficiary: boolean;
  state: string;
  district: string;
}

export interface SchemeRecommendation {
  scheme: Scheme;
  matchScore: number;
  eligible: boolean;
  calculatedLoanAmount: number;
  calculatedPromoterShare: number;
  reasons: string[];
}
