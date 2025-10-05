---
noteId: "dsa-intermediate-part2"
tags: []

---

# Intermediate Level - Data Structures & Algorithms (Questions 8-35)

## Algorithm Design (Q8-Q14)

### Q8: Implement the QuickSort algorithm for sorting investment schemes by return rate.

**Answer:**
QuickSort is an efficient sorting algorithm with O(n log n) average time complexity.

**Implementation:**
```typescript
interface InvestmentScheme {
  name: string;
  rate: number;
  type: string;
}

function quickSort(schemes: InvestmentScheme[], low: number = 0, high: number = schemes.length - 1): void {
  if (low < high) {
    const pivotIndex = partition(schemes, low, high);
    quickSort(schemes, low, pivotIndex - 1);
    quickSort(schemes, pivotIndex + 1, high);
  }
}

function partition(schemes: InvestmentScheme[], low: number, high: number): number {
  const pivot = schemes[high].rate;
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (schemes[j].rate <= pivot) {
      i++;
      [schemes[i], schemes[j]] = [schemes[j], schemes[i]];
    }
  }
  
  [schemes[i + 1], schemes[high]] = [schemes[high], schemes[i + 1]];
  return i + 1;
}

// FutureFunds Usage
const schemes: InvestmentScheme[] = [
  {name: "PPF", rate: 7.1, type: "Government"},
  {name: "EPF", rate: 8.5, type: "Government"},
  {name: "NPS", rate: 9.2, type: "Government"},
  {name: "FD", rate: 6.5, type: "Bank"},
  {name: "SIP", rate: 12.0, type: "Mutual Fund"}
];

quickSort(schemes);
console.log("Schemes sorted by rate:", schemes);
```

**Time Complexity:**
- **Average Case**: O(n log n)
- **Worst Case**: O(n²)
- **Space Complexity**: O(log n)

---

### Q9: Design a binary search algorithm for finding optimal investment amount.

**Answer:**
Binary search efficiently finds the optimal investment amount within a range.

**Implementation:**
```typescript
function findOptimalInvestment(
  targetCorpus: number,
  minAmount: number,
  maxAmount: number,
  rate: number,
  years: number,
  tolerance: number = 1000
): number {
  let left = minAmount;
  let right = maxAmount;
  let optimalAmount = 0;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const futureValue = calculateSIPFutureValue(mid, rate, years);
    
    if (Math.abs(futureValue - targetCorpus) <= tolerance) {
      return mid;
    }
    
    if (futureValue < targetCorpus) {
      left = mid + 1;
    } else {
      optimalAmount = mid;
      right = mid - 1;
    }
  }
  
  return optimalAmount;
}

// FutureFunds Usage
const targetCorpus = 10000000; // 1 Crore
const minAmount = 1000;
const maxAmount = 100000;
const rate = 12;
const years = 30;

const optimalSIP = findOptimalInvestment(targetCorpus, minAmount, maxAmount, rate, years);
console.log("Optimal monthly SIP:", optimalSIP);
```

**Time Complexity:**
- **Time**: O(log n) where n = range size
- **Space**: O(1)

---

### Q10: Implement the Merge Sort algorithm for sorting yearly projections.

**Answer:**
Merge Sort provides stable O(n log n) sorting with predictable performance.

**Implementation:**
```typescript
interface YearlyProjection {
  year: number;
  total: number;
  mutualFunds: number;
  fd: number;
  rd: number;
}

function mergeSort(projections: YearlyProjection[]): YearlyProjection[] {
  if (projections.length <= 1) return projections;
  
  const mid = Math.floor(projections.length / 2);
  const left = mergeSort(projections.slice(0, mid));
  const right = mergeSort(projections.slice(mid));
  
  return merge(left, right);
}

function merge(left: YearlyProjection[], right: YearlyProjection[]): YearlyProjection[] {
  const result: YearlyProjection[] = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i].total <= right[j].total) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// FutureFunds Usage
const projections: YearlyProjection[] = [
  {year: 2024, total: 500000, mutualFunds: 300000, fd: 200000, rd: 0},
  {year: 2025, total: 750000, mutualFunds: 450000, fd: 300000, rd: 0},
  {year: 2026, total: 1000000, mutualFunds: 600000, fd: 400000, rd: 0}
];

const sortedProjections = mergeSort(projections);
console.log("Projections sorted by total:", sortedProjections);
```

