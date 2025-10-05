---
noteId: "dsa-intermediate-part3"
tags: []

---

# Intermediate Level - Data Structures & Algorithms (Questions 22-35)

## Sorting & Searching (Q22-Q28)

### Q22: Implement a custom sorting algorithm for investment schemes by multiple criteria.

**Answer:**
Custom sorting allows sorting by multiple criteria with different priorities.

**Implementation:**
```typescript
interface InvestmentScheme {
  name: string;
  rate: number;
  risk: number;
  liquidity: number;
  taxBenefit: boolean;
}

function customSortSchemes(schemes: InvestmentScheme[]): InvestmentScheme[] {
  return schemes.sort((a, b) => {
    // Primary criteria: Tax benefit (true first)
    if (a.taxBenefit !== b.taxBenefit) {
      return a.taxBenefit ? -1 : 1;
    }
    
    // Secondary criteria: Return rate (higher first)
    if (Math.abs(a.rate - b.rate) > 0.1) {
      return b.rate - a.rate;
    }
    
    // Tertiary criteria: Risk (lower first)
    if (Math.abs(a.risk - b.risk) > 0.1) {
      return a.risk - b.risk;
    }
    
    // Quaternary criteria: Liquidity (higher first)
    return b.liquidity - a.liquidity;
  });
}

// FutureFunds Usage
const schemes: InvestmentScheme[] = [
  {name: "PPF", rate: 7.1, risk: 1, liquidity: 2, taxBenefit: true},
  {name: "EPF", rate: 8.5, risk: 1, liquidity: 3, taxBenefit: true},
  {name: "NPS", rate: 9.2, risk: 2, liquidity: 2, taxBenefit: true},
  {name: "FD", rate: 6.5, risk: 1, liquidity: 5, taxBenefit: false},
  {name: "SIP", rate: 12.0, risk: 8, liquidity: 4, taxBenefit: false}
];

const sortedSchemes = customSortSchemes(schemes);
console.log("Schemes sorted by multiple criteria:", sortedSchemes);
```

**Time Complexity:**
- **Time**: O(n log n) - Comparison-based sorting
- **Space**: O(1) - In-place sorting

---

### Q23: Design a binary search tree for efficient range queries on investment data.

**Answer:**
BST enables efficient range queries with O(log n) search time.

**Implementation:**
```typescript
class InvestmentBST {
  private root: TreeNode | null = null;
  
  insert(amount: number, scheme: string): void {
    this.root = this.insertNode(this.root, amount, scheme);
  }
  
  private insertNode(node: TreeNode | null, amount: number, scheme: string): TreeNode {
    if (node === null) {
      return new TreeNode(amount, scheme);
    }
    
    if (amount < node.amount) {
      node.left = this.insertNode(node.left, amount, scheme);
    } else if (amount > node.amount) {
      node.right = this.insertNode(node.right, amount, scheme);
    } else {
      node.schemes.push(scheme); // Handle duplicates
    }
    
    return node;
  }
  
  rangeQuery(minAmount: number, maxAmount: number): Array<{amount: number, schemes: string[]}> {
    const result: Array<{amount: number, schemes: string[]}> = [];
    this.rangeQueryHelper(this.root, minAmount, maxAmount, result);
    return result;
  }
  
  private rangeQueryHelper(
    node: TreeNode | null, 
    minAmount: number, 
    maxAmount: number, 
    result: Array<{amount: number, schemes: string[]}>
  ): void {
    if (node === null) return;
    
    if (node.amount >= minAmount && node.amount <= maxAmount) {
      result.push({amount: node.amount, schemes: [...node.schemes]});
    }
    
    if (node.amount > minAmount) {
      this.rangeQueryHelper(node.left, minAmount, maxAmount, result);
    }
    
    if (node.amount < maxAmount) {
      this.rangeQueryHelper(node.right, minAmount, maxAmount, result);
    }
  }
  
  findClosest(amount: number): {amount: number, schemes: string[]} | null {
    let closest: TreeNode | null = null;
    let minDiff = Infinity;
    
    this.findClosestHelper(this.root, amount, closest, minDiff);
    return closest ? {amount: closest.amount, schemes: [...closest.schemes]} : null;
  }
  
  private findClosestHelper(
    node: TreeNode | null, 
    amount: number, 
    closest: TreeNode | null, 
    minDiff: number
  ): void {
    if (node === null) return;
    
    const diff = Math.abs(node.amount - amount);
    if (diff < minDiff) {
      closest = node;
      minDiff = diff;
    }
    
    if (amount < node.amount) {
      this.findClosestHelper(node.left, amount, closest, minDiff);
    } else if (amount > node.amount) {
      this.findClosestHelper(node.right, amount, closest, minDiff);
    }
  }
}

// FutureFunds Usage
const investmentBST = new InvestmentBST();

investmentBST.insert(50000, "PPF");
investmentBST.insert(100000, "EPF");
investmentBST.insert(150000, "NPS");
investmentBST.insert(25000, "SIP");

const rangeResults = investmentBST.rangeQuery(30000, 120000);
console.log("Investments in range 30K-120K:", rangeResults);

const closest = investmentBST.findClosest(80000);
console.log("Closest to 80K:", closest);
```

