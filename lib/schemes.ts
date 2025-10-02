// Indian government schemes and investment options data

export interface Scheme {
  id: string
  name: string
  type: "pension" | "savings" | "tax-saving" | "fixed-income"
  interestRate: number
  minInvestment: number
  maxInvestment?: number
  lockInPeriod: number // in years
  taxBenefit: string
  eligibility: string
  description: string
}

export const indianSchemes: Scheme[] = [
  {
    id: "nps",
    name: "National Pension System (NPS)",
    type: "pension",
    interestRate: 10, // approximate annual return
    minInvestment: 500,
    maxInvestment: undefined,
    lockInPeriod: 0, // until retirement
    taxBenefit: "Up to ₹2 lakh under 80CCD(1B)",
    eligibility: "Indian citizens aged 18-70",
    description: "Government-sponsored pension scheme with market-linked returns and tax benefits.",
  },
  {
    id: "ppf",
    name: "Public Provident Fund (PPF)",
    type: "tax-saving",
    interestRate: 7.1,
    minInvestment: 500,
    maxInvestment: 150000,
    lockInPeriod: 15,
    taxBenefit: "EEE (Exempt-Exempt-Exempt) under 80C",
    eligibility: "Indian residents",
    description: "Long-term savings scheme with guaranteed returns and complete tax exemption.",
  },
  {
    id: "scss",
    name: "Senior Citizens Savings Scheme (SCSS)",
    type: "fixed-income",
    interestRate: 8.2,
    minInvestment: 1000,
    maxInvestment: 3000000,
    lockInPeriod: 5,
    taxBenefit: "Deduction under 80C",
    eligibility: "Indian citizens aged 60+",
    description: "Government-backed savings scheme for senior citizens with regular income.",
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana (APY)",
    type: "pension",
    interestRate: 8, // approximate
    minInvestment: 42,
    maxInvestment: 1454,
    lockInPeriod: 0, // until age 60
    eligibility: "Indian citizens aged 18-40",
    taxBenefit: "Deduction under 80CCD",
    description: "Government pension scheme guaranteeing fixed pension after age 60.",
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana",
    type: "savings",
    interestRate: 8.2,
    minInvestment: 250,
    maxInvestment: 150000,
    lockInPeriod: 21,
    taxBenefit: "EEE under 80C",
    eligibility: "Girl child below 10 years",
    description: "Savings scheme for girl child education and marriage.",
  },
  {
    id: "post-office-fd",
    name: "Post Office Fixed Deposit",
    type: "fixed-income",
    interestRate: 7.5,
    minInvestment: 1000,
    maxInvestment: undefined,
    lockInPeriod: 1,
    taxBenefit: "TDS applicable",
    eligibility: "Indian residents",
    description: "Safe fixed deposit scheme with government backing.",
  },
]

export const fdRates = {
  sbi: { "1year": 6.5, "2year": 7.0, "3year": 7.0, "5year": 6.5 },
  hdfc: { "1year": 7.0, "2year": 7.0, "3year": 7.0, "5year": 7.0 },
  icici: { "1year": 6.7, "2year": 7.0, "3year": 7.0, "5year": 7.0 },
  axis: { "1year": 6.9, "2year": 7.0, "3year": 7.1, "5year": 7.0 },
}

export function getSchemesByType(type: Scheme["type"]): Scheme[] {
  return indianSchemes.filter((scheme) => scheme.type === type)
}

export function getSchemeById(id: string): Scheme | undefined {
  return indianSchemes.find((scheme) => scheme.id === id)
}