**Time Complexity:**
- **Time**: O(n log n)
- **Space**: O(n)

---

### Q11: Design a greedy algorithm for optimal asset allocation.

**Answer:**
Greedy algorithms make locally optimal choices to find a global optimum.

**Implementation:**
```typescript
interface Asset {
  name: string;
  expectedReturn: number;
  risk: number;
  minAllocation: number;
  maxAllocation: number;
}

function greedyAssetAllocation(
  assets: Asset[],
  totalAmount: number,
  maxRisk: number
): Map<string, number> {
  // Sort by return/risk ratio (greedy choice)
  const sortedAssets = assets
    .filter(asset => asset.risk <= maxRisk)
    .sort((a, b) => (b.expectedReturn / b.risk) - (a.expectedReturn / a.risk));
  
  const allocation = new Map<string, number>();
  let remainingAmount = totalAmount;
  
  for (const asset of sortedAssets) {
    if (remainingAmount <= 0) break;
    
    // Allocate maximum possible amount
    const maxPossible = Math.min(
      remainingAmount,
      totalAmount * asset.maxAllocation / 100
    );
    
    const minRequired = totalAmount * asset.minAllocation / 100;
    const allocatedAmount = Math.max(maxPossible, minRequired);
    
    if (allocatedAmount > 0) {
      allocation.set(asset.name, allocatedAmount);
      remainingAmount -= allocatedAmount;
    }
  }
  
  return allocation;
}

// FutureFunds Usage
const assets: Asset[] = [
  {name: "Equity", expectedReturn: 12, risk: 8, minAllocation: 20, maxAllocation: 60},
  {name: "Debt", expectedReturn: 7, risk: 3, minAllocation: 20, maxAllocation: 50},
  {name: "Gold", expectedReturn: 8, risk: 5, minAllocation: 5, maxAllocation: 20},
  {name: "PPF", expectedReturn: 7.1, risk: 1, minAllocation: 10, maxAllocation: 30}
];

const allocation = greedyAssetAllocation(assets, 100000, 6);
console.log("Optimal allocation:", allocation);
```

**Time Complexity:**
- **Time**: O(n log n) for sorting
- **Space**: O(n)

---

### Q12: Implement a backtracking algorithm for finding all possible investment combinations.

**Answer:**
Backtracking explores all possible solutions by building candidates incrementally.

**Implementation:**
```typescript
interface InvestmentOption {
  name: string;
  amount: number;
  rate: number;
  maxContribution: number;
}

function findAllInvestmentCombinations(
  options: InvestmentOption[],
  targetAmount: number,
  maxOptions: number
): InvestmentOption[][] {
  const result: InvestmentOption[][] = [];
  
  function backtrack(
    currentCombination: InvestmentOption[],
    remainingAmount: number,
    startIndex: number
  ): void {
    if (remainingAmount === 0 && currentCombination.length <= maxOptions) {
      result.push([...currentCombination]);
      return;
    }
    
    if (currentCombination.length >= maxOptions) return;
    
    for (let i = startIndex; i < options.length; i++) {
      const option = options[i];
      
      if (option.amount <= remainingAmount && 
          option.amount <= option.maxContribution) {
        currentCombination.push(option);
        backtrack(
          currentCombination,
          remainingAmount - option.amount,
          i + 1
        );
        currentCombination.pop();
      }
    }
  }
  
  backtrack([], targetAmount, 0);
  return result;
}

// FutureFunds Usage
const options: InvestmentOption[] = [
  {name: "PPF", amount: 150000, rate: 7.1, maxContribution: 150000},
  {name: "EPF", amount: 100000, rate: 8.5, maxContribution: 100000},
  {name: "NPS", amount: 50000, rate: 9.2, maxContribution: 50000},
  {name: "SIP", amount: 25000, rate: 12, maxContribution: 0}
];

const combinations = findAllInvestmentCombinations(options, 200000, 3);
console.log("Investment combinations:", combinations.length);
```

**Time Complexity:**
- **Time**: O(2^n) in worst case
- **Space**: O(n) for recursion stack

---

### Q13: Design a divide and conquer algorithm for portfolio optimization.