**Time Complexity:**
- **Insert**: O(log n) average, O(n) worst case
- **Range Query**: O(log n + k) where k = results
- **Find Closest**: O(log n) average

---

### Q24: Implement a heap data structure for managing investment priorities.

**Answer:**
Heap provides efficient access to min/max elements and priority management.

**Implementation:**
```typescript
class InvestmentHeap {
  private heap: Array<{priority: number, investment: string, amount: number}> = [];
  
  insert(priority: number, investment: string, amount: number): void {
    this.heap.push({priority, investment, amount});
    this.heapifyUp(this.heap.length - 1);
  }
  
  extractMax(): {priority: number, investment: string, amount: number} | null {
    if (this.heap.length === 0) return null;
    
    const max = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heapifyDown(0);
    }
    
    return max;
  }
  
  peek(): {priority: number, investment: string, amount: number} | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  private heapifyUp(index: number): void {
    if (index === 0) return;
    
    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[parentIndex].priority < this.heap[index].priority) {
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      this.heapifyUp(parentIndex);
    }
  }
  
  private heapifyDown(index: number): void {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let largest = index;
    
    if (leftChild < this.heap.length && 
        this.heap[leftChild].priority > this.heap[largest].priority) {
      largest = leftChild;
    }
    
    if (rightChild < this.heap.length && 
        this.heap[rightChild].priority > this.heap[largest].priority) {
      largest = rightChild;
    }
    
    if (largest !== index) {
      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      this.heapifyDown(largest);
    }
  }
  
  size(): number {
    return this.heap.length;
  }
  
  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

// FutureFunds Usage
const investmentHeap = new InvestmentHeap();

// Priority based on urgency and amount
investmentHeap.insert(10, "Emergency Fund", 100000);  // Highest priority
investmentHeap.insert(8, "Retirement Planning", 50000);
investmentHeap.insert(6, "Tax Saving", 150000);
investmentHeap.insert(4, "Vacation Fund", 25000);

// Process investments by priority
while (!investmentHeap.isEmpty()) {
  const nextInvestment = investmentHeap.extractMax();
  console.log(`Next: ${nextInvestment?.investment} (Priority: ${nextInvestment?.priority})`);
}
```

**Time Complexity:**
- **Insert**: O(log n)
- **Extract Max**: O(log n)
- **Peek**: O(1)

---

### Q25: Design a linear search algorithm with early termination for investment matching.

**Answer:**
Linear search with early termination improves performance when target is found early.

