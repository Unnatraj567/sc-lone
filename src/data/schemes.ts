import { Scheme } from '../types';

export const SCHEMES_DATA: Scheme[] = [
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
    targetAudience: "Small vendors, fruit/vegetable hawkers, women SHGs, tailoring, poultry, rural artisans",
    incomeLimit: 500000,
    educationReq: "No formal education required",
    description: "Tailored micro-credit assistance up to ₹1.40 Lakh for rapid establishment of micro-enterprises with nominal interest rates, zero collateral, and 0.5% special rebate for women entrepreneurs.",
    keyFeatures: [
      "Maximum loan ceiling up to ₹1,40,000",
      "Concessional interest rate of 6.5% p.a. (vs. 14.5% in commercial MFIs)",
      "Promoter margin is just 5% (Beneficiary invests only ₹7,000 for ₹1.40 Lakh project)",
      "Flexible moratorium of 3 to 6 months before principal repayment begins",
      "Special fast-track channel through NBFC-MFIs and Women Self-Help Groups (SHGs)"
    ],
    documentsRequired: [
      "SC Caste Certificate issued by competent Revenue Authority",
      "Family Annual Income Certificate (≤ ₹5.00 Lakhs)",
      "Aadhaar Card (linked to mobile for e-KYC)",
      "Bank Account Passbook / Cancelled Cheque (DBT enabled)",
      "Basic Trade / Micro-venture Quotation or Estimate"
    ]
  },
  {
    id: "term-loan-small",
    name: "Term Loan Scheme (Small Business & Agro-Services)",
    hindiName: "सावधि ऋण योजना (लघु व्यवसाय एवं कृषि सेवा)",
    category: "Term Loan",
    maxLoan: 500000,
    concessionalRate: 7.0,
    commercialMarketRate: 13.0,
    promoterSharePercent: 5,
    scContributionPercent: 90,
    maxMoratoriumMonths: 6,
    maxRepaymentYears: 5,
    targetAudience: "Retail Kirana, mobile repair, auto/two-wheeler workshop, dairy farming, beauty salon, cyber cafe",
    incomeLimit: 500000,
    educationReq: "Basic literacy / 8th Pass preferred",
    description: "Financial assistance up to ₹5.00 Lakhs covering up to 90% of total project costs for commercially viable micro/small enterprises in retail, agriculture, and services.",
    keyFeatures: [
      "Project costs up to ₹5,00,000 covered",
      "Super concessional interest at 7.0% p.a.",
      "Promoter contribution: 5% for up to ₹2.00 Lakh, 10% for projects above ₹2.00 Lakh",
      "Moratorium period of 6 months during venture setup",
      "Repayment tenor up to 5 years (60 monthly installments)"
    ],
    documentsRequired: [
      "SC Caste Certificate",
      "Income Certificate (≤ ₹5.00 Lakhs)",
      "Aadhaar Card & PAN Card",
      "Rent Agreement / Proof of Business Premises",
      "Quotations for machinery/tools/inventory from registered vendors",
      "Bank Account Statement (last 6 months)"
    ]
  },
  {
    id: "term-loan-large",
    name: "High-Value Term Loan (Industrial & Transport)",
    hindiName: "उच्च मूल्य सावधि ऋण (औद्योगिक एवं परिवहन)",
    category: "Term Loan",
    maxLoan: 5000000,
    concessionalRate: 8.0,
    commercialMarketRate: 12.5,
    promoterSharePercent: 10,
    scContributionPercent: 90,
    maxMoratoriumMonths: 12,
    maxRepaymentYears: 7,
    targetAudience: "Manufacturing units, cold storage, passenger/goods transport, digital studio, food processing",
    incomeLimit: 500000,
    educationReq: "10th / 12th / ITI / Diploma / Degree",
    description: "Capital-intensive financing up to ₹50.00 Lakhs to facilitate SC industrialists and transport operators in acquiring plant machinery, commercial vehicles, and industrial facilities.",
    keyFeatures: [
      "High project cost ceiling up to ₹50,00,000",
      "Affordable rate of 8.0% p.a. (fixed concessional)",
      "Moratorium of up to 12 months for factory installation & trial runs",
      "Extended repayment period up to 7 years",
      "Co-financed through Public Sector Banks (PSBs) and State Channelizing Agencies"
    ],
    documentsRequired: [
      "SC Certificate & Income Proof",
      "Detailed Project Report (DPR) with cash-flow projections",
      "Machinery invoices and tax proforma invoices",
      "Pollution / Municipal trade license (if applicable)",
      "Driving License / Commercial Permit (for transport projects)",
      "Audited financial statements (for existing expansion)"
    ]
  },
  {
    id: "education-domestic",
    name: "Concessional Education Loan (Higher Studies in India)",
    hindiName: "रियायती शिक्षा ऋण (भारत में उच्च शिक्षा)",
    category: "Educational Loan",
    maxLoan: 2000000,
    concessionalRate: 6.5,
    commercialMarketRate: 11.5,
    promoterSharePercent: 0,
    scContributionPercent: 100,
    maxMoratoriumMonths: 12, // Course duration + 12 months grace
    maxRepaymentYears: 10,
    targetAudience: "SC students admitted into Engineering (IIT/NIT), Medical (AIIMS/MBBS), IIMs, Law, Polytechnic",
    incomeLimit: 500000,
    educationReq: "12th / Graduate with confirmed college admission",
    description: "100% comprehensive educational funding up to ₹20.00 Lakhs covering tuition fees, hostel expenses, exam charges, books, and essential computing devices.",
    keyFeatures: [
      "Zero promoter margin (100% funded up to ₹20.00 Lakh)",
      "Highly subsidized rate of 6.5% p.a. (0.5% additional rebate for female scholars)",
      "Generous Moratorium: Course duration + 1 year after graduation or 6 months after getting a job",
      "Repayment spans up to 10 years after moratorium completes",
      "Direct disbursement to university / college account"
    ],
    documentsRequired: [
      "SC Certificate & Family Income Proof",
      "Admission letter / Seat allotment slip from recognized University/Institute",
      "Fee breakdown structure issued by educational institution",
      "Mark sheets of Class 10th, 12th, and entrance exam score card",
      "Student and Co-borrower (Parent/Guardian) KYC"
    ]
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
    targetAudience: "SC postgraduates & doctoral candidates admitted to top QS-ranked world universities",
    incomeLimit: 500000,
    educationReq: "Bachelor's Degree + I-20 / CAS / Foreign University Offer",
    description: "Credit facility up to ₹30.00 Lakhs to pursue Master's, M.Phil, or Ph.D. degrees in prestigious overseas universities, covering tuition, foreign living expenses, airfare, and visa costs.",
    keyFeatures: [
      "Loan assistance up to ₹30,00,000",
      "Nominal 7.0% p.a. interest rate",
      "Includes airfare, foreign medical insurance, and computer allowance",
      "Moratorium period covers entire study program + 1 year",
      "Repayment tenure up to 10 years post-moratorium"
    ],
    documentsRequired: [
      "SC Certificate & Family Income Certificate",
      "Unconditional Offer Letter from Accredited Overseas University",
      "Valid Indian Passport and Student Visa Documentation",
      "GRE / GMAT / IELTS / TOEFL scorecard",
      "Estimates of living expenses and tuition fees in foreign currency"
    ]
  },
  {
    id: "green-business",
    name: "Green Business Scheme (Solar & Eco-Mobility)",
    hindiName: "हरित व्यवसाय योजना (सौर ऊर्जा एवं ई-रिक्शा)",
    category: "Green Credit",
    maxLoan: 3000000,
    concessionalRate: 6.75,
    commercialMarketRate: 13.5,
    promoterSharePercent: 5,
    scContributionPercent: 90,
    maxMoratoriumMonths: 9,
    maxRepaymentYears: 7,
    targetAudience: "Electric 3-Wheelers (E-Rickshaw/E-Cart), Solar Photovoltaic Pumps, Bio-waste composting, Recycled paper",
    incomeLimit: 500000,
    educationReq: "Basic technical orientation",
    description: "Dedicated eco-financing to empower SC youth in sustainable green businesses including electric transport and solar infrastructure.",
    keyFeatures: [
      "Financial assistance up to ₹30,00,000",
      "Concessional rate of 6.75% p.a. under clean energy transition mandate",
      "Beneficiary promoter investment starting from just 5%",
      "Moratorium of 9 months for equipment delivery and charging setup",
      "Repayment period of 7 years"
    ],
    documentsRequired: [
      "SC Certificate & Income Proof",
      "Vehicle proforma invoice or solar system quote from approved OEM vendor",
      "Aadhaar, PAN, and Commercial Driving License (for e-mobility)",
      "Site layout or electricity connection bill (for solar micro-grid)"
    ]
  }
];