**Answer:**
Divide and conquer breaks problems into smaller subproblems and combines solutions.

**Implementation:**
```typescript
interface Portfolio {
  assets: Array<{name: string, weight: number, return: number}>;
  totalReturn: number;
  risk: number;
}

function optimizePortfolio(assets: Array<{name: string, return: number, risk: number}>): Portfolio {
  if (assets.length === 1) {
    return {
      assets: [{name: assets[0].name, weight: 1, return: assets[0].return}],
      totalReturn: assets[0].return,
      risk: assets[0].risk
    };
  }
  
  const mid = Math.floor(assets.length / 2);
  const leftAssets = assets.slice(0, mid);
  const rightAssets = assets.slice(mid);
  
  const leftPortfolio = optimizePortfolio(leftAssets);
  const rightPortfolio = optimizePortfolio(rightAssets);
  
  return combinePortfolios(leftPortfolio, rightPortfolio);
}

function combinePortfolios(left: Portfolio, right: Portfolio): Portfolio {
  // Calculate optimal combination weights
  const leftWeight = calculateOptimalWeight(left, right);
  const rightWeight = 1 - leftWeight;
  
  const combinedAssets = [
    ...left.assets.map(asset => ({
      ...asset,
      weight: asset.weight * leftWeight
    })),
    ...right.assets.map(asset => ({
      ...asset,
      weight: asset.weight * rightWeight
    }))
  ];
  
  const totalReturn = leftWeight * left.totalReturn + rightWeight * right.totalReturn;
  const risk = Math.sqrt(
    leftWeight * leftWeight * left.risk * left.risk +
    rightWeight * rightWeight * right.risk * right.risk +
    2 * leftWeight * rightWeight * left.risk * right.risk * 0.3 // Correlation
  );
  
  return {
    assets: combinedAssets,
    totalReturn,
    risk
  };
}

function calculateOptimalWeight(left: Portfolio, right: Portfolio): number {
  // Simplified optimization - in practice, use more sophisticated methods
  const returnDiff = left.totalReturn - right.totalReturn;
  const riskDiff = left.risk - right.risk;
  
  if (riskDiff === 0) return 0.5;
  
  return Math.max(0, Math.min(1, 0.5 + returnDiff / (2 * riskDiff)));
}

// FutureFunds Usage
const assets = [
  {name: "Equity", return: 12, risk: 8},
  {name: "Debt", return: 7, risk: 3},
  {name: "Gold", return: 8, risk: 5},
  {name: "PPF", return: 7.1, risk: 1}
];

const optimizedPortfolio = optimizePortfolio(assets);
console.log("Optimized portfolio:", optimizedPortfolio);
```

**Time Complexity:**
- **Time**: O(n log n)
- **Space**: O(n)

---

### Q14: Implement a sliding window algorithm for analyzing investment trends.

**Answer:**
Sliding window efficiently processes contiguous subarrays of fixed size.

**Implementation:**
```typescript
function analyzeInvestmentTrends(
  monthlyReturns: number[],
  windowSize: number
): Array<{
  period: string;
  averageReturn: number;
  volatility: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}> {
  const results: Array<{
    period: string;
    averageReturn: number;
    volatility: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> = [];
  
  for (let i = 0; i <= monthlyReturns.length - windowSize; i++) {
    const window = monthlyReturns.slice(i, i + windowSize);
    const averageReturn = window.reduce((sum, ret) => sum + ret, 0) / windowSize;
    
    const variance = window.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / windowSize;
    const volatility = Math.sqrt(variance);
    
    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (window.length >= 2) {
      const firstHalf = window.slice(0, Math.floor(windowSize / 2));
      const secondHalf = window.slice(Math.floor(windowSize / 2));
      
      const firstAvg = firstHalf.reduce((sum, ret) => sum + ret, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, ret) => sum + ret, 0) / secondHalf.length;
      
      const diff = secondAvg - firstAvg;
      if (diff > 0.5) trend = 'increasing';
      else if (diff < -0.5) trend = 'decreasing';
    }
    
    results.push({
      period: `Month ${i + 1}-${i + windowSize}`,
      averageReturn,
      volatility,
      trend
    });
  }
  
  return results;
}

// FutureFunds Usage
const monthlyReturns = [1.2, 0.8, 1.5, -0.3, 2.1, 0.9, 1.8, 0.5, 1.3, 2.0, 0.7, 1.6];
const trendAnalysis = analyzeInvestmentTrends(monthlyReturns, 6);
console.log("Investment trends:", trendAnalysis);
```