**Implementation:**
```typescript
interface InvestmentCriteria {
  minRate: number;
  maxRate: number;
  minAmount: number;
  maxAmount: number;
  riskLevel: number;
  taxBenefit: boolean;
}

function findMatchingInvestments(
  schemes: InvestmentScheme[],
  criteria: InvestmentCriteria,
  maxResults: number = 10
): InvestmentScheme[] {
  const results: InvestmentScheme[] = [];
  
  for (let i = 0; i < schemes.length && results.length < maxResults; i++) {
    const scheme = schemes[i];
    
    // Early termination conditions
    if (scheme.rate < criteria.minRate) continue;
    if (scheme.rate > criteria.maxRate) continue;
    if (scheme.amount < criteria.minAmount) continue;
    if (scheme.amount > criteria.maxAmount) continue;
    if (scheme.risk > criteria.riskLevel) continue;
    if (criteria.taxBenefit && !scheme.taxBenefit) continue;
    
    // All criteria met
    results.push(scheme);
    
    // Early termination if we have enough results
    if (results.length >= maxResults) break;
  }
  
  return results;
}

// FutureFunds Usage
const schemes: InvestmentScheme[] = [
  {name: "PPF", rate: 7.1, amount: 150000, risk: 1, taxBenefit: true},
  {name: "EPF", rate: 8.5, amount: 100000, risk: 1, taxBenefit: true},
  {name: "NPS", rate: 9.2, amount: 50000, risk: 2, taxBenefit: true},
  {name: "FD", rate: 6.5, amount: 200000, risk: 1, taxBenefit: false},
  {name: "SIP", rate: 12.0, amount: 25000, risk: 8, taxBenefit: false}
];

const criteria: InvestmentCriteria = {
  minRate: 7.0,
  maxRate: 10.0,
  minAmount: 50000,
  maxAmount: 200000,
  riskLevel: 3,
  taxBenefit: true
};

const matches = findMatchingInvestments(schemes, criteria, 5);
console.log("Matching investments:", matches);
```

**Time Complexity:**
- **Best Case**: O(1) - First element matches
- **Average Case**: O(n/2) - Target found in middle
- **Worst Case**: O(n) - Target not found or at end

---

### Q26: Implement a counting sort for sorting investment amounts.

**Answer:**
Counting sort is efficient for sorting integers with a known range.

**Implementation:**
```typescript
function countingSort(amounts: number[]): number[] {
  if (amounts.length === 0) return [];
  
  // Find range
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const range = max - min + 1;
  
  // Count occurrences
  const count = new Array(range).fill(0);
  for (const amount of amounts) {
    count[amount - min]++;
  }
  
  // Build sorted array
  const sorted: number[] = [];
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      sorted.push(i + min);
      count[i]--;
    }
  }
  
  return sorted;
}

// FutureFunds Usage
const investmentAmounts = [50000, 100000, 25000, 150000, 75000, 200000];
const sortedAmounts = countingSort(investmentAmounts);
console.log("Sorted amounts:", sortedAmounts);

// For investment schemes with amounts
interface SchemeWithAmount {
  name: string;
  amount: number;
  rate: number;
}

function countingSortSchemes(schemes: SchemeWithAmount[]): SchemeWithAmount[] {
  if (schemes.length === 0) return [];
  
  const amounts = schemes.map(s => s.amount);
  const sortedAmounts = countingSort(amounts);
  
  // Rebuild schemes array in sorted order
  const sortedSchemes: SchemeWithAmount[] = [];
  const used = new Set<number>();
  
  for (const amount of sortedAmounts) {
    for (const scheme of schemes) {
      if (scheme.amount === amount && !used.has(schemes.indexOf(scheme))) {
        sortedSchemes.push(scheme);
        used.add(schemes.indexOf(scheme));
        break;
      }
    }
  }
  
  return sortedSchemes;
}
```

**Time Complexity:**
- **Time**: O(n + k) where k = range
- **Space**: O(k) for count array
- **Stable**: Yes, maintains relative order

---

### Q27: Design a radix sort for sorting investment IDs.

**Answer:**
Radix sort efficiently sorts strings or numbers by processing digits/characters.

