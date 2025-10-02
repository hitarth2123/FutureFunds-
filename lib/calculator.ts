// Calculator service for retirement planning calculations

export interface RetirementInput {
  currentAge: number
  retirementAge: number
  currentSavings: number
  monthlySIP: number
  monthlyFD: number
  monthlyRD: number
  expectedReturn: {
    mutualFunds: number // percentage
    fd: number // percentage
    rd: number // percentage
  }
  inflationRate: number // percentage
  monthlyExpenseAfterRetirement: number
  lifeExpectancy: number
}

export interface RetirementOutput {
  requiredCorpus: number
  achievedCorpus: number
  breakdown: {
    mutualFunds: number
    fd: number
    rd: number
    currentSavings: number
  }
  yearlyProjection: Array<{
    year: number
    age: number
    mutualFunds: number
    fd: number
    rd: number
    total: number
  }>
  isGoalAchievable: boolean
  shortfall: number
}

// Calculate future value of SIP (Systematic Investment Plan)
export function calculateSIPFutureValue(monthlyInvestment: number, annualReturnRate: number, years: number): number {
  const monthlyRate = annualReturnRate / 12 / 100
  const months = years * 12

  if (monthlyRate === 0) return monthlyInvestment * months

  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)

  return futureValue
}

// Calculate future value of lumpsum investment
export function calculateLumpsumFutureValue(principal: number, annualReturnRate: number, years: number): number {
  return principal * Math.pow(1 + annualReturnRate / 100, years)
}

// Calculate required corpus for retirement
export function calculateRequiredCorpus(
  monthlyExpense: number,
  yearsInRetirement: number,
  inflationRate: number,
): number {
  // Adjust for inflation during retirement
  const adjustedMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsInRetirement / 2)

  // Total corpus needed (simplified calculation)
  return adjustedMonthlyExpense * 12 * yearsInRetirement
}

// Main retirement calculation function
export function calculateRetirement(input: RetirementInput): RetirementOutput {
  const yearsToRetirement = input.retirementAge - input.currentAge
  const yearsInRetirement = input.lifeExpectancy - input.retirementAge

  // Calculate future value of each investment type
  const mutualFundsFV = calculateSIPFutureValue(input.monthlySIP, input.expectedReturn.mutualFunds, yearsToRetirement)

  const fdFV = calculateSIPFutureValue(input.monthlyFD, input.expectedReturn.fd, yearsToRetirement)

  const rdFV = calculateSIPFutureValue(input.monthlyRD, input.expectedReturn.rd, yearsToRetirement)

  const currentSavingsFV = calculateLumpsumFutureValue(
    input.currentSavings,
    input.expectedReturn.mutualFunds,
    yearsToRetirement,
  )

  const achievedCorpus = mutualFundsFV + fdFV + rdFV + currentSavingsFV

  // Calculate required corpus
  const requiredCorpus = calculateRequiredCorpus(
    input.monthlyExpenseAfterRetirement,
    yearsInRetirement,
    input.inflationRate,
  )

  // Generate yearly projection
  const yearlyProjection = []
  for (let i = 0; i <= yearsToRetirement; i++) {
    const year = new Date().getFullYear() + i
    const age = input.currentAge + i

    const mfValue = calculateSIPFutureValue(input.monthlySIP, input.expectedReturn.mutualFunds, i)
    const fdValue = calculateSIPFutureValue(input.monthlyFD, input.expectedReturn.fd, i)
    const rdValue = calculateSIPFutureValue(input.monthlyRD, input.expectedReturn.rd, i)
    const savingsValue = calculateLumpsumFutureValue(input.currentSavings, input.expectedReturn.mutualFunds, i)

    yearlyProjection.push({
      year,
      age,
      mutualFunds: mfValue,
      fd: fdValue,
      rd: rdValue,
      total: mfValue + fdValue + rdValue + savingsValue,
    })
  }

  return {
    requiredCorpus,
    achievedCorpus,
    breakdown: {
      mutualFunds: mutualFundsFV,
      fd: fdFV,
      rd: rdFV,
      currentSavings: currentSavingsFV,
    },
    yearlyProjection,
    isGoalAchievable: achievedCorpus >= requiredCorpus,
    shortfall: Math.max(0, requiredCorpus - achievedCorpus),
  }
}

// FD/RD maturity calculation
export function calculateFDMaturity(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency = 4, // quarterly by default
): number {
  const rate = annualRate / 100
  const maturityAmount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * years)
  return maturityAmount
}

export function calculateRDMaturity(monthlyDeposit: number, annualRate: number, months: number): number {
  const quarterlyRate = annualRate / 4 / 100
  const quarters = months / 3

  let maturityAmount = 0
  for (let i = 1; i <= quarters; i++) {
    maturityAmount += monthlyDeposit * 3 * Math.pow(1 + quarterlyRate, quarters - i + 1)
  }

  return maturityAmount
}