**Time Complexity:**
- **Time**: O(n * k) where k = window size
- **Space**: O(n)

---

## Time & Space Complexity (Q15-Q21)

### Q15: Analyze the time complexity of the SIP calculation algorithm.

**Answer:**
The SIP calculation uses a mathematical formula with constant time complexity.

**Algorithm Analysis:**
```typescript
function calculateSIPFutureValue(monthlyInvestment: number, annualRate: number, years: number): number {
  // O(1) - Constant time operations
  if (monthlyInvestment === 0) return 0;  // O(1)
  
  const monthlyRate = annualRate / 12 / 100;  // O(1)
  const months = years * 12;  // O(1)
  
  if (monthlyRate === 0) return monthlyInvestment * months;  // O(1)
  
  // O(1) - Single mathematical operation
  const futureValue = monthlyInvestment * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  
  return Math.round(futureValue * 100) / 100;  // O(1)
}
```

**Complexity Analysis:**
- **Time Complexity**: O(1) - Constant time regardless of input size
- **Space Complexity**: O(1) - No additional memory allocation
- **Mathematical Operations**: All operations are O(1)
- **Input Independence**: Performance doesn't depend on input values

**Why O(1):**
- No loops or recursion
- Fixed number of arithmetic operations
- Math.pow() is O(1) for reasonable inputs
- No data structures that grow with input

---

### Q16: Calculate the space complexity of storing yearly projections.

**Answer:**
Space complexity depends on the number of years and data stored per year.

**Implementation Analysis:**
```typescript
function generateYearlyProjections(input: RetirementInput, yearsToRetirement: number): YearlyProjection[] {
  // O(Y) space - Array of size yearsToRetirement + 1
  const projection: YearlyProjection[] = new Array(yearsToRetirement + 1);
  
  for (let i = 0; i <= yearsToRetirement; i++) {
    // O(1) space per iteration - Fixed size object
    projection[i] = {
      year: currentYear + i,           // O(1)
      age: input.currentAge + i,       // O(1)
      mutualFunds: calculateSIPFutureValue(input.monthlySIP, input.expectedReturn.mutualFunds, i),  // O(1)
      fd: calculateSIPFutureValue(input.monthlyFD, input.expectedReturn.fd, i),  // O(1)
      rd: calculateSIPFutureValue(input.monthlyRD, input.expectedReturn.rd, i),  // O(1)
      schemes: calculateSchemesValue(input.schemes, i),  // O(1)
      total: 0  // O(1)
    };
  }
  
  return projection;  // O(Y) space
}
```

**Space Complexity Analysis:**
- **Array Size**: O(Y) where Y = years to retirement
- **Per Year Data**: O(1) - Fixed size object
- **Total Space**: O(Y) - Linear in years
- **Auxiliary Space**: O(1) - No additional data structures

**Memory Usage Example:**
- **30 years**: ~30 objects × 7 fields = 210 data points
- **40 years**: ~40 objects × 7 fields = 280 data points
- **Memory per object**: ~200 bytes (estimated)
- **Total for 30 years**: ~6KB
- **Total for 40 years**: ~8KB

---

### Q17: Analyze the time complexity of the Monte Carlo simulation.

**Answer:**
Monte Carlo simulation has linear time complexity in the number of simulations.

**Algorithm Analysis:**
```typescript
function performRiskAnalysis(input: RetirementInput, simulations: number = 1000): RiskAnalysisResult {
  const results: number[] = [];  // O(N) space
  
  // O(N) time - Loop runs N times
  for (let i = 0; i < simulations; i++) {
    // O(1) time per iteration
    const randomReturn = generateNormalRandom(baseReturn, volatility);  // O(1)
    
    const modifiedInput: RetirementInput = {  // O(1) space
      ...input,
      expectedReturn: {
        ...input.expectedReturn,
        mutualFunds: Math.max(0, randomReturn)
      }
    };
    
    const result = calculateRetirement(modifiedInput);  // O(1) - assuming O(1) calculation
    results.push(result.achievedCorpus);  // O(1)
  }
  
  // O(N log N) time for sorting
  results.sort((a, b) => a - b);
  
  // O(1) time for calculations
  const percentile = (p: number) => results[Math.floor(p * results.length)];
  
  return {
    bestCase: results[results.length - 1],  // O(1)
    worstCase: results[0],  // O(1)
    median: percentile(0.5),  // O(1)
    percentile25: percentile(0.25),  // O(1)
    percentile75: percentile(0.75),  // O(1)
    probabilityOfSuccess: results.filter(r => r >= threshold).length / simulations,  // O(N)
    expectedValue: results.reduce((sum, r) => sum + r, 0) / results.length  // O(N)
  };
}
```