**Implementation:**
```typescript
function radixSortStrings(strings: string[]): string[] {
  if (strings.length === 0) return [];
  
  // Find maximum length
  const maxLength = Math.max(...strings.map(s => s.length));
  
  // Pad strings with leading zeros
  const paddedStrings = strings.map(s => s.padStart(maxLength, '0'));
  
  // Sort by each character position from right to left
  for (let pos = maxLength - 1; pos >= 0; pos--) {
    paddedStrings.sort((a, b) => a.charCodeAt(pos) - b.charCodeAt(pos));
  }
  
  // Remove padding
  return paddedStrings.map(s => s.replace(/^0+/, '') || '0');
}

function radixSortNumbers(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  
  // Find maximum number
  const max = Math.max(...numbers);
  
  // Count digits
  const maxDigits = Math.floor(Math.log10(max)) + 1;
  
  // Sort by each digit from right to left
  let sorted = [...numbers];
  
  for (let digit = 0; digit < maxDigits; digit++) {
    const buckets: number[][] = Array(10).fill(null).map(() => []);
    
    for (const num of sorted) {
      const digitValue = Math.floor(num / Math.pow(10, digit)) % 10;
      buckets[digitValue].push(num);
    }
    
    sorted = buckets.flat();
  }
  
  return sorted;
}

// FutureFunds Usage
const investmentIDs = ["INV001", "INV010", "INV002", "INV100", "INV011"];
const sortedIDs = radixSortStrings(investmentIDs);
console.log("Sorted investment IDs:", sortedIDs);

const amounts = [50000, 100000, 25000, 150000, 75000];
const sortedAmounts = radixSortNumbers(amounts);
console.log("Sorted amounts:", sortedAmounts);
```

**Time Complexity:**
- **Time**: O(d × n) where d = number of digits/characters
- **Space**: O(n + k) where k = radix (10 for digits, 256 for ASCII)
- **Stable**: Yes

---

### Q28: Implement a bucket sort for sorting investment returns.

**Answer:**
Bucket sort distributes elements into buckets and sorts each bucket individually.

**Implementation:**
```typescript
function bucketSort(returns: number[], bucketCount: number = 10): number[] {
  if (returns.length === 0) return [];
  
  // Find range
  const min = Math.min(...returns);
  const max = Math.max(...returns);
  const range = max - min;
  
  if (range === 0) return returns; // All values are the same
  
  // Create buckets
  const buckets: number[][] = Array(bucketCount).fill(null).map(() => []);
  
  // Distribute returns into buckets
  for (const returnValue of returns) {
    const bucketIndex = Math.min(
      Math.floor((returnValue - min) / range * bucketCount),
      bucketCount - 1
    );
    buckets[bucketIndex].push(returnValue);
  }
  
  // Sort each bucket and concatenate
  const sorted: number[] = [];
  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
    sorted.push(...bucket);
  }
  
  return sorted;
}

// FutureFunds Usage
const monthlyReturns = [1.2, 0.8, 1.5, -0.3, 2.1, 0.9, 1.8, 0.5, 1.3, 2.0];
const sortedReturns = bucketSort(monthlyReturns, 5);
console.log("Sorted returns:", sortedReturns);

// For investment schemes with returns
interface SchemeWithReturn {
  name: string;
  return: number;
  risk: number;
}

function bucketSortSchemes(schemes: SchemeWithReturn[]): SchemeWithReturn[] {
  if (schemes.length === 0) return [];
  
  const returns = schemes.map(s => s.return);
  const sortedReturns = bucketSort(returns);
  
  // Rebuild schemes array in sorted order
  const sortedSchemes: SchemeWithReturn[] = [];
  const used = new Set<number>();
  
  for (const returnValue of sortedReturns) {
    for (const scheme of schemes) {
      if (scheme.return === returnValue && !used.has(schemes.indexOf(scheme))) {
        sortedSchemes.push(scheme);
        used.add(schemes.indexOf(scheme));
        break;
      }
    }
  }
  
  return sortedSchemes;
}
```

**Time Complexity:**
- **Average Case**: O(n + k) where k = number of buckets
- **Worst Case**: O(n²) if all elements go to same bucket
- **Space**: O(n + k)

---

## Dynamic Programming (Q29-Q35)

### Q29: Implement a dynamic programming solution for optimal investment allocation.

**Answer:**
DP solves the optimal allocation problem by breaking it into overlapping subproblems.

**Implementation:**
```typescript
interface InvestmentOption {
  name: string;
  amount: number;
  return: number;
  risk: number;
}

function optimalInvestmentAllocation(
  options: InvestmentOption[],
  totalAmount: number,
  maxRisk: number
): {allocation: Map<string, number>, totalReturn: number} {
  const n = options.length;
  
  // DP table: dp[i][amount][risk] = max return
  const dp: number[][][] = Array(n + 1)
    .fill(null)
    .map(() => Array(totalAmount + 1)
      .fill(null)
      .map(() => Array(maxRisk + 1).fill(0))
    );
  
  // Fill DP table
  for (let i = 1; i <= n; i++) {
    const option = options[i - 1];
    
    for (let amount = 0; amount <= totalAmount; amount++) {
      for (let risk = 0; risk <= maxRisk; risk++) {
        // Don't invest in this option
        dp[i][amount][risk] = dp[i - 1][amount][risk];
        
        // Invest in this option (if possible)
        if (amount >= option.amount && risk >= option.risk) {
          const newReturn = dp[i - 1][amount - option.amount][risk - option.risk] + 
                           option.return * option.amount;
          
          if (newReturn > dp[i][amount][risk]) {
            dp[i][amount][risk] = newReturn;
          }
        }
      }
    }
  }
  
  // Backtrack to find allocation
  const allocation = new Map<string, number>();
  let i = n, amount = totalAmount, risk = maxRisk;
  
  while (i > 0 && amount > 0 && risk > 0) {
    const option = options[i - 1];
    
    if (amount >= option.amount && 
        risk >= option.risk &&
        dp[i][amount][risk] === dp[i - 1][amount - option.amount][risk - option.risk] + 
        option.return * option.amount) {
      
      allocation.set(option.name, (allocation.get(option.name) || 0) + option.amount);
      amount -= option.amount;
      risk -= option.risk;
    }
    
    i--;
  }
  
  return {
    allocation,
    totalReturn: dp[n][totalAmount][maxRisk]
  };
}

// FutureFunds Usage
const options: InvestmentOption[] = [
  {name: "PPF", amount: 150000, return: 0.071, risk: 1},
  {name: "EPF", amount: 100000, return: 0.085, risk: 1},
  {name: "NPS", amount: 50000, return: 0.092, risk: 2},
  {name: "SIP", amount: 25000, return: 0.12, risk: 8}
];

const result = optimalInvestmentAllocation(options, 500000, 10);
console.log("Optimal allocation:", result.allocation);
console.log("Total return:", result.totalReturn);
```

**Time Complexity:**
- **Time**: O(n × amount × risk)
- **Space**: O(n × amount × risk)

---

### Q30: Design a DP solution for the knapsack problem applied to retirement planning.

**Answer:**
The knapsack problem finds the optimal combination of investments within constraints.