**Complexity Analysis:**
- **Time Complexity**: O(N + N log N) = O(N log N)
  - Simulation loop: O(N)
  - Sorting: O(N log N)
  - Final calculations: O(N)
- **Space Complexity**: O(N) for storing results
- **Where N**: Number of simulations (typically 1000-10000)

**Performance Characteristics:**
- **1000 simulations**: ~10ms
- **10000 simulations**: ~100ms
- **100000 simulations**: ~1s
- **Memory**: ~8KB for 1000 simulations

---

### Q18: Calculate the time complexity of the portfolio optimization algorithm.

**Answer:**
Portfolio optimization using divide and conquer has O(n log n) time complexity.

**Algorithm Analysis:**
```typescript
function optimizePortfolio(assets: Array<{name: string, return: number, risk: number}>): Portfolio {
  // Base case: O(1)
  if (assets.length === 1) {
    return createSingleAssetPortfolio(assets[0]);
  }
  
  // Divide: O(1) - Array slicing
  const mid = Math.floor(assets.length / 2);
  const leftAssets = assets.slice(0, mid);      // O(n)
  const rightAssets = assets.slice(mid);        // O(n)
  
  // Conquer: T(n/2) + T(n/2) = 2T(n/2)
  const leftPortfolio = optimizePortfolio(leftAssets);   // T(n/2)
  const rightPortfolio = optimizePortfolio(rightAssets); // T(n/2)
  
  // Combine: O(n) - Merging portfolios
  return combinePortfolios(leftPortfolio, rightPortfolio);  // O(n)
}
```

**Recurrence Relation:**
- **T(n) = 2T(n/2) + O(n)**
- **Solution**: T(n) = O(n log n)

**Complexity Analysis:**
- **Time Complexity**: O(n log n)
  - Divide: O(n) for array slicing
  - Conquer: 2T(n/2) for recursive calls
  - Combine: O(n) for merging
- **Space Complexity**: O(n) for recursion stack
- **Where n**: Number of assets

**Performance for Different Asset Counts:**
- **4 assets**: ~1ms
- **8 assets**: ~2ms
- **16 assets**: ~4ms
- **32 assets**: ~8ms

---

### Q19: Analyze the space complexity of the caching system.

**Answer:**
The caching system has O(C) space complexity where C is the cache size.

**Cache Implementation Analysis:**
```typescript
class CalculationCache {
  private cache = new Map<string, RetirementOutput>();  // O(C) space
  private maxSize = 1000;  // O(1) space
  
  // O(1) time, O(1) space
  generateKey(input: RetirementInput): string {
    return JSON.stringify({
      age: input.currentAge,
      retirement: input.retirementAge,
      sip: input.monthlySIP,
      fd: input.monthlyFD,
      rd: input.monthlyRD,
      mfReturn: input.expectedReturn.mutualFunds,
      fdReturn: input.expectedReturn.fd,
      rdReturn: input.expectedReturn.rd,
      inflation: input.inflationRate,
      expense: input.monthlyExpenseAfterRetirement,
      schemes: input.schemes?.map(s => `${s.id}:${s.amount}:${s.rate}`).sort()
    });
  }
  
  // O(1) time, O(1) space
  get(input: RetirementInput): RetirementOutput | null {
    const key = this.generateKey(input);
    return this.cache.get(key) || null;
  }
  
  // O(1) time, O(1) space
  set(input: RetirementInput, output: RetirementOutput): void {
    const key = this.generateKey(input);
    
    // O(1) time for size check
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);  // O(1) time
    }
    
    this.cache.set(key, output);  // O(1) time
  }
}
```