**Implementation:**
```typescript
interface RetirementInvestment {
  name: string;
  cost: number; // Monthly contribution
  value: number; // Expected future value
  risk: number;
}

function retirementKnapsack(
  investments: RetirementInvestment[],
  monthlyBudget: number,
  maxRisk: number
): {selected: RetirementInvestment[], totalValue: number, totalCost: number} {
  const n = investments.length;
  
  // DP table: dp[i][budget][risk] = max value
  const dp: number[][][] = Array(n + 1)
    .fill(null)
    .map(() => Array(monthlyBudget + 1)
      .fill(null)
      .map(() => Array(maxRisk + 1).fill(0))
    );
  
  // Fill DP table
  for (let i = 1; i <= n; i++) {
    const investment = investments[i - 1];
    
    for (let budget = 0; budget <= monthlyBudget; budget++) {
      for (let risk = 0; risk <= maxRisk; risk++) {
        // Don't select this investment
        dp[i][budget][risk] = dp[i - 1][budget][risk];
        
        // Select this investment (if possible)
        if (budget >= investment.cost && risk >= investment.risk) {
          const newValue = dp[i - 1][budget - investment.cost][risk - investment.risk] + 
                          investment.value;
          
          if (newValue > dp[i][budget][risk]) {
            dp[i][budget][risk] = newValue;
          }
        }
      }
    }
  }
  
  // Backtrack to find selected investments
  const selected: RetirementInvestment[] = [];
  let i = n, budget = monthlyBudget, risk = maxRisk;
  
  while (i > 0 && budget > 0 && risk > 0) {
    const investment = investments[i - 1];
    
    if (budget >= investment.cost && 
        risk >= investment.risk &&
        dp[i][budget][risk] === dp[i - 1][budget - investment.cost][risk - investment.risk] + 
        investment.value) {
      
      selected.push(investment);
      budget -= investment.cost;
      risk -= investment.risk;
    }
    
    i--;
  }
  
  const totalValue = dp[n][monthlyBudget][maxRisk];
  const totalCost = selected.reduce((sum, inv) => sum + inv.cost, 0);
  
  return {selected, totalValue, totalCost};
}

// FutureFunds Usage
const retirementInvestments: RetirementInvestment[] = [
  {name: "PPF", cost: 12500, value: 5000000, risk: 1},
  {name: "EPF", cost: 8333, value: 3000000, risk: 1},
  {name: "NPS", cost: 4167, value: 2000000, risk: 2},
  {name: "SIP", cost: 25000, value: 8000000, risk: 8},
  {name: "FD", cost: 10000, value: 1500000, risk: 1}
];

const result = retirementKnapsack(retirementInvestments, 50000, 10);
console.log("Selected investments:", result.selected);
console.log("Total value:", result.totalValue);
console.log("Total cost:", result.totalCost);
```

**Time Complexity:**
- **Time**: O(n × budget × risk)
- **Space**: O(n × budget × risk)

---

### Q31: Implement a DP solution for the longest common subsequence in investment patterns.

**Answer:**
LCS finds common patterns between different investment strategies.

**Implementation:**
```typescript
function longestCommonSubsequence(
  pattern1: string[], 
  pattern2: string[]
): {length: number, sequence: string[]} {
  const m = pattern1.length;
  const n = pattern2.length;
  
  // DP table: dp[i][j] = LCS length for pattern1[0..i-1] and pattern2[0..j-1]
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (pattern1[i - 1] === pattern2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find LCS
  const sequence: string[] = [];
  let i = m, j = n;
  
  while (i > 0 && j > 0) {
    if (pattern1[i - 1] === pattern2[j - 1]) {
      sequence.unshift(pattern1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return {
    length: dp[m][n],
    sequence
  };
}

// FutureFunds Usage
const userPattern = ["PPF", "SIP", "FD", "NPS", "Gold"];
const expertPattern = ["Emergency Fund", "PPF", "SIP", "NPS", "Real Estate"];

const lcs = longestCommonSubsequence(userPattern, expertPattern);
console.log("Common investment pattern:", lcs.sequence);
console.log("Pattern similarity:", lcs.length / Math.max(userPattern.length, expertPattern.length));
```

**Time Complexity:**
- **Time**: O(m × n)
- **Space**: O(m × n)

---

### Q32: Design a DP solution for the edit distance between investment strategies.

**Answer:**
Edit distance measures how many changes are needed to transform one strategy into another.

**Implementation:**
```typescript
function editDistance(strategy1: string[], strategy2: string[]): {
  distance: number;
  operations: Array<{type: 'insert' | 'delete' | 'substitute', from: string, to: string}>;
} {
  const m = strategy1.length;
  const n = strategy2.length;
  
  // DP table: dp[i][j] = edit distance for strategy1[0..i-1] and strategy2[0..j-1]
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Initialize base cases
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // Delete all characters from strategy1
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // Insert all characters from strategy2
  }
  
  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (strategy1[i - 1] === strategy2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // No operation needed
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // Delete from strategy1
          dp[i][j - 1] + 1,     // Insert into strategy1
          dp[i - 1][j - 1] + 1  // Substitute in strategy1
        );
      }
    }
  }
  
  // Backtrack to find operations
  const operations: Array<{type: 'insert' | 'delete' | 'substitute', from: string, to: string}> = [];
  let i = m, j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && strategy1[i - 1] === strategy2[j - 1]) {
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      operations.unshift({type: 'delete', from: strategy1[i - 1], to: ''});
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      operations.unshift({type: 'insert', from: '', to: strategy2[j - 1]});
      j--;
    } else if (i > 0 && j > 0) {
      operations.unshift({type: 'substitute', from: strategy1[i - 1], to: strategy2[j - 1]});
      i--;
      j--;
    }
  }
  
  return {
    distance: dp[m][n],
    operations
  };
}

// FutureFunds Usage
const currentStrategy = ["PPF", "SIP", "FD"];
const targetStrategy = ["PPF", "NPS", "SIP", "Gold"];

const editResult = editDistance(currentStrategy, targetStrategy);
console.log("Edit distance:", editResult.distance);
console.log("Required operations:", editResult.operations);
```