**Space Complexity Analysis:**
- **Cache Storage**: O(C) where C = maxSize (1000)
- **Key Generation**: O(1) - Fixed size string
- **Value Storage**: O(1) per entry - Fixed size object
- **Total Space**: O(C) - Linear in cache size

**Memory Usage:**
- **Cache Size**: 1000 entries
- **Key Size**: ~200 bytes per key
- **Value Size**: ~2KB per RetirementOutput
- **Total Memory**: ~2.2MB for full cache

---

### Q20: Calculate the time complexity of the aggregation pipeline.

**Answer:**
MongoDB aggregation pipeline complexity depends on the operations and data size.

**Pipeline Analysis:**
```javascript
db.scenarios.aggregate([
  // Stage 1: $match - O(n) time, O(m) space where m = matching documents
  { $match: { userId: "user123" } },
  
  // Stage 2: $group - O(m) time, O(k) space where k = unique groups
  { $group: {
    _id: { ageGroup: "$input.currentAge" },
    avgSIP: { $avg: "$input.monthlySIP" },
    count: { $sum: 1 }
  }},
  
  // Stage 3: $sort - O(k log k) time, O(k) space
  { $sort: { avgSIP: -1 } },
  
  // Stage 4: $limit - O(1) time, O(1) space
  { $limit: 10 }
])
```

**Complexity Analysis:**
- **$match**: O(n) - Must scan all documents
- **$group**: O(m) - Process matching documents
- **$sort**: O(k log k) - Sort grouped results
- **$limit**: O(1) - Take first 10 results
- **Total Time**: O(n + m + k log k)
- **Total Space**: O(m + k)

**Performance Characteristics:**
- **Small dataset (1K docs)**: ~1ms
- **Medium dataset (100K docs)**: ~10ms
- **Large dataset (1M docs)**: ~100ms
- **With indexes**: ~10x faster

---

### Q21: Analyze the time complexity of the risk analysis algorithm.

**Answer:**
Risk analysis has O(N) time complexity where N is the number of simulations.

**Algorithm Analysis:**
```typescript
function performRiskAnalysis(input: RetirementInput, simulations: number = 1000): RiskAnalysisResult {
  const results: number[] = [];  // O(N) space
  const baseReturn = input.expectedReturn.mutualFunds;
  const volatility = 0.15;
  
  // O(N) time - Main simulation loop
  for (let i = 0; i < simulations; i++) {
    // O(1) time per iteration
    const randomReturn = generateNormalRandom(baseReturn, volatility);  // O(1)
    
    const modifiedInput: RetirementInput = {  // O(1) space
      ...input,
      expectedReturn: {
        ...input.expectedReturn,
        mutualFunds: Math.max(0, randomReturn)
      }
    };
    
    const result = calculateRetirement(modifiedInput);  // O(1) - assuming O(1)
    results.push(result.achievedCorpus);  // O(1)
  }
  
  // O(N log N) time for sorting
  results.sort((a, b) => a - b);
  
  // O(N) time for filtering and reduction
  const probabilityOfSuccess = results.filter(r => r >= threshold).length / simulations;
  const expectedValue = results.reduce((sum, r) => sum + r, 0) / simulations;
  
  return {
    bestCase: results[results.length - 1],  // O(1)
    worstCase: results[0],  // O(1)
    median: results[Math.floor(results.length / 2)],  // O(1)
    percentile25: results[Math.floor(results.length * 0.25)],  // O(1)
    percentile75: results[Math.floor(results.length * 0.75)],  // O(1)
    probabilityOfSuccess,  // O(N)
    expectedValue  // O(N)
  };
}
```

**Complexity Analysis:**
- **Simulation Loop**: O(N) - N iterations
- **Sorting**: O(N log N) - Sort N results
- **Final Calculations**: O(N) - Filter and reduce
- **Total Time**: O(N + N log N) = O(N log N)
- **Space Complexity**: O(N) - Store N results

**Performance for Different Simulation Counts:**
- **100 simulations**: ~1ms
- **1,000 simulations**: ~10ms
- **10,000 simulations**: ~100ms
- **100,000 simulations**: ~1s

---

This completes questions 8-21 of the intermediate level DSA questions, covering algorithm design and time/space complexity analysis with practical implementations for the FutureFunds platform.