**Time Complexity:**
- **Time**: O(m × n)
- **Space**: O(m × n)

---

### Q33: Implement a DP solution for the coin change problem in investment planning.

**Answer:**
Coin change finds the minimum number of investment types needed to reach a target amount.

**Implementation:**
```typescript
interface InvestmentType {
  name: string;
  amount: number;
  count: number; // Available count
}

function minimumInvestments(
  investmentTypes: InvestmentType[],
  targetAmount: number
): {minCount: number, selectedInvestments: Map<string, number>} {
  // DP table: dp[amount] = minimum number of investments needed
  const dp: number[] = Array(targetAmount + 1).fill(Infinity);
  dp[0] = 0; // 0 investments needed for 0 amount
  
  // Track which investments were used
  const parent: number[] = Array(targetAmount + 1).fill(-1);
  
  // Fill DP table
  for (let amount = 1; amount <= targetAmount; amount++) {
    for (let i = 0; i < investmentTypes.length; i++) {
      const investment = investmentTypes[i];
      
      if (amount >= investment.amount && 
          dp[amount - investment.amount] !== Infinity &&
          dp[amount - investment.amount] + 1 < dp[amount]) {
        
        dp[amount] = dp[amount - investment.amount] + 1;
        parent[amount] = i;
      }
    }
  }
  
  // Backtrack to find selected investments
  const selectedInvestments = new Map<string, number>();
  let amount = targetAmount;
  
  while (amount > 0 && parent[amount] !== -1) {
    const investmentIndex = parent[amount];
    const investment = investmentTypes[investmentIndex];
    
    selectedInvestments.set(
      investment.name, 
      (selectedInvestments.get(investment.name) || 0) + 1
    );
    
    amount -= investment.amount;
  }
  
  return {
    minCount: dp[targetAmount] === Infinity ? -1 : dp[targetAmount],
    selectedInvestments
  };
}

// FutureFunds Usage
const investmentTypes: InvestmentType[] = [
  {name: "PPF", amount: 150000, count: 10},
  {name: "EPF", amount: 100000, count: 5},
  {name: "NPS", amount: 50000, count: 20},
  {name: "SIP", amount: 25000, count: 50}
];

const result = minimumInvestments(investmentTypes, 500000);
console.log("Minimum investments needed:", result.minCount);
console.log("Selected investments:", result.selectedInvestments);
```

**Time Complexity:**
- **Time**: O(amount × investmentTypes.length)
- **Space**: O(amount)

---

### Q34: Design a DP solution for the maximum subarray sum in investment returns.

**Answer:**
Kadane's algorithm finds the maximum sum of contiguous subarray in O(n) time.

**Implementation:**
```typescript
function maximumSubarraySum(returns: number[]): {
  maxSum: number;
  startIndex: number;
  endIndex: number;
  subarray: number[];
} {
  if (returns.length === 0) {
    return {maxSum: 0, startIndex: -1, endIndex: -1, subarray: []};
  }
  
  let maxSum = returns[0];
  let currentSum = returns[0];
  let startIndex = 0;
  let endIndex = 0;
  let tempStart = 0;
  
  for (let i = 1; i < returns.length; i++) {
    if (currentSum < 0) {
      currentSum = returns[i];
      tempStart = i;
    } else {
      currentSum += returns[i];
    }
    
    if (currentSum > maxSum) {
      maxSum = currentSum;
      startIndex = tempStart;
      endIndex = i;
    }
  }
  
  const subarray = returns.slice(startIndex, endIndex + 1);
  
  return {
    maxSum,
    startIndex,
    endIndex,
    subarray
  };
}

// FutureFunds Usage
const monthlyReturns = [1.2, -0.5, 2.1, -1.0, 3.5, -0.8, 2.0, 1.5];
const result = maximumSubarraySum(monthlyReturns);
console.log("Maximum subarray sum:", result.maxSum);
console.log("Best performing period:", result.subarray);
console.log("Period:", `Month ${result.startIndex + 1} to ${result.endIndex + 1}`);

// For investment schemes
interface SchemeReturn {
  name: string;
  returns: number[];
}

function findBestPerformingPeriod(schemes: SchemeReturn[]): {
  scheme: string;
  period: number[];
  maxSum: number;
} {
  let bestScheme = "";
  let bestPeriod: number[] = [];
  let maxSum = -Infinity;
  
  for (const scheme of schemes) {
    const result = maximumSubarraySum(scheme.returns);
    if (result.maxSum > maxSum) {
      maxSum = result.maxSum;
      bestScheme = scheme.name;
      bestPeriod = result.subarray;
    }
  }
  
  return {
    scheme: bestScheme,
    period: bestPeriod,
    maxSum
  };
}
```

**Time Complexity:**
- **Time**: O(n)
- **Space**: O(1)

---

### Q35: Implement a DP solution for the longest increasing subsequence in investment growth.

**Answer:**
LIS finds the longest subsequence where elements are in increasing order.

**Implementation:**
```typescript
function longestIncreasingSubsequence(values: number[]): {
  length: number;
  subsequence: number[];
  indices: number[];
} {
  if (values.length === 0) {
    return {length: 0, subsequence: [], indices: []};
  }
  
  const n = values.length;
  const dp: number[] = Array(n).fill(1);
  const parent: number[] = Array(n).fill(-1);
  
  // Fill DP table
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (values[j] < values[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
      }
    }
  }
  
  // Find the maximum length and its index
  let maxLength = dp[0];
  let maxIndex = 0;
  
  for (let i = 1; i < n; i++) {
    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }
  
  // Backtrack to find the subsequence
  const subsequence: number[] = [];
  const indices: number[] = [];
  let current = maxIndex;
  
  while (current !== -1) {
    subsequence.unshift(values[current]);
    indices.unshift(current);
    current = parent[current];
  }
  
  return {
    length: maxLength,
    subsequence,
    indices
  };
}

// FutureFunds Usage
const yearlyValues = [100000, 120000, 110000, 150000, 140000, 180000, 170000, 200000];
const lis = longestIncreasingSubsequence(yearlyValues);
console.log("Longest increasing subsequence length:", lis.length);
console.log("Growth pattern:", lis.subsequence);
console.log("Years:", lis.indices.map(i => `Year ${i + 1}`));

// For investment portfolio growth
interface PortfolioSnapshot {
  year: number;
  totalValue: number;
  mutualFunds: number;
  fd: number;
  rd: number;
}

function findBestGrowthPeriod(portfolio: PortfolioSnapshot[]): {
  period: PortfolioSnapshot[];
  growthRate: number;
} {
  const values = portfolio.map(p => p.totalValue);
  const lis = longestIncreasingSubsequence(values);
  
  const period = lis.indices.map(i => portfolio[i]);
  const growthRate = period.length > 1 ? 
    (period[period.length - 1].totalValue - period[0].totalValue) / period[0].totalValue * 100 : 0;
  
  return {
    period,
    growthRate
  };
}
```

**Time Complexity:**
- **Time**: O(n²)
- **Space**: O(n)

---

This completes all 35 intermediate level DSA questions, covering advanced data structures, algorithm design, time/space complexity analysis, sorting/searching algorithms, and dynamic programming solutions with practical implementations for the FutureFunds retirement planning platform.
